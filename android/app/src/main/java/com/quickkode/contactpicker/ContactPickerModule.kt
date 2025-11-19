package com.quickkode.contactpicker

import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.database.Cursor
import android.provider.ContactsContract
import androidx.core.app.ActivityCompat
import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = ContactPickerModule.NAME)
class ContactPickerModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), ActivityEventListener {

    private var contactPromise: Promise? = null
    private val PICK_CONTACT_REQUEST = 1
    private val READ_CONTACTS_PERMISSION_REQUEST = 2

    // Companion object to hold constant values
    companion object {
        const val NAME = "ContactPicker"
    }

    init {
        reactContext.addActivityEventListener(this)
    }

    override fun getName(): String {
        return NAME
    }

    /**
     * Public method exposed to React Native.
     * Checks for permission and launches the picker or requests permission.
     */
    @ReactMethod
    fun pickContact(promise: Promise) {
        if (contactPromise != null) {
            promise.reject("E_BUSY", "Another contact pick operation is already in progress.")
            return
        }

        // Use the Elvis operator (?:) to safely check for the current Activity.
        val activity = getCurrentActivity() ?: run {
            promise.reject("E_ACTIVITY_MISSING", "Current Activity is null. Cannot launch contact picker.")
            return
        }

        contactPromise = promise

        // 'activity' is now guaranteed non-null (Activity) and is passed to helper functions.
        if (checkContactPermission(activity)) {
            launchContactPicker(activity)
        } else {
            requestContactPermission(activity)
        }
    }

    /**
     * Checks if READ_CONTACTS permission is granted.
     * @param activity The current non-null activity.
     */
    private fun checkContactPermission(activity: Activity): Boolean {
        return ActivityCompat.checkSelfPermission(
            activity, // Use the passed non-nullable activity
            android.Manifest.permission.READ_CONTACTS
        ) == PackageManager.PERMISSION_GRANTED
    }

    /**
     * Requests READ_CONTACTS permission from the user.
     * @param activity The current non-null activity.
     */
    private fun requestContactPermission(activity: Activity) {
        ActivityCompat.requestPermissions(
            activity, // Use the passed non-nullable activity
            arrayOf(android.Manifest.permission.READ_CONTACTS),
            READ_CONTACTS_PERMISSION_REQUEST
        )
    }

    /**
     * Launches the native system contact picker UI.
     * @param activity The current non-null activity.
     */
    private fun launchContactPicker(activity: Activity) {
        try {
            val intent = Intent(Intent.ACTION_PICK, ContactsContract.Contacts.CONTENT_URI)
            activity.startActivityForResult(intent, PICK_CONTACT_REQUEST) // Use the passed non-nullable activity
        } catch (e: Exception) {
            contactPromise?.reject("E_PICKER_ERROR", "Failed to launch contact picker.", e)
            contactPromise = null
        }
    }

    // --- ActivityEventListener Implementation ---

    override fun onActivityResult(
        activity: Activity,
        requestCode: Int,
        resultCode: Int,
        data: Intent?
    ) {
        if (requestCode != PICK_CONTACT_REQUEST || contactPromise == null) {
            return
        }

        if (resultCode != Activity.RESULT_OK || data == null) {
            // User cancelled the operation
            contactPromise?.reject("E_CANCELLED", "Contact selection cancelled by user.")
            contactPromise = null
            return
        }

        val contactUri = data.data ?: run {
            contactPromise?.reject("E_NO_DATA", "Contact selection returned no data URI.")
            contactPromise = null
            return
        }

        // Query the contact data
        var cursor: Cursor? = null
        try {
            // Use the non-nullable 'activity' parameter's content resolver
            cursor = activity.contentResolver.query(
                contactUri,
                null,
                null,
                null,
                null
            )

            if (cursor != null && cursor.moveToFirst()) {
                val contactIdIndex = cursor.getColumnIndex(ContactsContract.Contacts._ID)
                val displayNameIndex = cursor.getColumnIndex(ContactsContract.Contacts.DISPLAY_NAME)

                // Safety check for column existence
                if (contactIdIndex == -1 || displayNameIndex == -1) {
                    contactPromise?.reject("E_CURSOR_ERROR", "Required contact columns not found.")
                    return
                }

                val contactId = cursor.getString(contactIdIndex)
                val name = cursor.getString(displayNameIndex)

                // The standard picker usually returns the contact, but not the phone number directly.
                // We perform an additional query to get the primary phone number (if available).
                val phoneNumber = getPhoneNumber(contactId, activity) // Pass activity to helper

                val result = WritableNativeMap()
                result.putString("id", contactId)
                result.putString("name", name)
                result.putString("phoneNumber", phoneNumber)

                contactPromise?.resolve(result)

            } else {
                contactPromise?.reject("E_NOT_FOUND", "Selected contact data could not be retrieved.")
            }
        } catch (e: Exception) {
            contactPromise?.reject("E_PROCESSING_ERROR", "Error retrieving contact details.", e)
        } finally {
            cursor?.close()
            contactPromise = null
        }
    }

    /**
     * FIX: Updated signature from Intent? to Intent to match the required interface.
     */
    override fun onNewIntent(intent: Intent) {
        // Required method override
    }

    /**
     * Helper to query the contact's primary phone number.
     * @param activity The current non-null activity used for content resolving.
     */
    private fun getPhoneNumber(contactId: String, activity: Activity): String {
        var phoneNumber = ""
        var phoneCursor: Cursor? = null
        try {
            phoneCursor = activity.contentResolver.query( // Use passed activity
                ContactsContract.CommonDataKinds.Phone.CONTENT_URI,
                arrayOf(ContactsContract.CommonDataKinds.Phone.NUMBER),
                ContactsContract.CommonDataKinds.Phone.CONTACT_ID + " = ? AND " +
                        ContactsContract.CommonDataKinds.Phone.TYPE + " = " +
                        ContactsContract.CommonDataKinds.Phone.TYPE_MOBILE, // Prioritize mobile numbers
                arrayOf(contactId),
                null
            )

            if (phoneCursor != null && phoneCursor.moveToFirst()) {
                val numberIndex = phoneCursor.getColumnIndex(ContactsContract.CommonDataKinds.Phone.NUMBER)
                if (numberIndex != -1) {
                    phoneNumber = phoneCursor.getString(numberIndex)
                }
            }
        } catch (e: Exception) {
            // Log error but don't fail the operation, as we already have the name/id
            println("Error fetching phone number: ${e.message}")
        } finally {
            phoneCursor?.close()
        }
        return phoneNumber.replace("[^\\d+]+".toRegex(), "") // Clean up number format
    }
}

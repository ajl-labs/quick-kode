package com.quickkode.ussd

import android.content.ComponentName
import android.content.Intent
import android.net.Uri
import android.provider.Settings
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class UssdModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun initialize() {
        super.initialize()
    }

    companion object {
        var sharedContext: ReactApplicationContext? = null
    }

    init {
        sharedContext = reactContext
    }
    
    override fun getName(): String {
        return "UssdModule"
    }

    @ReactMethod
    fun dialUssdCode(ussdCode: String) {
        val encodedHash = Uri.encode("#")
        val uri = "tel:" + ussdCode.replace("#", encodedHash)
        val intent = Intent(Intent.ACTION_CALL)
        intent.data = Uri.parse(uri)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        reactApplicationContext.startActivity(intent)
    }

    @ReactMethod
    fun openAccessibilitySettings() {
        val intent = Intent(android.provider.Settings.ACTION_ACCESSIBILITY_SETTINGS)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        reactApplicationContext.startActivity(intent)
    }

    // This is no longer needed as we are capturing the message and analyse it instead of the USSD response. 
    // @ReactMethod
    // fun isAccessibilityServiceEnabled(promise: Promise) {
    //     try {
    //         val expectedComponentName = ComponentName(reactApplicationContext, UssdAccessibilityService::class.java)
    //         val enabledServices = android.provider.Settings.Secure.getString(
    //             reactApplicationContext.contentResolver,
    //             android.provider.Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
    //         )

    //         val isEnabled = enabledServices?.split(":")
    //             ?.any { it.equals(expectedComponentName.flattenToString(), ignoreCase = true) } == true

    //         promise.resolve(isEnabled)
    //     } catch (e: Exception) {
    //         promise.reject("CHECK_ACCESSIBILITY_ERROR", e.message)
    //     }
    // }

    @ReactMethod
    fun addListener(eventName: String?) {
        // Required for RN EventEmitter — even if empty
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Required for RN EventEmitter — even if empty
    }
}

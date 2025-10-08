package com.quickkode

import android.content.IntentFilter
import android.provider.Telephony
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class SmsListenerModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var smsReceiver: SmsReceiver? = null

    override fun getName() = "SmsListener"

    @ReactMethod
    fun startSmsListener(promise: Promise) {
        try {
            if (smsReceiver == null) {
                smsReceiver = SmsReceiver(reactApplicationContext)
                val intentFilter = IntentFilter(Telephony.Sms.Intents.SMS_RECEIVED_ACTION)
                reactApplicationContext.registerReceiver(smsReceiver, intentFilter)
            }
            promise.resolve("SMS Listener started successfully.")
        } catch (e: Exception) {
            promise.reject("ERROR_STARTING_LISTENER", e.message)
        }
    }

    @ReactMethod
    fun stopSmsListener(promise: Promise) {
        try {
            if (smsReceiver != null) {
                reactApplicationContext.unregisterReceiver(smsReceiver)
                smsReceiver = null
            }
            promise.resolve("SMS Listener stopped successfully.")
        } catch (e: Exception) {
            promise.reject("ERROR_STOPPING_LISTENER", e.message)
        }
    }
}
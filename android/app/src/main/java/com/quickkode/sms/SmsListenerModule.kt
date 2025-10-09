package com.quickkode.sms

import android.content.IntentFilter
import android.provider.Telephony
import android.content.Context
import com.facebook.react.bridge.*
import com.facebook.react.bridge.Arguments

class SmsListenerModule(private val context: ReactApplicationContext) :
    ReactContextBaseJavaModule(context) {

    private var smsReceiver: SmsReceiver? = null

    override fun getName() = "SmsListener"

    @ReactMethod
    fun startListening() {
        if (smsReceiver == null) {
            SmsReceiver.reactContext = context
            smsReceiver = SmsReceiver()
            val filter = IntentFilter(Telephony.Sms.Intents.SMS_RECEIVED_ACTION)
            context.registerReceiver(smsReceiver, filter)
        }
    }

    @ReactMethod
    fun stopListening() {
        smsReceiver?.let {
            context.unregisterReceiver(it)
            smsReceiver = null
        }
    }

    @ReactMethod
    fun getLastSms(promise: Promise) {
        val prefs = context.getSharedPreferences("sms_cache", Context.MODE_PRIVATE)
        val sender = prefs.getString("last_sms_sender", null)
        val message = prefs.getString("last_sms_message", null)

        if (sender != null && message != null) {
            val map = Arguments.createMap().apply {
                putString("sender", sender)
                putString("message", message)
            }
            promise.resolve(map)
        } else {
            promise.resolve(null)
        }
    }
}

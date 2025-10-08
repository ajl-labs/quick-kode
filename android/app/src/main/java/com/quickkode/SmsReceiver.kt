package com.quickkode

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.provider.Telephony
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.modules.core.DeviceEventManagerModule

class SmsReceiver(private val reactContext: ReactContext) : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Telephony.Sms.Intents.SMS_RECEIVED_ACTION) {
            val messages = Telephony.Sms.Intents.getMessagesFromIntent(intent)
            if (messages.isNotEmpty()) {
                val fullMessageBody = StringBuilder()
                var sender: String? = null
                var displayOriginatingAddress: String? = null
                var originatingAddress: String? = null

                for (smsMessage in messages) {
                    fullMessageBody.append(smsMessage.messageBody)
                    sender = smsMessage.originatingAddress
                    displayOriginatingAddress = smsMessage.displayOriginatingAddress
                    originatingAddress = smsMessage.originatingAddress
                }

                // Check if sender or service center address matches "M-Money"
                val isMMoney = listOf(sender, displayOriginatingAddress, originatingAddress)
                    .any { it?.lowercase()?.contains("m-money".lowercase()) == true }

                // You can add this info to params if needed

                val params = WritableNativeMap().apply {
                    putString("message", fullMessageBody.toString())
                    putString("sender", sender)
                    putString("displayOriginatingAddress", displayOriginatingAddress)
                    putString("originatingAddress", originatingAddress)
                }

                if (isMMoney) {
                    sendEvent(reactContext, "onSmsReceived", params)
                }
            }
        }
    }

    private fun sendEvent(reactContext: ReactContext, eventName: String, params: WritableNativeMap?) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }
}
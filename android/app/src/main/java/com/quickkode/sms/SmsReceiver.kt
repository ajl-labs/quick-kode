package com.quickkode.sms

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.telephony.SmsMessage
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.bridge.WritableNativeMap

class SmsReceiver : BroadcastReceiver() {

    companion object {
        var reactContext: ReactApplicationContext? = null
        private val processedMessages = mutableSetOf<String>()
    }

    override fun onReceive(context: Context?, intent: Intent?) {
        if (intent?.action != "android.provider.Telephony.SMS_RECEIVED") return

        try {
           val bundle: Bundle? = intent.extras
            val pdus = bundle?.get("pdus") as? Array<*>
       
            var sender: String? = null
            var displayOriginatingAddress: String? = null
            var timestamp: Long? = null
            var message = ""

            pdus?.forEach { pdu ->
                val format = bundle.getString("format")
                val sms = SmsMessage.createFromPdu(pdu as ByteArray, format)
                if (sender == null) {
                    sender = sms.originatingAddress
                }
                if( timestamp == null) {
                    timestamp = sms.timestampMillis
                }
                if( displayOriginatingAddress == null) {
                    displayOriginatingAddress = sms.displayOriginatingAddress
                }
                message += sms.displayMessageBody
            }
            
            // Generate a unique ID for this message to prevent duplicates
            val messageId = "${sender}_${timestamp}_${message.hashCode()}"
            
            // Check if sender or service center address matches "M-Money"
            val isMMoney = listOf(sender, displayOriginatingAddress)
                .any { it?.lowercase()?.contains("m-money".lowercase()) == true }

            if (processedMessages.contains(messageId) || !isMMoney) {
                Log.d("SmsReceiver", "Event stopped: Duplicate or M-Money message")
                return
            }

            // Add to processed messages
            processedMessages.add(messageId)

            val params = WritableNativeMap().apply {
                putString("message", message)
                putString("sender", sender)
                putString("timestamp", timestamp.toString())
                putString("address", displayOriginatingAddress)
            }

            reactContext?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                ?.emit("onSmsReceived", params)
            
        } catch (e: Exception) {
            Log.e("SmsReceiver", "Error receiving SMS", e)
        }
    }
}

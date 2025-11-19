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
import com.facebook.react.HeadlessJsTaskService

class SmsReceiver : BroadcastReceiver() {

    companion object {
        var reactContext: ReactApplicationContext? = null
        private val processedMessages = mutableSetOf<String>()
    }

    override fun onReceive(context: Context?, intent: Intent?) {
        if (intent?.action != "android.provider.Telephony.SMS_RECEIVED") return
        if (context == null) return

        try {
            val bundle: Bundle? = intent.extras
            val pdus = bundle?.get("pdus") as? Array<*>

            if (pdus == null) {
                Log.e("SmsReceiver", "No PDUs found")
                return
            }

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
                if (timestamp == null) {
                    timestamp = sms.timestampMillis
                }
                if (displayOriginatingAddress == null) {
                    displayOriginatingAddress = sms.displayOriginatingAddress
                }
                message += sms.displayMessageBody
            }

            val safeSender = sender ?: "unknown"
            val safeTimestamp = timestamp ?: System.currentTimeMillis()
            // Generate a unique ID for this message to prevent duplicates
            var messageId = "${safeSender}_${safeTimestamp}_${message.hashCode()}"
            // Check if sender or service center address matches "M-Money"
            // For development (emulator), also check for a 650 555 1212 number
            val isMMoney = listOf(sender, displayOriginatingAddress)
                .any { it?.lowercase()?.contains("m-money".lowercase()) == true || it == "6505551212" }
            // Check if it is a transaction message (contains "RWF")
            val isTransactionMessage = message.lowercase().contains("rwf")

            if (processedMessages.contains(messageId) || !isMMoney || !isTransactionMessage) {
                Log.d("SmsReceiver", "Event stopped: Duplicate or M-Money message")
                return
            }

            // Add to processed messages
            processedMessages.add(messageId)

            val serviceIntent = Intent(context, SmsHeadlessService::class.java).apply {
                putExtra("message", message)
                putExtra("sender", sender)
                putExtra("timestamp", timestamp)
                putExtra("messageId", messageId)
            }

            context.startService(serviceIntent)
            HeadlessJsTaskService.acquireWakeLockNow(context)

        } catch (e: Exception) {
            Log.e("SmsReceiver", "Error receiving SMS", e)
        }
    }
}

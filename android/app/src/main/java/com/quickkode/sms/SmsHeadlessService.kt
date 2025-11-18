package com.quickkode.sms

import android.content.Intent
import com.facebook.react.HeadlessJsTaskService
import com.facebook.react.jstasks.HeadlessJsTaskConfig
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap

class SmsHeadlessService : HeadlessJsTaskService() {

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val message = intent?.getStringExtra("message")
        val sender = intent?.getStringExtra("sender")
        val timestamp = intent?.getLongExtra("timestamp", 0L)
        val messageId = intent?.getStringExtra("messageId")

        val params: WritableMap = Arguments.createMap().apply {
            putString("message", message)
            putString("sender", sender)
            putString("timestamp", timestamp.toString())
            putString("messageId", messageId)
        }

        startTask(params)
        return START_STICKY
    }

    private fun startTask(params: WritableMap) {
        val jsTaskConfig = HeadlessJsTaskConfig(
            "SmsReceiverTask",  // This must match your JS task name
            params,
            5000, // timeout in ms
            true
        )
        startTask(jsTaskConfig)
    }
}

package com.quickkode.sms

import android.content.Intent
import com.facebook.react.HeadlessJsTaskService
import com.facebook.react.jstasks.HeadlessJsTaskConfig
import com.facebook.react.bridge.Arguments

class SmsHeadlessService : HeadlessJsTaskService() {
    override fun getTaskConfig(intent: Intent?): HeadlessJsTaskConfig? {
        if (intent == null) return null

        val message = intent.getStringExtra("message") ?: return null
        val sender = intent.getStringExtra("sender") ?: return null

        val data = Arguments.createMap().apply {
            putString("message", message)
            putString("sender", sender)
        }

        return HeadlessJsTaskConfig(
            "SmsListenerTask",
            data,
            5000, // timeout in ms
            true  // allow running in foreground
        )
    }
}

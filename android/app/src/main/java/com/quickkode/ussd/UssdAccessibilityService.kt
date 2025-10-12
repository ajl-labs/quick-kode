package com.quickkode.ussd

import android.accessibilityservice.AccessibilityService
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo
import android.util.Log
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.ReactApplication
import com.quickkode.ussd.UssdModule
import com.facebook.react.bridge.Arguments

// This is no longer needed as we are capturing the message and analyse it instead of the USSD response.
class UssdAccessibilityService : AccessibilityService() {

    override fun onAccessibilityEvent(event: AccessibilityEvent) {
        val className = event.className?.toString() ?: ""
        val isUssdDialog = className.contains("AlertDialog", ignoreCase = true)
                        || className.contains("com.android.phone", ignoreCase = true)
                        || className.contains("ussd", ignoreCase = true)
                        || className.contains("Dialog", ignoreCase = true)

        if ((event.eventType == AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED ||
             event.eventType == AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) &&
            isUssdDialog) {

            val rootNode = rootInActiveWindow ?: return
            val response = findUssdResponse(rootNode)

            if (!response.isNullOrEmpty()) {
            sendEventToReact(response)
            }
        }
    }

    override fun onInterrupt() {}

    private fun findUssdResponse(node: AccessibilityNodeInfo?): String? {
        node ?: return null

        if (node.text != null && node.text.isNotBlank()) {
            return node.text.toString()
        }

        for (i in 0 until node.childCount) {
            val childResponse = findUssdResponse(node.getChild(i))
            if (!childResponse.isNullOrEmpty()) return childResponse
        }

        return null
    }

    private fun sendEventToReact(text: String) {
        try {
            val reactContext = UssdModule.sharedContext

            if (reactContext != null) {
                val params = Arguments.createMap()
                params.putString("message", text)

                reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("onUSSDResponse", params)
                Log.d("UssdService", "USSD Response sent: $text")
            } else {
                Log.e("UssdService", "ReactContext is null")
            }
        } catch (e: Exception) {
            Log.e("UssdService", "Error sending event: ${e.message}")
        }
    }
}

package com.quickkode

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.quickkode.sms.SmsListenerPackage
import com.quickkode.ussd.UssdPackage
import com.quickkode.contactpicker.ContactPickerPackage

class MainApplication : Application(), ReactApplication {


    override val reactHost: ReactHost by lazy {
        getDefaultReactHost(
            context = applicationContext,
            packageList =
                PackageList(this).packages.apply {
                    // Packages that cannot be autolinked yet can be added manually here, for example:
                    // add(MyReactNativePackage())
                    add(UssdPackage())
                    add(SmsListenerPackage())
                    add(ContactPickerPackage())
                },
        )
    }

    override fun onCreate() {
        super.onCreate()
        loadReactNative(this)
    }
}

plugins {
    id("com.android.application")
    id("kotlin-android")
    id("dev.flutter.flutter-gradle-plugin")
}

android {
    namespace = "com.example.malaria_screener"

    // 🔑  Bump compileSdk to 35
    compileSdk = 35
    ndkVersion = "27.0.12077973"   // keep the NDK line you already added

    defaultConfig {
        applicationId = "com.example.malaria_screener"

        // 🔑  Min SDK stays 26
        minSdk = 26

        // 🔑  Bump targetSdk to 35
        targetSdk = 35

        versionCode = flutter.versionCode       // leave as-is
        versionName = flutter.versionName
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
    kotlinOptions { jvmTarget = "11" }

    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("debug")
        }
    }
}

flutter { source = "../.." }

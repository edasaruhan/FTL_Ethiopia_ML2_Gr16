# Malaria Screener Mobile App

Flutter application for field-based malaria diagnosis using AI-powered blood smear analysis.

## 📱 Key Features
- **Smart Capture** - High-quality blood smear image acquisition
- **AI Diagnosis** - On-device malaria parasite detection using TensorFlow Lite
- **Patient Management** - Secure patient registration and record-keeping
- **Malaria Assistant** - In-app chatbot for symptom checking and guidance
- **Offline Support** - Core functionality available without internet
- **Multi-platform** - Supports both Android and iOS devices

## 🛠 Tech Stack
| Category          | Technologies/Packages       |
|--------------------|-----------------------------|
| Framework         | Flutter 3.13                |
| Language          | Dart 3.1                    |
| Machine Learning  | TensorFlow Lite (tflite_flutter) |
| Camera            | camera 0.10.0+              |
| State Management  | Riverpod 2.4.7              |
| Navigation        | GoRouter 10.1.2             |
| Local Storage     | Hive 2.2.3                  |
| HTTP Client       | Dio 5.3.3                   |

## 🚀 Getting Started

### Prerequisites
- Flutter SDK 3.13+
- Dart SDK 3.1+
- Android Studio/Xcode (for emulators)
- Physical device recommended for camera testing

### Installation
```bash
# Clone the repository (if not already done)
git clone https://github.com/your-repo/malaria-diagnosis-system.git
cd mobile

# Install dependencies
flutter pub get

# Set up environment variables
cp .env.example .env

# Run on connected device
flutter run

# For release build
flutter build apk --release  # Android
flutter build ios --release  # iOS
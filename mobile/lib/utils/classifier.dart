import 'dart:io';
import 'dart:typed_data';
import 'package:flutter/services.dart';
import 'package:image/image.dart' as img;
import 'package:tflite_flutter/tflite_flutter.dart';

class Classifier {
  late Interpreter _interpreter;

  Classifier() {
    _loadModel();
  }

  Future<void> _loadModel() async {
    _interpreter = await Interpreter.fromAsset('assets/malaria_mobilenetv2_model.tflite');
  }

  Future<String> predict(File imageFile) async {
    // Load and preprocess image
    final bytes = await imageFile.readAsBytes();
    final image = img.decodeImage(bytes);
    final resized = img.copyResize(image!, width: 224, height: 224); // Match model input
    final input = Float32List(1 * 224 * 224 * 3); // 1 image, 224x224 RGB
    var index = 0;

    for (var y = 0; y < 224; y++) {
      for (var x = 0; x < 224; x++) {
        final pixel = resized.getPixel(x, y);
        input[index++] = img.getRed(pixel) / 255.0;
        input[index++] = img.getGreen(pixel) / 255.0;
        input[index++] = img.getBlue(pixel) / 255.0;
      }
    }

    // Output shape is [1, 1], a single float (e.g., probability of infection)
    final output = List.filled(1, 0.0).reshape([1, 1]);
    _interpreter.run(input.reshape([1, 224, 224, 3]), output);

    final probability = output[0][0];
    final label = probability >= 0.5 ? 'Parasitized' : 'Uninfected';
    final confidence = (probability * 100).toStringAsFixed(2);

    return '$label ($confidence%)';
  }
}

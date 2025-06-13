// utils/classifier.dart
import 'dart:io';
import 'dart:typed_data';
import 'package:flutter/services.dart';
import 'package:image/image.dart' as img;
import 'package:tflite_flutter/tflite_flutter.dart';

class Classifier {
  late Interpreter _interpreter;

  Classifier();

  Future<void> loadModel() async {
    _interpreter = await Interpreter.fromAsset('assets/malaria_mobilenetv2_model.tflite');
  }

  Future<Map<String, dynamic>> predict(File imageFile) async {
    if (_interpreter == null) {
      await loadModel();
    }

    final bytes = await imageFile.readAsBytes();
    final image = img.decodeImage(bytes);
    final resized = img.copyResize(image!, width: 128, height: 128);

    final input = Float32List(1 * 128 * 128 * 3);
    var index = 0;

    for (var y = 0; y < 128; y++) {
      for (var x = 0; x < 128; x++) {
        final pixel = resized.getPixel(x, y);
        input[index++] = img.getRed(pixel) / 255.0;
        input[index++] = img.getGreen(pixel) / 255.0;
        input[index++] = img.getBlue(pixel) / 255.0;
      }
    }

    final output = List.filled(1, 0.0).reshape([1, 1]);
    _interpreter.run(input.reshape([1, 128, 128, 3]), output);

    final probability = output[0][0];
    final label = probability > 0.5 ? 'Uninfected' : 'Parasitized';
    final confidence = probability > 0.5 ? probability : 1 - probability;

    return {
      'label': label,
      'confidence': (confidence * 100).toStringAsFixed(2),
    };
  }
}

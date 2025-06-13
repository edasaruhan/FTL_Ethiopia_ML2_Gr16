import 'dart:io';
import 'package:flutter/material.dart';
import 'package:camera/camera.dart';
import 'package:malaria_screener/screens/results_screen.dart';
import '../utils/classifier.dart';

class CameraScreen extends StatefulWidget {
  @override
  _CameraScreenState createState() => _CameraScreenState();
}

class _CameraScreenState extends State<CameraScreen> {
  CameraController? _controller;
  bool _isCameraInitialized = false;

  @override
  void initState() {
    super.initState();
    _initializeCamera();
  }

  Future<void> _initializeCamera() async {
    final cameras = await availableCameras();
    _controller = CameraController(cameras[0], ResolutionPreset.high);
    await _controller?.initialize();
    setState(() {
      _isCameraInitialized = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Capture Sample')),
      body: _isCameraInitialized
          ? CameraPreview(_controller!)
          : Center(child: CircularProgressIndicator()),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          final image = await _controller?.takePicture();
          if (image != null) {
            final classifier = Classifier();
            await classifier.loadModel();
            final result = await classifier.predict(File(image.path));

            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => ResultScreen(
                  imagePath: image.path,
                  resultText: result['label'],
                  confidence: result['confidence'],
                  patientName: 'Sara Noah',
                  patientId: 2,
                ),
              ),
            );
          }
        },
        child: Icon(Icons.camera_alt),
      ),
    );
  }

  @override
  void dispose() {
    _controller?.dispose();
    super.dispose();
  }
}

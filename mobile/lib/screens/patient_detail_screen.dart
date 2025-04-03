import 'dart:io';
import 'package:flutter/material.dart';
import 'package:malaria_screener/database/db_helper.dart';

class PatientDetailScreen extends StatefulWidget {
  final Map<String, dynamic> patient;

  PatientDetailScreen({required this.patient});

  @override
  _PatientDetailScreenState createState() => _PatientDetailScreenState();
}

class _PatientDetailScreenState extends State<PatientDetailScreen> {
  final dbHelper = DatabaseHelper.instance;
  List<Map<String, dynamic>> _slides = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchSlides();
  }

  // Fetch slides for the patient
  Future<void> _fetchSlides() async {
    final slides = await dbHelper.getSlidesByPatient(widget.patient['patient_id']);
    setState(() {
      _slides = slides;
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Patient Details'),
        backgroundColor: Colors.teal.shade800,
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Patient Details
            Text('Initials: ${widget.patient['initials']}', style: TextStyle(fontSize: 18)),
            SizedBox(height: 10),
            Text('Gender: ${widget.patient['gender']}', style: TextStyle(fontSize: 18)),
            SizedBox(height: 10),
            Text('Age: ${widget.patient['age']}', style: TextStyle(fontSize: 18)),
            SizedBox(height: 20),

            // Slides List
            Text(
              'Slides',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 10),
            Expanded(
              child: ListView.builder(
                itemCount: _slides.length,
                itemBuilder: (context, index) {
                  final slide = _slides[index];
                  return Card(
                    margin: EdgeInsets.symmetric(vertical: 8),
                    child: ExpansionTile(
                      title: Text('Slide ID: ${slide['slide_id']}'),
                      subtitle: Text('Date: ${slide['date']}'),
                      children: [
                        Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: FutureBuilder<List<Map<String, dynamic>>>(
                            future: dbHelper.getImagesBySlide(slide['slide_id']),
                            builder: (context, snapshot) {
                              if (snapshot.connectionState == ConnectionState.waiting) {
                                return Center(child: CircularProgressIndicator());
                              } else if (snapshot.hasError) {
                                return Text('Error: ${snapshot.error}');
                              } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                                return Text('No images found for this slide.');
                              } else {
                                final images = snapshot.data!;
                                return Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: images.map((image) {
                                    return Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          'Image ID: ${image['image_id']}',
                                          style: TextStyle(fontSize: 16),
                                        ),
                                        Text(
                                          'Infected RBCs: ${image['infected_count']}',
                                          style: TextStyle(fontSize: 16),
                                        ),
                                        Text(
                                          'Total RBCs: ${image['cell_count']}',
                                          style: TextStyle(fontSize: 16),
                                        ),
                                        if (image['image_path'] != null)
                                          Image.file(
                                            File(image['image_path']),
                                            height: 100,
                                            width: double.infinity,
                                            fit: BoxFit.cover,
                                          ),
                                        SizedBox(height: 10),
                                      ],
                                    );
                                  }).toList(),
                                );
                              }
                            },
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
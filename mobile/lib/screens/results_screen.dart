import 'dart:io';

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:malaria_screener/database/db_helper.dart';

class ResultScreen extends StatelessWidget {
  final String imagePath; // Path of the captured image
  final int infectedCount; // Number of infected RBCs
  final int totalCount; // Total number of RBCs

  ResultScreen({
    required this.imagePath,
    required this.infectedCount,
    required this.totalCount,
  });

  @override
  Widget build(BuildContext context) {
    final file = File(imagePath);

    return Scaffold(
      appBar: AppBar(
        title: Text('Analysis Results'),
        backgroundColor: Colors.teal.shade800,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Display the captured image
            ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: file.existsSync()
                  ? Image.file(file, height: 200, width: double.infinity, fit: BoxFit.cover)
                  : Image.asset('assets/placeholder.png', height: 200, width: double.infinity, fit: BoxFit.cover),
            ),
            SizedBox(height: 20),

            // Display the analysis results
            Text(
              'Analysis Results',
              style: GoogleFonts.lato(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.teal.shade800,
              ),
            ),
            SizedBox(height: 10),
            Text(
              'Infected RBCs: $infectedCount',
              style: GoogleFonts.lato(fontSize: 18),
            ),
            Text(
              'Total RBCs: $totalCount',
              style: GoogleFonts.lato(fontSize: 18),
            ),
            SizedBox(height: 20),

            // Save Results Button
            Center(
              child: ElevatedButton(
                onPressed: () async {
                  // Save results to the database
                  final dbHelper = DatabaseHelper.instance;
                  final patientId = 2; // Replace with actual patient ID
                  final slideId = 2; // Replace with actual slide ID

                  await dbHelper.insertImage({
                    'patient_id': patientId,
                    'slide_id': slideId,
                    'cell_count': totalCount,
                    'infected_count': infectedCount,
                    'cell_count_gt': totalCount,
                    'infected_count_gt': infectedCount,
                  });

                  // Navigate back to the home screen
                  Navigator.pop(context);
                },
                child: Text(
                  'Save Results',
                  style: GoogleFonts.lato(fontSize: 18),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.orangeAccent,
                  padding: EdgeInsets.symmetric(horizontal: 32, vertical: 12),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
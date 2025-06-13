import 'dart:io';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:malaria_screener/database/db_helper.dart';
import 'package:intl/intl.dart';

class ResultScreen extends StatelessWidget {
  final String imagePath;
  final String resultText;
  final String confidence; // percentage as string e.g., "87.25"
  final String patientName;
  final int patientId;

  ResultScreen({
    required this.imagePath,
    required this.resultText,
    required this.confidence,
    required this.patientName,
    required this.patientId,
  });

  @override
  Widget build(BuildContext context) {
    final file = File(imagePath);
    final isInfected = resultText.toLowerCase().contains('parasitized');
    final now = DateTime.now();
    final formattedDate = DateFormat('yyyy-MM-dd – HH:mm').format(now);

    return Scaffold(
      appBar: AppBar(
        title: Text('Analysis Results'),
        backgroundColor: Colors.teal.shade800,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView(
          children: [
            // Enlarged Image
            ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: file.existsSync()
                  ? Image.file(file, height: 300, width: double.infinity, fit: BoxFit.cover)
                  : Image.asset('assets/placeholder.png', height: 300, width: double.infinity, fit: BoxFit.cover),
            ),
            SizedBox(height: 24),

            Text(
              'Analysis Result',
              style: GoogleFonts.lato(fontSize: 26, fontWeight: FontWeight.bold, color: Colors.teal.shade800),
            ),
            SizedBox(height: 12),

            Row(
              children: [
                Icon(
                  isInfected ? Icons.warning_amber_rounded : Icons.check_circle_outline,
                  color: isInfected ? Colors.red : Colors.green,
                  size: 36,
                ),
                SizedBox(width: 12),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      resultText,
                      style: GoogleFonts.lato(fontSize: 22, fontWeight: FontWeight.w600, color: isInfected ? Colors.red : Colors.green),
                    ),
                    Text(
                      'Confidence: $confidence%',
                      style: GoogleFonts.lato(fontSize: 16, color: Colors.black87),
                    ),
                  ],
                ),
              ],
            ),
            SizedBox(height: 24),

            Divider(),

            // Patient Info
            Text(
              'Patient Info',
              style: GoogleFonts.lato(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 8),
            Text('👤     Name: $patientName', style: GoogleFonts.lato(fontSize: 16)),
            SizedBox(height: 5),
            Text('🆔     ID: $patientId', style: GoogleFonts.lato(fontSize: 16)),

            SizedBox(height: 16),

            // Date and Time
            Text(
              'Analysis Date & Time',
              style: GoogleFonts.lato(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 8),
            Text('📅     $formattedDate', style: GoogleFonts.lato(fontSize: 16)),

            SizedBox(height: 32),

            Center(
              child: ElevatedButton(
                onPressed: () async {
                  final dbHelper = DatabaseHelper.instance;
                  await dbHelper.insertImage({
                    'patient_id': patientId,
                    'slide_id': 2,
                    'cell_count': 1,
                    'infected_count': isInfected ? 1 : 0,
                    'cell_count_gt': 1,
                    'infected_count_gt': isInfected ? 1 : 0,
                  });

                  Navigator.pop(context);
                },
                child: Text('Save Results', style: GoogleFonts.lato(fontSize: 18)),
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

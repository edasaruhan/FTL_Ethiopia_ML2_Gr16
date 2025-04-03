import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class ResultDetailScreen extends StatelessWidget {
  final Map<String, dynamic> result;

  ResultDetailScreen({required this.result});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Result Details'),
        backgroundColor: Colors.teal.shade800,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Slide ID: ${result['slide_id']}',
              style: GoogleFonts.lato(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 20),
            Text(
              'Infected RBCs: ${result['infected_count']}',
              style: GoogleFonts.lato(fontSize: 18),
            ),
            Text(
              'Total RBCs: ${result['cell_count']}',
              style: GoogleFonts.lato(fontSize: 18),
            ),
            SizedBox(height: 20),
            Text(
              'Patient ID: ${result['patient_id']}',
              style: GoogleFonts.lato(fontSize: 18),
            ),
          ],
        ),
      ),
    );
  }
}
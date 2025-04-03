import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:malaria_screener/database/db_helper.dart';
import 'package:malaria_screener/screens/result_detail_screen.dart'; // Import ResultDetailScreen

class SavedResultsScreen extends StatefulWidget {
  @override
  _SavedResultsScreenState createState() => _SavedResultsScreenState();
}

class _SavedResultsScreenState extends State<SavedResultsScreen> {
  final dbHelper = DatabaseHelper.instance;
  List<Map<String, dynamic>> _savedResults = [];

  @override
  void initState() {
    super.initState();
    _fetchSavedResults();
  }

  // Fetch saved results from the database
  Future<void> _fetchSavedResults() async {
    final results = await dbHelper.getAllImages(); // Fetch all images
    setState(() {
      _savedResults = results;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Saved Results'),
        backgroundColor: Colors.teal.shade800,
      ),
      body: _savedResults.isEmpty
          ? Center(
        child: Text(
          'No saved results found.',
          style: GoogleFonts.lato(fontSize: 18),
        ),
      )
          : ListView.builder(
        itemCount: _savedResults.length,
        itemBuilder: (context, index) {
          final result = _savedResults[index];
          return Card(
            margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: ListTile(
              title: Text(
                'Slide ID: ${result['slide_id']}',
                style: GoogleFonts.lato(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              subtitle: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Infected RBCs: ${result['infected_count']}',
                    style: GoogleFonts.lato(fontSize: 16),
                  ),
                  Text(
                    'Total RBCs: ${result['cell_count']}',
                    style: GoogleFonts.lato(fontSize: 16),
                  ),
                ],
              ),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => ResultDetailScreen(result: result),
                  ),
                );
              },
            ),
          );
        },
      ),
    );
  }
}
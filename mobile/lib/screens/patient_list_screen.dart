import 'package:flutter/material.dart';
import 'package:malaria_screener/database/db_helper.dart';
import 'patient_detail_screen.dart';

class PatientListScreen extends StatefulWidget {
  @override
  _PatientListScreenState createState() => _PatientListScreenState();
}

class _PatientListScreenState extends State<PatientListScreen> {
  final dbHelper = DatabaseHelper.instance;
  List<Map<String, dynamic>> _patients = [];

  @override
  void initState() {
    super.initState();
    _fetchPatients();
  }

  // Fetch all patients from the database
  Future<void> _fetchPatients() async {
    final patients = await dbHelper.getAllPatients();
    setState(() {
      _patients = patients;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Registered Patients'),
        backgroundColor: Colors.teal.shade800,
      ),
      body: _patients.isEmpty
          ? Center(child: Text('No patients registered yet.'))
          : ListView.builder(
        itemCount: _patients.length,
        itemBuilder: (context, index) {
          final patient = _patients[index];
          return ListTile(
            title: Text(patient['initials']),
            subtitle: Text('Age: ${patient['age']}, Gender: ${patient['gender']}'),
            onTap: () {
              // Navigate to the Patient Detail Screen
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => PatientDetailScreen(patient: patient),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
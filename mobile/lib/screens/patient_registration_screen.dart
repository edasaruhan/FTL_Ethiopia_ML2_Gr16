import 'package:flutter/material.dart';
import 'package:malaria_screener/database/db_helper.dart'; // Import your DatabaseHelper

class PatientRegistrationScreen extends StatefulWidget {
  @override
  _PatientRegistrationScreenState createState() =>
      _PatientRegistrationScreenState();
}

class _PatientRegistrationScreenState extends State<PatientRegistrationScreen> {
  final _formKey = GlobalKey<FormState>(); // Form key for validation
  final _genderOptions = ['Male', 'Female']; // Gender options

  // Controllers for text fields
  final _initialsController = TextEditingController();
  String _selectedGender = 'Male';
  final _ageController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Register Patient'),
        backgroundColor: Colors.teal.shade800,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              // Initials (Name) Field
              TextFormField(
                controller: _initialsController,
                decoration: InputDecoration(
                  labelText: 'Initials',
                  border: OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter initials';
                  }
                  return null;
                },
              ),
              SizedBox(height: 20),

              // Gender Dropdown
              DropdownButtonFormField<String>(
                value: _selectedGender,
                decoration: InputDecoration(
                  labelText: 'Gender',
                  border: OutlineInputBorder(),
                ),
                items: _genderOptions.map((String gender) {
                  return DropdownMenuItem<String>(
                    value: gender,
                    child: Text(gender),
                  );
                }).toList(),
                onChanged: (String? newValue) {
                  setState(() {
                    _selectedGender = newValue!;
                  });
                },
              ),
              SizedBox(height: 20),

              // Age Field
              TextFormField(
                controller: _ageController,
                decoration: InputDecoration(
                  labelText: 'Age',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter age';
                  }
                  if (int.tryParse(value) == null) {
                    return 'Please enter a valid number';
                  }
                  return null;
                },
              ),
              SizedBox(height: 20),

              // Save Button
              ElevatedButton(
                onPressed: _savePatient,
                child: Text('Save Patient'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.orangeAccent,
                  padding: EdgeInsets.symmetric(horizontal: 32, vertical: 12),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // Save Patient to Database
  Future<void> _savePatient() async {
    if (_formKey.currentState!.validate()) {
      final dbHelper = DatabaseHelper.instance;

      // Create a patient map
      final patient = {
        'gender': _selectedGender,
        'initials': _initialsController.text,
        'age': int.parse(_ageController.text),
      };

      // Insert into the database
      await dbHelper.insertPatient(patient);

      // Show a success message
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Patient registered successfully!')),
      );

      // Clear the form
      _initialsController.clear();
      _ageController.clear();
      setState(() {
        _selectedGender = 'Male';
      });
    }
  }

  @override
  void dispose() {
    _initialsController.dispose();
    _ageController.dispose();
    super.dispose();
  }
}
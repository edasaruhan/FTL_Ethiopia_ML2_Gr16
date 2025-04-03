import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'patient_registration_screen.dart'; // Import the Patient Registration Screen
import 'patient_list_screen.dart'; // Import the Patient List Screen (to be created)

class HomeScreen extends StatefulWidget {
  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with TickerProviderStateMixin {
  double _opacity = 0.0;

  @override
  void initState() {
    super.initState();
    // Trigger animation on screen load
    Future.delayed(Duration(milliseconds: 500), () {
      setState(() {
        _opacity = 1.0;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Malaria Screener'),
        backgroundColor: Colors.teal.shade800,
      ),
      drawer: _buildDrawer(context), // Add the Drawer here
      body: Container(
        width: double.infinity,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [Colors.teal.shade800, Colors.teal.shade400],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: AnimatedOpacity(
          duration: Duration(seconds: 1),
          opacity: _opacity,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // App Title
              Text(
                'Malaria Screener',
                style: GoogleFonts.lato(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              SizedBox(height: 8),
              // Subtitle
              Text(
                'AI-Powered Malaria Detection',
                style: GoogleFonts.lato(
                  fontSize: 18,
                  color: Colors.white70,
                ),
              ),
              SizedBox(height: 30),

              // Image/Illustration with rounded corners
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: Image.asset(
                  'assets/malaria_analysis.webp',
                  height: 250,
                  width: 250,
                  fit: BoxFit.cover,
                ),
              ),

              SizedBox(height: 30),

              // Start Screening Button
              _buildCardButton(
                context,
                text: 'Start Screening',
                icon: Icons.camera_alt,
                route: '/camera',
              ),
              SizedBox(height: 20),

              // View Records Button
              _buildCardButton(
                context,
                text: 'View Records',
                icon: Icons.history,
                route: '/history',
              ),
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          Navigator.pushNamed(context, '/camera');
        },
        icon: Icon(Icons.play_circle_filled),
        label: Text("Quick Start"),
        backgroundColor: Colors.orangeAccent,
      ),
    );
  }

  // Drawer Widget
  Widget _buildDrawer(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          DrawerHeader(
            decoration: BoxDecoration(
              color: Colors.teal.shade800,
            ),
            child: Text(
              'Malaria Screener',
              style: GoogleFonts.lato(
                fontSize: 24,
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          ListTile(
            leading: Icon(Icons.home, color: Colors.teal.shade800),
            title: Text('Home'),
            onTap: () {
              Navigator.pop(context); // Close the drawer
              Navigator.pushReplacementNamed(context, '/');
            },
          ),
          ListTile(
            leading: Icon(Icons.person_add, color: Colors.teal.shade800),
            title: Text('Register Patient'),
            onTap: () {
              Navigator.pop(context); // Close the drawer
              Navigator.pushNamed(context, '/register_patient');
            },
          ),
          ListTile(
            leading: Icon(Icons.people, color: Colors.teal.shade800),
            title: Text('View Patients'),
            onTap: () {
              Navigator.pop(context); // Close the drawer
              Navigator.pushNamed(context, '/patient_list');
            },
          ),
          ListTile(
            leading: Icon(Icons.assignment, color: Colors.teal.shade800),
            title: Text('Saved Results'),
            onTap: () {
              Navigator.pop(context); // Close the drawer
              Navigator.pushNamed(context, '/saved_results');
            },
          ),
        ],
      ),
    );
  }

  // Card-style Buttons
  Widget _buildCardButton(BuildContext context,
      {required String text, required IconData icon, required String route}) {
    return GestureDetector(
      onTap: () {
        Navigator.pushNamed(context, route);
      },
      child: Container(
        width: 250,
        padding: EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: Colors.black26,
              blurRadius: 5,
              spreadRadius: 2,
              offset: Offset(2, 3),
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: Colors.teal.shade700, size: 26),
            SizedBox(width: 10),
            Text(
              text,
              style: GoogleFonts.lato(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: Colors.teal.shade700,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
import 'package:flutter/material.dart';
import 'package:malaria_screener/screens/patient_list_screen.dart';
import 'package:malaria_screener/screens/patient_registration_screen.dart';
import 'package:malaria_screener/screens/saved_results_screen.dart';
import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

import 'screens/home_screen.dart';
import 'screens/camera_screen.dart';
import 'screens/results_screen.dart';
import 'screens/history_screen.dart';
import 'screens/settings_screen.dart';
import 'database/db_helper.dart'; // Import your database helper

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Print Database Path
  String dbPath = await getDatabasesPath();
  String fullPath = join(dbPath, 'malaria_screener.db');
  print('SQLite Database Path: $fullPath');

  runApp(MalariaScreenerApp());
}

class MalariaScreenerApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(primarySwatch: Colors.teal),
      initialRoute: '/',
      routes: {
        '/': (context) => HomeScreen(),
        '/camera': (context) => CameraScreen(),
        // '/results': (context) => ResultScreen(),
        '/results': (context) => ResultScreen(
          imagePath: '',
          infectedCount: 0,
          totalCount: 0,
        ),
        '/history': (context) => HistoryScreen(),
        '/settings': (context) => SettingsScreen(),
        '/register_patient': (context) => PatientRegistrationScreen(),
        '/patient_list': (context) => PatientListScreen(),
        '/saved_results': (context) => SavedResultsScreen(),
      },
    );
  }
}



// class MyHomePage extends StatefulWidget {
//   const MyHomePage({super.key, required this.title});
//
//
//   final String title;
//
//   @override
//   State<MyHomePage> createState() => _MyHomePageState();
// }
//
// class _MyHomePageState extends State<MyHomePage> {
//   int _counter = 0;
//
//   void _incrementCounter() {
//     setState(() {
//
//       _counter++;
//     });
//   }
//
//   @override
//   Widget build(BuildContext context) {
//
//     return Scaffold(
//       appBar: AppBar(
//
//         backgroundColor: Theme.of(context).colorScheme.inversePrimary,
//
//         title: Text(widget.title),
//       ),
//       body: Center(
//
//         child: Column(
//
//           mainAxisAlignment: MainAxisAlignment.center,
//           children: <Widget>[
//             const Text(
//               'You have pushed the button this many times:',
//             ),
//             Text(
//               '$_counter',
//               style: Theme.of(context).textTheme.headlineMedium,
//             ),
//           ],
//         ),
//       ),
//       floatingActionButton: FloatingActionButton(
//         onPressed: _incrementCounter,
//         tooltip: 'Increment',
//         child: const Icon(Icons.add),
//       ), // This trailing comma makes auto-formatting nicer for build methods.
//     );
//   }
// }

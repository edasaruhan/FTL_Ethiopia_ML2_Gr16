import 'package:flutter/material.dart';

class HistoryScreen extends StatelessWidget {
  final List<Map<String, String>> sampleResults = [
    {'date': 'March 5, 2025', 'status': 'Negative'},
    {'date': 'March 1, 2025', 'status': 'Mild Infection'},
    {'date': 'Feb 20, 2025', 'status': 'Negative'},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Scan History')),
      body: ListView.builder(
        itemCount: sampleResults.length,
        itemBuilder: (context, index) {
          final result = sampleResults[index];
          return ListTile(
            leading: Icon(
              result['status'] == 'Negative' ? Icons.check_circle : Icons.warning,
              color: result['status'] == 'Negative' ? Colors.green : Colors.red,
            ),
            title: Text('Date: ${result['date']}'),
            subtitle: Text('Status: ${result['status']}'),
            onTap: () {
              Navigator.pushNamed(context, '/results', arguments: 'sample_image.png');
            },
          );
        },
      ),
    );
  }
}

import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

class DatabaseHelper {
  static final DatabaseHelper instance = DatabaseHelper._init();
  static Database? _database;

  DatabaseHelper._init();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDB('malaria_screener.db');
    return _database!;
  }

  Future<Database> _initDB(String filePath) async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, filePath);

    return await openDatabase(
      path,
      version: 1,
      onCreate: _createDB,
    );
  }

  // 🔹 Define the SQLite Schema (Tables)
  Future<void> _createDB(Database db, int version) async {
    await db.execute('''
      CREATE TABLE Patient (
        patient_id INTEGER PRIMARY KEY AUTOINCREMENT,
        gender TEXT,
        initials TEXT,
        age INTEGER
      )
    ''');

    await db.execute('''
      CREATE TABLE Slide (
        patient_id INTEGER,
        slide_id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT,
        time TEXT,
        site TEXT,
        preparer TEXT,
        operator TEXT,
        staining_method TEXT,
        FOREIGN KEY (patient_id) REFERENCES Patient(patient_id) ON DELETE CASCADE
      )
    ''');

    await db.execute('''
      CREATE TABLE Image (
        patient_id INTEGER,
        slide_id INTEGER,
        image_id INTEGER PRIMARY KEY AUTOINCREMENT,
        cell_count INTEGER,
        infected_count INTEGER,
        cell_count_gt INTEGER,
        infected_count_gt INTEGER,
        FOREIGN KEY (patient_id) REFERENCES Patient(patient_id),
        FOREIGN KEY (slide_id) REFERENCES Slide(slide_id)
      )
    ''');

    await db.execute('''
      CREATE TABLE ImageThick (
        patient_id INTEGER,
        slide_id INTEGER,
        image_id INTEGER PRIMARY KEY AUTOINCREMENT,
        parasite_count INTEGER,
        wbc_count INTEGER,
        parasite_count_gt INTEGER,
        wbc_count_gt INTEGER,
        FOREIGN KEY (patient_id) REFERENCES Patient(patient_id),
        FOREIGN KEY (slide_id) REFERENCES Slide(slide_id)
      )
    ''');
  }

  // 🔹 Close the database when done
  Future<void> close() async {
    final db = await instance.database;
    db.close();
  }

  // 🔹 Insert Patient Data
  Future<int> insertPatient(Map<String, dynamic> patient) async {
    final db = await instance.database;
    return await db.insert('Patient', patient);
  }

  // 🔹 Insert Slide Data
  Future<int> insertSlide(Map<String, dynamic> slide) async {
    final db = await instance.database;
    return await db.insert('Slide', slide);
  }

  // 🔹 Insert Image Data (Thin Smear)
  Future<int> insertImage(Map<String, dynamic> image) async {
    final db = await instance.database;
    return await db.insert('Image', image);
  }

  // 🔹 Insert Image Thick Data (Thick Smear)
  Future<int> insertImageThick(Map<String, dynamic> imageThick) async {
    final db = await instance.database;
    return await db.insert('ImageThick', imageThick);
  }

  // 🔹 Get all Patients
  Future<List<Map<String, dynamic>>> getAllPatients() async {
    final db = await instance.database;
    return await db.query('Patient');
  }

  // 🔹 Get a Single Patient by ID
  Future<Map<String, dynamic>?> getPatientById(int patientId) async {
    final db = await instance.database;
    final result = await db.query(
      'Patient',
      where: 'patient_id = ?',
      whereArgs: [patientId],
      limit: 1,
    );
    return result.isNotEmpty ? result.first : null;
  }

  // 🔹 Get all Slides for a given Patient
  Future<List<Map<String, dynamic>>> getSlidesByPatient(int patientId) async {
    final db = await instance.database;
    return await db.query('Slide', where: 'patient_id = ?', whereArgs: [patientId]);
  }

  // 🔹 Get all Slides
  Future<List<Map<String, dynamic>>> getAllSlides() async {
    final db = await instance.database;
    return await db.query('Slide');
  }

  // 🔹 Get a Single Slide by ID
  Future<Map<String, dynamic>?> getSlideById(int slideId) async {
    final db = await instance.database;
    final result = await db.query(
      'Slide',
      where: 'slide_id = ?',
      whereArgs: [slideId],
      limit: 1,
    );
    return result.isNotEmpty ? result.first : null;
  }

  // 🔹 Get all Images (Thin Smear)
  Future<List<Map<String, dynamic>>> getAllImages() async {
    final db = await instance.database;
    return await db.query('Image');
  }

  // 🔹 Get Images for a given Slide (Thin Smear)
  Future<List<Map<String, dynamic>>> getImagesBySlide(int slideId) async {
    final db = await instance.database;
    return await db.query('Image', where: 'slide_id = ?', whereArgs: [slideId]);
  }

  // 🔹 Get a Single Image by ID (Thin Smear)
  Future<Map<String, dynamic>?> getImageById(int imageId) async {
    final db = await instance.database;
    final result = await db.query(
      'Image',
      where: 'image_id = ?',
      whereArgs: [imageId],
      limit: 1,
    );
    return result.isNotEmpty ? result.first : null;
  }

  // 🔹 Get all Thick Images
  Future<List<Map<String, dynamic>>> getAllThickImages() async {
    final db = await instance.database;
    return await db.query('ImageThick');
  }

  // 🔹 Get Thick Images for a given Slide (Thick Smear)
  Future<List<Map<String, dynamic>>> getThickImagesBySlide(int slideId) async {
    final db = await instance.database;
    return await db.query('ImageThick', where: 'slide_id = ?', whereArgs: [slideId]);
  }

  // 🔹 Get a Single Thick Image by ID (Thick Smear)
  Future<Map<String, dynamic>?> getThickImageById(int imageId) async {
    final db = await instance.database;
    final result = await db.query(
      'ImageThick',
      where: 'image_id = ?',
      whereArgs: [imageId],
      limit: 1,
    );
    return result.isNotEmpty ? result.first : null;
  }

  // 🔹 Delete a Patient and all related data
  Future<int> deletePatient(int patientId) async {
    final db = await instance.database;
    return await db.delete('Patient', where: 'patient_id = ?', whereArgs: [patientId]);
  }
}

// Fetch all slides for a given patient
Future<List<Map<String, dynamic>>> getSlidesByPatient(int patientId) async {
  final db = await DatabaseHelper.instance.database; // Use DatabaseHelper.instance
  return await db.query('Slide', where: 'patient_id = ?', whereArgs: [patientId]);
}

// Fetch all images for a given slide
Future<List<Map<String, dynamic>>> getImagesBySlide(int slideId) async {
  final db = await DatabaseHelper.instance.database; // Use DatabaseHelper.instance
  return await db.query('Image', where: 'slide_id = ?', whereArgs: [slideId]);
}
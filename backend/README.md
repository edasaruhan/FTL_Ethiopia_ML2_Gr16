# Malaria Diagnosis Backend

Django REST API for malaria detection system.

## Features
- Image processing for blood smear analysis
- Patient record management (CRUD operations)
- Chatbot query handling
- PostgreSQL database integration

## Tech Stack
- Python 3.10+
- Django 4.2
- Django REST Framework
- TensorFlow (for CNN model)
- PostgreSQL

## Setup
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start server
python manage.py runserver
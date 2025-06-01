#  backend/screenings/serializers.py

from patients.models import Patient
from rest_framework import serializers
from .models import Screening

class PatientBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ['id', 'first_name', 'last_name']
class ScreeningSerializer(serializers.ModelSerializer):
    class Meta:
        model = Screening
        fields = '__all__'
        read_only_fields = ('result', 'parasite_count', 'confidence')

class ScreeningGetSerializer(serializers.ModelSerializer):
    patient = PatientBasicSerializer(read_only=True)

    class Meta:
        model = Screening
        fields = [
            'id',
            'patient',
            'image',
            'result',
            'parasite_count',
            'confidence',
            'notes',
            'created_at',
        ]
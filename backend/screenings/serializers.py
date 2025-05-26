#  backend/screenings/serializers.py

from rest_framework import serializers
from .models import Screening

class ScreeningSerializer(serializers.ModelSerializer):
    class Meta:
        model = Screening
        fields = '__all__'
        read_only_fields = ('result', 'parasite_count', 'confidence')
#  backend/screenings/models.py

from django.db import models
from patients.models import Patient

class Screening(models.Model):
    RESULT_CHOICES = [('P', 'Positive'), ('N', 'Negative'), ('I', 'Inconclusive')]
    
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='screenings')
    image = models.ImageField(upload_to='screenings/')
    result = models.CharField(max_length=1, choices=RESULT_CHOICES)
    parasite_count = models.PositiveIntegerField()
    confidence = models.FloatField()
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Screening #{self.id} - {self.get_result_display()}"
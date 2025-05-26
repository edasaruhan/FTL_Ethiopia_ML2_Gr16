#  backend/patients/models.py

from django.db import models
from accounts.models import CustomUser

class Patient(models.Model):
    GENDER_CHOICES = [('M', 'Male'), ('F', 'Female')]
    
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    birth_date = models.DateField()
    address = models.TextField()
    phone = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"
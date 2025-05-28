#  backend/accounts/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True, max_length=255, verbose_name='email address')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    USER_TYPE_CHOICES = (
        (1, 'Admin'),
        (2, 'Clinician'),
        (3, 'Field Worker'),
    )
    user_type = models.PositiveSmallIntegerField(choices=USER_TYPE_CHOICES, default=3)
    phone = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return self.email

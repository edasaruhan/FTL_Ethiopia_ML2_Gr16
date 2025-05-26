#  backend/accounts/urls.py
from django.urls import path
from .views import RegisterView, MyTokenObtainPairView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', MyTokenObtainPairView.as_view(), name='login'),
]
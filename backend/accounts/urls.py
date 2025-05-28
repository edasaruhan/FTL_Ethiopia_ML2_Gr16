#  backend/accounts/urls.py
from django.urls import path
from .views import RegisterView, EmailTokenObtainPairView, UserView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', EmailTokenObtainPairView.as_view(), name='login'),
    path('user/', UserView.as_view(), name='user'),
]
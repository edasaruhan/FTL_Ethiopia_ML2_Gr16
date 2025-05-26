#  backend/screenings/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ScreeningViewSet

router = DefaultRouter()
router.register(r'screenings', ScreeningViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
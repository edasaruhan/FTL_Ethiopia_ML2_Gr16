#  backend/screenings/views.py

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Screening
from .serializers import ScreeningSerializer
from rest_framework.views import APIView
class ScreeningViewSet(viewsets.ModelViewSet):
    queryset = Screening.objects.all()
    serializer_class = ScreeningSerializer
    parser_classes = [MultiPartParser, FormParser]
    
    @action(detail=False, methods=['post'])
    def upload(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # In a real implementation, you would call your ML model here
            # For now, we'll mock the response
            mock_result = {
                'result': 'P',
                'parasite_count': 42,
                'confidence': 0.96
            }
            serializer.save(**mock_result)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class ScreeningUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    
    def post(self, request):
        serializer = ScreeningSerializer(data=request.data)
        if serializer.is_valid():
            # In production, add your ML model processing here
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

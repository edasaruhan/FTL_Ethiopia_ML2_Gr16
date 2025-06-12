#  backend/screenings/views.py

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Screening
from .serializers import ScreeningGetSerializer, ScreeningSerializer
from rest_framework.views import APIView
from rest_framework import viewsets, permissions

import tensorflow as tf
from PIL import Image
import numpy as np
class ScreeningViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint to list all screenings or retrieve a single screening.
    """
    queryset = Screening.objects.select_related('patient').all().order_by('-created_at')
    serializer_class = ScreeningGetSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'], url_path='patient/(?P<patient_id>[^/.]+)')
    def screenings_by_patient(self, request, patient_id=None):
        screenings = Screening.objects.filter(patient_id=patient_id).order_by('-created_at')
        serializer = self.get_serializer(screenings, many=True)
        return Response(serializer.data)




# Load the TFLite model
MODEL_PATH = '../model_training/models/malaria_mobilenetv2_model.tflite'
interpreter = tf.lite.Interpreter(model_path=MODEL_PATH)
interpreter.allocate_tensors()

# Get input and output details once
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

class ScreeningUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def preprocess_image(self, image_file):
        img = Image.open(image_file).convert('RGB')
        img = img.resize((128, 128))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0).astype(np.float32)
        return img_array

    def post(self, request):
        serializer = ScreeningSerializer(data=request.data)
        if serializer.is_valid():
            image_file = request.FILES['image']
            img_array = self.preprocess_image(image_file)

            # Run inference with TFLite
            interpreter.set_tensor(input_details[0]['index'], img_array)
            interpreter.invoke()
            output_data = interpreter.get_tensor(output_details[0]['index'])[0][0]

            prediction = output_data
            result = 'N' if prediction > 0.5 else 'P'
            confidence = float(prediction if prediction > 0.5 else 1 - prediction)
            parasite_count = int(confidence * 100)  # Example scaling logic

            # Save record
            screening = serializer.save(
                result=result,
                parasite_count=parasite_count,
                confidence=confidence
            )

            return Response(ScreeningSerializer(screening).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
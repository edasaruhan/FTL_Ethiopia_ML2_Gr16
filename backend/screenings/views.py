#  backend/screenings/views.py

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Screening
from .serializers import ScreeningSerializer
from rest_framework.views import APIView

import tensorflow as tf
from PIL import Image
import numpy as np
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
            result = 'P' if prediction > 0.5 else 'N'
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
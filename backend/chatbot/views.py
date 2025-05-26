#  backend/chatbot/views.py

from rest_framework.views import APIView
from rest_framework.response import Response

class ChatbotView(APIView):
    def post(self, request):
        query = request.data.get('query', '')
        language = request.data.get('lang', 'en')
        
        # Mock response - in a real implementation, integrate with Rasa/NLP
        responses = {
            'en': {
                'symptoms': 'Malaria symptoms include fever, chills, and headache.',
                'treatment': 'Artemisinin-based combination therapies (ACTs) are recommended.',
            },
            'fr': {
                'symptoms': 'Les symptômes du paludisme incluent fièvre, frissons et maux de tête.',
                'treatment': 'Les thérapies combinées à base d\'artémisinine (ACT) sont recommandées.',
            }
        }
        
        response = responses.get(language, {}).get(query.lower(), 
                 'I can provide information about malaria symptoms and treatment.')
        
        return Response({'response': response})
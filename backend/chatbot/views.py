import os
import logging
import requests
import cohere

from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import ChatMessage
from .serializers import ChatMessageSerializer

# Configure logger
logger = logging.getLogger(__name__)

class ChatMessageViewSet(viewsets.ModelViewSet):
    queryset = ChatMessage.objects.all()
    serializer_class = ChatMessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user).order_by('created_at')

    def perform_create(self, serializer):
        query = self.request.data.get('query')
        if not query:
            raise Response({"error": "Query is required"}, status=status.HTTP_400_BAD_REQUEST)

        # === 1. Serper Search ===
        serper_api_key = os.getenv('SERPER_API_KEY')
        search_results = None
        search_urls = []
        organic_results = []

        if not serper_api_key:
            logger.warning("Serper API key is missing.")
        else:
            serper_url = "https://google.serper.dev/search"
            headers = {"X-API-KEY": serper_api_key, "Content-Type": "application/json"}
            payload = {"q": f"{query} malaria treatment and protection"}
            try:
                response = requests.post(serper_url, json=payload, headers=headers)
                response.raise_for_status()
                search_results = response.json()
                organic_results = search_results.get("organic", [])[:5]
                search_urls = [item.get("link") for item in organic_results if item.get("link")]
            except requests.RequestException as e:
                logger.error(f"Serper API call failed: {str(e)}")

        # === 2. Cohere Chat ===
        cohere_api_key = os.getenv('COHERE_API_KEY')
        if not cohere_api_key:
            response_text = "Cohere API key is missing. Please contact the administrator."
            logger.warning("Cohere API key is missing.")
        else:
            try:
                co = cohere.Client(cohere_api_key)

                preamble = """
                ## Task and Context
                You are an AI assistant specialized in providing accurate and helpful information on malaria treatment and protection. Use the provided search results as context to answer user queries. Include relevant details about malaria prevention (e.g., insecticide-treated nets, chemoprevention), treatment (e.g., artemisinin-based therapies), and risks (e.g., severe symptoms in children, pregnant women). If search results are insufficient, rely on your knowledge but prioritize factual accuracy. Provide concise, professional, and friendly responses.

                ## Style Guide
                Use clear language, avoid jargon, and explain medical terms simply. Cite search results by referencing their URLs when applicable.
                """

                documents = [
                    {
                        "title": item.get("title", ""),
                        "snippet": item.get("snippet", ""),
                        "url": item.get("link", "")
                    }
                    for item in organic_results
                ]

                cohere_response = co.chat(
                    message=query,
                    preamble=preamble,
                    documents=documents,
                    max_tokens=400
                )
                response_text = cohere_response.text

            except Exception as e:
                response_text = f"Error generating response: {str(e)}"
                logger.error(f"Cohere chat error: {str(e)}")

        # === 3. Save to Database ===
        serializer.save(
            user=self.request.user,
            query=query,
            search_results=search_results,
            search_urls=search_urls,
            response=response_text
        )

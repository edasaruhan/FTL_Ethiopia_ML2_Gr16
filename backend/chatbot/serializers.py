from rest_framework import serializers
from .models import ChatMessage

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'query', 'response', 'search_results', 'search_urls', 'created_at']
        read_only_fields = ['id', 'response', 'search_results', 'search_urls', 'created_at']
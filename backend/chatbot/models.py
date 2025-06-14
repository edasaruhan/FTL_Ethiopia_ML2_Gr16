from django.db import models
from django.conf import settings

class ChatMessage(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="chat_messages")
    query = models.TextField()
    search_results = models.JSONField(null=True, blank=True)  # Store Serper results
    search_urls = models.JSONField(null=True, blank=True)  # Store URLs as list
    response = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username}: {self.query[:50]}..."
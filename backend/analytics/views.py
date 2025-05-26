#  backend/analytics/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from screenings.models import Screening
from django.db.models import Count
from datetime import date, timedelta

class DashboardView(APIView):
    def get(self, request):
        stats = {
            'today_cases': Screening.objects.filter(created_at__date=date.today()).count(),
            'positive_rate': Screening.objects.filter(result='P').count() / Screening.objects.count() if Screening.objects.count() > 0 else 0,
            'weekly_trend': self.get_weekly_trend()
        }
        return Response(stats)
    
    def get_weekly_trend(self):
        dates = []
        counts = []
        for i in range(7):
            day = date.today() - timedelta(days=i)
            count = Screening.objects.filter(created_at__date=day).count()
            dates.append(day.strftime('%a'))
            counts.append(count)
        return {'dates': dates[::-1], 'counts': counts[::-1]}
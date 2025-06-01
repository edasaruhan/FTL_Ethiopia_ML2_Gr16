#  backend/analytics/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from screenings.models import Screening
from patients.models import Patient  
from datetime import date, timedelta

class DashboardView(APIView):
    def get(self, request):
        total_screenings = Screening.objects.count()
        stats = {
            'today_cases': Screening.objects.filter(created_at__date=date.today()).count(),
            'positive_rate': Screening.objects.filter(result='P').count() / total_screenings if total_screenings > 0 else 0,
            'total_patients': Patient.objects.count(),  
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
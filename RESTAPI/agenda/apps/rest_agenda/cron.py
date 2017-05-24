from .models import CronLog

def my_scheduled_job():
    CronLog.objects.create()

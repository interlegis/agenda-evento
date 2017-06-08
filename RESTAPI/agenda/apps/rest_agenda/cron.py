from rest_framework import status
from rest_framework.response import Response
from .models import CronLog, Reserva

def my_scheduled_job():
    """
    Update all instances of the queryset. Then send email to all users and
    create a Log that has the timestamp of the send
    """
    try:
        reservas = Reserva.objects.select_related().filter(status=u'R',
                                                           recebido=True,
                                                           evento__publicado_agenda=False)

        for i in range(len(reservas)):
            reservas[i].evento.publicado_agenda = True
            reservas[i].evento.save()
            reservas[i].save()

        CronLog.objects.create()
        return Response(status=status.HTTP_200_OK)
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

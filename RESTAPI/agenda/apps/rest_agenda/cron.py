from rest_framework import status
from rest_framework.response import Response
from .models import CronLog, Reserva
from .emails import enviar_email_tramitacao, enviar_notificacao_agenda

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
            enviar_email_tramitacao(reserva,"Publicado na Agenda")

        CronLog.objects.create()
        enviar_notificacao_agenda()
        return Response(status=status.HTTP_200_OK)
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

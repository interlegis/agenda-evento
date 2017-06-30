# -*- coding: utf-8 -*-
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.contrib.auth.models import User

def enviar_email_tramitacao(reserva,status):
    msg_plain = render_to_string('rest_agenda/email_tramitacao.txt',
                                {'nr_referencia': reserva.nr_referencia,
                                 'status': status})
    msg_html = render_to_string('rest_agenda/email_tramitacao.html',
                                {'nr_referencia': reserva.nr_referencia,
                                 'status': status})
    send_mail(
    u'Tramitação do Pedido -' + reserva.nr_referencia,
    msg_plain,
    'sapl-test@interlegis.leg.br',
    [reserva.usuario.email, reserva.evento.responsavel.email],
    fail_silently=False,
    html_message=msg_html
    )

def enviar_notificacao_agenda():
    msg_plain = render_to_string('rest_agenda/email_notificacao_agenda.txt')
    msg_html = render_to_string('rest_agenda/email_notificacao_agenda.html')
    send_mail(
    u'Notificação - Agenda Atualizada',
    msg_plain,
    'sapl-test@interlegis.leg.br',
    list(User.objects.values_list('email',flat=True)),
    fail_silently=False,
    html_message=msg_html
    )

def enviar_notificacao_video_conferencia(reserva,usuario_primeira_secretaria):
    msg_plain = render_to_string('rest_agenda/enviar_notificacao_video_conferencia.txt',
                                 {'nr_referencia': reserva.nr_referencia,
                                  'status': reserva.return_status(),
                                  'data_inicio': reserva.evento.data_inicio,
                                  'hora_inicio': reserva.evento.hora_inicio,
                                  'data_fim': reserva.evento.data_fim,
                                  'hora_fim': reserva.evento.hora_fim,
                                  'local_evento': reserva.evento.return_local()
                                  })
    msg_html = render_to_string('rest_agenda/enviar_notificacao_video_conferencia.html',
                                {'nr_referencia': reserva.nr_referencia,
                                 'status': reserva.return_status(),
                                 'data_inicio': reserva.evento.data_inicio,
                                 'hora_inicio': reserva.evento.hora_inicio,
                                 'data_fim': reserva.evento.data_fim,
                                 'hora_fim': reserva.evento.hora_fim,
                                 'local_evento': reserva.evento.return_local()
                                 })
    send_mail(
    u'Notificação - Video Conferência',
    msg_plain,
    'sapl-test@interlegis.leg.br',
    [usuario_primeira_secretaria.email,'matheusveleci@gmail.com'], #Adicionar email da VC
    fail_silently=False,
    html_message=msg_html
    )

def enviar_email_formalizacao(reserva, status):
    msg_plain = render_to_string('rest_agenda/enviar_email_formalizacao.txt',
                                {'nr_referencia': reserva.nr_referencia,
                                 'status': status})
    msg_html = render_to_string('rest_agenda/enviar_email_formalizacao.html',
                                {'nr_referencia': reserva.nr_referencia,
                                 'status': status})
    send_mail(
    u'Tramitação do Pedido -' + reserva.nr_referencia,
    msg_plain,
    'sapl-test@interlegis.leg.br',
    [reserva.usuario.email, reserva.evento.responsavel.email],
    fail_silently=False,
    html_message=msg_html
    )

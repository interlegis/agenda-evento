# -*- coding: utf-8 -*-
from django.core.mail import send_mail
from django.template.loader import render_to_string

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
    'nopley@agenda.interlegis.leg.br',
    [reserva.usuario.email, reserva.evento.responsavel.email],
    fail_silently=False,
    html_message=msg_html
    )

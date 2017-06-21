# -*- coding: utf-8 -*-
from django.core.mail import send_mail
from django.template.loader import render_to_string

def enviar_email_redefinr_senha(usuario,link):
    msg_plain = render_to_string('authentication/recuperacao_senha.txt',
                                {'link': link})
    msg_html = render_to_string('authentication/recuperacao_senha.html',
                                {'link': link})
    send_mail(
    u'Redefinição de Senha',
    msg_plain,
    'sapl-test@interlegis.leg.br',
    [usuario.email],
    fail_silently=False,
    html_message=msg_html
    )

# -*- coding: utf-8 -*-

import datetime
from .models import Reserva

def dias_uteis(data_atual, dias, plus_minus):
    while dias > 0:
        data_atual += datetime.timedelta(days=plus_minus)
        dia_semana = data_atual.weekday()
        if dia_semana >= 5:
            continue
        dias -= 1
    return data_atual

def check_datas(data_inicio,data_fim,hora_inicio,hora_fim):
    aviso = {}
    if Reserva.objects.filter(evento__data_inicio=data_inicio, status=u'P'):
        aviso['DataInicio'] = 'Evento Pré-Reservado na mesma data de início, \
        aguarde confirmacao'
    if Reserva.objects.filter(evento__data_fim=data_fim, status=u'P'):
        aviso['DataFim'] = 'Evento Pré-Reservado na mesma data de término, \
        aguarde confirmacao'
    if Reserva.objects.filter(evento__data_inicio__range=(data_inicio,data_fim),
       status=u'P'):
        aviso['EntreDatas'] = 'O período escolhido possui outros eventos \
         pré-reservado, aguarde confirmacao'
    if Reserva.objects.filter(evento__data_inicio=data_inicio,
       evento__hora_inicio__gte=hora_inicio, status=u'P') or \
       Reserva.objects.filter(evento__data_fim=data_fim,
       evento__hora_inicio__lte=hora_fim, status=u'P'):
        aviso['ConflitoHorario'] = 'Existe(m) evento(s) pré-reservado(s) \
        com conflito de horario, aguarde confirmacao'
    return aviso

def checkEventoDatas(evento_data):
    data_inicio = evento_data['data_inicio']
    data_fim = evento_data['data_fim']
    hora_inicio = evento_data['hora_inicio']
    hora_fim = evento_data['hora_fim']
    local = evento_data['local']
    
    if Reserva.objects.filter(evento__data_inicio__range=(data_inicio,data_fim),
       evento__data_fim__range=(data_inicio,data_fim),
       evento__hora_inicio__lte=hora_inicio,evento__hora_fim__gte=hora_fim,
       status=u'R', evento__local=local) or \
       Reserva.objects.filter(evento__data_inicio__range=(data_inicio,data_fim),
       evento__hora_inicio__lte=hora_fim,evento__hora_inicio__gte=hora_inicio,
       status=u'R', evento__local=local) or \
       Reserva.objects.filter(evento__data_fim__range=(data_inicio,data_fim),
       evento__hora_fim__lte=hora_fim,evento__hora_fim__gte=hora_inicio,
       status=u'R', evento__local=local):
       return False
    return True

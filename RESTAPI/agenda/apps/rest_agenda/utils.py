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
        aviso['DataInicio'] = 'Evento Pre-Reservado na mesma data de inicio, \
        aguarde confirmacao'
    if Reserva.objects.filter(evento__data_fim=data_fim, status=u'P'):
        aviso['DataFim'] = 'Evento Pre-Reservado na mesma data de termino, \
        aguarde confirmacao'
    if Reserva.objects.filter(evento__data_inicio__range=(data_inicio,data_fim),
       status=u'P'):
        aviso['EntreDatas'] = 'O periodo escolhido possui outros eventos \
         pre-reservado, aguarde confirmacao'
    if Reserva.objects.filter(evento__data_inicio=data_inicio,
       evento__hora_inicio__gte=hora_inicio, status=u'P') or \
       Reserva.objects.filter(evento__data_fim=data_fim,
       evento__hora_inicio__lte=hora_fim, status=u'P'):
        aviso['ConflitoHorario'] = 'Existe(m) evento(s) pre-reservado(s) \
        com conflito de horario, aguarde confirmacao'
    return aviso

def checkEventoDatas(evento_data):
    data_inicio = evento_data['data_inicio']
    data_fim = evento_data['data_fim']
    hora_inicio = evento_data['hora_inicio']
    hora_fim = evento_data['hora_fim']
    if Reserva.objects.filter(evento__data_inicio=data_inicio,status=u'R'):
        return False
    if Reserva.objects.filter(evento__data_fim=data_fim,status=u'R'):
        return False
    if Reserva.objects.filter(evento__data_inicio__range=(data_inicio,data_fim),
       status=u'R'):
        return False
    if Reserva.objects.filter(evento__data_inicio=data_inicio,
       evento__hora_inicio__gte=hora_inicio,status=u'R') or \
       Reserva.objects.filter(evento__data_fim=data_fim,
       evento__hora_inicio__lte=hora_fim,status=u'R'):
       return False
    return True

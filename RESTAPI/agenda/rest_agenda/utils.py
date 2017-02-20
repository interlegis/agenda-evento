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
    if Reserva.objects.filter(evento__data_inicio=data_inicio):
        aviso['DataInicio'] = 'Evento na mesma data de inicio, aguarde confirmacao'
    if Reserva.objects.filter(evento__data_fim=data_fim):
        aviso['DataFim'] = 'Evento na mesma data de termino, aguarde confirmacao'
    if Reserva.objects.filter(evento__data_inicio__range=(data_inicio,data_fim)):
        aviso['EntreDatas'] = 'O periodo escolhido possui outros eventos, aguarde confirmacao'
    if Reserva.objects.filter(evento__data_inicio=data_inicio,evento__hora_inicio__gte=hora_inicio) or \
       Reserva.objects.filter(evento__data_fim=data_fim,evento__hora_inicio__lte=hora_fim):
        aviso['ConflitoHorario'] = 'Existe evento(s) com conflito de horario, aguarde confirmacao'
    return aviso

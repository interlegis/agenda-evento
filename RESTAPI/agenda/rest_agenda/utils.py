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


def check_datas(evento):
    for reserva in Resersa.objects.all():
        if evento.data_inicio >= reserva.evento.data_inicio:
            if evento.data_fim <= reserva.evento.data_fim:
                return True
    return False

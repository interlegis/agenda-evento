import datetime
from .models import Reserva


def add_dias_uteis(data_atual, add_dias):
    while add_dias > 0:
        data_atual += datetime.timedelta(days=1)
        dia_semana = data_atual.weekday()
        if dia_semana >= 5:
            continue
        add_dias -= 1
    return data_atual


def check_datas(evento):
    for reserva in Resersa.objects.all():
        if evento.data_inicio >= reserva.evento.data_inicio:
            if evento.data_fim <= reserva.evento.data_fim:
                return True
    return False

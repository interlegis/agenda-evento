from django.contrib import admin
from .models import Reserva, Evento, Responsavel, CronLog, EventoTramitacaoLog

admin.site.register(Reserva)
admin.site.register(EventoTramitacaoLog)
admin.site.register(Evento)
admin.site.register(Responsavel)
admin.site.register(CronLog)

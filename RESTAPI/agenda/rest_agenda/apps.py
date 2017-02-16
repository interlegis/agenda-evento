from django.apps import AppConfig

class RestAgendaConfig(AppConfig):
    name ='rest_agenda'

    def ready(self):
        from . import signals

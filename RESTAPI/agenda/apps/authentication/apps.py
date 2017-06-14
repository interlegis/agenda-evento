from django.apps import AppConfig
from django.db.models.signals import post_migrate


class AuthenticationConfig(AppConfig):
    name ='apps.authentication'

    def ready(self):
        from . import signals
        post_migrate.connect(signals.populate_models, sender=self)

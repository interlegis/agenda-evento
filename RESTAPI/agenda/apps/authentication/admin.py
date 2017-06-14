from django.contrib import admin
from .models import RecuperarSenha
from django.contrib.auth.models import Permission

admin.site.register(RecuperarSenha)
admin.site.register(Permission)

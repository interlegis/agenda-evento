from django.db import models
from django.contrib.auth.models import User

class RecuperarSenha(models.Model):
    token = models.CharField(blank=True, max_length=50,unique=True)
    usuario = models.ForeignKey(User, verbose_name=u'Recuperar-Senha-Usario')
    data_criacao = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return u"RecuperarSenha"

from django.db import models
from django.contrib.auth.models import User
import datetime

class Evento(models.Model):
    LOCAIS = (
        (u'SR', u"Sala de Reunioes"),
        (u'AI', u"Auditorio Interlegis")
    )

    nome = models.CharField(blank=False, max_length=500, null=False)
    descricao = models.TextField(blank=False, null=False)
    local = models.CharField(blank=False, max_length=100, choices=LOCAIS,
                             null=False)
    data_inicio = models.DateTimeField(blank=False, null=False)
    data_fim = models.DateTimeField(blank=False, null=False)
    usario_fk = models.ForeignKey(User, verbose_name=u'Responsavel')

    class Meta:
        """docstring for Meta."""
        verbose_name = u"Evento"
        verbose_name_plural = u"Eventos"

    def __unicode__(self):
        return "Evento %s %s" % (self.nome, self.local)


class Pedido(models.Model):
    data_criacao = models.DateTimeField(
        blank=False,
        default=datetime.datetime.now,
        null=False
    )
    data_modificao = models.DateTimeField(blank=False, auto_now=True, null=False)
    is_reserved = models.BooleanField(default=False)
    is_legislativo = models.BooleanField(default=False)
    is_cancel = models.BooleanField(default=False)
    evento_fk = models.ForeignKey(Evento, verbose_name=u'Evento')

    class Meta:
        verbose_name = u"Pedido"
        verbose_name_plural = u"Pedidos"

    def __unicode__(self):
        return "Pedido %s %s" % (self.id, u"reservado"
         if self.is_reserved else u"pre-reserva")

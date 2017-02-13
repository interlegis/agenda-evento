from django.db import models
from django.contrib.auth.models import User
import datetime

class Responsavel(models.Model):
    nome = models.CharField(blank=True, max_length=100)
    email = models.EmailField()
    telefone = models.CharField(blank=True, max_length=11)
    lotacao = models.CharField(blank=True, max_length=100)

    class Meta:
        verbose_name = u"Responsavel"
        verbose_name_plural = u"Responsaveis"

    def __unicode__(self):
        return "Responsavel %s" % self.nome

class Evento(models.Model):
    LOCAIS = (
        (u'SR', u"Sala de Reunioes"),
        (u'AI', u"Auditorio Interlegis")
    )
    data_inicio = models.DateTimeField(blank=False, null=False)
    data_fim = models.DateTimeField(blank=False, null=False)
    nome = models.CharField(blank=False, max_length=500, null=False)
    descricao = models.TextField(blank=False, null=False)
    observacao = models.TextField(blank=True)
    local = models.CharField(blank=False, max_length=100, choices=LOCAIS,
                             null=False)
    legislativo = models.BooleanField(default=False)
    cancelado = models.BooleanField(default=False)
    causa_cancelamento = models.TextField(blank=True)
    responsavel_fk = models.ForeignKey(Responsavel,
                                       verbose_name=u'Responsavel-Evento')

    class Meta:
        verbose_name = u"Evento"
        verbose_name_plural = u"Eventos"

    def __unicode__(self):
        return "Evento %s %s" % (self.nome, self.local)

class Reserva(models.Model):
    STATUS = (
        (u'P', u"Pre-reserva"),
        (u'R', u"Reservado"),
        (u'C', u"Cancelado"),
    )
    data_criacao = models.DateTimeField(
        blank=False,
        default=datetime.datetime.now,
        null=False
    )
    evento_fk = models.ForeignKey(Evento, verbose_name=u'Evento',
                                  on_delete=models.CASCADE)
    usario_fk = models.ForeignKey(User, verbose_name=u'Responsavel-Reserva')
    status = models.CharField(blank=False, max_length=100, choices=STATUS,
                             null=False,default='P')
    data_modificacao = models.DateTimeField(blank=False, auto_now=True,
                                            null=False)
    nr_referencia = models.CharField(blank=True, max_length=50)
    ano = models.CharField(blank=True, max_length=4)
    recebido = models.BooleanField(default=False)

    class Meta:
        verbose_name = u"Reserva"
        verbose_name_plural = u"Reservas"

    def __unicode__(self):
        return "Reserva %s %s" % (self.id, self.status)

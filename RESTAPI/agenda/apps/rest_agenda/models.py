# -*- coding: utf-8 -*-
from django.db import models
from django.contrib.auth.models import User
import datetime
from django.utils import timezone
from agenda import settings

class CronLog(models.Model):
    date = models.DateTimeField(default=timezone.localtime(timezone.now()), blank=True)
    def __unicode__(self):
        return self.date.ctime()

class Responsavel(models.Model):
    nome = models.CharField(blank=True, max_length=100)
    email = models.EmailField()
    telefone = models.CharField(blank=True, max_length=15)
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
    data_inicio = models.DateField(blank=False, null=False)
    hora_inicio = models.TimeField(blank=False, null=False)
    data_fim = models.DateField(blank=False, null=False)
    hora_fim = models.TimeField(blank=False, null=False)
    nome = models.CharField(blank=False, max_length=500, null=False, unique=True)
    descricao = models.TextField(blank=False, null=False)
    observacao = models.TextField(blank=True)
    local = models.CharField(blank=False, max_length=100, choices=LOCAIS,
                             null=False)
    video_conferencia = models.BooleanField(default=False)
    publicado_agenda = models.BooleanField(default=False)
    legislativo = models.BooleanField(default=False)
    cancelado = models.BooleanField(default=False)
    causa_cancelamento = models.TextField(blank=True)
    responsavel = models.ForeignKey(Responsavel,
                                       verbose_name=u'Responsavel-Evento')

    class Meta:
        verbose_name = u"Evento"
        verbose_name_plural = u"Eventos"

    def __unicode__(self):
        return "Evento %s %s" % (self.nome, self.local)

    def return_local(self):
        if self.local == 'SR':
            return u"Sala de Reunioes"
        else:
            return u"Auditorio Interlegis"


class Reserva(models.Model):
    STATUS = (
        (u'P', u"Pre-reserva"),
        (u'R', u"Reservado"),
        (u'C', u"Cancelado"),
        (u'I', u"Impedido"),
    )
    data_criacao = models.DateTimeField(
        blank=False,
        default=timezone.localtime(timezone.now()),
        null=False
    )
    evento = models.ForeignKey(Evento, verbose_name=u'Evento',
                                  on_delete=models.CASCADE)
    usuario = models.ForeignKey(User, verbose_name=u'Responsavel-Reserva')
    status = models.CharField(blank=False, max_length=100, choices=STATUS,
                             null=False,default='P')
    data_modificacao = models.DateTimeField(blank=False, auto_now=True,
                                            null=False)
    nr_referencia = models.CharField(blank=True, max_length=50)
    ano = models.CharField(blank=True, max_length=4)
    validade_pre_reserva = models.DateField(blank=True, null=False)
    recebido = models.BooleanField(default=False)

    class Meta:
        verbose_name = u"Reserva"
        verbose_name_plural = u"Reservas"

    def __unicode__(self):
        return "Reserva %s %s" % (self.id, self.status)

    def return_status(self):
        if self.status == "P":
            return u"Pré-Reservado"
        elif self.status == "R":
            return u"Reservado"
        elif self.status == "C":
            return u"Cancelado"
        else:
            return u"Impedido"

class EventoTramitacaoLog(models.Model):
    reserva = models.ForeignKey(Reserva, verbose_name=u'Reserva')
    usuario = models.ForeignKey(User, verbose_name=u'Usuario')
    log = models.CharField(blank=True, max_length=100)
    data_modificacao = models.DateTimeField(default=timezone.localtime(timezone.now()), blank=True)

    class Meta:
        verbose_name = u"Log Evento Tramitado"
        verbose_name_plural = u"Log Eventos Tramitados"

    def __unicode__(self):
        return "Log Eventos %s %s" % (self.id, self.log)

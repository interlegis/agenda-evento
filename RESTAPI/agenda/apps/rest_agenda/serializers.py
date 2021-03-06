# -*- coding: utf-8 -*-

from rest_framework import serializers
from .models import Reserva, Evento, Responsavel, Arquivo
import random
import datetime
import magic
from .utils import dias_uteis, checkEventoDatas
from .emails import enviar_notificacao_video_conferencia
from agenda.settings import BASE_URL

class ResponsavelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Responsavel
        fields = ('nome', 'email','telefone', 'lotacao',)

class EventoSerializerAgenda(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField('get_id')
    reserva_id = serializers.SerializerMethodField('get_reser_id')
    title = serializers.SerializerMethodField('get_nome')
    start = serializers.SerializerMethodField('get_data_inicio')
    end = serializers.SerializerMethodField('get_data_fim')
    start_hour = serializers.SerializerMethodField('get_hora_inicio')
    end_hour = serializers.SerializerMethodField('get_hora_fim')
    description = serializers.SerializerMethodField('get_desc')
    lugar = serializers.SerializerMethodField('get_local')

    class Meta:
        model = Evento
        fields = ('_id', 'title', 'start', 'start_hour', 'end_hour', 'end',
        'description', 'lugar', 'reserva_id')

    def get_id(self, obj):
        return obj['evento__id']

    def get_reser_id(self, obj):
        return obj['id']

    def get_nome(self, obj):
        return obj['evento__nome']

    def get_data_inicio(self, obj):
        return str(obj['evento__data_inicio'])

    def get_data_fim(self, obj):
        return str(obj['evento__data_fim'])

    def get_hora_inicio(self, obj):
        return str(obj['evento__hora_inicio'])

    def get_hora_fim(self, obj):
        return str(obj['evento__hora_fim'])

    def get_desc(self, obj):
        return obj['evento__descricao']

    def get_local(self, obj):
        return obj['evento__local']

class EventoSerializer(serializers.ModelSerializer):
    responsavel = ResponsavelSerializer()
    class Meta:
        model = Evento
        fields = ('nome', 'descricao', 'local', 'data_inicio','hora_inicio',
                  'data_fim', 'hora_fim', 'legislativo','observacao',
                  'cancelado','causa_cancelamento','publicado_agenda',
                  'video_conferencia','responsavel',)

    def update(self, instance, validated_data,):
        responsavel_data = validated_data.pop('responsavel')
        responsavel = instance.responsavel

        for attr, value in responsavel_data.items():
            setattr(responsavel, attr, value)

        responsavel.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        return instance

    def validate(self, attrs):
        if (attrs['data_inicio'] - datetime.datetime.now().date()).days < 3:
            raise serializers.ValidationError('Evento fora do período para criação ou alteração')
        if self.instance is not None:
            if Reserva.objects.filter(evento__hora_inicio__lte=attrs['hora_inicio'],
            evento__hora_fim__gte=attrs['hora_inicio'],
            evento__data_inicio__range=(attrs['data_inicio'], attrs['data_fim']),
            evento__local=attrs['local'],
            status=u'R').exclude(pk=self.instance.pk) or \
            Reserva.objects.filter(evento__hora_inicio__lte=attrs['hora_inicio'],
            evento__hora_fim__gte=attrs['hora_inicio'],
            evento__data_fim__range=(attrs['data_inicio'], attrs['data_fim']),
            evento__local=attrs['local'],
            status=u'R').exclude(pk=self.instance.pk):
                raise serializers.ValidationError('Evento no mesmo dia: horario \
                ja reservado')
            if Reserva.objects.filter(
            evento__data_inicio__lte=attrs['data_inicio'],
            evento__data_fim__gte=attrs['data_fim'],
            status=u'R').exclude(pk=self.instance.pk):
                raise serializers.ValidationError('Evento no mesmo dia: horario \
                ja reservado')
        elif attrs['data_inicio'] < datetime.datetime.now().date():
            raise serializers.ValidationError('Data de inicio deve ser maior \
            igual a de hoje')
        elif attrs['data_fim'] < attrs['data_inicio']:
            raise serializers.ValidationError('Data final deve ser maior igual \
            a data de inicio')
        elif attrs['data_inicio'] == attrs['data_fim']:
            if attrs['hora_fim'] < attrs['hora_inicio']:
                raise serializers.ValidationError('Evento no mesmo dia: hora \
                final tem que ser maior do que a hora inicial')
        return attrs

class ReservaEventoSerializer(serializers.ModelSerializer):
    evento = EventoSerializer()
    class Meta:
        model = Reserva
        fields = ('id','data_criacao','nr_referencia','status','recebido','evento',)
        read_only_fields = ('status','id','recebido','nr_referencia','data_criacao')

    def save(self, request, **kwargs):
        evento_data = self.data.pop('evento')
        if not checkEventoDatas(evento_data):
            raise serializers.ValidationError('Eventos ja reservados nesse \
            período')
        responsavel = Responsavel.objects.create(**evento_data.pop('responsavel'))
        evento =  Evento.objects.create(responsavel=responsavel,**evento_data)
        ano = str(datetime.datetime.now().year)
        nr_referencia = str(random.randrange(0, 1000000,5)) + '/' + ano
        validade = dias_uteis(datetime.datetime.now().date(),5,1)
        if evento_data['local'] == u'SR' and \
           request.user.groups.filter(name='primeira_secretaria').exists():
            status = u'R'
        else:
            status = u'P'
        reserva = Reserva.objects.create(evento=evento,usuario=request.user,
                                         nr_referencia=nr_referencia, ano=ano,
                                         status=status,
                                         validade_pre_reserva=validade)
        if evento_data['video_conferencia'] is True and status == u'R':
            enviar_notificacao_video_conferencia(reserva,request.user, BASE_URL)

        return evento

class ArquivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Arquivo
        fields = ('nome','pdf',)
        readonly_fields = ('uploaded_at',)

    def validate(self, attrs):
        type_file = magic.from_buffer(attrs['pdf'].read(), mime=True)

        if type_file != 'application/pdf':
            raise serializers.ValidationError('O campo deve ser no formato pdf')
        return attrs

class ReservaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reserva
        fields = ('status','recebido','data_criacao','data_modificacao','nr_referencia',)
        read_only_fields = ('nr_referencia',)

# -*- coding: utf-8 -*-

from rest_framework import serializers
from .models import Reserva, Evento, Responsavel
import random
import datetime
from .utils import dias_uteis, checkEventoDatas
from .emails import enviar_notificacao_video_conferencia

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

        responsavel.nome = responsavel_data.get('nome', responsavel.nome)
        responsavel.email = responsavel_data.get('email', responsavel.email)
        responsavel.telefone = responsavel_data.get('telefone',
                                                    responsavel.telefone)
        responsavel.lotacao = responsavel_data.get('lotacao',
                                                   responsavel.lotacao)
        responsavel.save()

        instance.nome = validated_data.get('nome', instance.nome)
        instance.descricao = validated_data.get('descricao',
                                                instance.descricao)
        instance.local = validated_data.get('local', instance.local)

        instance.data_inicio = validated_data.get('data_inicio',
                                                  instance.data_inicio)
        instance.hora_inicio = validated_data.get('hora_inicio',
                                                  instance.hora_inicio)
        instance.data_fim = validated_data.get('data_fim',
                                               instance.data_fim)
        instance.hora_fim = validated_data.get('hora_fim',
                                                  instance.hora_fim)
        instance.legislativo = validated_data.get('legislativo',
                                                  instance.legislativo)
        instance.observacao = validated_data.get('observacao',
                                                  instance.observacao)
        instance.cancelado = validated_data.get('cancelado',
                                                  instance.cancelado)
        instance.publicado_agenda = validated_data.get('publicado_agenda',
                                                  instance.publicado_agenda)
        instance.video_conferencia = validated_data.get('video_conferencia',
                                                  instance.video_conferencia)
        instance.causa_cancelamento = validated_data.get('causa_cancelamento',
                                                  instance.causa_cancelamento)
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
            enviar_notificacao_video_conferencia(reserva,request.user)

        return evento

class ReservaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reserva
        fields = ('status','recebido','data_criacao','data_modificacao','nr_referencia',)
        read_only_fields = ('nr_referencia',)

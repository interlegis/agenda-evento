from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Reserva, Evento, Responsavel
import random
import datetime
from .utils import dias_uteis, check_datas

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password', 'first_name', 'last_name'
                  , 'is_superuser', 'email', 'is_staff',)
        extra_kwargs = {'password': {'write_only': True},
                        'is_superuser': {'write_only': True},
                        'is_staff': {'write_only': True}}


class ResponsavelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Responsavel
        fields = ('nome', 'email','telefone', 'lotacao',)


class EventoSerializer(serializers.ModelSerializer):
    responsavel = ResponsavelSerializer()
    class Meta:
        model = Evento
        fields = ('nome', 'descricao', 'local', 'data_inicio','hora_inicio',
                  'data_fim', 'hora_fim', 'legislativo','observacao',
                  'cancelado','causa_cancelamento','publicado_agenda',
                  'video_conferencia','responsavel',)
        read_only_fields = ('publicado_agenda',)

    def update(self, instance, validated_data):
        responsavel_data = validated_data.pop('responsavel')
        responsavel = instance.responsavel

        instance.nome = validated_data.get('nome', instance.nome)
        instance.descricao = validated_data.get('descricao',
                                                instance.descricao)
        instance.local = validated_data.get('local', instance.local)
        if instance.publicado_agenda is True:
            if validated_data.get('data_inicio') > dias_uteis(validated_data.get('data_inicio'),3,-1):
                raise serializers.ValidationError('Data com antecedencia menor que 3 dias uteis')
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
        instance.video_conferencia = validated_data.get('video_conferencia',
                                                  instance.video_conferencia)
        instance.causa_cancelamento = validated_data.get('causa_cancelamento',
                                                  instance.causa_cancelamento)
        conflito_datas = check_datas(instance.data_inicio,instance.data_fim,
                                     instance.hora_inicio,instance.hora_fim)
        instance.save()

        responsavel.nome = responsavel_data.get('nome', responsavel.nome)
        responsavel.email = responsavel_data.get('email', responsavel.email)
        responsavel.telefone = responsavel_data.get('telefone',
                                                    responsavel.telefone)
        responsavel.lotacao = responsavel_data.get('lotacao',
                                                   responsavel.lotacao)
        responsavel.save()

        return instance

    def validate(self, attrs):
        if attrs['data_inicio'] < datetime.datetime.now().date():
            raise serializers.ValidationError('Data de inicio deve ser maior igual a de hoje')
        elif attrs['data_fim'] < attrs['data_inicio']:
            raise serializers.ValidationError('Data final deve maior igual a data de inicio')
        elif attrs['data_inicio'] == attrs['data_fim']:
            if attrs['hora_fim'] < attrs['hora_inicio']:
                raise serializers.ValidationError('Evento no mesmo dia, horas final tem que ser maior')
        return attrs


class ReservaEventoSerializer(serializers.ModelSerializer):
    evento = EventoSerializer()
    class Meta:
        model = Reserva
        fields = ('id','nr_referencia','status','recebido','evento',)
        read_only_fields = ('status','id','recebido','nr_referencia',)

    def save(self, request, **kwargs):
        evento_data = self.data.pop('evento')
        responsavel = Responsavel.objects.create(**evento_data.pop('responsavel'))
        evento =  Evento.objects.create(responsavel=responsavel,**evento_data)
        ano = str(datetime.datetime.now().year)
        nr_referencia = str(random.randrange(0, 1000000,5)) + '/' + ano
        validade = dias_uteis(datetime.datetime.now().date(),5,1)
        if evento_data['local'] == u'SR' and request.user.groups.filter(name='primeira_secretaria').exists():
            if evento_data['video_conferencia'] is True:
                pass
            status = u'R'
        else:
            status = u'P'
        reserva = Reserva.objects.create(evento=evento,usario=request.user,
                                         nr_referencia=nr_referencia, ano=ano,
                                         status=status,
                                         validade_pre_reserva=validade)
        return evento



class ReservaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reserva
        fields = ('status','recebido','data_modificacao','nr_referencia',)
        read_only_fields = ('nr_referencia',)

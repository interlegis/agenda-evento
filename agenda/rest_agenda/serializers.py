from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Reserva, Evento, Responsavel
import random
import datetime

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
    responsavel_fk = ResponsavelSerializer()
    class Meta:
        model = Evento
        fields = ('nome', 'descricao', 'local', 'data_inicio', 'data_fim',
                  'legislativo','observacao','cancelado','responsavel_fk',)

class ReservaEventoSerializer(serializers.ModelSerializer):
    evento_fk = EventoSerializer()
    class Meta:
        model = Reserva
        fields = ('id','status','recebido','evento_fk',)
        read_only_fields = ('status','id','recebido',)

    def save(self, request, **kwargs):
        evento_data = self.data.pop('evento_fk')
        responsavel = Responsavel.objects.create(**evento_data.pop('responsavel_fk'))
        evento =  Evento.objects.create(responsavel_fk=responsavel,**evento_data)
        ano = str(datetime.datetime.now().year)
        nr_referencia = str(random.randrange(0, 1000000,5)) + '/' + ano
        reserva = Reserva.objects.create(evento_fk=evento,usario_fk=request.user,
                                         nr_referencia=nr_referencia, ano=ano)
        return evento

class ReservaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reserva
        fields = ('status','recebido','data_modificacao',)
        read_only_fields = ('nr_referencia',)

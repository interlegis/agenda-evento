from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Pedido, Evento

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password', 'first_name', 'last_name', 'is_superuser', 'email', 'is_staff',)
        extra_kwargs = {'password': {'write_only': True}, 'is_superuser': {'write_only': True}, 'is_staff': {'write_only': True}}


class EventoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evento
        fields = ('nome', 'descricao', 'local', 'data_inicio', 'data_fim',)


class PedidoEventoSerializer(serializers.ModelSerializer):
    evento_fk = EventoSerializer()
    class Meta:
        model = Pedido
        fields = ('is_legislativo','is_reserved', 'is_cancel','evento_fk',)
        read_only_fields = ('is_reserved', 'is_cancel', 'data_modificao')

    def save(self, request, **kwargs):
        evento =  Evento.objects.create(usario_fk=request.user,**self.data.pop('evento_fk'))
        pedido = Pedido.objects.create(evento_fk=evento,is_legislativo=self.data.pop('is_legislativo'))
        return evento

class PedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = ('is_legislativo','is_reserved', 'is_cancel','data_modificao',)

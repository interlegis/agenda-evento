from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Pedido, Evento

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password', 'first_name', 'last_name', 'is_superuser', 'email', 'is_staff',)
        write_only_fields = ('password', 'is_superuser', 'is_staff')

class PedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = ('is_legislativo',)


class EventoSerializer(serializers.ModelSerializer):
    is_legislativo = serializers.BooleanField(default=True)
    class Meta:
        model = Evento
        fields = ('nome', 'descricao', 'local', 'data_inicio', 'data_fim','is_legislativo',)

    def save(self, request, **kwargs):
        is_legislativo = self.data.pop('is_legislativo')
        evento =  Evento.objects.create(usario_fk=request.user,**self.data)
        pedido = Pedido.objects.create(evento_fk=evento,is_legislativo=is_legislativo)
        return evento

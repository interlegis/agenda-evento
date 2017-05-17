from django.contrib.auth.models import User, Group
from rest_framework import serializers

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('name',)

class UsuarioSerializer(serializers.ModelSerializer):
    groups = GroupSerializer(many=True)
    class Meta:
        model = User
        fields = ('username', 'password', 'first_name', 'last_name'
                  , 'is_superuser', 'email', 'is_staff','groups')
        extra_kwargs = {'password': {'write_only': True},
                        'is_superuser': {'write_only': True},
                        'is_staff': {'write_only': True}}

# -*- coding: utf-8 -*-
from django.contrib.auth.models import User, Group
from rest_framework import serializers

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('name',)

class UsuarioSerializer(serializers.ModelSerializer):
    groups = GroupSerializer(many=True, required=False)
    class Meta:
        model = User
        fields = ('username', 'password', 'first_name', 'last_name'
                  , 'is_superuser', 'email', 'is_staff', 'is_active', 'groups')
        extra_kwargs = {'password': {'write_only': True},
                        'is_superuser': {'write_only': True},
                        'is_staff': {'write_only': True},
                        'is_active': {'write_only': True}}

    def validate_email(self, attrs):
        if self.instance is not None:
            if User.objects.filter(email=attrs).exclude(pk=self.instance.pk).exists():
                raise serializers.ValidationError('Usuário já cadastrado \
                 com esse email!')
        else:
            if User.objects.filter(email=attrs).exists():
                raise serializers.ValidationError('Usuário já cadastrado \
                 com esse email!')
        return attrs

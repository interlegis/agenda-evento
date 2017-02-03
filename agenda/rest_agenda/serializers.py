from django.contrib.auth.models import User
from rest_framework import serializers

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password', 'first_name', 'last_name', 'is_superuser', 'email', 'is_staff')
        write_only_fields = ('password', 'is_superuser', 'is_staff')  # Note: Password field is write-only

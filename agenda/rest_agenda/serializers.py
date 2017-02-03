from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'password', 'first_name', 'last_name', 'is_superuser', 'email', 'is_staff')

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

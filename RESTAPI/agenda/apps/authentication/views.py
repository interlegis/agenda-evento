# -*- coding: utf-8 -*-
from django.contrib.auth.models import User
from .serializers import UsuarioSerializer
from rest_framework import status, generics
from rest_framework.response import Response
from .permissions import IsAuthenticatedListCreateUser
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import RecuperarSenha
import random
from .emails import enviar_email_redefinr_senha


class UsuarioListCreate(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticatedListCreateUser,)
    queryset = User.objects.all()
    serializer_class = UsuarioSerializer

    def create(self, request):
        serializer = UsuarioSerializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save()
                user = User.objects.get(username=serializer.data['username'])
                user.set_password(request.data['password'])
                user.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except:
                return Response("Created Error",
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        try:
            queryset = User.objects.all()
            serializer = UsuarioSerializer(queryset, many=True)
            return Response(serializer.data)
        except:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UsuarioDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk=None):
        try:
            return Response(UsuarioSerializer(request.user,
                            context={'request':request}).data,
                            status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk=None):
        try:
            user = User.objects.get(pk=request.user.pk)
            user.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk=None):
        try:
            user = User.objects.get(pk=request.user.pk)
            serializer = UsuarioSerializer(user, data=request.data)
            if serializer.is_valid():
                serializer.save()
                user = User.objects.get(username=serializer.data['username'])
                user.set_password(request.data['password'])
                user.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UsuarioNovaSenha(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        if RecuperarSenha.objects.filter(token=request.data['token']):
            user = RecuperarSenha.objects.get(token=request.data['token']).usuario
            user.set_password(request.data['password'])
            user.save()
            return Response("Senha alterada com sucesso.", status=status.HTTP_200_OK)
        else:
            return Response("Erro ao recupeara a senha.", status=status.HTTP_404_NOT_FOUND)

class UsuarioRecuperarSenha(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        if User.objects.filter(email=request.data['email']).exists():
            user = User.objects.get(email=request.data['email'])
            user.set_password('')
            user.save()
            token = ''.join([random.SystemRandom().choice('abcdefghijklmnopqrstuvwxyz0123456789') for i in range(50)])
            nova_senha = RecuperarSenha.objects.create(usuario=user,token=token)
            nova_senha.save()
            enviar_email_redefinr_senha(user,request.data['ROOT_URL_AGENDA']+'recuperarsenha/'+token)
            return Response("Verifique seu email!",status=status.HTTP_200_OK)
        else:
            return Response("Usuário não encontrado.", status=status.HTTP_404_NOT_FOUND)

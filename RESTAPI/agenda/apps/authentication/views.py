# -*- coding: utf-8 -*-
from django.contrib.auth.models import User
from .serializers import UsuarioSerializer
from rest_framework import status, generics
from rest_framework.response import Response
from .permissions import IsAuthenticatedListCreateUser
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from .emails import enviar_email_redefinr_senha, enviar_email_autenticar_cadastro
from agenda.settings import BASE_URL

class UsuarioListCreate(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticatedListCreateUser,)
    queryset = User.objects.all()
    serializer_class = UsuarioSerializer

    def create(self, request):
        #url_agenda = request.data['ROOT_URL_AGENDA']
        url_agenda = BASE_URL
        del request.data['ROOT_URL_AGENDA']
        serializer = UsuarioSerializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save()
                user = User.objects.get(username=serializer.data['username'])
                user.set_password(request.data['password'])
                user.save()
                token = urlsafe_base64_encode(force_bytes(
                                                User.objects.get(username=serializer.data['username']).id))
                enviar_email_autenticar_cadastro(user,
                                                 url_agenda+'autenticarcadastro/'+token)
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

class ValidarCadastro(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        token = urlsafe_base64_decode(request.data['token'])
        if User.objects.filter(id=token).exists():
            user = User.objects.get(id=token)
            user.is_active = True
            user.save()
            return Response("Usuario Autenticado com sucesso.", status=status.HTTP_200_OK)
        else:
            return Response("Erro ao recuperar a senha.", status=status.HTTP_404_NOT_FOUND)

class UsuarioNovaSenha(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        token = urlsafe_base64_decode(request.data['token'])
        if User.objects.filter(id=token).exists():
            user = User.objects.get(id=token)
            user.set_password(request.data['password'])
            user.save()
            return Response("Senha alterada com sucesso.", status=status.HTTP_200_OK)
        else:
            return Response("Erro ao recuperar a senha.", status=status.HTTP_404_NOT_FOUND)

class UsuarioRecuperarSenha(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        if User.objects.filter(email=request.data['email']).exists():
            user = User.objects.get(email=request.data['email'])
            user.set_password('')
            user.save()
            token = urlsafe_base64_encode(force_bytes(
                                          User.objects.get(email=request.data['email']).id))
            enviar_email_redefinr_senha(user,
                                        BASE_URL+'recuperarsenha/'+token)
            return Response("Verifique seu email!",status=status.HTTP_200_OK)
        else:
            return Response("Usuário não encontrado.", status=status.HTTP_404_NOT_FOUND)

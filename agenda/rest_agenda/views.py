from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User
from .serializers import *
from rest_framework import viewsets, status, response, permissions

# Create your views here.
def index(request):
    return HttpResponse("Hello World")

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UsuarioSerializer

    def create(self, request):
        serializer =  self.get_serializer(data=request.DATA)
        if serializer.is_valid():
            try:
                serializer.save()
                user = User.objects.filter(username=serializer.data['username'])[0]
                user.set_password(request.DATA['password'])
                user.save()
                return response.Response(serializer.data, status=status.HTTP_201_CREATED)
            except:
                return response.Response("Created Error",status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DadosUsuarioViewVSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def retrieve(self, request, pk=None):
        if pk == 'i':
            return response.Response(UserSerializer(request.user,
                context={'request':request}).data)
        return super(UserViewSet, self).retrieve(request, pk)

    def list(self, request):
        return response.Response({"erro": "Metodo nao disponivel para essa url"}, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request):
        return response.Response({"erro": "Metodo nao disponivel para essa url"}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        return response.Response({"erro": "Metodo nao disponivel para essa url"}, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, pk=None):
        return response.Response({"erro": "Metodo nao disponivel para essa url"}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        return response.Response({"erro": "Metodo nao disponivel para essa url"}, status=status.HTTP_400_BAD_REQUEST)

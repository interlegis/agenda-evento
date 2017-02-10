from django.contrib.auth.models import User
from .serializers import UsuarioSerializer
from rest_framework import status, generics, viewsets
from rest_framework.response import Response
from .permissions import IsAuthenticatedListCreateUser
from rest_framework.permissions import IsAuthenticated
from .models import Pedido, Evento
from .serializers import PedidoEventoSerializer, PedidoSerializer, EventoSerializer
from django.views.decorators.csrf import csrf_exempt


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
                return Response("Created Error",status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
            return Response(UsuarioSerializer(request.user, context={'request':request}).data)
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
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PedidoViewSet(generics.ListCreateAPIView):
    queryset = Pedido.objects.all()
    serializer_class = PedidoEventoSerializer
    permission_classes = (IsAuthenticated,)

    def create(self, request):
        serializer = PedidoEventoSerializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save(request)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except:
                return Response(serializer.errors,status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        try:
            queryset = Pedido.objects.all()
            serializer = PedidoEventoSerializer(queryset, many=True)
            return Response(serializer.data)
        except:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PedidoDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk):
        try:
            pedido = Pedido.objects.get(pk=pk)
            serializer = PedidoSerializer(pedido)
            return Response(serializer.data)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            pedido = Pedido.objects.get(pk=pk)
            pedido.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        try:
            pedido = Pedido.objects.get(pk=pk)
            serializer = PedidoSerializer(pedido, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

class EventoDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Evento.objects.all()
    serializer_class = EventoSerializer
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk, nome):
        try:
            pedido = Pedido.objects.get(pk=pk)
            if pedido.evento_fk.nome == nome:
                serializer = EventoSerializer(pedido.evento_fk)
                return Response(serializer.data)
            return Response(status=status.HTTP_404_NOT_FOUND)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk, nome):
        try:
            pedido = Pedido.objects.get(pk=pk)
            if pedido.evento_fk.nome == nome:
                pedido.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            return Response(status=status.HTTP_404_NOT_FOUND)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

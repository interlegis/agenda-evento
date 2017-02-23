from django.contrib.auth.models import User
from .serializers import UsuarioSerializer
from rest_framework import status, generics, viewsets
from rest_framework.response import Response
from .permissions import IsAuthenticatedListCreateUser
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Reserva, Evento
from .serializers import ReservaEventoSerializer, ReservaSerializer, EventoSerializer
from .utils import check_datas
import datetime



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


class ReservaViewSet(generics.ListCreateAPIView):
    queryset = Reserva.objects.all()
    serializer_class = ReservaEventoSerializer
    permission_classes = (IsAuthenticated,)

    def create(self, request):
        serializer = ReservaEventoSerializer(data=request.data)
        if serializer.is_valid():
            try:
                aviso = check_datas(serializer.data['evento']['data_inicio'],
                                    serializer.data['evento']['data_fim'],
                                    serializer.data['evento']['hora_inicio'],
                                    serializer.data['evento']['hora_fim'])
                serializer.save(request)
                return Response({'Reserva-Evento': serializer.data, 'avisos': aviso}, status=status.HTTP_201_CREATED)
            except:
                return Response(serializer.errors,status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        try:
            queryset = Reserva.objects.all()
            serializer = ReservaEventoSerializer(queryset, many=True)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ReservaDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Reserva.objects.all()
    serializer_class = ReservaSerializer
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk):
        try:
            reserva = Reserva.objects.get(pk=pk)
            serializer = ReservaSerializer(reserva)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            reserva = Reserva.objects.get(pk=pk)
            reserva.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        return Response(status=status.HTTP_404_NOT_FOUND)

class ReservaEdit(generics.ListCreateAPIView):
    queryset = Reserva.objects.all()
    serializer_class = ReservaSerializer
    permission_classes = (IsAuthenticated,)

    def post(self, request, pk, comando):
        try:
            reserva = Reserva.objects.get(pk=pk)
            if comando == "prereservado":
                request.data['status'] = u'P'
            elif comando == "cancelado":
                request.data['status'] = u'C'
            elif comando == "impedido":
                request.data['status'] = u'I'
                #send email
            elif comando == "reservado":
                request.data['status'] = u'R'
            elif comando == "recebido" and datetime.datetime.now().date() < reserva.validade_pre_reserva:
                request.data['recebido'] = True
            elif comando == "recebido" and datetime.datetime.now().date() > reserva.validade_pre_reserva:
                request.data['status'] = u'I'
            else:
                return Response({"message": "Comando nao e valido"}, status=status.HTTP_404_NOT_FOUND)
            request.data['data_modificacao'] = datetime.datetime.now()
            serializer = ReservaSerializer(reserva, data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        except:
            return Response({"message": "Registro inexistente"}, status=status.HTTP_404_NOT_FOUND)


class EventoDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Evento.objects.all()
    serializer_class = EventoSerializer
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk):
        try:
            reserva = Reserva.objects.get(pk=pk)
            serializer = EventoSerializer(reserva.evento)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            reserva = Reserva.objects.get(pk=pk)
            if reserva.evento.publicado_agenda:
                pass
                #nova agenda
            #email
            reserva.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)


class AgendaView(generics.ListAPIView):
    queryset = Reserva.objects.all()
    serializer_class = ReservaEventoSerializer
    permission_classes = (AllowAny,)

    def list(self, request, *args, **kwargs):
        data_inicio = datetime.datetime.now().date()
        data_fim = data_inicio + datetime.timedelta(days=7)
        queryset = Reserva.objects.filter(evento__data_inicio__range=(data_inicio,data_fim),status=u'R')
        serializer = ReservaEventoSerializer(queryset, many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)

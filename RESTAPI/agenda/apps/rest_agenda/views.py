# -*- coding: utf-8 -*-
import os
from django.contrib.auth.models import User
from rest_framework import status, generics, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Reserva, Evento, EventoTramitacaoLog, Arquivo
from .serializers import (ReservaEventoSerializer, ReservaSerializer,
                         EventoSerializer, EventoSerializerAgenda,
                         ArquivoSerializer )
from .utils import check_datas, checkEventoDatas
import datetime
from url_filter.integrations.drf import DjangoFilterBackend
from .emails import enviar_email_tramitacao, enviar_notificacao_video_conferencia,enviar_email_formalizacao
from agenda.settings import BASE_URL

class ReservaViewSet(generics.ListCreateAPIView):
    queryset = Reserva.objects.all()
    serializer_class = ReservaEventoSerializer
    permission_classes = (IsAuthenticated,)

    def create(self, request):
        serializer = ReservaEventoSerializer(data=request.data)
        if serializer.is_valid():
            try:
                if checkEventoDatas(serializer.data['evento']):
                    aviso = check_datas(serializer.data['evento']['data_inicio'],
                                        serializer.data['evento']['data_fim'],
                                        serializer.data['evento']['hora_inicio'],
                                        serializer.data['evento']['hora_fim'])
                    serializer.save(request)
                    if not request.data['evento']['local'] == u'SR' and \
                       not Reserva.objects.get(
                           evento=Evento.objects.get(
                                                     nome=request.data['evento']['nome'],
                                                     local=request.data['evento']['local'],
                                                     data_inicio=request.data['evento']['data_inicio'],
                                                     data_fim=request.data['evento']['data_fim'],
                                                     hora_inicio=request.data['evento']['hora_inicio'],
                                                     hora_fim=request.data['evento']['hora_fim'])).usuario.groups.filter(name='primeira_secretaria').exists():
                       enviar_email_formalizacao(
                                                 Reserva.objects.get(
                                                     evento=Evento.objects.get(
                                                                               nome=request.data['evento']['nome'],
                                                                               local=request.data['evento']['local'],
                                                                               data_inicio=request.data['evento']['data_inicio'],
                                                                               data_fim=request.data['evento']['data_fim'],
                                                                               hora_inicio=request.data['evento']['hora_inicio'],
                                                                               hora_fim=request.data['evento']['hora_fim'])),
                                                 Reserva.objects.get(
                                                     evento=Evento.objects.get(
                                                                               nome=request.data['evento']['nome'],
                                                                               local=request.data['evento']['local'],
                                                                               data_inicio=request.data['evento']['data_inicio'],
                                                                               data_fim=request.data['evento']['data_fim'],
                                                                               hora_inicio=request.data['evento']['hora_inicio'],
                                                                               hora_fim=request.data['evento']['hora_fim'])).status,
                                                 BASE_URL
                                                 )
                    return Response({'Reserva-Evento': serializer.data,
                                    'avisos': aviso},
                                    status=status.HTTP_201_CREATED)
                else:
                    return Response({'non_field_errors' : 'Ja existem eventos \
                                    reservados nessa data ou horario'},
                                    status=status.HTTP_400_BAD_REQUEST)
            except:
                return Response(serializer.errors,
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)

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
            tramitlogs = EventoTramitacaoLog.objects.filter(reserva=reserva)

            if len(tramitlogs) > 0 :
                path = tramitlogs.first().arquivo.pdf.path

                for log in tramitlogs:
                    log.delete()

                os.unlink(path)

            reserva.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        return Response(status=status.HTTP_404_NOT_FOUND)

class ReservaEdit(APIView):
    queryset = Reserva.objects.all()
    serializer_class = ReservaSerializer
    permission_classes = (IsAuthenticated,)

    def post(self, request, pk, comando):
        try:
            data = {}
            reserva = Reserva.objects.get(pk=pk)
            if comando == "prereservado":
                data['status'] = u'P'
            elif comando == "cancelado":
                data['status'] = u'C'
                data['causa_cancelamento'] = request.data['causa_cancelamento']
            elif comando == "impedido":
                data['status'] = u'I'
                #send email
            elif comando == "reservado":
                if Reserva.objects.filter(status=u'R',
                                          evento__data_fim__lte=reserva.evento.data_fim,
                                          evento__data_inicio__gte=reserva.evento.data_inicio,
                                          evento__hora_inicio__gte=reserva.evento.hora_inicio,
                                          evento__hora_fim__lte=reserva.evento.hora_fim):
                    return Response({"message": "Ja existem reservas nesse período."},
                                    status=status.HTTP_400_BAD_REQUEST)
                else:
                    data['status'] = u'R'
            elif comando == "recebido" and datetime.datetime.now().date() < \
                 reserva.validade_pre_reserva:
                data['recebido'] = True
            elif comando == "recebido" and datetime.datetime.now().date() > \
                 reserva.validade_pre_reserva:
                data['status'] = u'I'
                return Response({"message": "Pedido fora do prazo para ser formalizado"},
                                status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"message": "Comando nao e valido"},
                                status=status.HTTP_404_NOT_FOUND)
            data['data_modificacao'] = datetime.datetime.now()

            if 'pdf' in request.data and 'nome'in request.data:
                arq = Arquivo(nome=request.data['nome'],
                              pdf=request.data['pdf'])
                file_serializer = ArquivoSerializer(arq, data=request.data)
                if file_serializer.is_valid(raise_exception=True):
                    file_serializer.save()
                else:
                    return response.Response(serializer.errors,
                                    status=status.HTTP_400_BAD_REQUEST)

                log =  EventoTramitacaoLog(reserva=reserva,
                                           usuario=request.user,
                                           arquivo=arq,
                                           log="Mudanca de status:"+ comando)
                log.save()
            else:
                log =  EventoTramitacaoLog(reserva=reserva,
                                           usuario=request.user,
                                           arquivo=EventoTramitacaoLog.objects.filter(reserva__id=pk).first().arquivo,
                                           log="Mudanca de status:"+ comando)
                log.save()

            serializer = ReservaSerializer(reserva, data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            if reserva.evento.video_conferencia is True and comando == u'reservado':
                enviar_notificacao_video_conferencia(reserva,request.user,BASE_URL)
            if comando == 'cancelado':
                evento = reserva.evento
                evento.cancelado = True
                evento.causa_cancelamento = data['causa_cancelamento']
                evento.save()
            enviar_email_tramitacao(reserva,reserva.return_status,BASE_URL)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except:
            return Response({"message": "Registro inexistente"},
                            status=status.HTTP_404_NOT_FOUND)


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
            enviar_email_tramitacao(reserva,reserva.return_status,BASE_URL)
            evento = reserva.evento
            reserva.delete()
            evento.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        try:
            reserva = Reserva.objects.get(pk=pk)
            if not reserva.evento.publicado_agenda and (reserva.evento.data_inicio \
            - datetime.datetime.now().date()).days > 3 :
                serializer = EventoSerializer(reserva.evento,
                                              data=request.data['evento'])
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                else:
                    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"message": "Evento não está habilitado para alterações nesse período."},status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(status=status.HTTP_404_NOT_FOUND)


class PedidosUserView(generics.ListAPIView):
    queryset = Reserva.objects.all()
    serializer_class = ReservaEventoSerializer
    permission_classes = (IsAuthenticated,)

    def list(self, request, *args, **kwargs):
        try:
            user = User.objects.get(pk=request.user.pk)
            queryset = Reserva.objects.filter(usuario=user)
            serializer = ReservaEventoSerializer(queryset, many=True)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class AgendaView(generics.ListAPIView):
    queryset = Reserva.objects.all()
    serializer_class = ReservaEventoSerializer
    permission_classes = (AllowAny,)

    def list(self, request, *args, **kwargs):
        dia_da_semana = datetime.datetime.now().date().weekday()
        data_atual = datetime.datetime.now().date()
        if  dia_da_semana > 2:
            data_inicio = data_atual - datetime.timedelta(days=dia_da_semana-2)
        elif dia_da_semana < 2:
            minus_data = 0
            while(minus_data != 2):
                minus_data -= 1
            data_inicio = data_atual - datetime.timedelta(days=dia_da_semana-minus_data)
        else:
            data_inicio = datetime.datetime.now().date()
        data_fim = data_inicio + datetime.timedelta(days=7)
        queryset = Reserva.objects.filter(evento__data_inicio__range=(data_inicio,
                                                                      data_fim),
                                          status=u'R')
        serializer = ReservaEventoSerializer(queryset, many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)

class EventoLastestListView(generics.ListAPIView):
    queryset = Reserva.objects.filter(status=u'R',
                                      evento__publicado_agenda=True).exclude(
    evento__data_inicio__lt=datetime.datetime.now().date()).order_by(
    'evento__data_inicio', 'evento__nome').values('evento__data_fim',
    'evento__data_inicio', 'evento__hora_inicio', 'evento__hora_fim',
    'evento__descricao','evento__id','evento__local','evento__nome', 'id')
    serializer_class = EventoSerializerAgenda
    permission_classes = (AllowAny,)

    def list(self, request, *args, **kwargs):
        serializer = EventoSerializerAgenda(self.get_queryset(), many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)

class EventoListView(generics.ListAPIView):
    queryset = Reserva.objects.filter(status=u'R',
                                      evento__publicado_agenda=True).values(
    'evento__data_fim','evento__data_inicio', 'evento__hora_inicio',
    'evento__hora_fim','evento__descricao','evento__id','evento__local',
    'evento__nome', 'id')
    serializer_class = EventoSerializerAgenda
    permission_classes = (AllowAny,)

    def list(self, request, *args, **kwargs):
        serializer = EventoSerializerAgenda(self.get_queryset(), many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)

class PesquisaAgenda(generics.ListAPIView):
    queryset = Reserva.objects.all()
    serializer_class = ReservaEventoSerializer
    permission_classes = (AllowAny,)
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['status','evento']

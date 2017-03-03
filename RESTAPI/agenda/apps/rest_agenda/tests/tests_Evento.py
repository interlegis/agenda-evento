from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from model_mommy import mommy
import datetime
from apps.rest_agenda.models import *
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User, Group


class ReservaTests(APITestCase):
    # url = reverse('detail-pedido-evento', args=[])

    def set_credentials(self):
        user = mommy.make(User)
        token = Token.objects.get(user__username=user.username)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

    def teste_alteracao_evento(self):
        self.set_credentials()
        user = mommy.make(User)
        responsavel = mommy.make(Responsavel)
        evento = mommy.make(Evento, responsavel=responsavel,
                            publicado_agenda=True)
        data_validae = datetime.datetime.now().date() + \
                       datetime.timedelta(days=7)
        reserva = mommy.make(Reserva,evento=evento,usuario=user,
                             validade_pre_reserva=data_validae,id=1)
        data = {
            "nome": "Carnaval",
            "descricao": "Feriado Catolico de cunho festivo e tradicionamente \
            brasileiro",
            "local": 'SR',
            "data_inicio": "2017-03-25",
            "hora_inicio": "00:00",
            "data_fim": "2017-03-28",
            "hora_fim": "12:00",
            "legislativo": 'False',
            "observacao": "Nenhuma",
            "video_conferencia": 'False',
            "responsavel": {
                "nome": "Governo do Brasil",
                "email": "governo@gov.br",
                "telefone": "6199999999",
                "lotacao": "Governo"
            }
        }
        url =  reverse('detail-pedido-evento', args=[1])
        response = self.client.put(url, data)
        errors = ['Data com antecedencia menor que 3 dias uteis']
        self.assertEqual(response.data, errors)
        evento = mommy.make(Evento, responsavel=responsavel,
                            publicado_agenda=False)
        data_validae = datetime.datetime.now().date() + \
                       datetime.timedelta(days=7)
        reserva = mommy.make(Reserva,evento=evento,usuario=user,
                             validade_pre_reserva=data_validae,id=2)
        url =  reverse('detail-pedido-evento', args=[2])
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def teste_cancelamento_evento(self):
        self.set_credentials()
        user = mommy.make(User)
        responsavel = mommy.make(Responsavel)
        evento = mommy.make(Evento, responsavel=responsavel)
        data_validae = datetime.datetime.now().date() + \
                       datetime.timedelta(days=7)
        reserva = mommy.make(Reserva,evento=evento,usuario=user,
                             validade_pre_reserva=data_validae,id=1)
        url =  reverse('detail-pedido-evento', args=[1])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def teste_get_evento(self):
        self.set_credentials()
        user = mommy.make(User)
        responsavel = mommy.make(Responsavel)
        evento = mommy.make(Evento, responsavel=responsavel)
        data_validae = datetime.datetime.now().date() + \
                       datetime.timedelta(days=7)
        reserva = mommy.make(Reserva,evento=evento,usuario=user,
                             validade_pre_reserva=data_validae,id=1)
        url =  reverse('detail-pedido-evento', args=[1])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nome'], evento.nome)

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from model_mommy import mommy

from .models import Reserva
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User, Group


class ReservaTests(APITestCase):
    url = reverse('pedido')
    data = {
        "evento": {
            "nome": "Carnaval",
            "descricao": "Feriado Catolico de cunho festivo e tradicionamente brasileiro",
            "local": 'SR',
            "data_inicio": "2017-02-24",
            "hora_inicio": "00:00",
            "data_fim": "2017-02-28",
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
    }

    def test_create_reserva(self):
        user = mommy.make(User)
        token = Token.objects.get(user__username=user.username)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Reserva.objects.last().evento.nome, 'Carnaval')
        self.assertEqual(Reserva.objects.last().status, 'P')

    def test_create_reserva_primeira_secretaria(self):
        grupo = mommy.make(Group,name='primeira_secretaria')
        user = mommy.make(User,groups=[grupo])
        token = Token.objects.get(user__username=user.username)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Reserva.objects.last().evento.nome, 'Carnaval')
        self.assertEqual(Reserva.objects.last().status, 'R')

    def test_create_mesma_data_hora(self):
        user = mommy.make(User)
        token = Token.objects.get(user__username=user.username)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = self.client.post(self.url, self.data)
        response = self.client.post(self.url, self.data)
        avisos_esperados = {
            'DataInicio' : 'Evento na mesma data de inicio, aguarde confirmacao',
            'DataFim' : 'Evento na mesma data de termino, aguarde confirmacao',
            'EntreDatas' : 'O periodo escolhido possui outros eventos, aguarde confirmacao',
            'ConflitoHorario' : 'Existe evento(s) com conflito de horario, aguarde confirmacao',
        }
        self.assertEqual(response.data['avisos'], avisos_esperados)

    def teste_put_comandos(self):
        user = mommy.make(User)
        token = Token.objects.get(user__username=user.username)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        reserva =  Reserva.objects.last()
        url = reverse('edit-pedido',args=[reserva.id,'reservado'])
        response = self.client.post(url)
        self.assertEqual(Reserva.objects.get(pk=reserva.id).status, 'R')
        url = reverse('edit-pedido',args=[reserva.id,'prereservado'])
        response = self.client.post(url)
        self.assertEqual(Reserva.objects.get(pk=reserva.id).status, 'P')
        url = reverse('edit-pedido',args=[reserva.id,'cancelado'])
        response = self.client.post(url)
        self.assertEqual(Reserva.objects.get(pk=reserva.id).status, 'C')
        url = reverse('edit-pedido',args=[reserva.id,'impedido'])
        response = self.client.post(url)
        self.assertEqual(Reserva.objects.get(pk=reserva.id).status, 'I')
        url = reverse('edit-pedido',args=[reserva.id,'aleatorio'])
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        url = reverse('edit-pedido',args=[2903,'aleatorio'])
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        url = reverse('edit-pedido',args=[2903,'reservado'])
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def teste_resersa_delete(self):
        user = mommy.make(User)
        token = Token.objects.get(user__username=user.username)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        reserva = Reserva.objects.last()
        url = reverse('detail-pedido',args=[reserva.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        url = reverse('detail-pedido',args=[2392])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

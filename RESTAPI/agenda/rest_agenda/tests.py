from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from model_mommy import mommy
import datetime

from .models import *
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User, Group


class ReservaTests(APITestCase):
    url = reverse('pedido')
    data = {
        "evento": {
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
    }
    def set_credentials(self):
        user = mommy.make(User)
        token = Token.objects.get(user__username=user.username)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

    def teste_create_reserva(self):
        self.set_credentials()
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Reserva.objects.last().evento.nome, 'Carnaval')
        self.assertEqual(Reserva.objects.last().status, 'P')

    def teste_create_reserva_primeira_secretaria(self):
        self.set_credentials()
        grupo = mommy.make(Group,name='primeira_secretaria')
        user = mommy.make(User,groups=[grupo])
        token = Token.objects.get(user__username=user.username)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Reserva.objects.last().evento.nome, 'Carnaval')
        self.assertEqual(Reserva.objects.last().status, 'R')

    def teste_create_mesma_data_hora(self):
        self.set_credentials()
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        response = self.client.post(self.url, self.data)
        avisos_esperados = {
            'DataInicio' : 'Evento Pre-Reservado na mesma data de inicio, \
            aguarde confirmacao',
            'DataFim' : 'Evento Pre-Reservado na mesma data de termino, \
            aguarde confirmacao',
            'EntreDatas' : 'O periodo escolhido possui outros eventos \
            pre-reservado, aguarde confirmacao',
            'ConflitoHorario' : 'Existe(m) evento(s) pre-reservado(s) \
            com conflito de horario, aguarde con  firmacao'
        }
        self.assertEqual(response.data['avisos'], avisos_esperados)

    def teste_create_mesma_data_hora(self):
        self.set_credentials()
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        reserva = Reserva.objects.last()
        reserva.status = 'R'
        reserva.save()
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def teste_put_comandos(self):
        self.set_credentials()
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        reserva =  Reserva.objects.last()
        data_teste = {
            'reservado' : 'R',
            'prereservado' : 'P',
            'cancelado' : 'C',
            'impedido' : 'I',
        }
        for key, value in data_teste.iteritems():
            url = reverse('edit-pedido',args=[reserva.id,key])
            response = self.client.post(url)
            self.assertEqual(Reserva.objects.get(pk=reserva.id).status, value)

    def teste_put_comando_not_found(self):
        self.set_credentials()
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        reserva =  Reserva.objects.last()

        url = reverse('edit-pedido',args=[reserva.id,'aleatorio'])
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        url = reverse('edit-pedido',args=[2903,'aleatorio'])
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        url = reverse('edit-pedido',args=[2903,'reservado'])
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def teste_recebido(self):
        self.set_credentials()
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        reserva =  Reserva.objects.last()
        url = reverse('edit-pedido',args=[reserva.id,'recebido'])
        response = self.client.post(url)
        self.assertEqual(Reserva.objects.get(pk=reserva.id).recebido, True)
        url = reverse('edit-pedido',args=[reserva.id,'recebido'])
        reserva.validade_pre_reserva = datetime.datetime.now().date() -  \
        datetime.timedelta(days=10)
        reserva.save()
        response = self.client.post(url)
        self.assertEqual(Reserva.objects.get(pk=reserva.id).status, 'I')

    def teste_resersa_delete(self):
        self.set_credentials()
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        reserva = Reserva.objects.last()
        url = reverse('detail-pedido',args=[reserva.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        url = reverse('detail-pedido',args=[2392])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def teste_resersa_get_list(self):
        self.set_credentials()
        user = mommy.make(User)
        responsavel = mommy.make(Responsavel)
        evento = mommy.make(Evento, responsavel=responsavel)
        data_validae = datetime.datetime.now().date() + \
                       datetime.timedelta(days=7)
        reserva = mommy.make(Reserva,evento=evento,usuario=user,
                             validade_pre_reserva=data_validae,id=1)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), Reserva.objects.all().count())
        url = reverse('detail-pedido',args=[1])
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0].pop('id'), Reserva.objects.last().id)

class UserTests(APITestCase):
    url = reverse('usuario')
    data = {
        "username": "xxxxxx",
        "password": "xxxxx",
        "first_name": "XXX",
        "last_name": "YYYY",
        "email": "xxx@yyy.com",
    }

    def teste_create_user(self):
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['username'], "xxxxxx")
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.data['username'][0], u'Um usu\xe1rio com este nome de usu\xe1rio j\xe1 existe.')
        data = {}
        errors = {
            'username': [u'Este campo \xe9 obrigat\xf3rio.'],
            'password': [u'Este campo \xe9 obrigat\xf3rio.']
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.data,errors)



    def teste_put_user(self):
        url = reverse('detail-usuario',args=['i'])
        user = mommy.make(User)
        token = Token.objects.get(user__username=user.username)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        data = {
            'username' : 'mlel',
            'password' : 'BBBBB',
            'last_name' : 'AAAA',
            'email' : 'yyy@xxx.com'
        }
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], "mlel")

    def teste_get_user(self):
        url = reverse('detail-usuario', args=['i'])
        user = mommy.make(User)
        token = Token.objects.get(user__username=user.username)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], user.username)


    def teste_delete_user(self):
        url = reverse('detail-usuario', args=['i'])
        user = mommy.make(User)
        token = Token.objects.get(user__username=user.username)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def teste_auth_user(self):
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        url = reverse('token')
        data = {
            'username' : self.data['username'],
            'password' : self.data['password']
        }
        response = self.client.post(url, data)
        token = Token.objects.get(user__username=self.data['username'])
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['token'], token.key)

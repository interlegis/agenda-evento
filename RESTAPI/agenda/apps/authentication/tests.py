from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from model_mommy import mommy
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User, Group

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
        data.pop('username')
        response = self.client.put(url, data)
        errors = {
            'username': [u'Este campo \xe9 obrigat\xf3rio.'],
        }
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data,errors)


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
        data['password'] = 'jsadjaksdn'
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        errors = {
            'non_field_errors': [u'Imposs\xedvel fazer login com as credenciais fornecidas.']
        }
        self.assertEqual(response.data,errors)

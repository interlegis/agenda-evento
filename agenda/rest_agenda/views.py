from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User
from .serializers import *
from rest_framework import viewsets

# Create your views here.
def index(request):
    return HttpResponse("Hello World")

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

from django.contrib.auth.models import User
from .serializers import UsuarioSerializer
from rest_framework import status, generics, viewsets
from rest_framework.response import Response
from .permissions import IsAuthenticatedListCreateUser
from rest_framework.permissions import IsAuthenticated
from .models import Evento
from .serializers import EventoSerializer

class UsuarioListCreate(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = (IsAuthenticatedListCreateUser,)

    def create(self, request):
        serializer = UsuarioSerializer(data=request.DATA)
        if serializer.is_valid():
            try:
                serializer.save()
                user = User.objects.get(username=serializer.data['username'])
                user.set_password(request.DATA['password'])
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
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, pk=None):
        try:
            user = User.objects.get(pk=request.user.pk)
            user.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, pk=None):
        try:
            user = User.objects.get(pk=request.user.pk)
            serializer = UsuarioSerializer(user, data=request.DATA)
            if serializer.is_valid():
                serializer.save()
                user = User.objects.get(username=serializer.data['username'])
                user.set_password(request.DATA['password'])
                user.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class EventoViewSet(generics.ListCreateAPIView):
    queryset = Evento.objects.all()
    serializer_class = EventoSerializer
    permission_classes = (IsAuthenticated,)

    def create(self, request):
        serializer = EventoSerializer(data=request.DATA)
        if serializer.is_valid():
            try:
                serializer.save(request)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except:
                return Response("Created Error",status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    # 
    # def get(self, request):
    #     try:
    #         queryset = Evento.objects.all()
    #         serializer = EventoSerializer(queryset, many=True)
    #         return Response(serializer.data)
    #     except:
    #         return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

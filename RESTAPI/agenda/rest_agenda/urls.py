from django.conf.urls import url, include
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token
from . import views

urlpatterns = [
    url(r'^api/users/$', views.UsuarioListCreate.as_view()),
    url(r'^api/users/([i-i])/$', views.UsuarioDetail.as_view()),
    url(r'^api/auth/', obtain_auth_token),
    url(r'^api/pedido/$', views.ReservaViewSet.as_view()),
    url(r'^api/pedido/(?P<pk>\d+)/$', views.ReservaDetail.as_view()),
    url(r'^api/pedido/(?P<pk>\d+)/evento/$', views.EventoDetail.as_view()),
    url(r'^api/pedido/(?P<pk>\d+)/edit/(?P<comando>\w+)/$',
        views.ReservaEdit.as_view()),
    url(r'^api/agenda', views.AgendaView.as_view())
]

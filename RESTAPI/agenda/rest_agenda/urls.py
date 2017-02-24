from django.conf.urls import url, include
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token
from . import views

urlpatterns = [
    url(r'^api/users/$', views.UsuarioListCreate.as_view(), name='usuario'),
    url(r'^api/users/([i-i])/$', views.UsuarioDetail.as_view(),
        name='detail-usuario'),
    url(r'^api/auth/', obtain_auth_token,name='token'),
    url(r'^api/pedido/$', views.ReservaViewSet.as_view(),name='pedido'),
    url(r'^api/pedido/(?P<pk>\d+)/$', views.ReservaDetail.as_view(),
        name='detail-pedido'),
    url(r'^api/pedido/(?P<pk>\d+)/evento/$', views.EventoDetail.as_view(),
        name='detail-pedido-evento'),
    url(r'^api/pedido/(?P<pk>\d+)/edit/(?P<comando>\w+)/$',
        views.ReservaEdit.as_view(),name='edit-pedido'),
    url(r'^api/agenda', views.AgendaView.as_view(),name='agenda')
]

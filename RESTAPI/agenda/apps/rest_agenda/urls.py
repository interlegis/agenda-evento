from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^api/pedido/$', views.ReservaViewSet.as_view(),name='pedido'),
    url(r'^api/pedido/(?P<pk>\d+)/$', views.ReservaDetail.as_view(),
        name='detail-pedido'),
    url(r'^api/pedido/(?P<pk>\d+)/evento/$', views.EventoDetail.as_view(),
        name='detail-pedido-evento'),
    url(r'^api/pedido/(?P<pk>\d+)/edit/(?P<comando>\w+)/$',
        views.ReservaEdit.as_view(),name='edit-pedido'),
    url(r'^api/agenda', views.AgendaView.as_view(),name='agenda'),
    url(r'^api/pedido/user', views.PedidosUserView.as_view(),name='pedido-user')
]

from django.conf.urls import url
from rest_framework.authtoken.views import obtain_auth_token
from . import views

urlpatterns = [
    url(r'^api/users/$', views.UsuarioListCreate.as_view(), name='usuario'),
    url(r'^api/users/([i-i])/$', views.UsuarioDetail.as_view(),
        name='detail-usuario'),
    url(r'^api/users/([i-i])/atualizarSenha/', views.UsuarioNovaSenha.as_view(),
        name='atualizar-senha-usuario'),
    url(r'^api/users/recuperaSenha/', views.UsuarioRecuperarSenha.as_view(),
        name='recupear-senha-usuario'),
    url(r'^api/auth/', obtain_auth_token,name='token'),
]

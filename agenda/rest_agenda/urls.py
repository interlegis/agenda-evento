from django.conf.urls import url, include
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token

from . import views

router = routers.DefaultRouter()
router.register(r'users', views.UsuarioViewSet)
router.register(r'user', views.DadosUsuarioViewVSet)

urlpatterns = [
    url(r'^$',views.index,name='index'),
    url(r'^api/', include(router.urls)),
    url(r'^api/auth/', obtain_auth_token)
]

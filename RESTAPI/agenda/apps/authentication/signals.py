from django.conf import settings
from django.db.models.signals import post_save, post_init
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)


def populate_models(sender, instance=None, **kwargs):
    from django.contrib.auth.models import Group, User
    groups = ['admin','primeira_secretaria']
    for group in groups:
        if not Group.objects.filter(name=group).exists():
            grupo = Group.objects.create(name=group)
            grupo.save()
            print("Grupo %s criado com sucesso." % group)

    usuarios = ['admin','operador_primeira_secretaria']
    for usuario in usuarios:
        if not User.objects.filter(username=usuario).exists():
            if usuario == 'admin':
                novo_usuario = User.objects.create_superuser(username=usuario,
                                                             password='interlegis',
                                                             email='',
                                                             first_name='Administrador')
                novo_usuario.groups.add(Group.objects.get(name=groups[0]))
            else:
                novo_usuario = User.objects.create(username=usuario,
                                                   password='interlegis',
                                                   first_name='Primeira Secretaria')
                if usuario == 'operador_primeira_secretaria':
                    novo_usuario.groups.add(Group.objects.get(name=groups[1]))

            novo_usuario.save()
            print("Usuario %s criado com sucesso." % usuario)

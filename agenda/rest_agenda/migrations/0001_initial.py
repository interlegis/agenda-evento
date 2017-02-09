# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Evento',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('nome', models.CharField(max_length=500)),
                ('descricao', models.TextField()),
                ('local', models.CharField(max_length=100, choices=[('SR', 'Sala de Reunioes'), ('AI', 'Auditorio Interlegis')])),
                ('data_inicio', models.DateTimeField()),
                ('data_fim', models.DateTimeField()),
            ],
            options={
                'verbose_name': 'Evento',
                'verbose_name_plural': 'Eventos',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Pedido',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('data_criacao', models.DateTimeField(default=datetime.datetime.now)),
                ('data_modificao', models.DateTimeField(auto_now=True)),
                ('is_reserved', models.BooleanField(default=False)),
                ('is_legislativo', models.BooleanField(default=False)),
                ('is_cancel', models.BooleanField(default=False)),
            ],
            options={
                'verbose_name': 'Pedido',
                'verbose_name_plural': 'Pedidos',
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='evento',
            name='pedido_fk',
            field=models.ForeignKey(verbose_name='Pedido', to='rest_agenda.Pedido'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='evento',
            name='usario_fk',
            field=models.ForeignKey(verbose_name='Responsavel', to=settings.AUTH_USER_MODEL),
            preserve_default=True,
        ),
    ]

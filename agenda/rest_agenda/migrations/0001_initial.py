# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-02-10 11:47
from __future__ import unicode_literals

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Evento',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(max_length=500)),
                ('descricao', models.TextField()),
                ('local', models.CharField(choices=[('SR', 'Sala de Reunioes'), ('AI', 'Auditorio Interlegis')], max_length=100)),
                ('data_inicio', models.DateTimeField()),
                ('data_fim', models.DateTimeField()),
                ('usario_fk', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Responsavel')),
            ],
            options={
                'verbose_name': 'Evento',
                'verbose_name_plural': 'Eventos',
            },
        ),
        migrations.CreateModel(
            name='Pedido',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('data_criacao', models.DateTimeField(default=datetime.datetime.now)),
                ('data_modificao', models.DateTimeField(auto_now=True)),
                ('is_reserved', models.BooleanField(default=False)),
                ('is_legislativo', models.BooleanField(default=False)),
                ('is_cancel', models.BooleanField(default=False)),
                ('evento_fk', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='rest_agenda.Evento', verbose_name='Evento')),
            ],
            options={
                'verbose_name': 'Pedido',
                'verbose_name_plural': 'Pedidos',
            },
        ),
    ]

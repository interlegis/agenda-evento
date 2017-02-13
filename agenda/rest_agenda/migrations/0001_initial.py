# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-02-13 13:37
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
                ('data_inicio', models.DateTimeField()),
                ('data_fim', models.DateTimeField()),
                ('nome', models.CharField(max_length=500)),
                ('descricao', models.TextField()),
                ('local', models.CharField(choices=[('SR', 'Sala de Reunioes'), ('AI', 'Auditorio Interlegis')], max_length=100)),
                ('is_legislativo', models.BooleanField(default=False)),
                ('is_cancelado', models.BooleanField(default=False)),
                ('causa_cancelamento', models.TextField(blank=True)),
            ],
            options={
                'verbose_name': 'Evento',
                'verbose_name_plural': 'Eventos',
            },
        ),
        migrations.CreateModel(
            name='Reserva',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('data_criacao', models.DateTimeField(default=datetime.datetime.now)),
                ('is_reservado', models.BooleanField(default=False)),
                ('is_cancelado', models.BooleanField(default=False)),
                ('data_modificacao', models.DateTimeField(auto_now=True)),
                ('nr_referencia', models.CharField(blank=True, max_length=50)),
                ('is_recebido', models.BooleanField(default=False)),
                ('evento_fk', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='rest_agenda.Evento', verbose_name='Evento')),
                ('usario_fk', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Responsavel-Reserva')),
            ],
            options={
                'verbose_name': 'Reserva',
                'verbose_name_plural': 'Reservas',
            },
        ),
        migrations.CreateModel(
            name='Responsavel',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(blank=True, max_length=100)),
                ('email', models.EmailField(max_length=254)),
                ('telefone', models.CharField(blank=True, max_length=11)),
                ('lotacao', models.CharField(blank=True, max_length=100)),
            ],
            options={
                'verbose_name': 'Responsavel',
                'verbose_name_plural': 'Responsaveis',
            },
        ),
        migrations.AddField(
            model_name='evento',
            name='responsavel_fk',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='rest_agenda.Responsavel', verbose_name='Responsavel-Evento'),
        ),
    ]

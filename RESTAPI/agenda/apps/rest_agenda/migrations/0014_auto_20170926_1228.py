# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2017-09-26 15:28
from __future__ import unicode_literals

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('rest_agenda', '0013_auto_20170824_1416'),
    ]

    operations = [
        migrations.AlterField(
            model_name='arquivo',
            name='uploaded_at',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2017, 9, 26, 15, 28, 51, 288465, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='cronlog',
            name='date',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2017, 9, 26, 15, 28, 51, 268437, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='eventotramitacaolog',
            name='data_modificacao',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2017, 9, 26, 15, 28, 51, 289369, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='reserva',
            name='data_criacao',
            field=models.DateTimeField(default=datetime.datetime(2017, 9, 26, 15, 28, 51, 285545, tzinfo=utc)),
        ),
    ]

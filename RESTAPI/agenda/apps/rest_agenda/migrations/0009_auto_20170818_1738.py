# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-08-18 20:38
from __future__ import unicode_literals

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('rest_agenda', '0008_auto_20170817_1500'),
    ]

    operations = [
        migrations.AlterField(
            model_name='arquivo',
            name='uploaded_at',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2017, 8, 18, 20, 38, 32, 572511, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='cronlog',
            name='date',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2017, 8, 18, 20, 38, 32, 529893, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='eventotramitacaolog',
            name='data_modificacao',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2017, 8, 18, 20, 38, 32, 575413, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='reserva',
            name='data_criacao',
            field=models.DateTimeField(default=datetime.datetime(2017, 8, 18, 20, 38, 32, 564322, tzinfo=utc)),
        ),
    ]

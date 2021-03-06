# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-08-18 21:39
from __future__ import unicode_literals

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('rest_agenda', '0009_auto_20170818_1738'),
    ]

    operations = [
        migrations.AlterField(
            model_name='arquivo',
            name='uploaded_at',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2017, 8, 18, 21, 39, 47, 805709, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='cronlog',
            name='date',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2017, 8, 18, 21, 39, 47, 760474, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='eventotramitacaolog',
            name='data_modificacao',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2017, 8, 18, 21, 39, 47, 811398, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='reserva',
            name='data_criacao',
            field=models.DateTimeField(default=datetime.datetime(2017, 8, 18, 21, 39, 47, 801980, tzinfo=utc)),
        ),
    ]

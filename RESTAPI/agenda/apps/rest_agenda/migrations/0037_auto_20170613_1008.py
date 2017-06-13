# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-06-13 13:08
from __future__ import unicode_literals

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('rest_agenda', '0036_auto_20170613_1007'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cronlog',
            name='date',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2017, 6, 13, 13, 8, 13, 460510, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='eventotramitacaolog',
            name='data_modificacao',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2017, 6, 13, 13, 8, 13, 476284, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='reserva',
            name='data_criacao',
            field=models.DateTimeField(default=datetime.datetime(2017, 6, 13, 13, 8, 13, 475167, tzinfo=utc)),
        ),
    ]

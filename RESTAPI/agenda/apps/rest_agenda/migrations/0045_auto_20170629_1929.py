# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-06-29 22:29
from __future__ import unicode_literals

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('rest_agenda', '0044_auto_20170629_1852'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cronlog',
            name='date',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2017, 6, 29, 22, 29, 46, 119757, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='eventotramitacaolog',
            name='data_modificacao',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2017, 6, 29, 22, 29, 46, 182429, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='reserva',
            name='data_criacao',
            field=models.DateTimeField(default=datetime.datetime(2017, 6, 29, 22, 29, 46, 169421, tzinfo=utc)),
        ),
    ]
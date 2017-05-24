# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-05-19 21:20
from __future__ import unicode_literals

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('rest_agenda', '0022_auto_20170519_1817'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cronlog',
            name='date',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2017, 5, 19, 21, 20, 42, 424706, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='reserva',
            name='data_criacao',
            field=models.DateTimeField(default=datetime.datetime(2017, 5, 19, 21, 20, 42, 426823, tzinfo=utc)),
        ),
    ]

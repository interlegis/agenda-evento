# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-08-16 20:42
from __future__ import unicode_literals

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('rest_agenda', '0005_auto_20170809_1356'),
    ]

    operations = [
        migrations.AddField(
            model_name='eventotramitacaolog',
            name='pdf',
            field=models.FileField(blank=True, upload_to=b'pdf'),
        ),
        migrations.AlterField(
            model_name='cronlog',
            name='date',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2017, 8, 16, 20, 42, 29, 452984, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='eventotramitacaolog',
            name='data_modificacao',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2017, 8, 16, 20, 42, 29, 469060, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='reserva',
            name='data_criacao',
            field=models.DateTimeField(default=datetime.datetime(2017, 8, 16, 20, 42, 29, 466688, tzinfo=utc)),
        ),
    ]

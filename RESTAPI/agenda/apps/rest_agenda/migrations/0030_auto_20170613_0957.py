# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-06-13 12:57
from __future__ import unicode_literals

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('rest_agenda', '0029_auto_20170613_0952'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cronlog',
            name='date',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2017, 6, 13, 12, 57, 3, 766361, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='eventotramitacaolog',
            name='data_modificacao',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2017, 6, 13, 12, 57, 3, 782133, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='reserva',
            name='data_criacao',
            field=models.DateTimeField(default=datetime.datetime(2017, 6, 13, 12, 57, 3, 781056, tzinfo=utc)),
        ),
    ]
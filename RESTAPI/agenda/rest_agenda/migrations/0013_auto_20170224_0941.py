# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-02-24 12:41
from __future__ import unicode_literals

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('rest_agenda', '0012_auto_20170224_0940'),
    ]

    operations = [
        migrations.RenameField(
            model_name='reserva',
            old_name='usario',
            new_name='usuario',
        ),
        migrations.AlterField(
            model_name='reserva',
            name='data_criacao',
            field=models.DateTimeField(default=datetime.datetime(2017, 2, 24, 12, 41, 31, 591935, tzinfo=utc)),
        ),
    ]
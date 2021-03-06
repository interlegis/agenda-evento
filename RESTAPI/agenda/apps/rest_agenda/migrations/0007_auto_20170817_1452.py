# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-08-17 17:52
from __future__ import unicode_literals

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('rest_agenda', '0006_auto_20170816_1742'),
    ]

    operations = [
        migrations.CreateModel(
            name='Arquivo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(blank=True, max_length=100)),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
                ('pdf', models.FileField(upload_to=b'pdf')),
            ],
        ),
        migrations.RemoveField(
            model_name='eventotramitacaolog',
            name='pdf',
        ),
        migrations.AlterField(
            model_name='cronlog',
            name='date',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2017, 8, 17, 17, 52, 20, 610755, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='eventotramitacaolog',
            name='data_modificacao',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2017, 8, 17, 17, 52, 20, 626898, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='reserva',
            name='data_criacao',
            field=models.DateTimeField(default=datetime.datetime(2017, 8, 17, 17, 52, 20, 624062, tzinfo=utc)),
        ),
    ]

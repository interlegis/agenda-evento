# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-06-13 13:36
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='recuperarsenha',
            options={},
        ),
        migrations.AlterField(
            model_name='recuperarsenha',
            name='data_criacao',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='recuperarsenha',
            name='token',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AlterField(
            model_name='recuperarsenha',
            name='usuario',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Recupearar-Senha-Usario'),
        ),
    ]
# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-06-30 10:45
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0004_auto_20170629_1852'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='recuperarsenha',
            name='usuario',
        ),
        migrations.RemoveField(
            model_name='validarcadastro',
            name='usuario',
        ),
        migrations.DeleteModel(
            name='RecuperarSenha',
        ),
        migrations.DeleteModel(
            name='ValidarCadastro',
        ),
    ]

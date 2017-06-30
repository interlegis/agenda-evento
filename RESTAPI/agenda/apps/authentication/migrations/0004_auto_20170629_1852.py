# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-06-29 21:52
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('authentication', '0003_auto_20170613_1052'),
    ]

    operations = [
        migrations.CreateModel(
            name='ValidarCadastro',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('token', models.CharField(blank=True, max_length=50, unique=True)),
                ('data_criacao', models.DateTimeField(auto_now_add=True)),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Autenticar-Cadastro')),
            ],
        ),
        migrations.AlterField(
            model_name='recuperarsenha',
            name='usuario',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Recuperar-Senha-Usario'),
        ),
    ]
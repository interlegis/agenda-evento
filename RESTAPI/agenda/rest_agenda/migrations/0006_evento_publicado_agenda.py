# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-02-15 11:54
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rest_agenda', '0005_auto_20170215_0939'),
    ]

    operations = [
        migrations.AddField(
            model_name='evento',
            name='publicado_agenda',
            field=models.BooleanField(default=False),
        ),
    ]
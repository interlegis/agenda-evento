# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-02-15 10:52
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rest_agenda', '0003_auto_20170215_0844'),
    ]

    operations = [
        migrations.AddField(
            model_name='evento',
            name='video_conferencia',
            field=models.BooleanField(default=False),
        ),
    ]
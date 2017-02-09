# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rest_agenda', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='evento',
            name='pedido_fk',
        ),
        migrations.AddField(
            model_name='pedido',
            name='evento_fk',
            field=models.ForeignKey(default=1, verbose_name='Evento', to='rest_agenda.Evento'),
            preserve_default=False,
        ),
    ]

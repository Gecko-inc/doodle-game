# Generated by Django 3.2.5 on 2022-02-03 18:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='score',
            options={'ordering': ['-id'], 'verbose_name': 'Результат', 'verbose_name_plural': 'Результаты'},
        ),
    ]

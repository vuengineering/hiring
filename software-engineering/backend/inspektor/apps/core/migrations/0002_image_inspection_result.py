# Generated by Django 5.0.1 on 2024-02-14 10:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='image',
            name='inspection_result',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
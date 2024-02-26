# Generated by Django 5.0.1 on 2024-02-26 17:22

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Result",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("result", models.JSONField(null=True)),
                (
                    "status",
                    models.IntegerField(
                        choices=[(1, "In Progress"), (2, "Pass"), (3, "Fail")],
                        default=1,
                    ),
                ),
                (
                    "image",
                    models.OneToOneField(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="results",
                        to="core.image",
                    ),
                ),
            ],
            options={
                "db_table": "result",
            },
        ),
    ]


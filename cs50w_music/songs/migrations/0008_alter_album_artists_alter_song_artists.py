# Generated by Django 4.2.7 on 2023-11-14 00:23

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("songs", "0007_merge_20231114_0023"),
    ]

    operations = [
        migrations.AlterField(
            model_name="album",
            name="artists",
            field=models.ManyToManyField(
                blank=True, related_name="albums", to=settings.AUTH_USER_MODEL
            ),
        ),
        migrations.AlterField(
            model_name="song",
            name="artists",
            field=models.ManyToManyField(
                blank=True, related_name="songs", to=settings.AUTH_USER_MODEL
            ),
        ),
    ]

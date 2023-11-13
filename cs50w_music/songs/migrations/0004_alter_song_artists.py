# Generated by Django 4.2.7 on 2023-11-13 20:34

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("songs", "0003_alter_playlist_created_at"),
    ]

    operations = [
        migrations.AlterField(
            model_name="song",
            name="artists",
            field=models.ManyToManyField(
                blank=True, related_name="songs", to=settings.AUTH_USER_MODEL
            ),
        ),
    ]

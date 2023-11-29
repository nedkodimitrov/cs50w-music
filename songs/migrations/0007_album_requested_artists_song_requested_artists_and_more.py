# Generated by Django 4.2.7 on 2023-11-29 00:17

import datetime
from django.conf import settings
import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("songs", "0006_alter_album_artists_alter_song_artists"),
    ]

    operations = [
        migrations.AddField(
            model_name="album",
            name="requested_artists",
            field=models.ManyToManyField(
                blank=True,
                related_name="albums_requested_artist",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddField(
            model_name="song",
            name="requested_artists",
            field=models.ManyToManyField(
                blank=True,
                related_name="songs_requested_artist",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
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
        migrations.AlterField(
            model_name="song",
            name="track_number",
            field=models.PositiveIntegerField(
                blank=True,
                null=True,
                validators=[django.core.validators.MinValueValidator(1)],
            ),
        ),
        migrations.AlterField(
            model_name="user",
            name="birth_date",
            field=models.DateField(
                blank=True,
                null=True,
                validators=[
                    django.core.validators.MaxValueValidator(
                        limit_value=datetime.date.today
                    )
                ],
            ),
        ),
    ]

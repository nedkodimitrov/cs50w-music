# Generated by Django 4.2.7 on 2023-12-05 00:46

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("songs", "0007_album_requested_artists_song_requested_artists_and_more"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="user",
            options={},
        ),
        migrations.AddField(
            model_name="album",
            name="image_album_cover",
            field=models.ImageField(blank=True, null=True, upload_to="albums/images"),
        ),
        migrations.AddField(
            model_name="song",
            name="image_song_cover",
            field=models.ImageField(blank=True, null=True, upload_to="songs/images"),
        ),
        migrations.AlterField(
            model_name="song",
            name="audio_file",
            field=models.FileField(
                upload_to="songs/audio_files",
                validators=[
                    django.core.validators.FileExtensionValidator(
                        allowed_extensions=["mp3", "wav", "ogg"]
                    )
                ],
            ),
        ),
        migrations.AddIndex(
            model_name="album",
            index=models.Index(fields=["title"], name="songs_album_title_1c3d1c_idx"),
        ),
        migrations.AddIndex(
            model_name="playlist",
            index=models.Index(fields=["title"], name="songs_playl_title_e1f2e9_idx"),
        ),
        migrations.AddIndex(
            model_name="song",
            index=models.Index(fields=["title"], name="songs_song_title_2cbace_idx"),
        ),
        migrations.AddIndex(
            model_name="song",
            index=models.Index(fields=["album"], name="songs_song_album_i_3599b1_idx"),
        ),
        migrations.AddIndex(
            model_name="user",
            index=models.Index(
                fields=["username"], name="songs_user_usernam_5190fc_idx"
            ),
        ),
        migrations.AddIndex(
            model_name="user",
            index=models.Index(
                fields=["country"], name="songs_user_country_b40b4f_idx"
            ),
        ),
    ]

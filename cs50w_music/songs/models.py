from django.db import models
from django.db.models import F, Q
from django.contrib.auth.models import AbstractUser
from django_countries.fields import CountryField
from django.utils import timezone
from django.core.exceptions import ValidationError
import mimetypes


GENRE_CHOICES = ['rap', 'pop', 'rock']


class User(AbstractUser):
    birth_date = models.DateField(null=True, blank=True)
    country = CountryField(null=True, blank=True)

    def __str__(self):
        return self.username


class Album(models.Model):
    title = models.CharField(max_length=255)
    artists = models.ManyToManyField(User, related_name="albums")
    release = models.DateTimeField(null=True, blank=True, default=timezone.now)

    def __str__(self):
        return f"Album '{self.title}' by {', '.join([str(artist) for artist in self.artists.all()])}"



def validate_audio_file(value):
    try:
        content_type = value.content_type
    except AttributeError:
        # For admin panel uploads
        file_extension = value.name.split('.')[-1]
        content_type, _ = mimetypes.guess_type(value.name)

    if content_type != 'audio/mpeg':
        raise ValidationError("Invalid file type. Only 'audio/mpeg' files are accepted.")



class Song(models.Model):
    title = models.CharField(max_length=255)
    audio_file = models.FileField(upload_to='songs/', validators=[validate_audio_file])
    release = models.DateTimeField(null=True, blank=True, default=timezone.now)
    artists = models.ManyToManyField(User, related_name="songs")
    genre = models.CharField(max_length=20, blank=True, null=True, choices=[(g, g) for g in GENRE_CHOICES])
    album = models.ForeignKey(Album, blank=True, null=True, on_delete=models.SET_NULL, related_name="songs")
    duration = models.PositiveIntegerField (blank=True, null=True)
    track_number = models.PositiveIntegerField (blank=True, null=True)

    def __str__(self):
        return f"Song '{self.title}' by {', '.join([str(artist) for artist in self.artists.all()])}"


class Playlist(models.Model):
    title = models.CharField(max_length=255)
    songs = models.ManyToManyField(Song, blank=True, related_name="playlists")
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="playlists")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Playlist '{self.title}' by user {self.owner}"
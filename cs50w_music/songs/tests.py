from django.test import Client, TestCase
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from songs.models import Song, Playlist, Album
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
import datetime
from django.db.models import Max


class IndexTest(TestCase):
    #def setUp(self):

    def test_index(self):

        # Set up client to make requests
        c = Client()

        # Send get request to index page and store response
        response = c.get("/")

        # Make sure status code is 200
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Make sure three flights are returned in the context
        #self.assertEqual(response.context["flights"].count(), 3)


class BaseAPITest(TestCase):
    def setUp(self):
        self.client = APIClient(enforce_csrf_checks=True)

        self.yesterday = datetime.date.today() - datetime.timedelta(days=1)
        self.tomorrow = datetime.date.today() + datetime.timedelta(days=1)

        self.old_user_data = {
            'username': 'old_user',
            'password': 'old_password',
            'first_name': 'Old',
            'last_name': 'User',
            'birth_date': self.yesterday,
            'country': 'US',
            'email': "old_user@example.com"
        }
        self.old_user = get_user_model().objects.create_user(**self.old_user_data)

        self.old_user_2_data = {
            'username': 'old_user_2',
            'password': 'old_password_2'
        }
        self.old_user_2 = get_user_model().objects.create_user(**self.old_user_2_data)

        self.new_user_data = {
            'username': 'new_user',
            'password': 'new_password',
            'password_confirmation': 'new_password',
            'first_name': 'New',
            'last_name': 'User',
            'birth_date': self.yesterday,
            'country': 'BG',
            'email': "new_user@example.com"
        }


class RegistrationAPITests(BaseAPITest):
    def test_user_registration(self):
        """User registration should be successful with proper credentials and non-taken username."""
        response = self.client.post(reverse('songs:user-register'), self.new_user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(get_user_model().objects.count(), 3) # self.old_user, old_user_2 and new_user
        self.assertEqual(response.json()["user"]["username"], self.new_user_data["username"])
        self.assertIn('token', response.data)

    def test_user_registration_minimal_data(self):
        """User registration should be successful with proper credentials and non-taken username."""
        response = self.client.post(reverse('songs:user-register'), {"username": "new_user", "password": "new_password", "password_confirmation": "new_password"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(get_user_model().objects.count(), 3) # self.old_user, old_user_2 and new_user
        self.assertEqual(response.json()["user"]["username"], self.new_user_data["username"])
        self.assertIn('token', response.data)

    def test_fail_user_registration_username_taken(self):
        """User registration should fail if username is already taken."""
        self.old_user_data.update({"password_confirmation": self.old_user_data["password"]})
        response = self.client.post(reverse('songs:user-register'), self.old_user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(get_user_model().objects.count(), 2) # self.old_user and old_user_2
        self.assertEqual(response.json()["username"][0], 'A user with that username already exists.')

    def test_fail_user_registration_password_mismatch(self):
        """User registration should fail if password_confirmation doesn't match password."""
        self.new_user_data["password_confirmation"] += "_2"
        response = self.client.post(reverse('songs:user-register'), self.new_user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(get_user_model().objects.count(), 2) # self.old_user and old_user_2
        self.assertEqual(response.json()["non_field_errors"][0], 'Passwords do not match.')

    def test_fail_user_registration_short_password(self):
        """User registration should fail if the provided password is less than 8 characters."""
        self.new_user_data["password"] = "pass"
        response = self.client.post(reverse('songs:user-register'), self.new_user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(get_user_model().objects.count(), 2) # self.old_user and old_user_2
        self.assertEqual(response.json()["non_field_errors"][0], 'This password is too short. It must contain at least 8 characters.')

    def test_fail_user_registration_future_birthday(self):
        """User registration should fail if the provided birth date is in the future."""
        self.new_user_data["birth_date"] = self.tomorrow
        response = self.client.post(reverse('songs:user-register'), self.new_user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(get_user_model().objects.count(), 2) # self.old_user and old_user_2
        self.assertRegex(response.json()["birth_date"][0], r'Ensure this value is less than or equal to \d{4}-\d{2}-\d{2}.')

    def test_fail_user_registration_invalid_country(self):
        """User registration should fail if the provided country doesn't exist."""
        self.new_user_data["country"] = 'AA'
        response = self.client.post(reverse('songs:user-register'), self.new_user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(get_user_model().objects.count(), 2) # self.old_user and old_user_2
        self.assertRegex(response.json()["country"][0], r'.* is not a valid choice.')

    def test_fail_user_registration_skip_username(self):
        """User registration should fail if username is not provided."""
        self.new_user_data.pop("username")
        response = self.client.post(reverse('songs:user-register'), self.new_user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(get_user_model().objects.count(), 2) # self.old_user and old_user_2
        self.assertEqual(response.json()["username"][0], 'This field is required.')

    def test_fail_user_registration_skip_password(self):
        """User registration should fail if password is not provided."""
        self.new_user_data.pop("password")
        response = self.client.post(reverse('songs:user-register'), self.new_user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(get_user_model().objects.count(), 2) # self.old_user and old_user_2
        self.assertEqual(response.json()["password"][0], 'This field is required.')

    def test_fail_user_registration_skip_password_confirmation(self):
        """User registration should fail if password confirmation is not provided."""
        self.new_user_data.pop("password_confirmation")
        response = self.client.post(reverse('songs:user-register'), self.new_user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(get_user_model().objects.count(), 2) # self.old_user and old_user_2
        self.assertEqual(response.json()["password_confirmation"][0], 'This field is required.')

    def test_fail_registration_not_allowed_methods(self):
        """Check that get, put, patch and delete methods are not allowed for user login"""
        #get
        response = self.client.get(reverse('songs:user-register'))
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        #put
        response = self.client.put(reverse('songs:user-register'), self.new_user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        #patch
        response = self.client.patch(reverse('songs:user-register'), self.new_user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        #delete
        response = self.client.delete(reverse('songs:user-register'))
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

class LoginAPITests(BaseAPITest):
    def test_user_login(self):
        """User login should be successful correct credentials."""
        response = self.client.post(reverse('songs:user-login'), self.old_user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["user"]["username"], self.old_user.username)
        self.assertIn('token', response.data)

    def test_fail_user_login_wrong_username(self):
        """User login should fail with incorrect credentials."""
        self.old_user_data["username"] += "_2"
        response = self.client.post(reverse('songs:user-login'), self.old_user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json()["non_field_errors"][0], 'Invalid Details.')

    def test_fail_user_login_wrong_password(self):
        """User login should fail with incorrect credentials."""
        self.old_user_data["password"] += "_2"
        response = self.client.post(reverse('songs:user-login'), self.old_user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json()["non_field_errors"][0], 'Invalid Details.')

    def test_fail_user_login_skip_username(self):
        """User login should fail if username is not provided."""
        self.old_user_data.pop("username")
        response = self.client.post(reverse('songs:user-login'), self.old_user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json()["username"][0], 'This field is required.')

    def test_fail_user_login_skip_password(self):
        """User login should fail if password is not provided."""
        self.old_user_data.pop("password")
        response = self.client.post(reverse('songs:user-login'), self.old_user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json()["password"][0], 'This field is required.')

    def test_fail_login_not_allowed_methods(self):
        """Check that get, put, patch and delete methods are not allowed for user login"""
        #get
        response = self.client.get(reverse('songs:user-login'))
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        #put
        response = self.client.put(reverse('songs:user-login'), self.old_user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        #patch
        response = self.client.patch(reverse('songs:user-login'), self.old_user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        #delete
        response = self.client.delete(reverse('songs:user-login'))
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)


class AuthenticatedAPITests(BaseAPITest):
    def setUp(self):
        super().setUp()
        self.client.force_authenticate(user=self.old_user)

        self.old_album_data = {
            'title': 'Old album',
            'release_date': self.yesterday,
            'artists': [self.old_user.id]
        }

        # create an album and then set artists to prevent TypeError 
        album_artists = self.old_album_data.pop("artists")
        self.old_album = Album.objects.create(**self.old_album_data)
        self.old_album.artists.set(album_artists)

        self.old_song_data = {
            'title': 'Old song',
            'audio_file': SimpleUploadedFile(name="old_audio_file.mp3", content=b'Old audio file content', content_type='audio/mp3'),
            'release_date': self.yesterday,
            'artists': [self.old_user.id],
            'genre': 'pop',
            'album': self.old_album,
            'duration': 200,
            'track_number': 1
        }

        # create a song and then set artists to prevent TypeError 
        song_artists = self.old_song_data.pop("artists")
        self.old_song = Song.objects.create(**self.old_song_data)
        self.old_song.artists.set(song_artists)

        # create a song and then set artists to prevent TypeError 
        self.old_song_2 = Song.objects.create(**self.old_song_data)
        self.old_song_2.artists.set([self.old_user_2.id])

        self.new_song_data = {
            'title': 'Old song',
            'audio_file': SimpleUploadedFile(name="new_audio_file.mp3", content=b'new audio file content', content_type='audio/mp3'),
            'release_date': self.yesterday,
            'artists': [self.old_user.id],
            'genre': 'rap',
            'album': self.old_album.id,
            'duration': 2010,
            'track_number': 3
        }


class UserViewSetTest(AuthenticatedAPITests):
    def test_user_list(self):
        """Successfully list all users."""
        response = self.client.get(reverse('songs:users-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()["results"]), 2)  # list 2 users - old_user and old_user_2

    def test_fail_user_list_not_allowed_methods(self):
        """Check that post, put, patch and delete methods are not allowed for user list"""
        # post
        response = self.client.post(reverse('songs:users-list'), self.new_user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        # put
        response = self.client.put(reverse('songs:users-list'))
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        # patch
        response = self.client.patch(reverse('songs:users-list'))
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        # delete
        response = self.client.delete(reverse('songs:users-list'))
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_get_user_detail(self):
        """Successfully get details of an existing user"""
        response = self.client.get(reverse('songs:users-detail', args=[self.old_user.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["username"], self.old_user.username)

    def test_fail_user_detail_password_and_email(self):
        """Make sure that user password and email are not being sent"""
        response = self.client.get(reverse('songs:users-detail', args=[self.old_user.id]))
        with self.assertRaises(KeyError) as raises:
            response.json()["password"]
        with self.assertRaises(KeyError) as raises:
            response.json()["email"]
        
    def test_fail_user_detail_invalid_id(self):
        """Fail to get details about a user with an invallid id"""
        response = self.client.get(reverse('songs:users-detail', args=[get_user_model().objects.all().aggregate(Max("id"))["id__max"] + 1]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_detail_put(self):
        """Test user can update all of their details"""
        self.new_user_data.update({"old_password": self.old_user_data["password"]})
        old_password_hash = self.old_user.password
        response = self.client.put(reverse('songs:users-detail', args=[self.old_user.id]), self.new_user_data, format='json')
        self.old_user.refresh_from_db()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.old_user.username, self.new_user_data["username"])
        self.assertNotEqual(self.old_user.password, old_password_hash)

    def test_user_detail_change_username(self):
        """change username"""
        new_username = "available_username"
        response = self.client.patch(reverse('songs:users-detail', args=[self.old_user.id]), {"username": new_username}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["username"], new_username)

    def test_fail_user_detail_change_username_taken(self):
        """Assert user can't change their username to a taken one"""
        response = self.client.patch(reverse('songs:users-detail', args=[self.old_user.id]), {"username": self.old_user_2.username}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json()["username"][0], 'A user with that username already exists.')

    def test_fail_user_detail_change_password_incorrect_old_password(self):
        """Assert user cant change their password if they input incorrect old password"""
        old_password = self.old_user.password
        response = self.client.patch(
            reverse('songs:users-detail', 
                    args=[self.old_user.id]),
                    {"old_password": "incorrect password", "password": self.new_user_data["password"], "password_confirmation": self.new_user_data["password"]}, 
                    format='json')
        self.old_user.refresh_from_db()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(self.old_user.password, old_password)
        self.assertEqual(response.json()[0], 'Old password is incorrect.')

    def test_fail_user_detail_change_password_too_short(self):
        """Assert user cant change their password if they input a short new password"""
        old_password = self.old_user.password
        response = self.client.patch(
            reverse('songs:users-detail', 
                    args=[self.old_user.id]),
                    {"old_password": self.old_user_data["password"], "password": "short", "password_confirmation": "short"}, 
                    format='json')
        self.old_user.refresh_from_db()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(self.old_user.password, old_password)
        self.assertEqual(response.json()["non_field_errors"][0], 'This password is too short. It must contain at least 8 characters.')

    def test_fail_user_detail_change_password_skip_password_confirmation(self):
        """Assert user cant change their password if they don't provide their old password"""
        old_password = self.old_user.password
        response = self.client.patch(
            reverse('songs:users-detail', 
                    args=[self.old_user.id]),
                    {"old_password": self.old_user_data["password"], "password": self.new_user_data["password"]}, 
                    format='json')
        self.old_user.refresh_from_db()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(self.old_user.password, old_password)
        self.assertEqual(response.json()["non_field_errors"][0], 'Passwords do not match.')

    def test_fail_user_detail_change_password_skip_old_password(self):
        """Assert user cant change their password if they don't privde password condirmation"""
        old_password = self.old_user.password
        response = self.client.patch(
            reverse('songs:users-detail', 
                    args=[self.old_user.id]),
                    {"password": self.new_user_data["password"], "password_confirmation": self.new_user_data["password"]}, 
                    format='json')
        self.old_user.refresh_from_db()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(self.old_user.password, old_password)
        self.assertEqual(response.json()[0], 'Old password is incorrect.')

    def test_fail_user_post(self):
        """A user should be created only using register"""
        response = self.client.post(reverse('songs:users-list'))
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_fail_user_detail_post(self):
        """A user should be created only using register"""
        response = self.client.post(reverse('songs:users-detail', args=[self.old_user.id]))
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_user_detail_delete_user(self):
        """A user should be able to delete their profile."""
        response = self.client.delete(reverse('songs:users-detail', args=[self.old_user.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_fail_user_detail_modify_another_user(self):
        """
        Check that another user can't perform post, put, patch and delete methods
        Authenticated as old_user and attempt to send those requests to old_user_2
        """
        # post
        response = self.client.post(reverse('songs:users-detail', args=[self.old_user_2.id]))
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        # put
        response = self.client.put(reverse('songs:users-detail', args=[self.old_user_2.id]))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        # patch
        response = self.client.patch(reverse('songs:users-detail', args=[self.old_user_2.id]))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        # delete
        response = self.client.delete(reverse('songs:users-detail', args=[self.old_user_2.id]))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class SongTests(AuthenticatedAPITests):
    def test_song_list(self):
        """Successfully list all songs."""
        response = self.client.get(reverse('songs:songs-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()["results"]), 2)  # list 2 users - old_user and old_user_2

    def test_fail_song_list_not_allowed_methods(self):
        """Check that put, patch and delete methods are not allowed for song list"""
        # put
        response = self.client.put(reverse('songs:songs-list'))
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        # patch
        response = self.client.patch(reverse('songs:songs-list'))
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        # delete
        response = self.client.delete(reverse('songs:songs-list'))
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_create_song(self):
        response = self.client.post(reverse('songs:songs-list'), data=self.new_song_data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Song.objects.count(), 3)  # old song, old song 2 and new song
        self.assertEqual(response.json()["title"], self.new_song_data["title"])

    def test_fail_create_song_invalid_audio_file(self):
        self.new_song_data["audio_file"] = SimpleUploadedFile(name="test_image_file.png", content=b'test image file content', content_type='image/png')
        response = self.client.post(reverse('songs:songs-list'), data=self.new_song_data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Song.objects.count(), 2)  # old song and old song 2
        self.assertRegex(response.json()["audio_file"][0], r'File extension .* is not allowed. Allowed extensions are: mp3, wav, ogg.')

    def test_fail_create_song_missing_title(self):
        self.new_song_data.pop("title")
        response = self.client.post(reverse('songs:songs-list'), data=self.new_song_data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Song.objects.count(), 2)  # old song and old song 2
        self.assertEqual(response.json()["title"][0], 'This field is required.')

    def test_get_song_detail(self):
        """Successfully get details of an existing song"""
        response = self.client.get(reverse('songs:songs-detail', args=[self.old_song.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["title"], self.old_song.title)

    def test_update_song(self):
        response = self.client.put(reverse('songs:songs-detail', args=[self.old_song.id]), data=self.new_song_data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["title"], self.new_song_data["title"])

    def test_update_song_title(self):
        response = self.client.patch(reverse('songs:songs-detail', args=[self.old_song.id]), {"title": self.new_song_data["title"]}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["title"], self.new_song_data["title"])

    def test_update_song_audio_file(self):
        response = self.client.patch(reverse('songs:songs-detail', args=[self.old_song.id]), {"title": self.new_song_data["title"]}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["title"], self.new_song_data["title"])

    def test_song_detail_delete_song(self):
        """A user should be able to delete a song of theirs."""
        response = self.client.delete(reverse('songs:songs-detail', args=[self.old_user.songs.first().id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_fail_update_song_by_another_user(self):
        response = self.client.post(reverse('songs:songs-detail', args=[self.old_song_2.id]), format='multipart')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertEqual(response.json()["detail"], 'Method "POST" not allowed.')

        response = self.client.put(reverse('songs:songs-detail', args=[self.old_song_2.id]), format='multipart')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.json()["detail"], 'You do not have permission to perform this action.')

        response = self.client.patch(reverse('songs:songs-detail', args=[self.old_song_2.id]), format='multipart')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.json()["detail"], 'You do not have permission to perform this action.')

        response = self.client.delete(reverse('songs:songs-detail', args=[self.old_song_2.id]), format='multipart')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.json()["detail"], 'You do not have permission to perform this action.')
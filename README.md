# cs50w-music - CS50w final project

#### Video Demo:  [https://youtu.be/zlQ08J3Y5fI](https://www.youtube.com/watch?v=zlQ08J3Y5fI)

## Description
This web application, made with Django and React and inspired by Spotify, lets users and artists team up to upload, work together on songs and albums, and play music. It also has a sign-in system and sends notifications to keep things lively.

## How to run
### Setup
`python3 -m venv env`  
`source env/bin/activate`  
`pip install -r backend/requirements.txt`  
`python backend/manage.py migrate`  

`npm install --prefix frontend/`

### Run
in separate terminals run:  
`python backend/manage.py runserver`  
`npm start  --prefix frontend/`

Visit [http://127.0.0.1:3000/](http://127.0.0.1:3000/) in the web browser.

## Distinctiveness and Complexity

This project departs from previous assignments by introducing a collaborative music-sharing platform inspired by Spotify, where users can collectively contribute to the creation of shared songs and albums. Unlike earlier projects, this approach emphasizes collaboration among artists, allowing them to collectively manage songs and albums for a more interactive experience.

The project's complexity on the backend is underscored by the incorporation of Django Rest Framework (DRF), a powerful tool for building APIs in Django projects. DRF enhances the backend by facilitating robust API development, ensuring efficient data management, real-time communication, and secure user interactions. Additionally, Django Notifications is integrated for real-time updates, while Django Knox handles secure token authentication, collectively providing a comprehensive and secure foundation.

On the frontend, the project utilizes React, enriched by the integration of Material-UI (Mui) for a sleek and responsive user interface. The adoption of Axios further enhances data communication between the React frontend and Django backend, contributing to a seamless and efficient user experience.


## File contents

* **backend/cs50w_music/settings.py**  
Django settings for cs50w_music project.

* **backend/cs50w_music/settings_test.py**  
Settings for testing with disabled api rate limiting.

* **backend/cs50w_music/urls.py**  
URL configuration for the project.

* **backend/songs/admin.py**  
Configure the admin panel

* **backend/songs/helpers.py**  
Helper functions used in **views.py** to make the views cleaner.

* **backend/songs/models.py**  
Django ORM models defining the structure and relationships for User, Album, Song, and Playlist.

* **backend/songs/notifications_middleware.py**  
Middleware authenticating user via knox token when calling django-notifications APIs.

* **backend/songs/permissions.py**  
Custom permission classes for a the song app.

* **backend/songs/serializers.py**  
Serializers which convert complex Django model instances into native Python data types for user registration, login, and managing music-related entities

* **backend/songs/tests.py**  
Tests for user registration, login;
creating, editing and deleting song/album/playlist; 
requesting additional artists to a song/album

* **backend/songs/urls.py**  
URL configuration for the song app.

* **backend/songs/views.py**  
Viewsets and APIs for user management, authentication, and music-related operations.


* **frontend/src/AccountMenu.js**  
Menu that contains a link to the user's profile page and sign out link; and handlers for opening and closing the menu.

* **frontend/src/AlbumDetails.js**  
Album page that displays details about an album and songs that are featured as part of it.

* **frontend/src/App.js**  
Structures a music-sharing platform using React Router, handling user authentication, navigation, and rendering components for signing in, signing up, browsing songs and albums, and editing user profiles

* **frontend/src/ArtistsCardsCollection.js**  
A collection of usercards to display the artists of a song/album.

* **frontend/src/CardsCollection.js**  
A collection of user/song/album cards fetched from the provided url. Supports infinite scroll.

* **frontend/src/ConfirmButton.js**  
Button for users to confirm to be added as an artist of a song/album when they have been requested.

* **frontend/src/CreateMenu.js**  
Menu that includes links to create song and create album and handlers for opening and closing the menu.

* **frontend/src/CreateRelease.js**  
Page for creating a new song/album.

* **frontend/src/DeleteButton.js**  
Button for deleting a song/album. Asks for confirmation.

* **frontend/src/EditRelease.js**  
Page for editting a song/album and also for requesting additional artists to be added to it.

* **frontend/src/EditUser.js**  
Page for editting a user details.

* **frontend/src/Home.js**  
Home page showing the 20 newest songs and albums and the first 20 users alphabetically and buttons that link to all songs/albums/users using **CardCollection**s.

* **frontend/src/MobileMenu.js**  
Mobile menu that contains Notifications menu and Account menu.

* frontend/src/Navbar.js
Navigation bar that includes **CreateMenu**, **SearchBar**, **MobileMenu**, sign in link.

* **frontend/src/NotificationsMenu.js**  
Menu containing user's notifications

* **frontend/src/PlaySong.js**  
Song page that displays details about a song and a audio player to play the song audio

* **frontend/src/ReleaseCard.js**  
A card that shows some brief information about a song/album and links to it.

* **frontend/src/RequesedArtistsCardsCollection.js**  
A collection of **UserCard**s to display the requested artists of a song/album.

* **frontend/src/SearchBar.js**  
Search bar that navigates to home with a search parameter of the contents of the search input box.

* **frontend/src/SignIn.js**  
Page for logging in a user.

* **frontend/src/SignOutMenuItem.js**  
Menu item that includes Sign out link and handles sign out.

* **frontend/src/SignUp.js**  
Page for creating a new user.

* **frontend/src/UserCard.js**  
A card that shows some brief information about a user and links to their profile.

* **frontend/src/UserDetails.js**  
User profile page including user details and songs and albums released by that user

* **frontend/src/axiosInstance.js**  
Axios instance for making API requests with a predefined base URL. And handle token authentication.


* **frontend/src/styles/CardsCollection.css**  
Styles for **CardsCollection.js** and **ArtistsCardsCollection.js**.

* **frontend/src/styles/Navbar.css**  
Styles for **Navbar.js**.

* **frontend/src/styles/ReleaseDetails.css**  
Styles for **PlaySong.js** and **AlbumDetails.js** (song/album details).

* **frontend/src/styles/UserDetails.css**  
Styles for **UserDetails.js** (user profile page).


## API Endpoints  
base url http://127.0.0.1:8000/ 

**Pagination with 20 items per page**.   

Authorization and api rate limiting are set for security measures.  

### User Endpoints  
* GET api/users  
Retrieve a list of all users.  
    * search by username and country (e.g. api/users?search=user1)
    * page (e.g. api/users?page=2)

* GET api/users{id}/  
Retrieve details of a specific user.  

* PATCH api/users{id}/  
Modify details of a specific user. 
    * username  
    * old_password (required when changing the password)
    * password  
    * password_confirmation
    * first_name  
    * last_name  
    * email  
    * birth_date  
    * country

* DELETE api/users{id}/  
Set the a specific user as inactive - soft delete.

Django knox token authentication:

* POST api/register/  
Register a new user and obtain an authentication token.
    * **username**  
    * **password**  
    * **password_confirmation**
    * first_name  
    * last_name  
    * email  
    * birth_date  
    * country

    The response contains the authentication token.

* POST api/login/  
Log in and obtain an authentication token.  
    * **username**  
    * **password**  

* POST api/logout/
Log out the current user.

* POST api/logoutall/  
Remove all tokens that the server has - forcing all clients to re-authenticate

### Album Endpoints
* GET api/albums/  
Retrieve a list of all albums.
    * search by title and artists__username (e.g. api/albums?search=user1)
    * filter by artists__id (e.g. api/albums?artists__id=1)
    * page (e.g. api/users?page=2)

* GET api/albums/{id}/  
Retrieve details of a specific album.

* POST api/albums/  
Create a new album.
    * **title**   
    * release_date  
    
    The current user is automcatically added to the artists list.

* PATCH api/albums/{id}/  
Update details of a specific album.
    * title
    * release_date
    * cover_image

* DELETE api/albums/{id}/  
Delete a specific album.

* POST api/albums/{id}/manage_requested_artists/  
Request to add an artist to the list of artists associated with an album.
    * **aritst_id**

* DELETE api/albums/{id}/manage_requested_artists/  
Remove an artist from requested artists.
    * **aritst_id**

* POST api/albums/{id}/confirm_current_user_as_artist/  
Confirm to be added as an artist to the list of artists associated with an album.

* DELETE api/albums/{id}/remove_current_user_as_artist/  
Remove current user from the list of artists associated with an album.


### Song Endpoints
* GET api/songs/  
Retrieve a list of all songs.
    * search by title and artists__username (e.g. api/songs?search=songtitle)
    * filter by album__id and artists__id (e.g. api/songs?album__id=2)
    * page (e.g. api/users?page=2)

* GET api/songs/{id}/  
Retrieve details of a specific song.

* POST api/songs/  
Create a new song.
    * **title**  
    * **audio_file**  
    * release_date  
    * genre
    * album_id
    * track_number (In the album)
    * cover_image
    
    The current user is added in the artists list.


* PATCH api/songs/{id}/  
Update details of a specific song.

* DELETE api/songs/{id}/  
Delete a specific song.

* POST api/songs/{id}/manage_requested_artists/  
Request to add an artist to the list of artists associated with a song.
    * **aritst_id**

* DELETE api/songs/{id}/manage_requested_artists/  
Remove an artist from requested artists.
    * **aritst_id**

* POST api/songs/{id}/confirm_current_user_as_artist/  
Confirm to be added as an artist to the list of artists associated with a song.

* DELETE api/songs/{id}/remove_current_user_as_artist/  
Remove current user from the list of artists associated with a song.


### Playlist Endpoints
* GET api/playlists/  
Retrieve a list of all playlists of the current user.
    * search by title (e.g. api/playlists?search=playlisttitle)
    * page (e.g. api/users?page=2)

* GET api/playlists/{id}/  
Retrieve details of a specific playlist.

* POST api/playlists/  
Create a new playlist.
    * **title**

    The current user is set as the owner of the playlist and the timestamp created_at is set to now.

* PATCH api/playlists/{id}/  
Update details of a specific playlist.
    * title

* DELETE api/playlists/{id}/  
Delete a specific playlist.

* POST api/playlists/{id}/manage_songs/  
Add a song to a playlist.
    * **song_id**

* DELETE api/playlists/{id}/manage_songs/  
Remove a song from a playlist.
    * **song_id**


### Notification Endpoints (django-notifications app)
* GET notifications/api/all_list/  
List current user's read and unread notifications
    * max (default=10) (e.g. api/all_list?max=100)
    * mark_as_read (default=false) (e.g. api/all_list?mark_as_read=true)

* GET notifications/api/unread_list
List current user's unread notifications
    * max (default=10) (e.g. api/all_list?max=100)
    * mark_as_read (default=false) (e.g. api/all_list?mark_as_read=true)

* GET notifications/api/unread_count/
Get the count of the current user's unread notifications


## Testing - CI
**.github/workflows/ci.yml** The github action workflow, triggered on push events, runs Django unit tests for the project, ensuring seamless and automated testing.  
`cd backend`  
`python3 manage.py test --settings=cs50w_music.settings_test`


## Additional information
- The frontend is functional, though not polished extensively, as the primary focus was on backend development.  
- Storing the authentication token in the browser's local storage poses a security vulnerability, as it could be susceptible to theft through cross-site scripting (XSS) attacks.  
- Static files are served from media in development; CDN server would be more appropriate in production  
- Using incremental song and album ids and not random (like youtube does) because this app doesn't support unlisted songs/albums  

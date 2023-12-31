from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from knox import views as knox_views
import notifications.urls
from rest_framework.routers import DefaultRouter
from songs import views


app_name = "songs"

router = DefaultRouter()
router.register(r"songs", views.SongViewSet, basename="songs")
router.register(r"playlists", views.PlaylistViewSet, basename="playlists")
router.register(r"albums", views.AlbumViewSet, basename="albums")
router.register(r"users", views.UserViewSet, basename="users")

urlpatterns = [
    path("api/", include(router.urls)),
    path("api/register/", views.RegistrationAPI.as_view(), name="user-register"),
    path("api/login/", views.LoginAPI.as_view(), name="user-login"),
    path("api/logout/", knox_views.LogoutView.as_view(), name="knox-logout"),
    path("api/logoutall/", knox_views.LogoutAllView.as_view(), name="knox-logout-all"),
    path("notifications/", include(notifications.urls, namespace="notifications")),
]

# static files are served from media in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
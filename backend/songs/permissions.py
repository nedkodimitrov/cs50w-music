"""Custom permission classes for a the song app."""

from rest_framework import permissions


class IsArtistOrReadOnly(permissions.BasePermission):
    """Allows read-only access or editing/deleting if the user is in the artists list."""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user in obj.artists.all()


class IsPlaylistOwner(permissions.BasePermission):
    """Allows access only to the owner of a playlist."""

    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user


class IsRequestedArtist(permissions.BasePermission):
    """Allows access only to users in the requested artists list."""

    def has_object_permission(self, request, view, obj):
        return request.user in obj.requested_artists.all()


class IsUserOrReadOnly(permissions.BasePermission):
    """Allows read-only access or updating/deleting if the user is authenticated as the user"""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user == obj

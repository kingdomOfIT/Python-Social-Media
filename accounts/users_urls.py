from django.urls import path
from . import api

urlpatterns = [
    path('',api.ListUsersAPI.as_view() ,name='list_users'),
]

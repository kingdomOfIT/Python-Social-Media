from django.urls import path
from . import api
from knox.urls import views as knoxviews

from rest_framework import routers
from .api import PostViewSet

urlpatterns = [
    path('log-in/',api.LoginAPI.as_view() ,name='log-in'),
    path('register/',api.RegisterAPI.as_view() ,name='register'),
    path('log-out/',knoxviews.LogoutView.as_view() ,name='log-out'),
    path('validation/',api.UserValidationAPI.as_view() ,name="validation"),
    path('activate/<uidb64>/<token>/', api.ActivationAPI.as_view(), name='activate'),
]

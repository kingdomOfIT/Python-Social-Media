from rest_framework import routers
from django.urls import path 
from .api import FollowingPostViewSet

router = routers.DefaultRouter()

router.register('' ,FollowingPostViewSet ,basename='follow')

urlpatterns = router.urls

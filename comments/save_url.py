from django.urls import path 
from rest_framework import routers 
from . import api

router = routers.DefaultRouter()

router.register('' ,api.SaveViewSet ,basename='saves')

urlpatterns = router.urls
 
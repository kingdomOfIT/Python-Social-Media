from django.urls import path
from . import api
from rest_framework import routers
from .api import PostViewSet, FollowingPostViewSet, LikeViewSet, SaveViewSet, FollowingUsersViewSet

router = routers.DefaultRouter()
router.register('', PostViewSet, basename='posts')
router.register('', FollowingPostViewSet, basename='following_posts')
router.register('', FollowingUsersViewSet, basename='following_users')
router.register('', LikeViewSet, basename='likes')
router.register('', SaveViewSet, basename='saves')

urlpatterns = [
    path('', api.GetUserAPI.as_view(), name='get_user'),
    path('profile/', api.ProfileAPI.as_view(), name='profile'),
    path('<int:id>/', api.GetUserAPI.as_view(), name='get_user_by_id'),
    path('<int:id>/update/', api.UpdateUserApi.as_view(), name='update-user'),
    path('<int:id>/update-image/', api.UpdateProfileImageApi.as_view(), name="update-user-image"),
]

# Add the router URLs to urlpatterns
urlpatterns += router.urls
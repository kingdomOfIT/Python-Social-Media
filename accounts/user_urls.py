# from django.urls import path
# from . import api
# from django.urls import path


# urlpatterns = [
#     path('',api.GetUserAPI.as_view() ,name='get_user'),
#     path('profile/',api.ProfileAPI.as_view() ,name='profile'),
#     path('<int:id>/', api.GetUserAPI.as_view(), name='get_user_by_id'),
#     path('update-user/<int:id>/',api.UpdateUserApi.as_view() ,name='update-user'),
#     path('update-image/<int:id>/',api.UpdateProfileImageApi.as_view() ,name="update-user-image"),
#     path('<int:pk>/following/posts',api.GetFollowing.as_view() ,name="following_posts"),
#     path('<int:pk>/following/users',api.GetFollowing.as_view() ,name="following_users"),
#     path('<int:pk>/liked-posts',api.GetPost.as_view() ,name="get_liked_posts"),
#     path('<int:pk>/saved-posts',api.GetPost.as_view() ,name="get_saved_posts"),
#     path('<int:pk>/posts',api.GetPost.as_view() ,name="get_user_posts"),
# ]

from django.urls import path
from . import api
from rest_framework import routers
from .api import PostViewSet, FollowingPostViewSet, LikeViewSet, SaveViewSet

router = routers.DefaultRouter()
router.register('', PostViewSet, basename='posts')
router.register('', FollowingPostViewSet, basename='follow')
router.register('', LikeViewSet, basename='likes')
router.register('', SaveViewSet, basename='saves')

urlpatterns = [
    path('', api.GetUserAPI.as_view(), name='get_user'),
    path('profile/', api.ProfileAPI.as_view(), name='profile'),
    path('<int:id>/', api.GetUserAPI.as_view(), name='get_user_by_id'),
    path('update-user/<int:id>/', api.UpdateUserApi.as_view(), name='update-user'),
    path('update-image/<int:id>/', api.UpdateProfileImageApi.as_view(), name="update-user-image"),
]

# Add the router URLs to urlpatterns
urlpatterns += router.urls
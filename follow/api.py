from rest_framework import generics
from posts.models import Post
from posts.serializers import PostSer
from accounts.serializers import GetUserSerializer
from rest_framework import status
from .serializers import FollowSerializer
from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from accounts.models import User
from django.contrib.auth.models import User as User2
from django.shortcuts import get_object_or_404
from .models import Follow
from django.db.models import F

class FollowingPostViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.ListModelMixin):
    queryset = Post.objects.all()
    serializer_class = PostSer

    def create(self, request, *args, **kwargs):
        target_user_id = request.data.get('targetUser')
        if target_user_id is None:
            return Response({'error': 'targetUser field is required'}, status=status.HTTP_400_BAD_REQUEST)

        requester_user = request.user  # Get the user making the request
        target_user = User.objects.filter(id=target_user_id).first()  # Get the target user object

        if not target_user:
            return Response({'error': 'Target user not found'}, status=status.HTTP_404_NOT_FOUND)

        follow_data = {'requesterUser': requester_user.id, 'targetUser': target_user.id}
        serializer = FollowSerializer(data=follow_data)

        if serializer.is_valid():
            serializer.save()
            # Update the following count for the requester user
            requester_user.profile.following_count = F('following_count') + 1
            requester_user.profile.save()
            # Update the followers count for the target user
            target_user.profile.followers_count = F('followers_count') + 1
            target_user.profile.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def delete_follow(self, request, *args, **kwargs):
        user_id = request.data.get("user_id")
        target_user_id = request.data.get("target_user_id")
        
        user = get_object_or_404(User2, pk=user_id)
        target_user = get_object_or_404(User2, pk=target_user_id)
        
        # Check if there's a follow relationship between the user and the target_user
        follow_instance = Follow.objects.filter(requesterUser=user, targetUser=target_user).first()
        if not follow_instance:
            return Response({"message": "No follow relationship found."}, status=status.HTTP_404_NOT_FOUND)
        
        # Delete the follow instance
        follow_instance.delete()

        # Update the following count for the requester user
        user.profile.following_count = F('following_count') - 1
        user.profile.save()
        # Update the followers count for the target user
        target_user.profile.followers_count = F('followers_count') - 1
        target_user.profile.save()
        
        return Response({"message": "Follow relationship deleted successfully."}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def following_posts(self, request, *args, **kwargs):
        user_id = request.GET.get("0")
        user = get_object_or_404(User2, pk=user_id)
        following = user.following.all()

        if not following:
            return Response([], status=status.HTTP_200_OK)

        following_users_ids = [follow.targetUser.id for follow in following]
        following_posts = Post.objects.filter(owner_id__in=following_users_ids)
        following_posts = following_posts.exclude(owner=user)
        
        queryset = self.filter_queryset(following_posts)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    

    @action(detail=False, methods=['get'])
    def following_users(self, request, *args, **kwargs):
        user_id = request.GET.get("userId")
        user = get_object_or_404(User2, pk=user_id)
        following = user.following.all()

        if not following:
            return Response([], status=status.HTTP_200_OK)

        following_users = [follow.targetUser for follow in following]
        queryset = self.filter_queryset(following_users)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = GetUserSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = GetUserSerializer(queryset, many=True)
        return Response(serializer.data)
    

    # @action(detail=False, methods=['post'])
    # def delete_follow(self, request, *args, **kwargs):
    #     user_id = request.data.get("user_id")
    #     target_user_id = request.data.get("target_user_id")
        
    #     user = get_object_or_404(User2, pk=user_id)
    #     target_user = get_object_or_404(User2, pk=target_user_id)
        
    #     # Check if there's a follow relationship between the user and the target_user
    #     follow_instance = Follow.objects.filter(requesterUser=user, targetUser=target_user).first()
    #     if not follow_instance:
    #         return Response({"message": "No follow relationship found."}, status=status.HTTP_404_NOT_FOUND)
        
    #     # Delete the follow instance
    #     follow_instance.delete()
        
    #     return Response({"message": "Follow relationship deleted successfully."}, status=status.HTTP_200_OK)

from django.contrib.auth.models import User as DjangoUser
from django.db import transaction
from django.db.models import F
from django.shortcuts import get_object_or_404

from rest_framework import status, viewsets, mixins
from rest_framework.decorators import action
from rest_framework.response import Response

from accounts.models import User
from accounts.serializers import UserSerializer
from post.models import Post
from post.serializers import PostSer
from .models import Follow
from .serializers import FollowSerializer

class FollowingPostViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.ListModelMixin):
    queryset = Post.objects.all()
    serializer_class = PostSer

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        target_user_id = request.data.get('targetUser')
        if target_user_id is None:
            return Response({'error': 'targetUser field is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        requester_user = request.user
        target_user = get_object_or_404(User, id=target_user_id)

        # Check if the follow relationship already exists
        if requester_user.following.filter(id=target_user.id).exists():
            return Response({'error': 'You are already following this user'}, status=status.HTTP_400_BAD_REQUEST)

        follow_data = {'requesterUser': requester_user.id, 'targetUser': target_user.id}
        serializer = FollowSerializer(data=follow_data)

        if serializer.is_valid():
            serializer.save()

            # Update the following count for the requester user
            requester_user.profile.followingCount = F('followingCount') + 1
            requester_user.profile.save()

            # Update the followers count for the target user
            target_user.profile.followersCount = F('followersCount') + 1
            target_user.profile.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    @action(detail=False, methods=['post'])
    def delete_follow(self, request, *args, **kwargs):
        user_id = request.data.get("user_id")
        target_user_id = request.data.get("target_user_id")
        
        user = get_object_or_404(DjangoUser, pk=user_id)
        target_user = get_object_or_404(DjangoUser, pk=target_user_id)
        
        # Check if there's a follow relationship between the user and the target_user
        follow_instance = Follow.objects.filter(requesterUser=user, targetUser=target_user).first()
        if not follow_instance:
            return Response({"message": "No follow relationship found."}, status=status.HTTP_404_NOT_FOUND)
        
        # Delete the follow instance
        follow_instance.delete()

        # Update the following count for the requester user
        user.profile.followingCount = F('followingCount') - 1
        user.profile.save()
        # Update the followers count for the target user
        target_user.profile.followersCount = F('followersCount') - 1
        target_user.profile.save()
        
        return Response({"message": "Follow relationship deleted successfully.", "targetUserId": target_user_id}, status=status.HTTP_200_OK)


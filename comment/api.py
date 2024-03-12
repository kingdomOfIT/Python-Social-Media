from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.http import Http404

from rest_framework import viewsets, permissions, filters, status
from rest_framework.response import Response 
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError

from .models import *
from .serializers import *

from post.custom_permissions import IsOwnerOrReadOnly
from post.models import Post
from post.serializers import PostSer


class CommentViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows comments to be viewed or edited.
    """
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer 
    permission_classes = [
        permissions.IsAuthenticated,
        IsOwnerOrReadOnly,
    ]
    filter_backends = [filters.OrderingFilter]
    ordering = ['-createdAt']

    def perform_create(self ,serializer):
        """
        Override method to associate the comment with the authenticated user.
        """
        return serializer.save(owner = self.request.user)

    def update(self, request, pk=None, partial=False):
        """
        Update a comment instance.
        """
        try:
            comment = get_object_or_404(Comment, id=pk)
            self.check_object_permissions(request, comment)
            serializer = CommentUpdateSerializer(comment, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            comment_data = serializer.data
            return Response(comment_data)
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Http404 as e:
            return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': 'An unexpected error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LikeViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows likes to be viewed or edited.
    """
    queryset = Like.objects.all()
    serializer_class = LikeSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        """
        Override method to associate the like with the authenticated user.
        """
        return serializer.save(owner=self.request.user)

    def create(self, request, pk=None, partial=False):
        """
        Create a new like for a post.
        """
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(owner=self.request.user)
            post_id = serializer.data["post"]
            post = Post.objects.get(id=post_id)
            return Response(PostSer(post).data)
        except Exception as e:
            print("Error from create like function:", e)
            return Response({"error": "Failed to create like"}, status=status.HTTP_400_BAD_REQUEST)


    def destroy(self, request, pk=None, partial=False):
        """
        Delete a like instance.
        """
        try:
            like = get_object_or_404(Like, id=pk)
            post = like.post
            self.check_object_permissions(request, like)
            like.delete()
            return Response(PostSer(post).data)
        except Http404:
            return Response({"error": "Like not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print("Error from delete like function:", e)
            return Response({"error": "Failed to delete like"}, status=status.HTTP_400_BAD_REQUEST)
    
class SaveViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows posts to be saved, retrieved, updated, or deleted.
    """
    queryset = Save.objects.all()
    serializer_class = SaveSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        """
        Associate the saved post with the authenticated user.
        """
        return serializer.save(owner=self.request.user)

    def create(self, request, pk=None):
        """
        Save a post instance.
        """
        try:
            request.data['is_saved'] = True
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(owner=self.request.user)
            post_id = serializer.data["post"]
            post = Post.objects.get(id=post_id)
            return Response(PostSer(post).data)
        except Exception as e:
            print("Error from saving post function:", e)
            return Response({'error': 'Failed to save the post.'}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        """
        Unsave a post instance.
        """
        try:
            save = get_object_or_404(Save, id=pk)
            post = save.post
            self.check_object_permissions(request, save)
            save.delete()
            return Response(PostSer(post).data)
        except Http404:
            return Response({'error': 'Save not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print("Error from deleting saved post:", e)
            return Response({'error': 'Failed to unsave the post.'}, status=status.HTTP_400_BAD_REQUEST)


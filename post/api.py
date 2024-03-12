from rest_framework import viewsets, permissions, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action

from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.http import Http404

from .models import Post 
from .serializers import PostSer
from .custom_permissions import IsOwnerOrReadOnly
from .pagination import CustomPagination
from comment.models import Comment
from comment.serializers import CommentSerializer

class PostViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows posts to be viewed or edited.
    """
    queryset = Post.objects.all()
    serializer_class = PostSer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    pagination_class = CustomPagination
    filter_backends = [filters.OrderingFilter]
    ordering = ['-createdAt']

    def perform_create(self, serializer):
        """
        Override method to associate the post with the authenticated user.
        """
        serializer.save(owner=self.request.user)
    
    @action(detail=True)
    def comments(self, request, pk=None):
        """
        Retrieve comments for a specific post.
        """
        try:
            post = get_object_or_404(Post, pk=pk)
            comments = Comment.objects.filter(post=post).order_by('-createdAt')
            serialized_comments = CommentSerializer(comments, many=True).data
            return Response(serialized_comments)
        except Http404 as e:
            return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': 'An unexpected error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


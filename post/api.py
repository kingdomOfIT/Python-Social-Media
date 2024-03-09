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
    def get_user_posts(self, request, pk=None):
        """
        Retrieve posts for a specific user.
        """
        try:
            owner = get_object_or_404(User, pk=pk)
            owner_posts = Post.objects.filter(owner=owner.id)
            serializer = PostSer(owner_posts, many=True)
            return Response(serializer.data)
        except Http404 as e:
            return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': 'An unexpected error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


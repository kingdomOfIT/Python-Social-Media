from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework import permissions 
from rest_framework.response import Response 
from rest_framework.decorators import action
from rest_framework import pagination
from rest_framework import filters
from django.contrib.auth.models import User

from .models import Comment ,Like, Save
from .serializers import CommentSer ,CommentUpdateSer ,LikeSer ,LikeUpdateSer, SaveSerializer
from posts.custom_permissions import isOwnerOrReadOnly
from posts.models import Post
from posts.serializers import PostSer


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSer 
    permission_classes = [
        permissions.IsAuthenticated,
        isOwnerOrReadOnly,
    ]
    filter_backends = [filters.OrderingFilter]
    ordering = ['-p_date']

    def perform_create(self ,serializer):
        return serializer.save(owner = self.request.user)

    def update(self ,request , pk=None):
        comment = get_object_or_404(Comment ,id = pk)
        self.check_object_permissions(request , comment)
        serializer = CommentUpdateSer(comment ,data = request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        comment = serializer.data
        return Response(comment)

    @action(detail=True)
    def get_comments(self ,request ,pk = None):
        post = get_object_or_404(Post ,pk = pk)
        comments = Comment.objects.filter(post = post).order_by('-p_date')
        return Response( CommentSer(comments ,many = True).data )

class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.all()
    serializer_class = LikeSer
    permission_classes = [
        # permissions.IsAuthenticated,
        isOwnerOrReadOnly,
    ]

    def perform_create(self ,serializer):
        return serializer.save(owner = self.request.user)

    def create(self ,request , pk=None):
        try:
            serializer = self.get_serializer(data = request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(owner = self.request.user)
            post_id = serializer.data["post"]
            post = Post.objects.get(id = post_id)
            return Response(PostSer(post).data)
        except Exception as e:
            print("Error from create like function")
            print(e)

    def update(self ,request , pk=None):
        like = get_object_or_404(Like ,id = pk)
        post = like.post
        self.check_object_permissions(request , like)
        serializer = LikeUpdateSer(like ,data = request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(PostSer(post).data)

    def destroy(self ,request , pk=None):
        like = get_object_or_404(Like ,id = pk)
        post = like.post
        self.check_object_permissions(request , like)
        like.delete() 
        return Response(PostSer(post).data)
    
    @action(detail=True)
    def get_user_liked_posts(self, request, pk=None):
        try:
            user = get_object_or_404(User, pk=pk)
            liked_posts = Like.objects.filter(owner=user)
            # print("Liked posts: ", liked_posts)

            post_ids = [like.post.id for like in liked_posts]
            posts = Post.objects.filter(id__in=post_ids).order_by('-p_date')
            post_data = PostSer(posts, many=True).data

            return Response(post_data)
        except Exception as e:
            print("Error running get_user_liked_posts: ", e)
    

class SaveViewSet(viewsets.ModelViewSet):
    queryset = Save.objects.all()
    serializer_class = SaveSerializer
    permission_classes = [
        # permissions.IsAuthenticated,
        isOwnerOrReadOnly,
    ]

    def perform_create(self ,serializer):
        return serializer.save(owner = self.request.user)

    def create(self ,request , pk=None):
        try:
            request.data['is_saved'] = True
            serializer = self.get_serializer(data = request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(owner = self.request.user)
            post_id = serializer.data["post"]
            post = Post.objects.get(id = post_id)
            return Response(PostSer(post).data)
        except Exception as e:
            print("Error from saving post function")
            print(e)

    def destroy(self ,request , pk=None):
        save = get_object_or_404(Save ,id = pk)
        post = save.post
        self.check_object_permissions(request , save)
        save.delete() 
        return Response(PostSer(post).data)
    
    @action(detail=True)
    def get_user_saved_posts(self, request, pk=None):
        user = get_object_or_404(User, pk=pk)
        saved_posts = Save.objects.filter(owner=user)

        post_ids = [save.post.id for save in saved_posts]
        posts = Post.objects.filter(id__in=post_ids).order_by('-p_date')
        post_data = PostSer(posts, many=True).data

        return Response(post_data)




import logging
from knox.models import AuthToken

from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.http import HttpResponseBadRequest, Http404
from django.shortcuts import get_object_or_404
from django.shortcuts import render
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from django.db import transaction

from rest_framework import generics, permissions, status, filters, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action

from comment.serializers import LikeSerializer, SaveSerializer

from .custom_permissions import IsTheSameUser
from .email_verification import Email
from .models import Profile
from post.models import Post
from comment.models import Like, Save
from post.serializers import PostSer
from .serializers import *
from .token import account_activation_token
from post.custom_permissions import IsOwnerOrReadOnly
from post.pagination import CustomPagination


class GetUserAPI(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get_object(self):
        """
        Retrieve the user object based on the user_id URL parameter.

        If user_id is provided, attempt to retrieve the user by ID. 
        If not found, raise a 404 error.
        If user_id is not provided, return the currently authenticated user.

        Returns:
            User instance: The requested user object.
        """
        user_id = self.kwargs.get('id', None)

        if user_id is not None:
            user = get_object_or_404(User, id=user_id)
            return user

        # If user_id is not provided, return the currently authenticated user
        return self.request.user
    
class ListUsersAPI(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def list(self, request, *args, **kwargs):
        """
        Retrieve a list of users.

        Returns:
            Response: A Response object containing the list of users.
        """
        try:
            response = super().list(request, *args, **kwargs)
            serialized_data = list(map(dict, response.data))
            return response
        except Exception as e:
            # Log the exception and return an appropriate error response
            logging.Logger.exception("Failed to retrieve list of users: %s", e)
            return Response({'error': 'Failed to retrieve list of users'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LoginAPI(generics.GenericAPIView):
    """
    API endpoint for user login.
    """
    serializer_class = LoginSerializer

    def post(self ,request , *args ,**kwargs):
        """
        Handle POST request for user login.
        """
        serializer = self.get_serializer(data = request.data)
        serializer.is_valid(raise_exception=True)
        username = serializer.validated_data['username']
        user = User.objects.get(username=username)
        token = AuthToken.objects.create(user)[1]

        return Response({
            'user' : UserSerializer(user).data,
            'token' : token
        })

class RegisterAPI(generics.GenericAPIView):
    """
    API endpoint for user registration.
    """
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        """
        Handle user registration.
        
        :param request: HTTP request object
        :param args: Additional positional arguments
        :param kwargs: Additional keyword arguments
        :return: HTTP response
        """
        try:
            # Extract profile data from request
            profile_data = {"image": request.data["image"], "sex": request.data["sex"]}

            # Serialize user data and validate
            user_serializer = self.get_serializer(data=request.data)
            user_serializer.is_valid(raise_exception=True)
            user = user_serializer.save()

            # Set user as inactive upon registration
            User = get_user_model()
            User.objects.filter(pk=user.pk).update(is_active=False)

            # Associate profile data with the user and save
            profile_data["user"] = user.id
            prfile_serialize = ProfileSerializer(data=profile_data)
            prfile_serialize.is_valid(raise_exception=True)
            prfile_serialize.save()

            # Send activation email to the user
            Email.send_activation_email(request, user, user.email)

            # Return successful response
            return Response({
                'user': UserSerializer(user).data
            })
        except Exception as e:
            # Log the exception and return appropriate error response
            logging.Logger.exception("Exception during user registration: %s", e)
            return Response({"error": "Failed to register user"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class ActivationAPI(generics.GenericAPIView):
    """
    Activate user account based on the activation token.
    """

    def get(self, request, uidb64, token):
        """
        Activate user account using the provided activation token.

        Args:
            request: HTTP request object.
            uidb64 (str): Base64 encoded user ID.
            token (str): Activation token.

        Returns:
            HttpResponse: Confirmation page on successful activation.
            HttpResponseBadRequest: Error message if activation fails.
        """

        # Retrieve the User model
        User = get_user_model()
        try:
            # Decode the base64 encoded user ID
            uid = force_str(urlsafe_base64_decode(uidb64))
            # Retrieve the user based on the decoded ID
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            # Handle invalid or missing user ID
            user = None

        # Check if the user exists and the activation token is valid
        if user is not None and account_activation_token.check_token(user, token):
            # Activate the user account
            user.is_active = True
            user.save()
            
            # Render the confirmation page
            return render(request, 'confirm.html')
        else:
            # Return an error response if activation fails
            return HttpResponseBadRequest("Invalid activation link")

class ProfileAPI(generics.CreateAPIView):
    """
    API endpoint to create a new profile.
    
    This endpoint allows clients to create a new profile by providing profile data.
    """
    queryset = Profile.objects.all()  # Queryset to retrieve all profiles (unused in this endpoint)
    serializer_class = ProfileSerializer  # Serializer class to serialize/deserialize profile data

    def __init__(self, *args, **kwargs):
        """
        Initialize the ProfileAPI view.
        
        This method sets the queryset and serializer_class attributes. It's invoked when
        the ProfileAPI view is instantiated.
        """
        try:
            super().__init__(*args, **kwargs)  # Call the superclass's constructor
        except Exception as e:
            # Log an error if there's an exception during initialization
            logging.Logger.error("Failed to initialize ProfileAPI: %s", e)
            raise  # Re-raise the exception to propagate it further

class UserValidationAPI(generics.GenericAPIView):
    serializer_class = UserValidationSerializer
    queryset = User.objects.all()

    def post(self ,request ,*args ,**kwargs):
        serializer = self.get_serializer(data = request.data)
        serializer.is_valid(raise_exception=True)
        return Response({
            "success" : True
        })

class UpdateUserApi(generics.GenericAPIView):
    """
    API endpoint to update user information.

    This endpoint allows an authenticated user to update their own information.

    Request Parameters:
    - id: The ID of the user to be updated.

    Permissions:
    - User must be authenticated.
    - User must have permission to update their own profile.

    Serializer:
    - UpdateUserSer: Serializer for updating user information.
    """
    serializer_class = UpdateUserSerializer
    queryset = User.objects.all()
    permission_classes = [
        permissions.IsAuthenticated,
        IsTheSameUser,
    ]

    def post(self ,request ,*args ,**kwargs):
        """
        Handles POST requests to update user information.

        If the request is successful, returns a JSON response with the updated user data.
        If the request fails due to validation errors or other issues, returns an appropriate error response.
        """
        try:
            request_data_copy = request.data.copy()
            sex = request_data_copy.pop('sex')
            profile_data = {}
            profile_data['sex'] = sex

            user = get_object_or_404(User, id = kwargs['id'])
            self.check_object_permissions(request, user)

            user_serializer = self.get_serializer(user ,data = request.data)
            profile_serializer = UpdateProfileSerializer(user.profile ,data=profile_data)

            with transaction.atomic():
                user_serializer.is_valid(raise_exception=True)
                profile_serializer.is_valid(raise_exception=True)
                user_instance = user_serializer.save()
                profile_serializer.save()

            return Response(UserSerializer(user_instance).data)
        except Exception as e:
            print("Exception: ", e)  # Log the exception for debugging
            return Response("Failed to update user information.", status=status.HTTP_400_BAD_REQUEST)

class UpdateProfileImageApi(generics.GenericAPIView):
    """
    API endpoint to update a user's profile image.
    """
    queryset = User.objects.all()
    serializer_class = UpdateImageProfileSerializer
    permission_classes = [
        permissions.IsAuthenticated,
        IsTheSameUser
    ]

    def post(self ,request ,*args ,**kwargs):
        """
        Handle POST request to update user's profile image.

        Parameters:
        - request: The HTTP request object.
        - *args: Additional positional arguments.
        - **kwargs: Additional keyword arguments containing URL parameters.

        Returns:
        - Response containing updated user data with profile image.
        """

        # Retrieve the user object based on the provided user ID
        user = get_object_or_404(User ,id = kwargs["id"])

        # Retrieve the user's profile
        user_profile = user.profile 

        # Check permissions to ensure the authenticated user can update the profile image
        self.check_object_permissions(request , user)

        # Serialize and validate the new profile image data
        profile_serializer = self.get_serializer(user_profile ,data = request.data)
        profile_serializer.is_valid(raise_exception = True)

        # Save the updated profile image
        profile_serializer.save()

        # Return response with updated user data including profile image
        return Response({"user": UserSerializer(user).data})
    
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

    @action(detail=True)
    def posts(self, request, pk=None):
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

class FollowingPostViewSet(viewsets.GenericViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSer

    @action(detail=True, methods=['get'])
    def following_posts(self, request, *args, **kwargs):
        user_id = request.GET.get("0")
        user = get_object_or_404(User, pk=user_id)
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
    

    @action(detail=True, methods=['get'])
    def following_users(self, request, *args, **kwargs):
        user_id = request.GET.get("userId")
        if user_id is None: 
            user_id = request.GET.get("0")
        user = get_object_or_404(User, pk=user_id)
        following = user.following.all()

        if not following:
            return Response([], status=status.HTTP_200_OK)

        following_users = [follow.targetUser for follow in following]
        queryset = self.filter_queryset(following_users)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = UserSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)


class LikeViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows likes to be viewed or edited.
    """
    queryset = Like.objects.all()
    serializer_class = LikeSerializer
    permission_classes = [IsOwnerOrReadOnly]

    @action(detail=True)
    def liked_posts(self, request, pk=None):
        """
        Retrieve posts liked by a specific user.
        """
        try:
            user = get_object_or_404(User, pk=pk)
            liked_posts = Like.objects.filter(owner=user)
            post_ids = [like.post.id for like in liked_posts]
            posts = Post.objects.filter(id__in=post_ids).order_by('-createdAt')
            post_data = PostSer(posts, many=True).data
            return Response(post_data)
        except Http404:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print("Error running get_user_liked_posts:", e)
            return Response({"error": "Failed to retrieve user's liked posts"}, status=status.HTTP_400_BAD_REQUEST)
        

class SaveViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows posts to be saved, retrieved, updated, or deleted.
    """
    queryset = Save.objects.all()
    serializer_class = SaveSerializer
    permission_classes = [IsOwnerOrReadOnly]
    
    @action(detail=True)
    def saved_posts(self, request, pk=None):
        """
        Retrieve saved posts for a specific user.
        """
        try:
            user = get_object_or_404(User, pk=pk)
            saved_posts = Save.objects.filter(owner=user)
            post_ids = [save.post.id for save in saved_posts]
            posts = Post.objects.filter(id__in=post_ids).order_by('-createdAt')
            post_data = PostSer(posts, many=True).data
            return Response(post_data)
        except Http404:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print("Error from retrieving saved posts:", e)
            return Response({'error': 'Failed to retrieve saved posts.'}, status=status.HTTP_400_BAD_REQUEST)
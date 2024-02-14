from django.contrib.auth.models import User 
from rest_framework import generics ,permissions
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils.encoding import force_bytes, force_str
from rest_framework.decorators import api_view
from rest_framework import status
from django.contrib.auth import get_user_model
from django.shortcuts import redirect
from django.http import JsonResponse
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.shortcuts import render

from knox.models import AuthToken
from .email_verification import Email
from .token import account_activation_token
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib import messages


from .serializers import (
    GetUserSerializer,
    RegisterSerializer,
    LoginSerializer,
    ProfileSerializer,
    UserValidationSer,
    UpdateUserSer,
    UpdateProfileSer,
    UpdateImageProfileSer,
    ListUserSerializer

)
from .models import Profile 
from .custom_permissions import isTheSameUser


class GetUserAPI(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = GetUserSerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get_object(self):
        # Get the user_id from the URL parameter
        user_id = self.kwargs.get('user_id', None)

        # Check if user_id is provided and valid
        if user_id is not None:
            try:
                # Retrieve the user by user_id
                user = User.objects.get(id=user_id)
                return user
            except User.DoesNotExist:
                pass

        # If user_id is not provided or the user is not found, default to the currently authenticated user
        return self.request.user
    
class ListUsersAPI(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = ListUserSerializer

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)

        # Convert ordered dict to list of dicts
        serialized_data = list(map(dict, response.data))

        return response

class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self ,request , *args ,**kwargs):
        serializer = self.get_serializer(data = request.data)
        serializer.is_valid(raise_exception=True)
        username = serializer.validated_data['username']
        user = User.objects.get(username=username)

        return Response({
            'user' : GetUserSerializer(user).data,
            'token' : AuthToken.objects.create(user)[1]
        })

class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        try:
            profile_data = {"image": request.data["image"], "sex": request.data["sex"]}
            user_serializer = self.get_serializer(data=request.data)
            user_serializer.is_valid(raise_exception=True)
            user = user_serializer.save()

            # Set user as inactive upon registration
            User = get_user_model()
            User.objects.filter(pk=user.pk).update(is_active=False)

            profile_data["user"] = user.id
            prfile_serialize = ProfileSerializer(data=profile_data)
            prfile_serialize.is_valid(raise_exception=True)
            prfile_serialize.save()

            # print("This is the user obj: ", GetUserSerializer(user).data)
            # print("This is the profile obj: ", prfile_serialize.data)

            email_to = user.email

            Email.send_activation_email(request, user, email_to)

            return Response({
                'user': GetUserSerializer(user).data
            })
        except Exception as e:
            print("Exception: ", e)
            return Response({
                "da"
            })
    
class ActivationAPI(generics.GenericAPIView):

    def get(self, request, uidb64, token):
        User = get_user_model()
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and account_activation_token.check_token(user, token):
            user.is_active = True
            user.save()
            
            return render(request, 'confirm.html')
        else:
            print()

        return Response("")


class ProfileAPI(generics.CreateAPIView):
    try:
        queryset = Profile.objects.all()
        serializer_class = ProfileSerializer
    except Exception as e: 
        print("Exception: ", e)

#api to check the unique username and email
class userValidtaionApi(generics.GenericAPIView):
    serializer_class = UserValidationSer
    queryset = User.objects.all()

    @api_view(['POST'])
    def user_validtaion_api(request):
        if request.method == 'POST':
            serializer = UserValidationSer(data=request.data)
            if serializer.is_valid():
                return Response({"success": True}, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#Update User and Profile Api
class UpdateUserApi(generics.GenericAPIView):
    serializer_class = UpdateUserSer
    queryset = User.objects.all()
    permission_classes = [
        permissions.IsAuthenticated,
        isTheSameUser,
    ]

    def post(self ,request ,*args ,**kwargs):
        # get the profile chaned data
        try:
            print("Request: ", request.data)
            request_data_copy = request.data.copy()
            sex = request_data_copy.pop('sex')
            print("Sex: ", sex)
            profile_data = {}
            profile_data['sex'] = sex
            # get the user
            user = get_object_or_404(User, id = kwargs['id'])
            # check if the authenticated user is the same
            # of the targeted user ( the ones we want to change his information)
            self.check_object_permissions(request, user)
            user_serializer = self.get_serializer(user ,data = request.data)
            # validation
            profile_serializer = UpdateProfileSer(user.profile ,data=profile_data)
            user_serializer.is_valid(raise_exception=True)
            profile_serializer.is_valid(raise_exception = True)

            # if validation succed change information
            user_instance = user_serializer.save()
            profile_serializer.save()

            return Response(
                GetUserSerializer(user_instance).data
            )
        except Exception as e: 
            print("Exxx: ", e)
            return Response(
                "faIL"
            )

class UpdateProfileImageApi(generics.GenericAPIView):
    queryset = User.objects.all()
    serializer_class = UpdateImageProfileSer
    permission_classes = [
        permissions.IsAuthenticated,
        isTheSameUser
    ]

    def post(self ,request ,*args ,**kwargs):
        user = get_object_or_404(User ,id = kwargs["id"])
        u_profile = user.profile 
        self.check_object_permissions(request , user)
        p_serializer = self.get_serializer(u_profile ,data = request.data)
        p_serializer.is_valid(raise_exception = True)
        p_serializer.save()
        return Response({
            "user" : GetUserSerializer(user).data
        })
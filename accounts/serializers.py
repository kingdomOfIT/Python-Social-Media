from rest_framework import serializers 
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.models import User 
from django.contrib.auth import authenticate

import logging
# from ..follow.serializers import FollowSerializer

from .models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField(source='get_image_url')

    class Meta:
        model = Profile
        fields = ['user', 'image', 'sex', 'image_url', 'id', 'followersCount', 'followingCount']
        extra_kwargs = {
            'image': {
                'write_only': True,
            }
        }
    
    def get_image_url(self, obj):
        """
        Get the URL of the profile image.

        Parameters:
        - obj: The Profile instance.

        Returns:
        - str: The URL of the profile image.
        """
        return obj.image.url

    def create(self, validated_data):
        validated_data.pop('followersCount', None)
        validated_data.pop('followingCount', None)
        return super().create(validated_data)

class UserSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']

    def get_profile(self, obj):
        try:
            profile = getattr(obj, 'profile', None)
            if profile:
                return ProfileSerializer(profile).data
        except Exception as e:
            # Handle specific exceptions, if any
            # Log the exception for debugging purposes
            logging.Logger.exception("Error occurred while serializing profile: %s", e)
        return None

#login serializer
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        user = authenticate(username=username, password=password)
        if not user:
            raise AuthenticationFailed("Incorrect username or password. Please try again.")

        if not user.is_active:
            raise AuthenticationFailed("Your account is not active. Please verify your email to activate your account.")

        return data

#Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    image = serializers.ImageField()
    sex = serializers.CharField(required=True)

    class Meta:
        model = User 
        fields = ['username', 'password', 'email', 'first_name', 'last_name', 'image', 'sex']
        write_only_fields = ['password']
    
    def validate(self, data):
        # Check if a user with the given email already exists
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError('User with this email already exists')
        return data

    def create(self, validated_data):
        # Create the user instance with validated data
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password'],  # Password should be hashed automatically
        )
        # Set additional fields if necessary
        user.sex = validated_data['sex']
        user.image = validated_data['image']
        user.save()
        return user

#userVerificationSerializer
class UserValidationSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.CharField()

    def validate(self , data):
        user = User.objects.filter(username = data["username"])
        if user.exists() :
            raise serializers.ValidationError({"username":"Uh-oh! This username is already taken. How about trying a unique one?"})

        user = User.objects.filter(email = data["email"])
        if user.exists() :
            raise serializers.ValidationError({"email":"Uh-oh! This email is already taken. How about trying a unique one?"})

        return data
    
#User Update Serializer
class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username' ,'email' ,'first_name' ,'last_name','id']

    def validate(self ,data):
        c_user_id = self.context['request'].user.id
        user = User.objects.filter(username = data['username']).exclude(id = c_user_id)
        if user.exists() :
            raise serializers.ValidationError({'error' : 'user with this username already exists'})

        user = User.objects.filter(email = data['email']).exclude(id = c_user_id)
        if user.exists() :
            raise serializers.ValidationError({'error' : 'user with this email already exists'})
        return data

#Profile Update Serializer
class UpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['sex',]

class UpdateImageProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['image',]


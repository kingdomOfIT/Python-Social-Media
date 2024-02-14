from django.test import TestCase
from ..serializers import *
from ..models import Profile
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.exceptions import ValidationError
from PIL import Image
from io import BytesIO
from django.contrib.auth import get_user_model

class ProfileSerializerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='12345')
        
        # Create a temporary image file
        image = Image.new('RGB', (100, 100))
        image_file = BytesIO()
        image.save(image_file, 'JPEG')
        image_file.seek(0)

        self.profile = Profile.objects.create(
            user=self.user,
            sex='M',
            image=SimpleUploadedFile('test.jpg', image_file.read(), content_type='image/jpeg'),
            followers_count=10,
            following_count=20
        )
        self.serializer = ProfileSerializer(instance=self.profile)
        
    def test_contains_expected_fields(self):
        data = self.serializer.data
        self.assertEqual(set(data.keys()), set(['user', 'sex', 'image_path', 'id', 'followers_count', 'following_count']))

    def test_image_path_field_content(self):
        data = self.serializer.data
        self.assertEqual(data['image_path'], self.profile.image.url)


class GetUserSerializerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='12345', email='test@example.com', first_name='John', last_name='Doe')
        
        # Create a temporary image file
        image = Image.new('RGB', (100, 100))
        image_file = BytesIO()
        image.save(image_file, 'JPEG')
        image_file.seek(0)

        self.profile = Profile.objects.create(
            user=self.user,
            image=SimpleUploadedFile('test.jpg', image_file.read(), content_type='image/jpeg')  # Attach the image file here
        )
        self.serializer = GetUserSerializer(instance=self.user)
        
    def test_contains_expected_fields(self):
        data = self.serializer.data
        self.assertEqual(set(data.keys()), set(['id', 'username', 'email', 'first_name', 'last_name', 'profile']))

    def test_profile_field_content(self):
        data = self.serializer.data
        self.assertEqual(data['profile'], ProfileSerializer(self.profile).data)


class ListUserSerializerTest(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='user1', password='12345', email='user1@example.com', first_name='John', last_name='Doe')
        self.user2 = User.objects.create_user(username='user2', password='12345', email='user2@example.com', first_name='Jane', last_name='Doe')
        
        # Create a temporary image file for user1's profile
        image = Image.new('RGB', (100, 100))
        image_file = BytesIO()
        image.save(image_file, 'JPEG')
        image_file.seek(0)
        
        # Create a profile for user1 with the image
        self.profile1 = Profile.objects.create(
            user=self.user1,
            image=SimpleUploadedFile('test.jpg', image_file.read(), content_type='image/jpeg')
        )
        
        # Create serializers for both users
        self.serializer1 = ListUserSerializer(instance=self.user1)
        self.serializer2 = ListUserSerializer(instance=self.user2)
        
    def test_contains_expected_fields(self):
        data1 = self.serializer1.data
        data2 = self.serializer2.data
        
        self.assertEqual(set(data1.keys()), set(['id', 'username', 'email', 'first_name', 'last_name', 'profile']))
        self.assertEqual(set(data2.keys()), set(['id', 'username', 'email', 'first_name', 'last_name', 'profile']))

    def test_profile_field_exists(self):
        data1 = self.serializer1.data
        data2 = self.serializer2.data
        
        # Check if the 'profile' field exists
        self.assertIn('profile', data1)
        self.assertIn('profile', data2)

    def test_profile_field_content(self):
        data1 = self.serializer1.data
        data2 = self.serializer2.data
        
        # Check if profile data is correct for user1
        self.assertEqual(data1['profile'], ProfileSerializer(self.profile1).data)
        
        # Check if profile data is None for user2
        self.assertIsNone(data2['profile'])


class MockRequest:
    def __init__(self, data):
        self.data = data

class LoginSerializerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.serializer = LoginSerializer()
        
    def test_valid_login_data(self):
        data = {
            'username': 'testuser',
            'password': '12345'
        }
        validated_data = self.serializer.validate(data)
        self.assertEqual(data, validated_data)

    def test_invalid_login_data(self):
        data = {
            'username': 'testuser',
            'password': 'wrongpassword'
        }
        with self.assertRaises(ValidationError) as context:
            self.serializer.validate(data)
        self.assertEqual(str(context.exception.detail[0]), "Make sure that email and password are correct and verified.")

User = get_user_model()

class RegisterSerializerTest(TestCase):
    def setUp(self):
        self.valid_data = {
            'username': 'testuser',
            'password': 'testpassword',
            'email': 'test@example.com',
            'first_name': 'John',
            'last_name': 'Doe',
            'image': None,
            'sex': 'M'
        }
        self.serializer = RegisterSerializer()
        
    def test_valid_registration_data(self):
        validated_data = self.serializer.validate(self.valid_data)
        self.assertEqual(self.valid_data, validated_data)

    def test_invalid_registration_duplicate_email(self):
        # Create a user with the same email
        User.objects.create_user(username='existing_user', email='test@example.com')
        
        with self.assertRaises(ValidationError) as context:
            self.serializer.validate(self.valid_data)
        
        self.assertEqual(str(context.exception.detail[0]), 'user with this email already exists')

    def test_create_user(self):
        # Ensure that a new user is created when calling the create method
        user = self.serializer.create(self.valid_data)
        self.assertIsNotNone(user)
        self.assertEqual(user.username, self.valid_data['username'])
        self.assertEqual(user.email, self.valid_data['email'])
        self.assertEqual(user.first_name, self.valid_data['first_name'])
        self.assertEqual(user.last_name, self.valid_data['last_name'])


class UserValidationSerTest(TestCase):
    def setUp(self):
        # Create a user for testing
        self.existing_user = User.objects.create_user(username='existing_user', email='existing@example.com')
        self.serializer = UserValidationSer()

    def test_valid_data(self):
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com'
        }
        validated_data = self.serializer.validate(data)
        self.assertEqual(data, validated_data)

    def test_invalid_username_taken(self):
        # Try to validate with an existing username
        data = {
            'username': 'existing_user',
            'email': 'newuser@example.com'
        }
        with self.assertRaises(ValidationError) as context:
            self.serializer.validate(data)
        self.assertEqual(context.exception.detail, {"username": "Uh-oh! This username is already taken. How about trying a unique one?"})

    def test_invalid_email_taken(self):
        # Try to validate with an existing email
        data = {
            'username': 'newuser',
            'email': 'existing@example.com'
        }
        with self.assertRaises(ValidationError) as context:
            self.serializer.validate(data)
        self.assertEqual(context.exception.detail, {"email": "Uh-oh! This email is already taken. How about trying a unique one?"})


class UpdateProfileSerTest(TestCase):
    def setUp(self):
        # Create a user and profile for testing
        self.user = User.objects.create_user(username='testuser', email='test@example.com')
        self.profile = Profile.objects.create(user=self.user, sex='M')
        self.serializer = UpdateProfileSer(instance=self.profile)

    def test_valid_data(self):
        data = {
            'sex': 'Female'
        }
        validated_data = self.serializer.validate(data)
        self.assertEqual(data, validated_data)

    # def test_invalid_data(self):
    #     # Try to update with invalid data
    #     data = {
    #         'sex': 'Invalid'  # Invalid value
    #     }
    #     with self.assertRaises(ValidationError) as context:
    #         self.serializer.validate(data)
    #     print("Halve: ", context)
    #     self.assertEqual(context.exception.detail, {'sex': ['"Invalid" is not a valid choice.']})

class UpdateImageProfileSerTest(TestCase):
    def setUp(self):
        # Create a user and profile for testing
        self.user = User.objects.create_user(username='testuser', email='test@example.com')
        self.profile = Profile.objects.create(user=self.user, image='path/to/image.jpg')
        self.serializer = UpdateImageProfileSer(instance=self.profile)

    def test_valid_data(self):
        data = {
            'image': 'new_path/to/image.jpg'
        }
        validated_data = self.serializer.validate(data)
        self.assertEqual(data, validated_data)

    # def test_invalid_data(self):
    #     # Try to update with invalid data
    #     data = {
    #         'image': ''  # Empty value
    #     }
    #     with self.assertRaises(ValidationError) as context:
    #         self.serializer.validate(data)
    #     print("Halve: ", context)
    #     self.assertEqual(context.exception.detail, {'image': ['This field may not be blank.']})
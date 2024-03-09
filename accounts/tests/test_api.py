from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from django.core import mail
from django.core.files.uploadedfile import SimpleUploadedFile
from ..api import *
from PIL import Image
from io import BytesIO

from django.contrib.auth import get_user_model
from django.test import Client
from ..token import account_activation_token
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str

class GetUserAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.user2 = User.objects.create_user(username='testuser2', password='testpassword2')
        self.client.force_authenticate(user=self.user)

    def test_get_user_without_user_id(self):
        self.assertTrue(self.user.is_authenticated)

        response = self.client.get(reverse('get_user'))

        self.assertEqual(response.status_code, 200)

        self.assertEqual(response.data['id'], self.user.id)
        self.assertEqual(response.data['username'], self.user.username)

    def test_get_user_with_user_id(self):
        another_user = User.objects.create_user(username='anotheruser', password='testpassword')

        response = self.client.get(reverse('get_user_by_id', kwargs={'user_id': another_user.id}))

        self.assertEqual(response.status_code, 200)

        self.assertEqual(response.data['id'], another_user.id)
        self.assertEqual(response.data['username'], another_user.username)

    def test_list_users_api(self):
        # Make a GET request to the ListUsersAPI
        response = self.client.get(reverse('list_users'))

        # Check if the response status code is 200 (OK)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check if the expected users are present in the response data
        self.assertEqual(len(response.data), 2)  # Assuming there are only 2 users in the database
        self.assertEqual(response.data[0]['username'], 'testuser')
        self.assertEqual(response.data[1]['username'], 'testuser2')
        # Add more assertions as needed
        
class TestLoginAPI(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.login_url = reverse('log-in')

    def test_login_api(self):
        # Prepare the credentials to be sent in the POST request
        credentials = {'username': 'testuser', 'password': 'testpassword'}

        # Make a POST request to the login endpoint
        response = self.client.post(self.login_url, credentials, format='json')

        # Check if the response status code is 200 (OK)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check if the response contains the expected keys
        self.assertIn('user', response.data)
        self.assertIn('token', response.data)

        # Check if the returned user data matches the logged-in user
        self.assertEqual(response.data['user']['username'], 'testuser')

        # Check if the token is present in the response
        self.assertIn('token', response.data)

class TestRegisterAPI(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')

    def test_register_api(self):
        # Create a temporary image file
        image = Image.new('RGB', (100, 100))
        image_file = BytesIO()
        image.save(image_file, 'JPEG')
        image_file.seek(0)

        # Make a POST request with image file data
        response = self.client.post(self.register_url, 
                                    {'username': 'testuser', 
                                     'password': 'Pass123!', 
                                     'email': 'amirkahriman4@gmail.com', 
                                     'first_name': 'Thery', 
                                     'last_name': 'Korisnik', 
                                     'image': SimpleUploadedFile('test.jpg', image_file.read(), content_type='image/jpeg'), 
                                     'sex': 'male'
                                     })

        # Assert the response status code
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check if the user is created successfully
        self.assertTrue(User.objects.filter(username='testuser').exists())

        # Check if the user is set as inactive upon registration
        user = User.objects.get(username='testuser')
        self.assertFalse(user.is_active)

        # Check if the activation email is sent
        self.assertEqual(len(mail.outbox), 1)  # Assuming only one email is sent
        self.assertEqual(mail.outbox[0].to, ['amirkahriman4@gmail.com'])
        # Add more assertions as needed for the email content, subject, etc.

class ActivationAPITest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = get_user_model().objects.create_user(username='testuser', email='test@example.com', password='testpassword')

    def test_activation_api(self):
        # Generate an activation token for the test user
        token = account_activation_token.make_token(self.user)

        # Generate a base64 encoded uid for the test user
        uidb64 = urlsafe_base64_encode(force_bytes(self.user.pk))

        # Make a GET request to the ActivationAPI
        response = self.client.get(reverse('activate', kwargs={'uidb64': uidb64, 'token': token}))

        # Check if the user is activated
        self.assertTrue(get_user_model().objects.get(username='testuser').is_active)

        # Check if the response status code is 200 (OK) or 302 (redirect)
        self.assertIn(response.status_code, [200, 302])

        # Check if the confirmation template is rendered
        self.assertTemplateUsed(response, 'confirm.html')



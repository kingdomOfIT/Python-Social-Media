from io import BytesIO
from PIL import Image

from django.contrib.auth.models import User
from django.core import mail
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, RequestFactory, Client
from django.urls import reverse
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

from rest_framework import status
from rest_framework.test import APIClient, force_authenticate

from follow.models import Follow
from ..api import *
from ..token import account_activation_token


class GetUserAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.user2 = User.objects.create_user(username='testuser2', password='testpassword2')
        self.client.force_authenticate(user=self.user)

    def test_get_user_without_user_id(self):
        response = self.client.get(reverse('get_user'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['id'], self.user.id)
        self.assertEqual(response.data['username'], self.user.username)

    def test_get_user_with_user_id(self):
        another_user = User.objects.create_user(username='anotheruser', password='testpassword')
        response = self.client.get(reverse('get_user_by_id', kwargs={'id': another_user.id}))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['id'], another_user.id)
        self.assertEqual(response.data['username'], another_user.username)

    def test_list_users_api(self):
        response = self.client.get(reverse('list_users'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['username'], 'testuser')
        self.assertEqual(response.data[1]['username'], 'testuser2')

class TestLoginAPI(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.login_url = reverse('log-in')

    def test_login_api(self):
        credentials = {'username': 'testuser', 'password': 'testpassword'}
        response = self.client.post(self.login_url, credentials, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('user', response.data)
        self.assertIn('token', response.data)
        self.assertEqual(response.data['user']['username'], 'testuser')
        self.assertIn('token', response.data)

class TestRegisterAPI(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')

    def test_register_api(self):
        image = Image.new('RGB', (100, 100))
        image_file = BytesIO()
        image.save(image_file, 'JPEG')
        image_file.seek(0)

        response = self.client.post(self.register_url, 
                                    {'username': 'testuser', 
                                     'password': 'Pass123!', 
                                     'email': 'amirkahriman4@gmail.com', 
                                     'first_name': 'Thery', 
                                     'last_name': 'Korisnik', 
                                     'image': SimpleUploadedFile('test.jpg', image_file.read(), content_type='image/jpeg'), 
                                     'sex': 'male'
                                     })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(User.objects.filter(username='testuser').exists())
        user = User.objects.get(username='testuser')
        self.assertFalse(user.is_active)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].to, ['amirkahriman4@gmail.com'])

class ActivationAPITest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = get_user_model().objects.create_user(username='testuser', email='test@example.com', password='testpassword')

    def test_activation_api(self):
        token = account_activation_token.make_token(self.user)
        uidb64 = urlsafe_base64_encode(force_bytes(self.user.pk))
        response = self.client.get(reverse('activate', kwargs={'uidb64': uidb64, 'token': token}))
        self.assertTrue(get_user_model().objects.get(username='testuser').is_active)
        self.assertIn(response.status_code, [200, 302])
        self.assertTemplateUsed(response, 'confirm.html')

class FollowAPITestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.client = APIClient()
        self.user1 = User.objects.create_user(username='user1', email='user1@example.com', password='password')
        self.user2 = User.objects.create_user(username='user2', email='user2@example.com', password='password')

    def test_following_posts(self):
        url = f'/user/{self.user1.id}/following_posts/'
        data = {'0': self.user1.id}
        self.client.force_login(self.user1)
        response = self.client.get(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_following_users(self):
        url = f'/user/{self.user1.id}/following_users/'
        data = {'userId': self.user1.id}
        self.client.force_login(self.user1)
        response = self.client.get(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class PostViewSetTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(username='testuser', password='12345')
        cls.post = Post.objects.create(title='Test Post', content='Test content', owner=cls.user)

    def setUp(self):
        self.factory = RequestFactory()

    def test_get_user_posts(self):
        view = PostViewSet.as_view({'get': 'posts'})
        request = self.factory.get(f'#/user/{self.user.pk}/user_posts/')
        force_authenticate(request, user=self.user)
        response = view(request, pk=self.user.pk)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

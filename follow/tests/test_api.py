from django.contrib.auth.models import User
from django.test import TestCase, RequestFactory
from rest_framework import status
from rest_framework.test import APIClient
from ..models import Follow
from accounts.models import Profile

class FollowAPITestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.client = APIClient()
        self.user1 = User.objects.create_user(username='user1', email='user1@example.com', password='password')
        self.user2 = User.objects.create_user(username='user2', email='user2@example.com', password='password')

    def test_create_follow(self):

        url = '/follow/'
        data = {'targetUser': self.user2.id, 'requesterUser': self.user1.id}
        self.client.force_authenticate(user=self.user1)
        self.user1.profile = Profile.objects.create(user=self.user1)
        self.user2.profile = Profile.objects.create(user=self.user2)

        response = self.client.post(url, data)

        if response.status_code != status.HTTP_201_CREATED:
            print("Response data:", response.data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Follow.objects.filter(requesterUser=self.user1, targetUser=self.user2).exists())



    def test_delete_follow(self):
        follow = Follow.objects.create(requesterUser=self.user1, targetUser=self.user2)
        self.user1.profile = Profile.objects.create(user=self.user1)
        self.user2.profile = Profile.objects.create(user=self.user2)

        url = '/follow/delete_follow/'
        data = {'user_id': self.user1.id, 'target_user_id': self.user2.id}
        self.client.force_login(self.user1)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(Follow.objects.filter(requesterUser=self.user1, targetUser=self.user2).exists())

    def test_following_posts(self):
        url = '/follow/following_posts/'
        data = {'0': self.user1.id}
        self.client.force_login(self.user1)
        response = self.client.get(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_following_users(self):
        url = '/follow/following_users/'
        data = {'userId': self.user1.id}
        self.client.force_login(self.user1)
        response = self.client.get(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

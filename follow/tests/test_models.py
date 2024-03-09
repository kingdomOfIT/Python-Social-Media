from django.test import TestCase
from django.contrib.auth.models import User
from ..models import Follow
from django.utils import timezone

class FollowModelTestCase(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='user1', email='user1@example.com', password='password')
        self.user2 = User.objects.create_user(username='user2', email='user2@example.com', password='password')

    def test_follow_creation(self):
        follow = Follow.objects.create(requesterUser=self.user1, targetUser=self.user2)
        self.assertIsNotNone(follow)
        self.assertIsNotNone(follow.id)
        self.assertEqual(follow.requesterUser, self.user1)
        self.assertEqual(follow.targetUser, self.user2)
        self.assertIsNotNone(follow.createdAt)
        self.assertIsNotNone(follow.updatedAt)
        self.assertTrue(timezone.now() - follow.createdAt < timezone.timedelta(seconds=1))
        self.assertTrue(timezone.now() - follow.updatedAt < timezone.timedelta(seconds=1))

from django.test import TestCase
from django.contrib.auth.models import User
from ..models import Follow
from django.utils import timezone

class FollowModelTest(TestCase):

    def setUp(self):
        self.user1 = User.objects.create_user(username='user1', password='password')
        self.user2 = User.objects.create_user(username='user2', password='password')

    def test_follow_creation(self):
        follow = Follow.objects.create(requesterUser=self.user1, targetUser=self.user2)
        
        # Check if the timestamps are set correctly
        self.assertIsNotNone(follow.createdAt)
        self.assertIsNotNone(follow.updatedAt)
        
        # Check if the requester and target users are set correctly
        self.assertEqual(follow.requesterUser, self.user1)
        self.assertEqual(follow.targetUser, self.user2)

    def test_follow_creation_without_requester(self):
        # Attempt to create a follow without specifying the requester user
        with self.assertRaises(ValueError):
            Follow.objects.create(targetUser=self.user2)

    def test_follow_creation_without_target(self):
        # Attempt to create a follow without specifying the target user
        with self.assertRaises(ValueError):
            Follow.objects.create(requesterUser=self.user1)

    def test_follow_update_timestamp(self):
        follow = Follow.objects.create(requesterUser=self.user1, targetUser=self.user2)
        
        # Save the timestamp before updating
        old_updated_at = follow.updatedAt

        # Update the follow
        follow.save()

        # Check if the updatedAt timestamp has changed
        self.assertNotEqual(follow.updatedAt, old_updated_at)

from django.test import TestCase
from django.contrib.auth.models import User
from ..models import Profile

class ProfileModelTest(TestCase):
    def setUp(self):
        # User for testing purposes
        self.user = User.objects.create_user(username='testuser', password='testpassword')

    def test_create_profile(self):
        # Creating a profile instance
        profile = Profile.objects.create(
            image='test/image.jpg',
            sex='male',
            user=self.user
        )

        # Retrieve the profile from the database
        saved_profile = Profile.objects.get(user=self.user)

        # Check if the retrieved profile matches the created profile
        self.assertEqual(saved_profile.image, 'test/image.jpg')
        self.assertEqual(saved_profile.sex, 'male')
        self.assertEqual(saved_profile.user, self.user)
        self.assertEqual(saved_profile.followers_count, 0)
        self.assertEqual(saved_profile.following_count, 0)

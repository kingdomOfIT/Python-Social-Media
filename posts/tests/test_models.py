from django.test import TestCase
from django.contrib.auth.models import User
from django.utils import timezone
from ..models import Post 

class PostModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Set up non-modified objects used by all test methods
        user = User.objects.create_user(username='testuser', password='12345')
        Post.objects.create(title='Test Post', content='Test content', owner=user)

    def test_post_creation(self):
        post = Post.objects.get(id=1)
        self.assertEqual(post.title, 'Test Post')
        self.assertEqual(post.content, 'Test content')
        self.assertEqual(post.owner.username, 'testuser')

    def test_post_timestamps(self):
        post = Post.objects.get(id=1)
        # Check if p_date is set on creation
        self.assertIsNotNone(post.p_date)
        # Ensure p_date and u_date are set to the same value on creation
        self.assertEqual(post.p_date, post.u_date)
        # Simulate an update
        post.title = 'Updated Test Post'
        post.save()
        self.assertLessEqual((post.u_date - post.p_date).total_seconds(), 1)

    def test_post_str_method(self):
        post = Post.objects.get(id=1)
        self.assertEqual(str(post.title), 'Test Post')

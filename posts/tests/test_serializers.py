from django.contrib.auth.models import User
from django.test import TestCase
from ..models import Post 
from ..serializers import PostSer
from rest_framework.exceptions import ValidationError

class PostSerializerTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Set up non-modified objects used by all test methods
        user = User.objects.create(username='testuser', password='12345')
        cls.post = Post.objects.create(title='Test Post', content='Test content', owner=user)

    def test_serializer_fields(self):
        serializer = PostSer(instance=self.post)
        data = serializer.data
        self.assertEqual(set(data.keys()), {'id', 'title', 'content', 'owner', 'comments_count', 'likes_count', 'delikes_count', 'likes', 'saves', 'u_date', 'p_date'})

    def test_owner_field(self):
        serializer = PostSer(instance=self.post)
        self.assertIn('username', serializer.data['owner'])
        self.assertEqual(serializer.data['owner']['username'], 'testuser')

    def test_comments_count_field(self):
        serializer = PostSer(instance=self.post)
        self.assertEqual(serializer.data['comments_count'], 0)  # Assuming no comments are added yet

    def test_likes_count_field(self):
        serializer = PostSer(instance=self.post)
        self.assertEqual(serializer.data['likes_count'], 0)  # Assuming no likes are added yet

    def test_delikes_count_field(self):
        serializer = PostSer(instance=self.post)
        self.assertEqual(serializer.data['delikes_count'], 0)  # Assuming no dislikes are added yet

    def test_likes_field(self):
        serializer = PostSer(instance=self.post)
        self.assertEqual(serializer.data['likes'], [])  # Assuming no likes are added yet

    def test_saves_field(self):
        serializer = PostSer(instance=self.post)
        self.assertEqual(serializer.data['saves'], [])  # Assuming no saves are added yet

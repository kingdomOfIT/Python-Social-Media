from django.contrib.auth.models import User
from django.test import RequestFactory, TestCase
from ..models import Post  # Replace 'myapp' with the actual name of your Django app
from ..api import PostViewSet
from rest_framework.test import APIRequestFactory, force_authenticate

class PostViewSetTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Set up non-modified objects used by all test methods
        cls.user = User.objects.create_user(username='testuser', password='12345')
        cls.post = Post.objects.create(title='Test Post', content='Test content', owner=cls.user)

    def setUp(self):
        # Every test needs access to the request factory.
        self.factory = RequestFactory()

    def test_get_user_posts(self):
        view = PostViewSet.as_view({'get': 'get_user_posts'})
        request = self.factory.get('/#/get_user_posts/')
        force_authenticate(request, user=self.user)
        response = view(request, pk=self.user.pk)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)  # Assuming only one post for the user

    def test_create_post(self):
        view = PostViewSet.as_view({'post': 'create'})
        data = {'title': 'New Post', 'content': 'New content'}
        request = self.factory.post('/#/posts/', data)
        force_authenticate(request, user=self.user)
        response = view(request)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Post.objects.count(), 2)  # Assuming one post already exists
        self.assertEqual(Post.objects.last().title, 'New Post')

    def test_get_single_post(self):
        view = PostViewSet.as_view({'get': 'retrieve'})
        request = self.factory.get('/#/posts/1/')
        force_authenticate(request, user=self.user)
        response = view(request, pk=self.post.pk)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['title'], 'Test Post')

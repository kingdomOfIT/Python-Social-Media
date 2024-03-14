from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from ..models import Comment
from post.models import Post

from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from ..models import Like, Save


class CommentViewSetTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password123')
        self.post = Post.objects.create(title='Test Post', content='This is a test post', owner=self.user)

    def test_create_comment(self):
        self.client.force_authenticate(user=self.user)
        url = '/comment/'
        data = {
            'content': 'Test comment',
            'post': self.post.id
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comment.objects.count(), 1)
        self.assertEqual(Comment.objects.get().content, 'Test comment')
        self.assertEqual(Comment.objects.get().owner, self.user)

    def test_update_comment(self):
        comment = Comment.objects.create(content='Initial comment', post=self.post, owner=self.user)
        self.client.force_authenticate(user=self.user)
        url = f'/comment/{comment.id}/'
        updated_data = {
            'content': 'Updated comment'
        }
        response = self.client.patch(url, updated_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(Comment.objects.get().content, 'Updated comment')

class LikeViewSetTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password123')
        self.post = Post.objects.create(title='Test Post', content='This is a test post', owner=self.user)

    def test_create_like(self):
        self.client.force_authenticate(user=self.user)
        url = '/like/'
        data = {'post': self.post.id, 'like': True}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(Like.objects.exists())
        self.assertEqual(Like.objects.first().owner, self.user)
        self.assertEqual(Like.objects.first().post, self.post)

    def test_delete_like(self):
        like = Like.objects.create(owner=self.user, post=self.post, like=False)
        self.client.force_authenticate(user=self.user)
        url = f'/like/{like.id}/'
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(Like.objects.exists())

class SaveViewSetTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password123')
        self.post = Post.objects.create(title='Test Post', content='This is a test post', owner=self.user)

    def test_create_save(self):
        self.client.force_authenticate(user=self.user)
        url = '/save/'
        data = {'post': self.post.id, "is_saved": True}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(Save.objects.exists())
        self.assertEqual(Save.objects.first().owner, self.user)
        self.assertEqual(Save.objects.first().post, self.post)

    def test_delete_save(self):
        save = Save.objects.create(owner=self.user, post=self.post, is_saved=False)
        self.client.force_authenticate(user=self.user)
        url = f'/save/{save.id}/'
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(Save.objects.exists())



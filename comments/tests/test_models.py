from django.test import TestCase
from django.contrib.auth.models import User
from posts.models import Post
from ..models import Comment, Like, Save

class CommentModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.post = Post.objects.create(title='Test Post', content='Test Content', owner=self.user)

    def test_comment_creation(self):
        comment = Comment.objects.create(owner=self.user, post=self.post, content='Test Comment')
        self.assertTrue(isinstance(comment, Comment))

    def test_like_creation(self):
        like = Like.objects.create(owner=self.user, post=self.post, like=True)
        self.assertTrue(isinstance(like, Like))

    def test_save_creation(self):
        self.save = Save.objects.create(owner=self.user, post=self.post, is_saved=True)
        self.assertTrue(isinstance(self.save, Save))

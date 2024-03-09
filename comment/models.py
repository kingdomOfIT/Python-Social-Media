from django.db import models
from django.contrib.auth.models import User 
from post.models import Post 
from django.utils import timezone

# Create your models here.
class Comment(models.Model):
    owner = models.ForeignKey(User, on_delete = models.CASCADE, related_name='comments')
    post = models.ForeignKey(Post, on_delete = models.CASCADE, related_name='comments')
    content = models.TextField()
    createdAt = models.DateTimeField(editable=False ,null = True)
    updatedAt = models.DateTimeField(null = True)

    def save(self, *args, **kwargs):
        ''' On save, update timestamps '''
        if not self.id:
            self.createdAt = timezone.now()
        self.updatedAt = timezone.now()
        return super(Comment, self).save(*args, **kwargs)


class Like(models.Model):
    owner = models.ForeignKey(User, on_delete = models.CASCADE, related_name='likes')
    post = models.ForeignKey(Post, on_delete = models.CASCADE, related_name='likes' )
    like = models.BooleanField()

class Save(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saves')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='saves')
    is_saved = models.BooleanField()
    
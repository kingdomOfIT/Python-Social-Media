from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Post(models.Model):
    title = models.CharField(max_length= 112)
    content = models.TextField()
    owner = models.ForeignKey(User ,on_delete = models.CASCADE)
    createdAt = models.DateTimeField(editable=False ,null=True)
    updatedAt = models.DateTimeField(null=True)

    def save(self, *args, **kwargs):
        ''' On save, update timestamps '''
        if not self.id:
            self.createdAt = timezone.now().replace(microsecond=0)
        self.updatedAt = timezone.now().replace(microsecond=0) 
        return super(Post, self).save(*args, **kwargs)
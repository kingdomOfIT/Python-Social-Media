from django.db import models
from django.contrib.auth.models import User
import uuid

# Create your models here.
    
class Interest(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    
    def __str__(self):
        return self.name
    
class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    profileImg = models.ImageField(upload_to='profile_images', default='blank-profile-picture.png')
    interests = models.ManyToManyField(Interest)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now = True)
    
    def __str__(self):
        return self.user.username

class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    interests = models.ManyToManyField(Interest)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now = True)
    
    def __str__(self):
        return self.title + " ->>> " + self.description
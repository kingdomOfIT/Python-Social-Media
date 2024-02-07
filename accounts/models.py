from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Profile(models.Model):
    image = models.ImageField(upload_to="images" ,blank = True)
    sex = models.CharField(max_length = 112)
    user = models.OneToOneField(User , on_delete=models.CASCADE)
    followers_count = models.IntegerField(default=0)
    following_count = models.IntegerField(default=0)

    def __str__(self):
        return self.user.username
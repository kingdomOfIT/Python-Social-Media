from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import uuid

class Follow(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    requesterUser = models.ForeignKey(User, related_name='following', on_delete=models.CASCADE)
    targetUser = models.ForeignKey(User, related_name='followers', on_delete=models.CASCADE)
    createdAt = models.DateTimeField(auto_now_add=True, editable=False, null=True)
    updatedAt = models.DateTimeField(auto_now_add=True, null=True)

    def create(self, *args, **kwargs):
        ''' On create, update timestamps '''
        if not self.id:
            self.createdAt = timezone.now()
        self.updatedAt = timezone.now()

        return super(Follow, self).save(*args, **kwargs)

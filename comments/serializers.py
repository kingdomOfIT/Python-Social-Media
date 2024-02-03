from rest_framework import serializers 

from .models import Comment 
from .models import Like
from .models import Save
from accounts.serializers import GetUserSerializer

class CommentSer(serializers.ModelSerializer):
    owner = serializers.SerializerMethodField()
    class Meta():
        model = Comment 
        fields = '__all__'
        read_only_fields = ['owner','u_date','p_date']
    
    def get_owner(self ,obj):
        return GetUserSerializer(obj.owner).data

class CommentUpdateSer(serializers.ModelSerializer):
    owner = serializers.SerializerMethodField()
    class Meta():
        model = Comment 
        fields = '__all__'
        read_only_fields = ['post','owner','u_date','p_date']

    def get_owner(self ,obj):
        return GetUserSerializer(obj.owner).data

# like serializer 
class LikeSer(serializers.ModelSerializer):
    class Meta():
        model = Like 
        fields = '__all__'
        read_only_fields = ['owner',]
    
    def validate(self ,data):
        owner_id = self.context['request'].user.id
        post = data['post']

        like = Like.objects.filter(owner = owner_id ,post = post.id)
        if like.exists():
            raise serializers.ValidationError("this like with this user and post already exists")
        return data


# like Update serializer 
class LikeUpdateSer(serializers.ModelSerializer):
    class Meta():
        model = Like 
        fields = '__all__'
        read_only_fields = ['owner','post']


class SaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Save 
        fields = '__all__'
        read_only_fields = ['owner']

    def create(self, validated_data):
        owner = self.context['request'].user
        post = validated_data.get('post')
        is_saved = validated_data.get('is_saved', True)
        
        # Ensure the Save instance is created with the owner, post, and is_saved
        save_instance = Save.objects.create(owner=owner, post=post, is_saved=is_saved)
        
        return save_instance

    def validate(self, data):
        owner_id = self.context['request'].user.id
        post = data.get('post')

        save = Save.objects.filter(owner=owner_id, post=post.id)
        if save.exists():
            raise serializers.ValidationError("Save already exists with the same user and post")

        return data


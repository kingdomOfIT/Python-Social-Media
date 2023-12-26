from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import Post, Profile

class RegisterForm(UserCreationForm):
    email = forms.EmailField(required=True)
    
    class Meta: 
        model = User
        fields = ["username", "email", "password1", "password2"]
        
    def save(self, commit=True):
        user = super(RegisterForm, self).save(commit=False)
        user_profile = Profile(user=user)
        
        if commit:
            user.save()
            user_profile.save()

        return user
        
class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ["title", "description", "interests"]
        
class OnboardingForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ["bio", "interests"]
from django.shortcuts import render, redirect
from .forms import RegisterForm, PostForm, OnboardingForm
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required, permission_required
from .models import Post, Profile
from django.contrib.auth.models import User, Group
from django.shortcuts import get_object_or_404

# Create your views here.
@login_required(login_url="/login")
def home(request):
    posts = Post.objects.all()
    
    if request.method == "POST":
        postID = request.POST.get("post-id")
        userID = request.POST.get("user-id")
        
        if "delete-post" in request.POST:
            post = Post.objects.filter(id=request.POST.get("delete-post")).first()
            
            if post and (post.author == request.user or request.user.has_perm("main.delete_post")):
                post.delete()
            elif post and post.author != request.user:
                pass #potrebno završiti report post-a
            
        elif "update-post" in request.POST:
            print("Just calling updatePost")
            postID = request.POST.get("update-post")
            post = Post.objects.filter(id=postID).first()

            if post:
                # Retrieve the new title from the form
                print("Req: ", request.POST)
                newTitle = request.POST.get("update-title")
                print("New title: ", newTitle)
                newDescription = request.POST.get("update-description")

                # Update the post with the new title
                post.title = newTitle
                post.description = newDescription
                print("New post obj: ", post)
                post.save()
            
        elif userID:
            user = User.objects.filter(id=userID).first()
            
            if user and request.user.is_staff:
                try:
                    group = Group.objects.get(name="default")
                    group.user_set.remove(user)
                except:
                    pass
                
                try:  
                    group = Group.objects.get(name="modereator")
                    group.user_set.remove(user)
                except:
                    pass
        
    return render(request, 'main/home.html', {"posts": posts})

@login_required(login_url="/login")
@permission_required("main.add_post", login_url="/login", raise_exception=True)
def create_post(request):
    if request.method == "POST":
        form = PostForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            post.save()
            
            # Get the interests from the form and save them for the post
            interests = form.cleaned_data.get('interests')
            post.interests.set(interests)
            
            return redirect("/home")
    else: 
        form = PostForm
    return render(request, 'main/createPost.html',{"form": form} )

def sign_up(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('/onboarding')
    else:
        form = RegisterForm()
    
    return render(request, 'registration/sign_up.html', {"form": form})

def onboarding(request):
    
    profile_instance = get_object_or_404(Profile, user=request.user)
     
    if request.method == 'POST':
        form = OnboardingForm(request.POST, instance=profile_instance)
        if form.is_valid():
            form.save()
            return redirect('/home')
    else:
        form = OnboardingForm(instance=profile_instance)

    return render(request, 'main/onboarding.html', {'form': form})

def someone(request):
    return render('main/someone.html')
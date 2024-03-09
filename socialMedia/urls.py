from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path("",include("frontend.urls")),
    path('auth/',include('accounts.urls')),
    path('posts/',include('post.urls')),
    path('comments/',include('comment.urls')),
    path('likes/',include('comment.likes_url')),
    path('save/',include('comment.save_url')),
    path('follow/',include('follow.urls')),
    path('account/',include('allauth.urls')),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    import debug_toolbar
    urlpatterns += [path('__debug__/', include(debug_toolbar.urls))]
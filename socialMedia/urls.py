from django.conf import settings
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.static import serve
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),
    path("",include("frontend.urls")),
    path('auth/',include('accounts.urls')),
    path('user/',include('accounts.user_urls')),
    path('users/',include('accounts.users_urls')),
    path('post/',include('post.urls')),
    path('comment/',include('comment.urls')),
    path('like/',include('comment.likes_url')),
    path('save/',include('comment.save_url')),
    path('follow/',include('follow.urls')),
    path('account/',include('allauth.urls')),
    path('api/schema', SpectacularAPIView.as_view(), name="schema"),
    path('api/schema/docs', SpectacularSwaggerView.as_view(url_name="schema")),
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    import debug_toolbar
    urlpatterns += [path('__debug__/', include(debug_toolbar.urls))]
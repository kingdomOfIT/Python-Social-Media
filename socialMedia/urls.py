from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),
    path("",include("frontend.urls")),
    path('auth/',include('accounts.urls')),
    path('post/',include('post.urls')),
    path('comment/',include('comment.urls')),
    path('like/',include('comment.likes_url')),
    path('save/',include('comment.save_url')),
    path('follow/',include('follow.urls')),
    path('account/',include('allauth.urls')),
    path('api/schema', SpectacularAPIView.as_view(), name="schema"),
    path('api/schema/docs', SpectacularSwaggerView.as_view(url_name="schema"))
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    import debug_toolbar
    urlpatterns += [path('__debug__/', include(debug_toolbar.urls))]
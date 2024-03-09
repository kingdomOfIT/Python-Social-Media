from django.test import SimpleTestCase
from django.urls import reverse, resolve
from ..api import *
from knox.urls import views as knoxviews

class TestUrls(SimpleTestCase):
    def test_get_user_url(self):
        url = reverse('get_user')
        self.assertEquals(resolve(url).func.view_class, GetUserAPI)

    def test_list_users_url(self):
        url = reverse('list_users')
        self.assertEquals(resolve(url).func.view_class, ListUsersAPI)

    def test_get_user_by_id_url(self):
        id = 123
        url = reverse('get_user_by_id', args=[id])

        self.assertEquals(resolve(url).func.view_class, GetUserAPI)

    def test_log_in_url(self):
        url = reverse('log-in')
        self.assertEquals(resolve(url).func.view_class, LoginAPI)

    def test_register_url(self):
        url = reverse('register')
        self.assertEquals(resolve(url).func.view_class, RegisterAPI)

    def test_log_out_url(self):
        url = reverse('log-out')
        self.assertEquals(resolve(url).func.view_class, knoxviews.LogoutView)

    def test_profile_url(self):
        url = reverse('profile')
        self.assertEquals(resolve(url).func.view_class, ProfileAPI)

    def test_validation_url(self):
        url = reverse('validation')
        self.assertEquals(resolve(url).func.view_class, UserValidationAPI)

    def test_update_user_url(self):
        id = 123
        url = reverse('update-user', args=[id])
        self.assertEquals(resolve(url).func.view_class, UpdateUserApi)

    def test_update_user_image_url(self):
        id = 123
        url = reverse('update-user-image', args=[id])

        self.assertEquals(resolve(url).func.view_class, UpdateProfileImageApi)

    def test_activate_url(self):
        uidb64 = 'sample_uidb64'
        token = 'sample_token'

        url = reverse('activate', args=[uidb64, token])

        # Check if the resolved view class matches ActivationAPI
        self.assertEquals(resolve(url).func.view_class, ActivationAPI)


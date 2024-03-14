from django.template.loader import render_to_string
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from .token import account_activation_token
from django.core.mail import EmailMessage
from django.contrib import messages

class Email:
    @staticmethod
    def send_activation_email(request, user, to_email):
        print("Trenutni sajt: ", get_current_site(request))
        print("Trenutna domena: ", get_current_site(request).domain)
        try:
            mail_subject = "Activate your user account."
            message = render_to_string("template_activate_account.html", {
                'user': user.username,
                'domain': get_current_site(request).domain,
                'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                'token': account_activation_token.make_token(user),
                "protocol": 'https' if request.is_secure() else 'http'
            })
            email = EmailMessage(mail_subject, message, to=[to_email])
            email.content_subtype = "html"
            email.send()
        except Exception as e:
            print("Error sending activation email:", e)
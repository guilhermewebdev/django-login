from django.apps import AppConfig


class AuthenticationConfig(AppConfig):
    name = 'authentication'
    default_site = 'authentication.admin.Site'

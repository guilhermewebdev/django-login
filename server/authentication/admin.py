from django.contrib import admin

class Site(admin.AdminSite):
    site_header = 'Dabozz'
    login_template = 'login.html'

system = Site(name='system')
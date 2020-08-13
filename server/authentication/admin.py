from django.contrib import admin

class Site(admin.AdminSite):
    site_header = 'Dabozz'

system = Site(name='system')
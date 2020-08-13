from django.contrib import admin

class Site(admin.AdminSite):
    pass

system = Site(name='system')
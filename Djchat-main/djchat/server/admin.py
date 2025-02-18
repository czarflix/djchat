from django.contrib import admin

from .models import Category, Channel, Message, Server

# Register your models here.

admin.site.register(Category)
admin.site.register(Server)
admin.site.register(Channel)
admin.site.register(Message)

from django.conf import settings
from django.db import models
from django.dispatch import receiver
from django.shortcuts import get_object_or_404

from .validators import validate_icon_image_extension, validate_icon_image_size


# Create your models here.
def category_icon_upload_path(instance, filename):
    return f"category/{instance.id}/category_icon/{filename}"


def server_banner_upload_path(instance, filename):
    return f"server/{instance.id}/server_banner/{filename}"


def server_icon_upload_path(instance, filename):
    return f"server/{instance.id}/server_icon/{filename}"


class Category(models.Model):
    name = models.CharField(max_length=80)
    description = models.TextField(null=True, blank=True)
    icon = models.FileField(null=True, blank=True, upload_to=category_icon_upload_path)

    def __str__(self):
        return self.name

    # This in case if the category icon is being updated, then delete the old icon and save the new one
    def save(self, *args, **kwargs):
        # Incase if the category is being updated
        if self.id:
            existing = get_object_or_404(Category, id=self.id)
            # If the icon is being updated, then delete the old one
            if existing.icon != self.icon:
                existing.icon.delete(save=False)
        self.name = self.name.lower()
        super(Category, self).save(*args, **kwargs)

    # This in case if the category is being deleted, then delete the icon from local storage
    @receiver(models.signals.pre_delete, sender="server.Category")
    def delete_category_icon(sender, instance, **kwargs):
        # Loop through the fields of the model
        for field in instance._meta.fields:
            # If the field is the icon field
            if field.name == "icon":
                # Get the file from the field
                file = getattr(instance, field.name)
                if file:
                    file.delete(save=False)


class Server(models.Model):
    name = models.CharField(max_length=150)
    description = models.TextField(null=True, blank=True)
    banner = models.ImageField(
        null=True,
        blank=True,
        upload_to=server_banner_upload_path,
        validators=[validate_icon_image_extension, validate_icon_image_size],
    )
    icon = models.ImageField(
        null=True,
        blank=True,
        upload_to=server_icon_upload_path,
        validators=[validate_icon_image_extension, validate_icon_image_size],
    )

    # Relation is one to many (one server can have many users), So foreign key is in the many side
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="server_owner"
    )

    # Many to many relation (one server can have many categories and one category can have many servers)
    categories = models.ManyToManyField(Category, related_name="categories")

    # Many to many relation (one server can have many members and one member can have many servers)
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="server_members")

    # This in case if the server icon is being updated, then delete the old icon and save the new one
    def save(self, *args, **kwargs):
        # Incase if the server is being updated
        if self.id:
            existing = get_object_or_404(Server, id=self.id)
            # If the icon is being updated, then delete the old one
            if existing.icon != self.icon:
                existing.icon.delete(save=False)
            if existing.banner != self.banner:
                existing.banner.delete(save=False)

        super(Server, self).save(*args, **kwargs)

    # This in case if the category is being deleted, then delete the icon from local storage
    @receiver(models.signals.pre_delete, sender="server.Server")
    def delete_server_icon(sender, instance, **kwargs):
        # Loop through the fields of the model
        for field in instance._meta.fields:
            # If the field is the icon field
            if field.name == "icon":
                # Get the file from the field
                file = getattr(instance, field.name)
                if file:
                    file.delete(save=False)
            # If the field is the banner field
            if field.name == "banner":
                # Get the file from the field
                file = getattr(instance, field.name)
                if file:
                    file.delete(save=False)

    def __str__(self):
        return self.name


class Channel(models.Model):
    name = models.CharField(max_length=150)
    description = models.TextField(null=True, blank=True)
    topic = models.CharField(max_length=150, null=True, blank=True)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="channel_owner"
    )

    # one to many relation (one server can have many channels)
    server = models.ForeignKey(Server, on_delete=models.CASCADE, related_name="channel_server")

    def __str__(self):
        return self.name

    # lower case the name before saving
    def save(self, *args, **kwargs):
        self.name = self.name.lower()
        super(Channel, self).save(*args, **kwargs)


class Message(models.Model):
    content = models.TextField()
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="message_sender"
    )
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE, related_name="message_channel")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.sender} - {self.content}"

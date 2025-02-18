import os

from django.core.exceptions import ValidationError
from PIL import Image


def validate_icon_image_size(image):
    if image:
        with Image.open(image) as img:
            width, height = img.size
            if width < 400 or height < 400:
                raise ValidationError(f"Image size must be greater than 400x400, but you uploaded {width}x{height}")


def validate_icon_image_extension(image):
    extension = os.path.splitext(image.name)[1]
    valid_extensions = [".png", ".jpg", ".jpeg", ".svg"]
    if extension.lower() not in valid_extensions:
        raise ValidationError(
            f"Image extension must be one of the following: {valid_extensions} But you uploaded {extension}"
        )

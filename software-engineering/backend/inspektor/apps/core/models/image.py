from django.db import models

from inspektor.apps.core.models import Case


def get_image_path(instance, filename):
    """
    Specify a dynamic path for uploaded images.
    Args:
        instance: ImageField instance
        filename: name of the uploaded file

    Returns: path to the uploaded file

    """
    return f"all/{instance.case.id}/{filename}"


class Image(models.Model):
    """
    An image captured during an inspection process. This is the main artifact that is actually inspected for defects
    so it is actually a proxy for the object being inspected.
    """

    case = models.ForeignKey(
        Case, on_delete=models.CASCADE, related_name="images", blank=True, null=True
    )
    capture_datetime = models.DateTimeField()
    file = models.ImageField(upload_to=get_image_path)

    class Meta:
        db_table = "image"

    def __str__(self):
        return f"Image name: {self.file.name} and id: {self.id} "

    def delete(self, *args, **kwargs):
        """
        Delete the file from the storage when the object is deleted
        """
        self.file.delete()
        super().delete(*args, **kwargs)

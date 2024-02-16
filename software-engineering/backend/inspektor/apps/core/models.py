from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.utils import timezone


class Case(models.Model):
    """
    A case represents a single inspection process/run. It can contain multiple images and multiple inspection results but
    relates to a single inspection object. So for example if you are inspecting batches of screws you would create
    one case for each batch and generate multiple images and inspection results for each case.
    """

    open_datetime = models.DateTimeField(editable=False, blank=True, null=True)
    close_datetime = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = "case"

    def save(self, *args, **kwargs):
        """On save, update timestamps"""
        if self.pk is None:
            self.open_datetime = timezone.now()
        return super().save(*args, **kwargs)

    def __str__(self):
        return f"Case {self.id} opened on {self.open_datetime}"


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


class Inspection(models.Model):
    """
    The results of the Inspection algorithm applied to an image.

    """

    # Related Image will be a FK
    image = models.ForeignKey(
        Image,
        on_delete=models.CASCADE,
        related_name="inspections",
        blank=True,
        null=True,
    )
    inspection_time = models.DateTimeField()
    inspection_result = models.BooleanField()
    inspection_errors = ArrayField(
        models.CharField(max_length=120, blank=True),
        size=10,
    )

    class Meta:
        db_table = "inspection"

    def __str__(self):
        return f"Image {self.image.id} inspection is: {self.inspection_result} with {self.inspection_errors}"

    def delete(self, *args, **kwargs):
        """
        Delete the file from the storage when the object is deleted
        """
        self.file.delete()
        super().delete(*args, **kwargs)

    def save(self, *args, **kwargs):
        self.inspection_time = timezone.now()
        return super().save(*args, **kwargs)

from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.utils import timezone

from inspektor.apps.core.models.image import Image


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

    def save(self, *args, **kwargs):
        self.inspection_time = timezone.now()
        return super().save(*args, **kwargs)

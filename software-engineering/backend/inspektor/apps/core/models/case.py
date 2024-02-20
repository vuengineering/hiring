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

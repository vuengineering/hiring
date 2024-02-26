from inspektor.apps.core import models
from django.contrib import admin


@admin.register(models.Case)
class CaseAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "open_datetime",
        "close_datetime",
    )


@admin.register(models.Image)
class ImageAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "file",
        "case",
        "capture_datetime",
    )
    list_filter = ("case",)

@admin.register(models.InspectionResult)
class ResultAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "part_number",
        "inspector",
        "inspection_date",
        "passed",
    )

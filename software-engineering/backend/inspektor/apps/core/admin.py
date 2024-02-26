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


@admin.register(models.Result)
class ResultAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "image",
        "result",
        "status",
    )
    list_filter = ("image", "status")

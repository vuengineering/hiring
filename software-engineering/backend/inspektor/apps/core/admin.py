from django.utils.html import format_html

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


# New section for Inspections on admin UI
@admin.register(models.Inspection)
class InspectionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "image",
        "inspection_result",
        "inspection_time",
        "show_errors",
    )

    # Format inspection errors column for rendering.
    def show_errors(self, obj):
        return format_html("<br>".join(obj.inspection_errors))

    list_filter = ("image",)

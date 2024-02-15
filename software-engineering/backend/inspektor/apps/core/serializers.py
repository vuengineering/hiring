from inspektor.apps.core import models
from rest_framework import serializers
from rest_framework.parsers import MultiPartParser


class CaseSerializer(serializers.ModelSerializer):
    images = serializers.PrimaryKeyRelatedField(
        many=True, queryset=models.Image.objects.all(), required=False, allow_null=True
    )
    all_photos_in_class_zero = serializers.BooleanField(
        read_only=True, allow_null=False
    )

    class Meta:
        model = models.Case
        fields = "__all__"


class ImageSerializer(serializers.ModelSerializer):
    case = serializers.PrimaryKeyRelatedField(
        queryset=models.Case.objects.all(), required=False, allow_null=True
    )
    file = serializers.models.ImageField()

    class Meta:
        model = models.Image
        fields = "__all__"
        read_only_fields = ("image_class",)
        parser_classes = [MultiPartParser]

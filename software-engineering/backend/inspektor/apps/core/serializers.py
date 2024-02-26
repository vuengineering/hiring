from inspektor.apps.core import models
from rest_framework import serializers
from rest_framework.parsers import MultiPartParser


class CaseSerializer(serializers.ModelSerializer):
    images = serializers.PrimaryKeyRelatedField(
        many=True, queryset=models.Image.objects.all(), required=False, allow_null=True
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
        parser_classes = [MultiPartParser]

class ResultSerializer(serializers.ModelSerializer):
    passed = serializers.PrimaryKeyRelatedField(
        queryset=models.InspectionResult.objects.all(), required=False, allow_null=True
    )

    class Meta:
        model = models.InspectionResult
        fields = "__all__"
        parser_classes = [MultiPartParser]

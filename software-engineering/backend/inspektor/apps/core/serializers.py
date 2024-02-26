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
    status = serializers.SerializerMethodField()

    class Meta:
        model = models.Result
        fields = ["id", "image", "status", "result"]

    def get_status(self, obj):
        """
        returns the status value in human readable form

        Returns:
            string: "In progress", "Pass" or "Fail"
        """
        return obj.get_status()


class ImageResultSerializer(ImageSerializer):
    results = ResultSerializer(read_only=True)

    class Meta:
        model = models.Image
        fields = "__all__"


class CaseResultSerializer(serializers.ModelSerializer):
    images = ImageResultSerializer(many=True, read_only=True)

    class Meta:
        model = models.Case
        fields = "__all__"

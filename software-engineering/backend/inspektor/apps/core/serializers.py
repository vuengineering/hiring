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


class InspectionSerializer(serializers.ModelSerializer):
    image = serializers.PrimaryKeyRelatedField(
        queryset=models.Image.objects.all(), required=False, allow_null=True
    )
    inspection_result = serializers.models.BooleanField()

    class Meta:
        model = models.Inspection
        fields = "__all__"


class ImageSerializer(serializers.ModelSerializer):
    case = serializers.PrimaryKeyRelatedField(
        queryset=models.Case.objects.all(), required=False, allow_null=True
    )
    file = serializers.models.ImageField()

    # Object[] --> Get field "inspections" containing all related inspection objects.
    inspections = InspectionSerializer(many=True, required=False, allow_null=True)

    # int[] --> Get field "inspections" containing all related inspection ids.
    # inspections = serializers.PrimaryKeyRelatedField(
    #     many=True,
    #     queryset=models.Inspection.objects.all(),
    #     required=False,
    #     allow_null=True,
    # )

    # Conditional inspections value depending on url param
    # inspections = serializers.SerializerMethodField()
    # def get_inspections(self, img):
    #     include_extra_data = self.context.get('show_extra_data', False)
    #     if include_extra_data:
    #         return InspectionSerializer(img.inspections, many=True).data

    class Meta:
        model = models.Image
        fields = "__all__"
        parser_classes = [MultiPartParser]

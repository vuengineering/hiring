from django_filters import rest_framework as filters
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework.decorators import action
from rest_framework import viewsets
from rest_framework.response import Response


from inspektor.apps.core import models, serializers
from inspektor.apps.ml.tasks import run_inference_on_image


class IdInFilter(filters.FilterSet):
    """
    Filter that allows filtering by a list of IDs.
    """

    id = filters.BaseInFilter(field_name="id")

    class Meta:
        fields = ["id"]


class ModelViewSetWithIds(viewsets.ModelViewSet):
    """
    A base viewset that allows reading (and enables filtering objects by ids), creating and updating objects.
    """

    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = IdInFilter
    permission_classes = ()


class CaseViewSet(ModelViewSetWithIds):
    queryset = models.Case.objects.all()
    serializer_class = serializers.CaseSerializer
    model_class = models.Case

    @extend_schema(
        responses=serializers.CaseResultSerializer,
    )
    @action(detail=True, methods=["get"], url_path="result")
    def result(self, request, *args, **kwargs):
        """
        Display the Case result
        """
        instance = self.get_object()
        return Response(serializers.CaseResultSerializer(instance).data)


@extend_schema_view(
    create=extend_schema(request={"multipart/form-data": serializers.ImageSerializer})
)
class ImageViewSet(ModelViewSetWithIds):
    queryset = models.Image.objects.all()
    serializer_class = serializers.ImageSerializer
    model_class = models.Image

    def perform_create(self, serializer):
        image = serializer.save()
        # ↓↓↓ this is where the magic should happen ↓↓↓
        run_inference_on_image(image)

    @extend_schema(
        responses=serializers.ImageResultSerializer,
    )
    @action(detail=True, methods=["get"], url_path="result")
    def result(self, request, *args, **kwargs):
        """
        Display the result
        """
        instance = self.get_object()
        return Response(serializers.ImageResultSerializer(instance).data)

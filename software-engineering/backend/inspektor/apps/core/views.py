from django_filters import rest_framework as filters
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import viewsets

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
    ModelViewSet provides default create, retrieve, update, partial_update, destroy and list actions since it uses
    GenericViewSet and all the available mixins.
    Then, after you register the view to the router, you can:
        + Create an item and list all the items
        + Retrieve, update, and delete a single item
    """

    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = IdInFilter
    permission_classes = ()


class CaseViewSet(ModelViewSetWithIds):
    queryset = models.Case.objects.all()
    serializer_class = serializers.CaseSerializer
    model_class = models.Case


@extend_schema_view(
    create=extend_schema(request={"multipart/form-data": serializers.ImageSerializer})
)
class ImageViewSet(ModelViewSetWithIds):
    queryset = models.Image.objects.all()
    serializer_class = serializers.ImageSerializer
    model_class = models.Image

    # Returns a dictionary containing any extra context that should be supplied to the serializer. Defaults to including
    # 'request', 'view' and 'format' keys.
    # def get_serializer_context(self):
    #     context = super().get_serializer_context()
    #     context.update({"show_extra_data": self.request.query_params.get('show_extra_data', False)})
    #     return context

    # Called by CreateModelMixin when saving a new object instance
    def perform_create(self, serializer):
        image = serializer.save()
        # ↓↓↓ this is where the magic should happen ↓↓↓
        run_inference_on_image(image)


class InspectionViewSet(ModelViewSetWithIds):
    queryset = models.Inspection.objects.all()
    serializer_class = serializers.InspectionSerializer
    model_class = models.Inspection

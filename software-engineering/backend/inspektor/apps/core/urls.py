from inspektor.apps.core import views
from django.urls import include, path
from rest_framework.routers import DefaultRouter

app_name = "inspektor.apps.core"

router = DefaultRouter()
router.register("case", views.CaseViewSet, basename="case")
router.register("image", views.ImageViewSet, basename="image")
router.register("result", views.ResultViewSet, basename="result")


urlpatterns = [path("", include(router.urls))]

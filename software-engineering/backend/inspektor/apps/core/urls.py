from inspektor.apps.core import views
from django.urls import include, path
from rest_framework.routers import DefaultRouter

app_name = "inspektor.apps.core"

router = DefaultRouter()

# Register views for all models
router.register(r"case", views.CaseViewSet, basename="case")
router.register(r"image", views.ImageViewSet, basename="image")
router.register(r"inspection", views.InspectionViewSet, basename="inspection")

urlpatterns = [path("", include(router.urls))]

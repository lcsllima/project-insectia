from django.urls import path, include, re_path
from rest_framework import routers, permissions

# from drf_yasg.views import get_schema_view
# from drf_yasg import openapi

from .views import InsectImageViewSet, AnalyzeStatusViewSet

router = routers.DefaultRouter()
router.register(r'insect-images', InsectImageViewSet)
router.register(r'analyze-status', AnalyzeStatusViewSet)


urlpatterns = [
    path('apis/', include(router.urls)),
]
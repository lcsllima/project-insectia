from django.shortcuts import render
from rest_framework import viewsets
from .models import InsectImage, AnalyzeStatus
from .serializers import InsectImageSerializer, AnalyzeStatusSerializer

class InsectImageViewSet(viewsets.ModelViewSet):
    queryset = InsectImage.objects.all()
    serializer_class = InsectImageSerializer

class AnalyzeStatusViewSet(viewsets.ModelViewSet):
    queryset = AnalyzeStatus.objects.all()
    serializer_class = AnalyzeStatusSerializer

    def get_queryset(self):
        queryset = AnalyzeStatus.objects.all()
        email = self.request.query_params.get('email', None)
        if email is not None:
            queryset = queryset.filter(email=email)
        return queryset

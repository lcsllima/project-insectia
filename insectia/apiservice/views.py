from django.shortcuts import render
from rest_framework import viewsets
from .models import InsectImage
from .serializers import InsectImageSerializer

class InsectImageViewSet(viewsets.ModelViewSet):
    queryset = InsectImage.objects.all()
    serializer_class = InsectImageSerializer

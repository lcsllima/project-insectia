from django.shortcuts import render
from rest_framework import viewsets
from .models import InsectImage, AnalyzeStatus, ScrapedContent
from .serializers import InsectImageSerializer, AnalyzeStatusSerializer, ScrapedContentSerializer
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics
from bs4 import BeautifulSoup
import requests
from rest_framework.response import Response
from rest_framework import status

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

class WikipediaScrapeView(viewsets.ViewSet):
    serializer_class = ScrapedContentSerializer

    def list(self, request):
        # Get the title from the query parameters, e.g., ?title=Lib%C3%A9lula
        title = request.query_params.get('title', None)

        if title:
            try:
                # Try to get the scraped content from the database
                scraped_content = ScrapedContent.objects.get(title=title)
                serializer = ScrapedContentSerializer(scraped_content)
                return Response(serializer.data)

            except ScrapedContent.DoesNotExist:
                # If the content is not in the database, scrape it from Wikipedia
                url = f"https://pt.wikipedia.org/wiki/{title}"
                response = requests.get(url)

                if response.status_code == 200:
                    soup = BeautifulSoup(response.text, 'html.parser')
                    page_content = str(soup.find('div', {'id': 'bodyContent'}))

                    scraped_content = ScrapedContent(title=title, content=page_content)
                    scraped_content.save()

                    serializer = ScrapedContentSerializer(scraped_content)
                    return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response({"detail": "Title not found or invalid title parameter."}, status=status.HTTP_400_BAD_REQUEST)
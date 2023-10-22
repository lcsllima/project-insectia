from django.contrib import admin
from .models import InsectImage, Insect, AnalyzeStatus, ScrapedContent

# Register your models here.
admin.site.register(InsectImage)
admin.site.register(Insect)
admin.site.register(AnalyzeStatus)
admin.site.register(ScrapedContent)

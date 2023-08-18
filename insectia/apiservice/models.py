from django.db import models

class InsectImage(models.Model):
    image = models.ImageField(upload_to='images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

class Insect(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ForeignKey(InsectImage, on_delete=models.CASCADE, related_name='insect_image')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
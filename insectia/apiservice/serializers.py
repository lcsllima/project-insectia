from rest_framework import serializers
from .models import Insect, InsectImage

class InsectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = InsectImage
        fields = ('id', 'image', 'uploaded_at')

    def get_fields(self, *args, **kwargs):
        fields = super(InsectImageSerializer, self).get_fields(*args, **kwargs)
        fields['image'] = serializers.ImageField(max_length=None, allow_empty_file=False, use_url=True)
        return fields
from rest_framework import serializers
from .models import Insect, InsectImage, AnalyzeStatus
import threading


# import numpy as np
# import tensorflow as tf
# from tensorflow.keras.applications import InceptionV3
# from tensorflow.keras.models import Sequential
# from tensorflow.keras.layers import Dense, Embedding, LSTM
# from tensorflow.keras.preprocessing.image import load_img, img_to_array
# from tensorflow.keras.preprocessing.text import Tokenizer
# from tensorflow.keras.preprocessing.sequence import pad_sequences
# from tensorflow.keras.models import Model
# from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
# from tensorflow.keras.applications.inception_v3 import preprocess_input
# from tensorflow.keras.preprocessing import image

# Lock para evitar que duas threads acessem o mesmo recurso ao mesmo tempo
lock = threading.Lock()
# base_model = InceptionV3(weights='imagenet', include_top=False)

class InsectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = InsectImage
        fields = ('id', 'image', 'uploaded_at')

    def get_fields(self, *args, **kwargs):
        fields = super(InsectImageSerializer, self).get_fields(*args, **kwargs)
        fields['image'] = serializers.ImageField(max_length=None, allow_empty_file=False, use_url=True)
        return fields
    
    def create(self, validated_data):
        # Gerar um novo AnalyzeStatus
        email_exist = self.context['request'].data['email']
        image_content = self.context['request'].data['image']
        if email_exist:
            email_content = email_exist

        analyze_status = AnalyzeStatus.objects.create(status='pending', email=email_content)
        analyze_status.save()

        # Cria uma nova thread para processar a imagem
        thread = threading.Thread(target=processar_imagem_com_o_modelo, args=(image_content, analyze_status))

        return InsectImage.objects.create(**validated_data)
    
class AnalyzeStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalyzeStatus
        fields = ('id', 'status', 'email', 'created_at', 'updated_at')
    
    def get_fields(self, *args, **kwargs):
        fields = super(AnalyzeStatusSerializer, self).get_fields(*args, **kwargs)
        fields['status'] = serializers.CharField(max_length=100)
        fields['email'] = serializers.CharField(max_length=100)
        return fields

# Mudar o nome da função para algo que faça mais sentido
def processar_imagem_com_o_modelo(image):
    pass
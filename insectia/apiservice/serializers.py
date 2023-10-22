from rest_framework import serializers
from .models import Insect, InsectImage, AnalyzeStatus, ScrapedContent
import threading

import numpy as np

import matplotlib.pyplot as plt

import torch, os
from PIL import Image
import torch.nn as nn
import torchvision
import torch.optim as optim
import torchvision.transforms as transforms
from torchvision.datasets import ImageFolder
from torchvision import transforms, models

# Carregar o modelo previamente treinado
model_path = '/insectia/apiservice/trained_models/model_4.pth'
classes = ['Borboleta', 'Gafanhoto', 'Joaninha', 'Libélula', 'Mosquito']

from PIL import Image
import torch
from torchvision import transforms


model = torchvision.models.resnet18(weights="IMAGENET1K_V1")
model.fc = nn.Linear(512, 5)  # Certifique-se de definir num_classes de acordo com o número de classes em seu modelo

# Carregar os pesos do modelo treinado
model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
model.eval()

# Função para processar a imagem e retornar a classe reconhecida
def processar_imagem_com_o_modelo_e_retornar(image_path):
    # Carregar a imagem
    img = Image.open(image_path)

    # Aplicar as transformações
    transform = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.5], std=[0.5]),
        transforms.Resize((224, 224), antialias=True)
    ])
    img = transform(img)
    img = img.unsqueeze(0)  # Adicionar uma dimensão para simular um lote com uma única imagem

    # Realizar a previsão
    with torch.no_grad():
        output = model(img)
        _, predicted = torch.max(output.data, 1)

    # Retornar o nome da classe prevista
    return classes[predicted.item()]  # Certifique-se de ter definido a lista 'classes' anteriormente

# Agora você pode usar a função processar_imagem_com_o_modelo_e_retornar para prever a classe da imagem



# Lock para evitar que duas threads acessem o mesmo recurso ao mesmo tempo
# lock = threading.Lock()


class InsectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = InsectImage
        fields = ('id', 'image', 'uploaded_at')

    def get_fields(self, *args, **kwargs):
        fields = super(InsectImageSerializer, self).get_fields(*args, **kwargs)
        fields['image'] = serializers.ImageField(max_length=None, allow_empty_file=False, use_url=True)
        fields['predicted_class'] = serializers.CharField(max_length=100, read_only=True) # predicted_class é read_only
        return fields
    
    def create(self, validated_data):
        # Gerar um novo AnalyzeStatus
        email_content = None
        # Confere se existe o data['email']
        if 'email' in self.context['request'].data:
            email_exist = self.context['request'].data['email']
            if email_exist:
                email_content = email_exist
        image_content = self.context['request'].data['image']

        # Atualizar o instance com o predicted_class para o usuário, antes de retornar  (InsectImage)
        predicted_class = processar_imagem_com_o_modelo_e_retornar(image_content)
        validated_data['predicted_class'] = predicted_class

        # Salvar a instancia com a classe predita
        instance = super(InsectImageSerializer, self).create(validated_data) # Cria nosso item, mas é interessante quando for usar a thread
        insect_image_id = instance.id

        return instance

        # return InsectImage.objects.create(**validated_data)
    
class AnalyzeStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalyzeStatus
        fields = ('id', 'status', 'email', 'created_at', 'updated_at')
    
    def get_fields(self, *args, **kwargs):
        fields = super(AnalyzeStatusSerializer, self).get_fields(*args, **kwargs)
        fields['status'] = serializers.CharField(max_length=100)
        fields['email'] = serializers.CharField(max_length=100)
        return fields

class ScrapedContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScrapedContent
        fields = '__all__'

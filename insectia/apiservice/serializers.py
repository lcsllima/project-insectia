from rest_framework import serializers
from .models import Insect, InsectImage, AnalyzeStatus
import threading


from PIL import Image
import torch
import torchvision.transforms as transforms
from torchvision.datasets import ImageFolder
import torch.nn as nn

import os

class InsectClassifier(nn.Module):
    def __init__(self, num_classes):
        super(InsectClassifier, self).__init__()
        
        # Camadas convolucionais
        self.conv_layers = nn.Sequential(
            nn.Conv2d(in_channels=3, out_channels=16, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2),
            nn.Conv2d(in_channels=16, out_channels=32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2),
        )
        
        # Camadas totalmente conectadas
        self.fc_layers = nn.Sequential(
            nn.Linear(32 * 56 * 56, 128),  # Correção no tamanho do tensor de entrada
            nn.ReLU(),
            nn.Linear(128, num_classes)
        )
    def forward(self, x):
        x = self.conv_layers(x)
        x = x.view(x.size(0), -1)  # Achatando o tensor para a camada totalmente conectada
        x = self.fc_layers(x)
        return x


# Lock para evitar que duas threads acessem o mesmo recurso ao mesmo tempo
lock = threading.Lock()


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


        # ------ Teste --------
        # Aqui estive usando uma thread, talvez nem seja necessário, já que o modelo por hora está respondendo em menos de 1 segundo

        # analyze_status = AnalyzeStatus.objects.create(status='pending', email=email_content)
        # analyze_status.save()

        # instance = super(InsectImageSerializer, self).create(validated_data) # Cria nosso item, mas é interessante quando for usar a thread
        # insect_image_id = instance.id

        # Cria uma nova thread para processar a imagem
        # thread = threading.Thread(target=processar_imagem_com_o_modelo, args=(image_content, insect_image_id, analyze_status.id))
        

        # ------ Teste -------- 
        # se o desempenho do modelo for satisfátório em tempo de resposta, não é necessário usar thread

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


def processar_imagem_com_o_modelo_e_retornar(image_path):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    # Caminho para a pasta que contém as subpastas das classes
    data_dir = "/insectia/apiservice/model_classes"

    # Define as transformações para pré-processamento das imagens
    data_transforms = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    # Carrega os dados usando ImageFolder
    dataset = ImageFolder(data_dir, transform=data_transforms)

    # Carregar o modelo treinado
    model = InsectClassifier(3)
    model.load_state_dict(torch.load("/insectia/apiservice/trained_models/modelo_treinado.pth"))
    model.to(device)
    model.eval()

    # Carregar e pré-processar a imagem de entrada
    # image = Image.open('/insectia/images/google334.jpg').convert("RGB") # Está com hardcode para teste, remover e usar o parâmtro image_path
    image = Image.open(image_path).convert("RGB")
    # image = Image.open(image_path).convert("RGB")
    data_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    input_image = data_transform(image).unsqueeze(0).to(device)

    # Fazer a previsão
    with torch.no_grad():
        outputs = model(input_image)
        predicted_class = torch.argmax(outputs, dim=1).item()

    # Mapear o índice da classe para o nome da classe
    class_names = dataset.classes

    return class_names[predicted_class]


def processar_imagem_com_o_modelo(image_path, insect_image_id, analyze_status_id):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    # Caminho para a pasta que contém as subpastas das classes
    data_dir = "/insectia/apiservice/model_classes"

    # Define as transformações para pré-processamento das imagens
    data_transforms = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    # Carrega os dados usando ImageFolder
    dataset = ImageFolder(data_dir, transform=data_transforms)

    # Carregar o modelo treinado
    model = InsectClassifier(3)
    model.load_state_dict(torch.load("/insectia/apiservice/trained_models/modelo_treinado.pth"))
    model.to(device)
    model.eval()

    # Carregar e pré-processar a imagem de entrada
    # image = Image.open('/insectia/images/google334.jpg').convert("RGB") # Está com hardcode para teste, remover e usar o parâmtro image_path
    image = Image.open(image_path).convert("RGB")
    # image = Image.open(image_path).convert("RGB")
    data_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    input_image = data_transform(image).unsqueeze(0).to(device)

    # Fazer a previsão
    with torch.no_grad():
        outputs = model(input_image)
        predicted_class = torch.argmax(outputs, dim=1).item()

    # Mapear o índice da classe para o nome da classe
    class_names = dataset.classes
    predicted_class_name = class_names[predicted_class]

    # Atualizar o AnalyzeStatus
    with lock:
        analyze_status = AnalyzeStatus.objects.get(id=analyze_status_id)
        analyze_status.status = 'done'
        analyze_status.save()
        # Atualizar o InsectImage
        insect_image = InsectImage.objects.get(id=insect_image_id)
        insect_image.predicted_class = predicted_class_name
        insect_image.save()

    return predicted_class_name

    # print(f"A imagem pertence à classe: {predicted_class_name}")


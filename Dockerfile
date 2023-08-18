FROM python:3.9

# não mostrar logs do buffer
# ENV PYTHONUNBUFFERED 1

# diretório de trabalho do contêiner
WORKDIR /insectia

COPY requirements.txt /insectia/

# Instalação das dependências definidas no requirements.txt
RUN pip install -r requirements.txt

# Copiamos o diretório atual para o conteiner
COPY . /insectia/
import React, { useState } from 'react';
import './ImageUploadForm.css'

const ImageUploadForm = () => {
  const [responseMessage, setResponseMessage] = useState('');


  window.onload = function() {

    const uploadLabel = document.querySelector('label[for="image-input"]');
    const fileInput = document.querySelector('#image-input');
    const imagePreview = document.getElementById('image-preview');
  
    uploadLabel.addEventListener("dragover", function (e) {
      e.preventDefault();
    });

    uploadLabel.addEventListener("drop", function (e) {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imagePreview.classList.remove('hidden');
                imagePreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
  

  
    fileInput.addEventListener('change', function() {
      const file = this.files[0];
  
      if(file) {
        const reader = new FileReader();
  
        reader.onload = function(e) {
          imagePreview.classList.remove('hidden');
          imagePreview.src = e.target.result;
        };
  
        reader.readAsDataURL(fileInput.files[0]);
      }
    });
  }
 
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // Adicionamos um elemento com a class loader
    const loader = document.createElement('div');
    loader.classList.add('loader');
    document.querySelector('.wrapper-form').appendChild(loader);

    const formData = new FormData(e.target);
    
    try {
      const response = await fetch("http://localhost:8000/apis/insect-images/", {
        method: "POST",
        body: formData,
      });

      

      const responseData = await response.json();
      setResponseMessage(responseData.message);     

      const response_result = responseData.predicted_class // Inserir o nome da classe em wrapper result 
      const wrapper_result = document.querySelector('.wrapper.api-result');

      if (wrapper_result != null) {
        // Se o response já não foi removido
        if(wrapper_result.classList.contains('no-response')) {
          wrapper_result.classList.toggle('no-response');
        }

        const result_placeholder = document.querySelector('.result-placeholder');
        result_placeholder.innerText = response_result;
        // Removemos o loader
        loader.remove();

      } else {
        console.log('wrapper_result is null')
        // Removemos o loader 
        loader.remove();
      }


      
    } catch (error) {
      console.error(error);
      setResponseMessage('Ocorreu um erro ao enviar a imagem.');
      loader.remove();
    }
  };

  return (
    <div className="main">
        <div className="wrapper-form">
          <div className="wrapper">
            <div className="wrapper-text">
              <h1>Upload de Imagem</h1>
              <p>Envie uma imagem de um inseto para o servidor.</p>
            </div>
          </div>
          <form onSubmit={handleFormSubmit} encType="multipart/form-data">
            {/* <fieldset>
              <legend htmlFor="image">Imagem</legend>
              <img id="image-preview" src="#" alt="" />
              <input id="image-input" type="file" name="image" accept="image/*" />
            </fieldset> */}

            <fieldset>
              <legend htmlFor="image">Imagem</legend>
              <div className="wrapper-image-description">
                <label htmlFor="image-input" className="custom-upload-button" draggable="true">
                    <img id="image-preview"  className="hidden" src="#" alt=""/>
                    Clique ou arraste uma imagem para fazer upload
                </label>
                <input id="image-input" type="file" name="image" accept="image/*"/>
                <p className="upload-instructions">Formatos suportados: JPG, PNG, GIF, etc.</p>
              </div>
            </fieldset>
            <fieldset className="hidden">
              <legend htmlFor="email">E-mail</legend>
              <input type="email" name="email" />
            </fieldset>
            <button className="btn btn-submit" type="submit">Identificar</button>
          </form>
          <div>{responseMessage}</div>
          </div>
          {/* <div className="wallpaper-deepmind"><img id="deepmind-wpp" src="/pexels-google-deepmind-18069365.jpg"></img> </div>
          */}
          {/* <div className="form-background"></div> */}

          <div className="wrapper api-result no-response">
            <div className="wrapper-text">
              <h3>Se trata de um:</h3>
              <h2 className="result-placeholder"></h2>
            </div>
          </div>
    </div>
  );
};

export default ImageUploadForm;

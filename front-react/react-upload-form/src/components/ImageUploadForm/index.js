import React, { useState } from 'react';
import './ImageUploadForm.css'

const ImageUploadForm = () => {
  const [responseMessage, setResponseMessage] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    console.log(formData);
    try {
      const response = await fetch("http://localhost:8000/apis/insect-images/", {
        method: "POST",
        body: formData,
      });

      

      const responseData = await response.json();
      // Console log do response da api
      console.log(responseData);
      setResponseMessage(responseData.message);

      //       Object { id: 48, image: "http://localhost:8000/uploaded/images/google138.jpg", uploaded_at: "2023-09-03T23:11:07.933292Z", predicted_class: "Dragonfly" }
      // index.js:23

      // Gerar um função que a cada 30 segundos verifica se a imagem já foi processada
      // Usando o URL do http://localhost:8000/apis/analyze-status/ com o email do usuário


      // Usar o responseData para gerar uma div com o nome da "predicted_class"
      // E então, fazer um "toggle" (remover) a classe no-response que esconde o wrapper
      
      // Inserir o nome da classe em wrapper result 
      const response_result = responseData.predicted_class
      const wrapper_result = document.querySelector('.wrapper.api-result');

      if (wrapper_result != null) {
        // Se o response já não foi removido
        if(wrapper_result.classList.contains('no-response')) {
          wrapper_result.classList.toggle('no-response');
        }

        const result_placeholder = document.querySelector('.result-placeholder');
        result_placeholder.innerText = response_result;
      } else {
        console.log('wrapper_result is null')
      }


      
    } catch (error) {
      console.error(error);
      setResponseMessage('Ocorreu um erro ao enviar a imagem.');
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
            <fieldset>
              <legend htmlFor="image">Imagem</legend>
              <input type="file" name="image" accept="image/*" />
            </fieldset>
            <fieldset>
              <legend htmlFor="email">E-mail</legend>
              <input type="email" name="email" />
            </fieldset>
            <button className="btn btn-submit" type="submit">Enviar</button>
          </form>
          <div>{responseMessage}</div>
          </div>
          {/* <div className="wallpaper-deepmind"><img id="deepmind-wpp" src="/pexels-google-deepmind-18069365.jpg"></img> </div>
          */}
          {/* <div className="form-background"></div> */}

          <div className="wrapper api-result no-response">
            <div className="wrapper-text">
              <h1>Se trata de um:</h1>
              <p class="result-placeholder"></p>
            </div>
          </div>
    </div>
  );
};

export default ImageUploadForm;

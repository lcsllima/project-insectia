import React, { useState } from 'react';
import './ImageUploadForm.css'

const ImageUploadForm = (props) => {
  const [responseMessage, setResponseMessage] = useState('');

    
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // Adicionamos um elemento com a class loader
    const loader = document.createElement('div');
    loader.classList.add('loader');
    // document.querySelector('.wrapper-form').appendChild(loader);
    document.querySelector('.api-result').appendChild(loader);

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
        if (wrapper_result.classList.contains('no-response')) {
          wrapper_result.classList.toggle('no-response');
        }
      
        const result_placeholder = document.querySelector('.result-placeholder');
        result_placeholder.innerText = response_result;
      
        // Faremos um GET em http://localhost:8080/insect-content/{response_result}
        // e retornaremos o conteúdo do inseto
        const insect_content = await fetch(`http://localhost:8000/apis/wikipedia-scrape?title=${response_result}`);
        
        // Salvamos o titulo do inseto
        result_placeholder.innerHTML = `<a href="https://pt.wikipedia.org/wiki/${response_result}" target="_blank">${response_result}</a>`; 

        if (insect_content.ok) {
          const insect_content_data = await insect_content.json();
          const insect_content_text = insect_content_data.content;

          result_placeholder.innerHTML += insect_content_text;
        } else {
          result_placeholder.innerText += 'Erro ao obter o conteúdo do inseto.';
        }
      
        // Removemos o loader
        loader.remove();
      } else {
        console.log('wrapper_result is null');
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
    <div className="main form-main hidden">
        <div className="wrapper-form">
          <div className="wrapper">
            <div className="wrapper-text">
              <h1>{props.title}</h1>
              <p>{props.description}</p>
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
          <div className="wrapper api-result no-response">
            <div className="wrapper-text">
              <h3>Identificado:</h3>
              <h2 className="result-placeholder"></h2>
            </div>
          </div>
          </div>
          {/* <div className="wallpaper-deepmind"><img id="deepmind-wpp" src="/pexels-google-deepmind-18069365.jpg"></img> </div>
          */}
          {/* <div className="form-background"></div> */}
    </div>
  );
};

export default ImageUploadForm;

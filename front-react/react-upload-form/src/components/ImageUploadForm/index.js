import React, { useState } from 'react';
import './ImageUploadForm.css'

const ImageUploadForm = () => {
  const [responseMessage, setResponseMessage] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    try {
      const response = await fetch("http://localhost:8000/apis/insect-images/", {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();
      setResponseMessage(responseData.message);
    } catch (error) {
      console.error(error);
      setResponseMessage('Ocorreu um erro ao enviar a imagem.');
    }
  };

  return (
    <div className="main">
      <div className="wrapper-component">
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
              <legend htmlFor="e-mail">E-mail</legend>
              <input type="email" name="e-mail" />
            </fieldset>
            <button className="btn btn-submit" type="submit">Enviar</button>
          </form>
          <div>{responseMessage}</div>
          </div>
          {/* <div className="wallpaper-deepmind"><img id="deepmind-wpp" src="/pexels-google-deepmind-18069365.jpg"></img> </div>
          */}
          {/* <div className="form-background"></div> */}
        </div>
    </div>
  );
};

export default ImageUploadForm;

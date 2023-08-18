import React, { useState } from 'react';

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
    <div>
      <h1>Upload de Imagem</h1>
      <form onSubmit={handleFormSubmit} encType="multipart/form-data">
        <input type="file" name="image" accept="image/*" />
        <button type="submit">Enviar</button>
      </form>
      <div>{responseMessage}</div>
    </div>
  );
};

export default ImageUploadForm;

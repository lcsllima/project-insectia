import React from "react";
import './CardsSelection.css'

import ImageUploadForm from "../ImageUploadForm";

const CardsSelection = (props) => {
    window.onload = () => {
        const cards = document.querySelectorAll('.wrapper-content-div');
        const transitionScreen = document.querySelectorAll('.transition-screen');
      
        cards.forEach((card) => {
          card.addEventListener('click', () => {
            transitionScreen.forEach((screen) => {
                screen.style.display = 'block';                
            });
            
            // Espera 2s
            setTimeout(() => {
                // document.querySelector('.wrapper-cards').style.opacity = '0';
                // document.querySelector('.wrapper-description').firstChild.innerText = 'Envie uma imagem que deseja identificar';
                document.querySelector('.upload-screen').classList.add('active');    
            }, 3000);

          });
        });
      };
      
    
    return (
        <div className="wrapper-content-div">
            <div className="transition-screen"></div>
            <div className="transition-screen screen-2"></div>
            <div className="transition-screen screen-3"></div>
            <div className="transition-screen screen-4"></div>
            <div className="upload-screen">
                {/* <ImageUploadForm /> */}
            <form>
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
            </div>
        </div>
    );
};

export default CardsSelection;
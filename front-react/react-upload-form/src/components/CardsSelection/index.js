import React from "react";
import './CardsSelection.css'

import ImageUploadForm from "../ImageUploadForm";

const CardsSelection = (props) => {
    window.onload = () => {
        const cards = document.querySelectorAll('.wrapper-cards');
        let transitionScreen = document.querySelectorAll('.transition-screen');
      
        cards.forEach((card) => {
          card.addEventListener('click', () => {
            transitionScreen.forEach((screen) => {
                screen.style.display = 'block';   
                screen.classList.remove('reverse-transition');             
            });
            
            // Espera 3s
            setTimeout(() => {
                // document.querySelector('.wrapper-cards').style.opacity = '0';
                // document.querySelector('.wrapper-description').firstChild.innerText = 'Envie uma imagem que deseja identificar';
                document.querySelector('.upload-screen').classList.add('active');
                document.querySelector('.form-main').classList.remove('hidden');
            }, 3000);

          });
        });

        const returnButton = document.querySelector(".return-button");
        
        returnButton.addEventListener("click", () => {
            let transitionScreens = document.querySelectorAll('.transition-screen');
      
            // Itera sobre todas as telas de transição
            transitionScreens.forEach(transitionScreen => {
                // Adiciona uma classe para reverter a animação
                transitionScreen.classList.add('reverse-transition');
            });
            
            setTimeout(() => {
              document.querySelector('.upload-screen').classList.remove('active');
            }, 1000);

        });
    
        const uploadLabel = document.querySelector('label[for="image-input"]');
        const fileInput = document.querySelector('#image-input');
        const imagePreview = document.getElementById('image-preview');
      
        uploadLabel.addEventListener("dragover", function (e) {
          e.preventDefault();
        });
    
        uploadLabel.addEventListener("drop", function (e) {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            fileInput.files = e.dataTransfer.files;
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
    };
      
    
    return (
        <div className="wrapper-content-div">
            <div className="transition-screen"></div>
            <div className="transition-screen screen-2"></div>
            <div className="transition-screen screen-3"></div>
            <div className="transition-screen screen-4"></div>
            <div className="upload-screen">
                {/* <ImageUploadForm /> */}
              <ImageUploadForm/>
              <button className="return-button">&#8617;</button>
            </div>
        </div>
    );
};

export default CardsSelection;
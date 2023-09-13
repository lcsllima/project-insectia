import React from 'react';
import ReactDOM from 'react-dom/client';
import IdentifyCards from './components/IdentifyCards';
import './index.css';

import CardsSelection from './components/CardsSelection';



// import ImageUploadForm from './components/ImageUploadForm';
// import App from './App';
// import FillerSpaceDiv from './components/FillerSpaceDiv';
// import SiteHeaders from './components/SiteHeaders';
// import SiteFooter from './components/SiteFooter';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      {/* <SiteHeaders title="Insect Images" /> */}
      {/* <ImageUploadForm /> */}
      {/* <FillerSpaceDiv backgroundImage="1" /> */}
      {/* <FillerSpaceDiv title="" text="exemplo - teste 123" /> */}
      {/* <SiteFooter /> */}
      {/* Imagem do bettle.png que está na pasta public*/}
      <div className='wrapper-description'>
        <h1>Escolha uma categoria para começar a identificar</h1>
      </div>
      <div className="wrapper-cards">
        <IdentifyCards title="Inseto" image="bettle.png" alt="Insect" />
        <IdentifyCards title="Plantas" image="leafs.png" alt="Insect" />
      </div>
      <CardsSelection />
  </React.StrictMode>,
);

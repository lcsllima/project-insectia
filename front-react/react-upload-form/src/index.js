import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ImageUploadForm from './components/ImageUploadForm';
// import App from './App';
import FillerSpaceDiv from './components/FillerSpaceDiv';
import SiteHeaders from './components/SiteHeaders';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <SiteHeaders title="Insect Images" />
      <ImageUploadForm />
      <FillerSpaceDiv backgroundImage="1" />
      <FillerSpaceDiv title="" text="exemplo - teste 123" />
  </React.StrictMode>,
);

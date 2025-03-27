import React from 'react';
import ImageUploader from './components/ImageUploader';
import './ImagesPage.css';

const ImagesPage: React.FC = () => {
  return (
    <div className="images-page-container">
      <div className="images-page-box">
        <h1 className="images-page-title text-3xl font-bold my-4">
          Galería de Imágenes
        </h1>
        <ImageUploader />
      </div>
    </div>
  );
};

export default ImagesPage;

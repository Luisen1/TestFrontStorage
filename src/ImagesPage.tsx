import React from 'react';
import ImageUploader from './components/ImageUploader';
import './ImagesPage.css';

const ImagesPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-4">Galería de Imágenes</h1>
      <ImageUploader />
    </div>
  );
};

export default ImagesPage;
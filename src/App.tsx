import './index.css';       // Estilos de Tailwind
import './AppCustom.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ImagesPage from './ImagesPage';
import ImageSearchByLabel from './ImageSearchByLabel';
import CreateBucket from './CreateBucket';


const Home: React.FC = () => (
  <div className="p-4 text-center">
    <h1 className="text-4xl font-bold mb-4 text-white">Bienvenidos</h1>
  </div>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-800">
        <nav className="bg-gray-700 p-4 flex justify-center gap-4">
          <Link to="/" className="text-white hover:underline">Inicio</Link>
          <Link to="/images" className="text-white hover:underline">Imágenes</Link>
          <Link to="/search" className="text-white hover:underline">Buscar por Etiqueta</Link>
          <Link to="/create-bucket" className="text-white hover:underline">Crear Bucket</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/images" element={<ImagesPage />} />
          <Route path="/search" element={<ImageSearchByLabel />} />
          <Route path="/create-bucket" element={<CreateBucket />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;

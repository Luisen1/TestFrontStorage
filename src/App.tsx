// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ImagesPage from './ImagesPage';
import ImageSearchByLabel from './ImageSearchByLabel';

const Home: React.FC = () => (
  <div className="p-4 text-center">
    <h1 className="text-4xl font-bold mb-4">Bienvenido a TestFrontStorage</h1>
    <p>Utiliza la navegación para acceder a las funcionalidades.</p>
  </div>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <nav className="bg-gray-200 p-4 flex justify-center gap-4">
        <Link to="/" className="text-blue-600 hover:underline">Inicio</Link>
        <Link to="/images" className="text-blue-600 hover:underline">Imágenes</Link>
        <Link to="/search" className="text-blue-600 hover:underline">Buscar por Etiqueta</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/images" element={<ImagesPage />} />
        <Route path="/search" element={<ImageSearchByLabel />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

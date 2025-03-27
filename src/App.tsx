// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ImagesPage from './ImagesPage';

const Home: React.FC = () => {
  return (
    <div className="p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Bienvenido a TestFrontStorage</h1>
      <p>Usa la navegación para acceder a la funcionalidad de imágenes.</p>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <nav className="bg-gray-200 p-4 flex justify-center gap-4">
        <Link to="/" className="text-blue-600 hover:underline">
          Inicio
        </Link>
        <Link to="/images" className="text-blue-600 hover:underline">
          Imágenes
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/images" element={<ImagesPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

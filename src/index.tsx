// src/index.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // Si tienes Tailwind o tus estilos globales
import ImageUploader from './components/ImageUploader'; // Tu componente con Hooks

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("No se encontró el elemento #root en el HTML");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ImageUploader />
  </React.StrictMode>
);

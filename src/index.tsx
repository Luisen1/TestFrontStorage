// src/index.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';  // Asegúrate de importar tus estilos (por ejemplo, Tailwind)
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('No se encontró el elemento #root en el HTML');
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

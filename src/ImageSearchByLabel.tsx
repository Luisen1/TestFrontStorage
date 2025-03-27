import React, { useState } from 'react';

interface ServerImage {
  id: number;
  url: string;
  size: number;
  file_name: string;
  // labels?: Label[];
  // bucket?: Bucket;
}

const ImageSearchByLabel: React.FC = () => {
  const [searchTag, setSearchTag] = useState('');
  const [results, setResults] = useState<ServerImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchTag.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3030/api/images/by-label?tag=${encodeURIComponent(searchTag)}`, {
        method: 'GET'
      });
      if (!response.ok) {
        throw new Error('Error en la búsqueda');
      }
      const data = await response.json();
      // El endpoint regresa { success: true, data: [...] }
      setResults(data.data); // <--- Aquí el cambio: usar data.data en lugar de data.data.images
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Buscar Imágenes por Etiqueta</h2>
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={searchTag}
          onChange={(e) => setSearchTag(e.target.value)}
          placeholder="Ingrese etiqueta..."
          className="border border-gray-300 p-2 rounded flex-grow mr-2"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Buscar
        </button>
      </div>
      {loading && <p className="text-center">Buscando...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map((img) => (
            <div
              key={img.id}
              className="bg-white shadow rounded-lg p-4 flex flex-col items-center"
            >
              <img
                src={img.url}
                alt={img.file_name}
                className="w-full h-auto max-h-40 object-contain mb-2"
              />
              <p className="text-gray-700 text-sm">ID: {img.id}</p>
              <p className="text-gray-700 text-sm truncate">URL: {img.url}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSearchByLabel;

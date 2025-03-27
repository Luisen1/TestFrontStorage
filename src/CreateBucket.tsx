
import React, { useState } from 'react';
import './CreateBucket.css';

const CreateBucket: React.FC = () => {
  const [bucketName, setBucketName] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCreateBucket = async () => {
    // Evita enviar petición si el nombre está vacío
    if (!bucketName.trim()) return;

    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      // Petición POST al endpoint
      const response = await fetch('http://localhost:3030/api/bucket/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: bucketName })
      });

      if (!response.ok) {
        throw new Error('Error al crear el bucket');
      }

      // Si llega aquí, el bucket se creó correctamente
      const data = await response.json();
      console.log('Respuesta al crear bucket:', data);

      setSuccessMessage('¡Bucket creado con éxito!');
      setBucketName(''); // Limpia el input
    } catch (error: any) {
      setErrorMessage(error.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Crear Nuevo Bucket</h2>
      <div className="flex flex-col space-y-4">
        <input
          type="text"
          value={bucketName}
          onChange={(e) => setBucketName(e.target.value)}
          placeholder="Ingrese el nombre del bucket"
          className="border border-gray-300 p-2 rounded"
        />
        <button
          onClick={handleCreateBucket}
          disabled={loading}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Creando...' : 'Crear Bucket'}
        </button>

        {successMessage && (
          <p className="text-green-600 text-center">{successMessage}</p>
        )}
        {errorMessage && (
          <p className="text-red-600 text-center">{errorMessage}</p>
        )}
      </div>
    </div>
  );
};

export default CreateBucket;

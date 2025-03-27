import React, { useState } from 'react';
import './CreateBucket.css';

const CreateBucket: React.FC = () => {
  const [bucketName, setBucketName] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCreateBucket = async () => {
    if (!bucketName.trim()) return;
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await fetch('http://localhost:3030/api/bucket/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: bucketName }),
      });

      if (!response.ok) {
        throw new Error('Error al crear el bucket');
      }

      const data = await response.json();
      console.log('Respuesta al crear bucket:', data);

      setSuccessMessage('¡Bucket creado con éxito!');
      setBucketName('');
    } catch (error: any) {
      setErrorMessage(error.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-bucket-container">
      <div className="create-bucket-box">
        <h2>Crear Nuevo Bucket</h2>
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            value={bucketName}
            onChange={(e) => setBucketName(e.target.value)}
            placeholder="Ingrese el nombre del bucket"
            className="border border-gray-500 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-800 text-white placeholder-gray-400"
          />
          <button
            onClick={handleCreateBucket}
            disabled={loading}
            className="bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50 transition-all"
          >
            {loading ? 'Creando...' : 'Crear Bucket'}
          </button>

          {successMessage && (
            <p className="text-green-400 text-center font-medium">
              {successMessage}
            </p>
          )}
          {errorMessage && (
            <p className="text-red-400 text-center font-medium">
              {errorMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateBucket;

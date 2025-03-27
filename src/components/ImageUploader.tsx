import React, { useState, useEffect } from 'react';
import { Upload, ArrowLeft, FileCheck2, FileX2 } from 'lucide-react';
import { validateFile, listUploadedImages } from '../utils/fileUtils';

interface UploadStatus {
  type: 'success' | 'error';
  message: string;
}

interface ServerImage {
  id: number;
  url: string;
  size: number;
  file_name: string;
}

const ImageUploader: React.FC = () => {
  // Estados para subir imagen
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  // Estado para imágenes del servidor
  const [serverImages, setServerImages] = useState<ServerImage[]>([]);

  // Al montar el componente se consumen las imágenes del endpoint
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('http://localhost:3030/api/images');
        if (!response.ok) {
          throw new Error('Error al obtener imágenes');
        }
        const data = await response.json();
        // Asumiendo que el JSON devuelto es: { success: true, data: { images: [...] } }
        setServerImages(data.data.images);
      } catch (error) {
        console.error('Error al obtener imágenes:', error);
      }
    };

    fetchImages();
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validationResult = validateFile(file);

      if (validationResult.isValid) {
        setSelectedFile(file);
        setUploadStatus(null);

        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setUploadStatus({
          type: 'error',
          message: validationResult.message,
        });
      }
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append('image', selectedFile);

        const response = await fetch('http://localhost:3030/api/process-image', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Error en la solicitud');
        }

        const result = await response.json();

        setUploadStatus({
          type: 'success',
          message: 'Imagen subida exitosamente y procesada',
        });

        setUploadedImages((prevImages) => {
          const newImages = [...prevImages, selectedFile.name];
          return listUploadedImages(newImages);
        });

        setSelectedFile(null);
        setPreviewImage(null);

        // Limpia el input de archivo
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      } catch (error) {
        console.error('Error detallado:', error);
        setUploadStatus({
          type: 'error',
          message: `Error al subir: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        });
      }
    }
  };

  const handleGoBack = () => {
    setSelectedFile(null);
    setPreviewImage(null);
    setUploadStatus(null);

    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Función para descargar la imagen
  const handleDownload = (image: ServerImage) => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.file_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Función para borrar la imagen del servidor
  const handleDelete = async (image: ServerImage) => {
    try {
      const response = await fetch(`http://localhost:3030/api/images/${image.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('No se pudo borrar la imagen');
      }
      // Actualiza el estado eliminando la imagen borrada
      setServerImages((prevImages) => prevImages.filter((img) => img.id !== image.id));
    } catch (error) {
      console.error('Error al borrar la imagen:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Subir Imagen</h2>
        
        <input
          type="file"
          id="fileInput"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {previewImage && (
          <div className="mb-4 relative">
            <img
              src={previewImage}
              alt="Vista previa"
              className="max-w-full max-h-64 mx-auto rounded-lg object-contain"
            />
          </div>
        )}
        
        {uploadStatus && (
          <div
            className={`
              mb-4 p-3 rounded-lg text-center flex items-center justify-center
              ${uploadStatus.type === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'}
            `}
          >
            {uploadStatus.type === 'success' ? (
              <FileCheck2 className="mr-2" />
            ) : (
              <FileX2 className="mr-2" />
            )}
            {uploadStatus.message}
          </div>
        )}
        
        <div className="flex justify-between space-x-4">
          <label
            htmlFor="fileInput"
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg
                       hover:bg-blue-600 transition duration-300
                       flex items-center justify-center cursor-pointer"
          >
            <Upload className="mr-2" />
            Seleccionar Imagen
          </label>
          
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploadStatus?.type === 'success'}
            className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg
                       hover:bg-green-600 transition duration-300
                       flex items-center justify-center
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="mr-2" />
            Subir
          </button>
          
          <button
            onClick={handleGoBack}
            className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg
                       hover:bg-red-600 transition duration-300
                       flex items-center justify-center
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="mr-2" />
            Atrás
          </button>
        </div>

        {uploadedImages.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-2">Imágenes Subidas (localmente):</h3>
            <ul className="list-disc list-inside">
              {uploadedImages.map((imageName, index) => (
                <li key={index}>{imageName}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {serverImages.length > 0 && (
        <div className="mt-8 w-full max-w-4xl">
          <h3 className="text-2xl font-bold mb-4 text-center">Imágenes del Servidor</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {serverImages.map((img) => (
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
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => handleDownload(img)}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-xs"
                  >
                    Descargar
                  </button>
                  <button
                    onClick={() => handleDelete(img)}
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-xs"
                  >
                    Borrar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;

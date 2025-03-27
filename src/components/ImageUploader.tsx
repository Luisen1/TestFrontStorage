import React, { useState } from 'react';
import { Upload, ArrowLeft, FileCheck2, FileX2 } from 'lucide-react';
import { validateFile, listUploadedImages } from '../utils/fileUtils';

interface UploadStatus {
  type: 'success' | 'error';
  message: string;
}

const ImageUploader: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

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
          message: validationResult.message
        });
      }
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append('image', selectedFile);

        const response = await fetch('http://localhost:3030/api/images/process', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Error en la solicitud');
        }

        await response.json();

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
          message: `Error al subir: ${
            error instanceof Error ? error.message : 'Error desconocido'
          }`,
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

  return (
    <div className="bg-gray-900 min-h-screen p-4 text-gray-100">
      {/* 
        text-gray-100 => Aplica un color de texto claro (casi blanco) 
        en todo el contenedor para mayor contraste 
      */}
      <h1 className="text-3xl font-bold text-center mb-6">Subir y Gestionar Imágenes</h1>

      <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Subir Imagen</h2>

        {/* Sección de selección de archivo */}
        <div className="mb-4">
          <label
            htmlFor="fileInput"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer transition-colors"
          >
            <Upload className="mr-2" />
            Seleccionar archivo
          </label>
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          {/* Nombre del archivo seleccionado o texto por defecto */}
          <span className="ml-3">
            {selectedFile ? selectedFile.name : 'Sin archivos seleccionados'}
          </span>
        </div>

        {/* Vista previa de la imagen */}
        {previewImage && (
          <div className="mb-4">
            <img
              src={previewImage}
              alt="Vista previa"
              className="max-w-full max-h-64 rounded object-contain"
            />
          </div>
        )}

        {/* Mensaje de éxito o error */}
        {uploadStatus && (
          <div
            className={`mb-4 p-3 rounded-lg text-center flex items-center justify-center
              ${
                uploadStatus.type === 'success'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
          >
            {uploadStatus.type === 'success' ? (
              <FileCheck2 className="mr-2" />
            ) : (
              <FileX2 className="mr-2" />
            )}
            {uploadStatus.message}
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex space-x-4">
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploadStatus?.type === 'success'}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded disabled:opacity-50 transition-colors"
          >
            <Upload className="inline-block mr-1" />
            Subir
          </button>
          <button
            onClick={handleGoBack}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors"
          >
            <ArrowLeft className="inline-block mr-1" />
            Atrás
          </button>
        </div>

        {/* Listado de imágenes subidas localmente */}
        {uploadedImages.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-2">Imágenes Subidas:</h3>
            <ul className="list-disc list-inside">
              {uploadedImages.map((imageName, index) => (
                <li key={index}>{imageName}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;

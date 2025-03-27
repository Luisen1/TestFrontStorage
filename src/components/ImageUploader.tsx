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
        
        // Limpiar el input de archivo
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
          <div className={`
            mb-4 p-3 rounded-lg text-center flex items-center justify-center
            ${uploadStatus.type === 'success' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'}
          `}>
            {uploadStatus.type === 'success' 
              ? <FileCheck2 className="mr-2" /> 
              : <FileX2 className="mr-2" />
            }
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
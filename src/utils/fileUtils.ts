export const validateFile = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB
  
    if (allowedTypes.indexOf(file.type) === -1) {
      return { 
      isValid: false, 
      message: 'Tipo de archivo no permitido' 
      };
    }
  
    if (file.size > maxSize) {
      return { 
        isValid: false, 
        message: 'El archivo es demasiado grande' 
      };
    }
  
    return { 
      isValid: true, 
      message: '' 
    };
  };
  
  export const listUploadedImages = (images: string[]) => {
    // Filtrar imágenes duplicadas
    return Array.from(new Set(images));
  };
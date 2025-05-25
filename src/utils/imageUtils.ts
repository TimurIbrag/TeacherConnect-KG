
export const validateImageFile = (file: File) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: "Размер файла не должен превышать 10MB"
    };
  }
  
  if (!file.type.startsWith('image/')) {
    return {
      isValid: false,
      error: "Пожалуйста, выберите изображение"
    };
  }
  
  return { isValid: true };
};

export const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result.toString());
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

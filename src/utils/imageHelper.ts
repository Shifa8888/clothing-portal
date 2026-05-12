/**
 * Helper to convert a File object from an input element to a Base64 data URL.
 * This allows storing custom images in localStorage.
 */
export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};

/**
 * Returns a mock file path simulating a server-side upload to public/uploads/
 */
export const getSimulatedUploadPath = (fileName: string): string => {
  const sanitizedName = fileName.replace(/\s+/g, '-').toLowerCase();
  return `/public/uploads/${Date.now()}-${sanitizedName}`;
};

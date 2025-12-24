import UTIF from 'utif';

/**
 * Decode TIFF file to HTMLImageElement
 * Browsers don't natively support TIFF, so we need to decode it manually
 */
export async function decodeTIFF(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        
        // Decode TIFF using UTIF
        const ifds = UTIF.decode(buffer);
        if (!ifds || ifds.length === 0) {
          throw new Error('Invalid TIFF file');
        }
        
        // Use first image in TIFF
        const firstImage = ifds[0];
        UTIF.decodeImage(buffer, firstImage);
        
        const rgba = UTIF.toRGBA8(firstImage);
        
        // Create canvas and draw decoded image
        const canvas = document.createElement('canvas');
        canvas.width = firstImage.width;
        canvas.height = firstImage.height;
        const ctx = canvas.getContext('2d')!;
        
        const imageData = ctx.createImageData(firstImage.width, firstImage.height);
        imageData.data.set(rgba);
        ctx.putImageData(imageData, 0, 0);
        
        // Convert canvas to blob then to Image
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to convert TIFF to image'));
            return;
          }
          
          const url = URL.createObjectURL(blob);
          const img = new Image();
          
          img.onload = () => {
            URL.revokeObjectURL(url);
            resolve(img);
          };
          
          img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load decoded TIFF'));
          };
          
          img.src = url;
        }, 'image/png');
        
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read TIFF file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Check if file is a TIFF based on MIME type or extension
 */
export function isTIFF(file: File): boolean {
  return file.type === 'image/tiff' || 
         file.type === 'image/tif' ||
         file.name.toLowerCase().endsWith('.tif') ||
         file.name.toLowerCase().endsWith('.tiff');
}

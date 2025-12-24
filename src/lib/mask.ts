import { Point } from '../types';

/**
 * Generate binary mask from closed polygon path
 * Returns ImageData with white (255) for selected region, black (0) for background
 */
export function generateMask(
  path: Point[],
  width: number,
  height: number
): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  
  // Fill with black (background)
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, width, height);
  
  // Draw path and fill with white (selected region)
  ctx.fillStyle = 'white';
  ctx.beginPath();
  
  if (path.length > 0) {
    ctx.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) {
      ctx.lineTo(path[i].x, path[i].y);
    }
    ctx.closePath();
    ctx.fill();
  }
  
  return ctx.getImageData(0, 0, width, height);
}

/**
 * Apply color to background (everything EXCEPT the selected object)
 * This inverts the fill: selected object keeps original pixels, background becomes solid color
 */
export function applyBackgroundColor(
  originalImage: HTMLImageElement,
  mask: ImageData,
  backgroundColor: string
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = originalImage.width;
  canvas.height = originalImage.height;
  const ctx = canvas.getContext('2d')!;
  
  // Draw original image
  ctx.drawImage(originalImage, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
  // Parse background color
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = 1;
  tempCanvas.height = 1;
  const tempCtx = tempCanvas.getContext('2d')!;
  tempCtx.fillStyle = backgroundColor;
  tempCtx.fillRect(0, 0, 1, 1);
  const bgColorData = tempCtx.getImageData(0, 0, 1, 1).data;
  const bgR = bgColorData[0];
  const bgG = bgColorData[1];
  const bgB = bgColorData[2];
  
  // Apply background color where mask is black (background)
  // Keep original pixels where mask is white (selected object)
  for (let i = 0; i < mask.data.length; i += 4) {
    const maskValue = mask.data[i]; // R channel (0 = background, 255 = selected)
    
    if (maskValue < 128) {
      // Background pixel - apply solid color
      imageData.data[i] = bgR;
      imageData.data[i + 1] = bgG;
      imageData.data[i + 2] = bgB;
      imageData.data[i + 3] = 255; // Full opacity
    }
    // else: selected object pixel - keep original
  }
  
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

/**
 * Download canvas as PNG
 */
export function downloadCanvasAsPNG(canvas: HTMLCanvasElement, filename: string = 'chromacut-result.png') {
  canvas.toBlob((blob) => {
    if (!blob) return;
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    
    // Clean up
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }, 'image/png');
}

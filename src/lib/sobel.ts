/**
 * Compute Sobel gradient magnitude for edge detection
 * Returns normalized gradient values (0-1) where 1 = strong edge
 */
export function computeSobelGradients(imageData: ImageData): Float32Array {
  const { width, height, data } = imageData;
  const gradients = new Float32Array(width * height);
  
  // Convert to grayscale first for better edge detection
  const gray = new Float32Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    gray[i] = 0.299 * r + 0.587 * g + 0.114 * b;
  }

  // Sobel kernels
  const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

  let maxGradient = 0;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let gx = 0;
      let gy = 0;

      // Apply Sobel kernels
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = (y + ky) * width + (x + kx);
          const kernelIdx = (ky + 1) * 3 + (kx + 1);
          const pixel = gray[idx];
          gx += pixel * sobelX[kernelIdx];
          gy += pixel * sobelY[kernelIdx];
        }
      }

      const magnitude = Math.sqrt(gx * gx + gy * gy);
      const idx = y * width + x;
      gradients[idx] = magnitude;
      maxGradient = Math.max(maxGradient, magnitude);
    }
  }

  // Normalize gradients to 0-1 range
  if (maxGradient > 0) {
    for (let i = 0; i < gradients.length; i++) {
      gradients[i] /= maxGradient;
    }
  }

  return gradients;
}

/**
 * Convert edge strength to traversal cost
 * Strong edges (high gradient) => low cost
 * Weak edges (low gradient) => high cost
 */
export function gradientToCostMap(
  gradients: Float32Array,
  edgeStrength: number = 1.0
): Float32Array {
  const costMap = new Float32Array(gradients.length);
  
  for (let i = 0; i < gradients.length; i++) {
    // Invert: strong edge (gradient near 1) => low cost (near 0)
    // Apply edge strength scaling
    const edgeValue = gradients[i] * edgeStrength;
    costMap[i] = 1.0 - Math.min(edgeValue, 1.0);
  }
  
  return costMap;
}

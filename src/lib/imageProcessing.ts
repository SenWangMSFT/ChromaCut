import { computeSobelGradients, gradientToCostMap } from './sobel';
import { findLowestCostPath, simplifyPath } from './pathfinding';
import { generateMask, applyBackgroundColor, downloadCanvasAsPNG } from './mask';
import { Point } from '../types';

/**
 * Process uploaded image to extract ImageData at native resolution
 */
export function loadImageData(image: HTMLImageElement): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(image, 0, 0);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

/**
 * Check if cursor is near the first anchor (for closing path)
 */
export function isNearFirstAnchor(
  cursor: Point,
  firstAnchor: Point,
  threshold: number = 10
): boolean {
  const dx = cursor.x - firstAnchor.x;
  const dy = cursor.y - firstAnchor.y;
  return Math.sqrt(dx * dx + dy * dy) <= threshold;
}

export {
  computeSobelGradients,
  gradientToCostMap,
  findLowestCostPath,
  simplifyPath,
  generateMask,
  applyBackgroundColor,
  downloadCanvasAsPNG
};

export interface Point {
  x: number;
  y: number;
}

export interface PathSegment {
  points: Point[];
  isCommitted: boolean;
}

export interface Anchor {
  point: Point;
  id: number;
}

export interface EditorState {
  image: HTMLImageElement | null;
  imageData: ImageData | null;
  costMap: Float32Array | null;
  anchors: Anchor[];
  committedPath: Point[];
  previewPath: Point[];
  isPathClosed: boolean;
  mask: ImageData | null;
  edgeStrength: number;
  selectedColor: string;
}

export interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

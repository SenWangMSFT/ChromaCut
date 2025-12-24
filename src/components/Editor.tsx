import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Stage, Layer, Image as KonvaImage, Line, Circle } from 'react-konva';
import { Point, Anchor } from '../types';
import {
  loadImageData,
  computeSobelGradients,
  gradientToCostMap,
  findLowestCostPath,
  isNearFirstAnchor,
} from '../lib/imageProcessing';

interface EditorProps {
  image: HTMLImageElement | null;
  edgeStrength: number;
  onPathClosed: (path: Point[]) => void;
  onReset: () => void;
  resetTrigger: number;
}

export const Editor: React.FC<EditorProps> = ({
  image,
  edgeStrength,
  onPathClosed,
  onReset,
  resetTrigger,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);
  
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [costMap, setCostMap] = useState<Float32Array | null>(null);
  
  const [anchors, setAnchors] = useState<Anchor[]>([]);
  const [committedPath, setCommittedPath] = useState<Point[]>([]);
  const [previewPath, setPreviewPath] = useState<Point[]>([]);
  const [isPathClosed, setIsPathClosed] = useState(false);
  const [isNearStart, setIsNearStart] = useState(false);
  
  const anchorIdCounter = useRef(0);
  const lastMouseMoveTime = useRef(0);

  // Handle window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Reset on resetTrigger change
  useEffect(() => {
    if (resetTrigger > 0) {
      setAnchors([]);
      setCommittedPath([]);
      setPreviewPath([]);
      setIsPathClosed(false);
      setIsNearStart(false);
      anchorIdCounter.current = 0;
    }
  }, [resetTrigger]);

  // Process image when loaded
  useEffect(() => {
    if (!image) {
      setImageData(null);
      setCostMap(null);
      setAnchors([]);
      setCommittedPath([]);
      setPreviewPath([]);
      setIsPathClosed(false);
      return;
    }

    // Load image data and compute cost map
    const imgData = loadImageData(image);
    setImageData(imgData);
    
    const gradients = computeSobelGradients(imgData);
    const costs = gradientToCostMap(gradients, edgeStrength);
    setCostMap(costs);
    
    // Center and fit image
    const scaleX = (dimensions.width * 0.9) / image.width;
    const scaleY = (dimensions.height * 0.9) / image.height;
    const newScale = Math.min(scaleX, scaleY, 1);
    
    setScale(newScale);
    setPosition({
      x: (dimensions.width - image.width * newScale) / 2,
      y: (dimensions.height - image.height * newScale) / 2,
    });
  }, [image, dimensions.width, dimensions.height]);

  // Update cost map when edge strength changes
  useEffect(() => {
    if (!imageData) return;
    
    const gradients = computeSobelGradients(imageData);
    const costs = gradientToCostMap(gradients, edgeStrength);
    setCostMap(costs);
  }, [edgeStrength, imageData]);

  // Convert stage coordinates to image coordinates
  const stageToImage = useCallback((point: Point): Point => {
    if (!image) return point;
    return {
      x: (point.x - position.x) / scale,
      y: (point.y - position.y) / scale,
    };
  }, [scale, position, image]);

  // Convert image coordinates to stage coordinates
  const imageToStage = useCallback((point: Point): Point => {
    return {
      x: point.x * scale + position.x,
      y: point.y * scale + position.y,
    };
  }, [scale, position]);

  // Handle mouse move for live preview
  const handleMouseMove = useCallback((e: any) => {
    if (!image || !costMap || isPathClosed) return;
    
    // Throttle mouse move updates
    const now = Date.now();
    if (now - lastMouseMoveTime.current < 16) return; // ~60fps
    lastMouseMoveTime.current = now;
    
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const imagePoint = stageToImage(point);
    
    // Check if near first anchor
    if (anchors.length > 2) {
      const near = isNearFirstAnchor(imagePoint, anchors[0].point, 15 / scale);
      setIsNearStart(near);
    }
    
    // Compute preview path if we have at least one anchor
    if (anchors.length > 0 && imageData) {
      const lastAnchor = anchors[anchors.length - 1].point;
      
      requestAnimationFrame(() => {
        const path = findLowestCostPath(
          lastAnchor,
          imagePoint,
          costMap,
          imageData.width,
          imageData.height,
          200
        );
        setPreviewPath(path);
      });
    }
  }, [image, costMap, imageData, anchors, scale, stageToImage, isPathClosed]);

  // Handle click to place anchor
  const handleClick = useCallback((e: any) => {
    if (!image || !costMap || !imageData || isPathClosed) return;
    
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const imagePoint = stageToImage(point);
    
    // Clamp to image bounds
    const clampedPoint: Point = {
      x: Math.max(0, Math.min(image.width - 1, imagePoint.x)),
      y: Math.max(0, Math.min(image.height - 1, imagePoint.y)),
    };
    
    // Check if clicking near first anchor (close path)
    if (anchors.length > 2 && isNearFirstAnchor(clampedPoint, anchors[0].point, 15 / scale)) {
      // Close the path
      const closingPath = findLowestCostPath(
        anchors[anchors.length - 1].point,
        anchors[0].point,
        costMap,
        imageData.width,
        imageData.height,
        200
      );
      
      const finalPath = [...committedPath, ...closingPath];
      setCommittedPath(finalPath);
      setPreviewPath([]);
      setIsPathClosed(true);
      setIsNearStart(false);
      
      // Notify parent
      onPathClosed(finalPath);
      return;
    }
    
    // Add new anchor
    const newAnchor: Anchor = {
      point: clampedPoint,
      id: anchorIdCounter.current++,
    };
    
    // If we have a previous anchor, commit the path segment
    if (anchors.length > 0) {
      const lastAnchor = anchors[anchors.length - 1].point;
      const segmentPath = findLowestCostPath(
        lastAnchor,
        clampedPoint,
        costMap,
        imageData.width,
        imageData.height,
        200
      );
      setCommittedPath(prev => [...prev, ...segmentPath]);
    } else {
      // First anchor, just add the point
      setCommittedPath([clampedPoint]);
    }
    
    setAnchors(prev => [...prev, newAnchor]);
    setPreviewPath([]);
  }, [image, costMap, imageData, anchors, committedPath, stageToImage, scale, isPathClosed, onPathClosed]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPathClosed) return;
      
      // Undo: Ctrl/Cmd + Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (anchors.length > 0) {
          // Remove last anchor and recalculate committed path
          const newAnchors = anchors.slice(0, -1);
          setAnchors(newAnchors);
          
          if (newAnchors.length === 0) {
            setCommittedPath([]);
          } else if (costMap && imageData) {
            // Recalculate committed path from remaining anchors
            const newPath: Point[] = [newAnchors[0].point];
            for (let i = 1; i < newAnchors.length; i++) {
              const segment = findLowestCostPath(
                newAnchors[i - 1].point,
                newAnchors[i].point,
                costMap,
                imageData.width,
                imageData.height,
                200
              );
              newPath.push(...segment.slice(1));
            }
            setCommittedPath(newPath);
          }
          setPreviewPath([]);
        }
      }
      
      // Reset: Escape
      if (e.key === 'Escape') {
        e.preventDefault();
        setAnchors([]);
        setCommittedPath([]);
        setPreviewPath([]);
        setIsPathClosed(false);
        setIsNearStart(false);
        anchorIdCounter.current = 0;
        onReset();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [anchors, costMap, imageData, isPathClosed, onReset]);

  // Handle wheel zoom
  const handleWheel = useCallback((e: any) => {
    e.evt.preventDefault();
    
    const stage = stageRef.current;
    if (!stage) return;
    
    const oldScale = scale;
    const pointer = stage.getPointerPosition();
    
    const mousePointTo = {
      x: (pointer.x - position.x) / oldScale,
      y: (pointer.y - position.y) / oldScale,
    };
    
    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const scaleBy = 1.05;
    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    
    // Clamp scale
    const clampedScale = Math.max(0.1, Math.min(5, newScale));
    
    setScale(clampedScale);
    setPosition({
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    });
  }, [scale, position]);

  // Flatten all path points for rendering
  const allPathPoints = [...committedPath, ...previewPath];
  const pathPointsFlat = allPathPoints.flatMap(p => {
    const sp = imageToStage(p);
    return [sp.x, sp.y];
  });

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#fafafa',
        borderRadius: '24px',
        cursor: isPathClosed ? 'default' : 'crosshair',
      }}
    >
      {image ? (
        <Stage
          ref={stageRef}
          width={dimensions.width}
          height={dimensions.height}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          onWheel={handleWheel}
          draggable={false}
        >
          <Layer>
            <KonvaImage
              image={image}
              x={position.x}
              y={position.y}
              scaleX={scale}
              scaleY={scale}
            />
            
            {/* Committed + Preview Path */}
            {pathPointsFlat.length > 2 && (
              <Line
                points={pathPointsFlat}
                stroke={isNearStart ? '#00ff00' : '#00bfff'}
                strokeWidth={2}
                lineCap="round"
                lineJoin="round"
              />
            )}
            
            {/* Anchors */}
            {anchors.map((anchor, idx) => {
              const stagePoint = imageToStage(anchor.point);
              const isFirst = idx === 0;
              return (
                <Circle
                  key={anchor.id}
                  x={stagePoint.x}
                  y={stagePoint.y}
                  radius={isFirst && isNearStart ? 8 : 5}
                  fill={isFirst && isNearStart ? '#00ff00' : '#ffff00'}
                  stroke="#000"
                  strokeWidth={1}
                />
              );
            })}
          </Layer>
        </Stage>
      ) : (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: '#9ca3af',
            fontSize: '18px',
          }}
        >
          Upload an image to start
        </div>
      )}
    </div>
  );
};

import React, { useState, useCallback } from 'react';
import { Editor } from './components/Editor';
import { Toolbar } from './components/Toolbar';
import { Toast } from './components/Toast';
import { Point } from './types';
import { generateMask, applyBackgroundColor, downloadCanvasAsPNG } from './lib/mask';
import { isTIFF, decodeTIFF } from './lib/tiff';
import './App.css';

interface ToastState {
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

function App() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [closedPath, setClosedPath] = useState<Point[] | null>(null);
  const [edgeStrength, setEdgeStrength] = useState(1.5);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [resetTrigger, setResetTrigger] = useState(0);
  const [resultCanvas, setResultCanvas] = useState<HTMLCanvasElement | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: ToastState['type'] = 'info') => {
    setToast({ message, type });
  };

  const handleUploadImage = useCallback((file: File) => {
    // Check file size (warn if > 10MB)
    if (file.size > 10 * 1024 * 1024) {
      const proceed = window.confirm(
        'This image is quite large and may impact performance. Continue?'
      );
      if (!proceed) return;
    }

    // Revoke previous object URL to prevent memory leak
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }

    const loadImage = async () => {
      try {
        let img: HTMLImageElement;
        
        // Check if file is TIFF and needs decoding
        if (isTIFF(file)) {
          img = await decodeTIFF(file);
        } else {
          // Standard image loading for PNG/JPG
          const url = URL.createObjectURL(file);
          setImageUrl(url);
          
          img = new Image();
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = url;
          });
        }
        
        setImage(img);
        setClosedPath(null);
        setResultCanvas(null);
        setResetTrigger(0);
        showToast('Image loaded successfully!', 'success');
      } catch (error) {
        console.error('Error loading image:', error);
        showToast('Failed to load image. Please try a different file.', 'error');
      }
    };

    loadImage();
  }, [imageUrl]);

  const handlePathClosed = useCallback((path: Point[]) => {
    setClosedPath(path);
    showToast('Selection completed! Choose a background color.', 'success');
  }, []);

  const handleReset = useCallback(() => {
    setClosedPath(null);
    setResultCanvas(null);
    setResetTrigger(prev => prev + 1);
  }, []);

  const handleUndo = useCallback(() => {
    // Undo is handled in Editor component via keyboard
    // This button trigger is for UI consistency
    const event = new KeyboardEvent('keydown', {
      key: 'z',
      ctrlKey: true,
      bubbles: true,
    });
    window.dispatchEvent(event);
  }, []);

  const handleApplyColor = useCallback(() => {
    if (!image || !closedPath) return;

    try {
      // Generate mask from closed path
      const mask = generateMask(closedPath, image.width, image.height);

      // Apply background color
      const canvas = applyBackgroundColor(image, mask, backgroundColor);
      setResultCanvas(canvas);

      showToast('Background color applied! Click Download to save.', 'success');
    } catch (error) {
      console.error('Error applying color:', error);
      showToast('Failed to apply background color', 'error');
    }
  }, [image, closedPath, backgroundColor]);

  const handleDownload = useCallback(() => {
    if (!resultCanvas) {
      showToast('Please apply a background color first', 'warning');
      return;
    }

    downloadCanvasAsPNG(resultCanvas);
    showToast('Image downloaded successfully!', 'success');
  }, [resultCanvas]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  return (
    <div className="app">
      <Toolbar
        hasImage={!!image}
        hasClosedPath={!!closedPath}
        edgeStrength={edgeStrength}
        backgroundColor={backgroundColor}
        onUploadImage={handleUploadImage}
        onEdgeStrengthChange={setEdgeStrength}
        onBackgroundColorChange={setBackgroundColor}
        onUndo={handleUndo}
        onReset={handleReset}
        onApplyColor={handleApplyColor}
        onDownload={handleDownload}
      />

      <div className="editor-container">
        <Editor
          image={image}
          edgeStrength={edgeStrength}
          onPathClosed={handlePathClosed}
          onReset={handleReset}
          resetTrigger={resetTrigger}
        />
      </div>

      {resultCanvas && (
        <div className="result-overlay">
          <div className="result-modal">
            <h2>Preview Result</h2>
            <div className="result-image-container">
              <img
                src={resultCanvas.toDataURL()}
                alt="Result"
                style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }}
              />
            </div>
            <div className="result-actions">
              <button className="btn btn-primary" onClick={handleDownload}>
                ⬇ Download PNG
              </button>
              <button className="btn" onClick={() => setResultCanvas(null)}>
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;

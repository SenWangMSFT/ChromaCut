import React, { useState, useCallback } from 'react';
import { Editor } from './components/Editor';
import { Toolbar } from './components/Toolbar';
import { Toast } from './components/Toast';
import { Point, OutputMode } from './types';
import { generateMask, applyBackgroundColor, extractObject, downloadCanvasAsPNG } from './lib/mask';
import { isTIFF, decodeTIFF } from './lib/tiff';
import { Language, translations } from './translations';
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
  const [outputMode, setOutputMode] = useState<OutputMode>('extract-object');
  const [resetTrigger, setResetTrigger] = useState(0);
  const [resultCanvas, setResultCanvas] = useState<HTMLCanvasElement | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [leftPanelWidth, setLeftPanelWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);
  const [language, setLanguage] = useState<Language>('en');

  const t = translations[language];

  const showToast = (message: string, type: ToastState['type'] = 'info') => {
    setToast({ message, type });
  };

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  React.useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = e.clientX - 16; // Account for app padding
      setLeftPanelWidth(Math.max(300, Math.min(600, newWidth)));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

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

      let canvas: HTMLCanvasElement;
      if (outputMode === 'background-color') {
        // Apply background color
        canvas = applyBackgroundColor(image, mask, backgroundColor);
      } else {
        // Extract object with transparent background
        canvas = extractObject(image, mask);
      }
      
      setResultCanvas(canvas);

      showToast(t.colorAppliedSuccess, 'success');
    } catch (error) {
      console.error('Error processing image:', error);
      showToast(t.applyColorError, 'error');
    }
  }, [image, closedPath, backgroundColor, outputMode, t]);

  const handleDownload = useCallback(() => {
    if (!resultCanvas) {
      showToast(t.applyColorError, 'warning');
      return;
    }

    downloadCanvasAsPNG(resultCanvas);
    showToast(t.downloadSuccess, 'success');
  }, [resultCanvas, t]);

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
      <div className="app-container">
        {image && (
          <>
            <div className="left-panel left-panel-animated" style={{ width: `${leftPanelWidth}px` }}>
              <Toolbar
                hasImage={!!image}
                hasClosedPath={!!closedPath}
                hasResult={!!resultCanvas}
                edgeStrength={edgeStrength}
                backgroundColor={backgroundColor}
                outputMode={outputMode}
                onUploadImage={handleUploadImage}
                onEdgeStrengthChange={setEdgeStrength}
                onBackgroundColorChange={setBackgroundColor}
                onOutputModeChange={setOutputMode}
                onUndo={handleUndo}
                onReset={handleReset}
                onApplyColor={handleApplyColor}
                onDownload={handleDownload}
                translations={t}
                language={language}
                onLanguageChange={setLanguage}
              />
            </div>

            <div
              className="resize-handle"
              onMouseDown={handleResizeStart}
            >
              <div className="resize-handle-bar" />
            </div>
          </>
        )}

        <div className="right-panel" style={{ width: image ? undefined : '100%' }}>
          <Editor
            image={image}
            edgeStrength={edgeStrength}
            onPathClosed={handlePathClosed}
            onReset={handleReset}
            resetTrigger={resetTrigger}
            onUploadImage={handleUploadImage}
            resultCanvas={resultCanvas}
            translations={t}
            language={language}
            onLanguageChange={setLanguage}
          />
        </div>
      </div>

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

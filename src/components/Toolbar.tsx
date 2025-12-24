import React from 'react';

interface ToolbarProps {
  hasImage: boolean;
  hasClosedPath: boolean;
  edgeStrength: number;
  backgroundColor: string;
  onUploadImage: (file: File) => void;
  onEdgeStrengthChange: (value: number) => void;
  onBackgroundColorChange: (color: string) => void;
  onUndo: () => void;
  onReset: () => void;
  onApplyColor: () => void;
  onDownload: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  hasImage,
  hasClosedPath,
  edgeStrength,
  backgroundColor,
  onUploadImage,
  onEdgeStrengthChange,
  onBackgroundColorChange,
  onUndo,
  onReset,
  onApplyColor,
  onDownload,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.match(/^image\/(png|jpeg|jpg|tiff|tif)$/)) {
      onUploadImage(file);
    } else {
      alert('Please upload a PNG, JPG, or TIF image');
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="toolbar">
      <div className="toolbar-section">
        <h1 className="app-title">ChromaCut</h1>
        <p className="app-subtitle">Magnetic Lasso Editor</p>
      </div>

      <div className="toolbar-section-card">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/tiff,image/tif"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        
        <button className="btn btn-primary" onClick={handleUploadClick}>
          📁 Upload Image
        </button>

        {hasImage && (
          <>
            <div className="divider" />
            
            <button
              className="btn"
              onClick={onUndo}
              title="Undo last anchor (Ctrl/Cmd+Z)"
            >
              ↶ Undo
            </button>
            
            <button
              className="btn"
              onClick={onReset}
              title="Reset selection (Esc)"
            >
              ✕ Reset
            </button>

            <div className="divider" />

            <div className="control-group">
              <label htmlFor="edge-strength">Edge Strength:</label>
              <input
                id="edge-strength"
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={edgeStrength}
                onChange={(e) => onEdgeStrengthChange(parseFloat(e.target.value))}
                className="slider"
              />
              <span className="value-label">{edgeStrength.toFixed(1)}</span>
            </div>

            {hasClosedPath && (
              <>
                <div className="divider" />
                
                <div className="control-group">
                  <label htmlFor="bg-color">Background Color:</label>
                  <input
                    id="bg-color"
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => onBackgroundColorChange(e.target.value)}
                    className="color-picker"
                  />
                </div>

                <button className="btn btn-success" onClick={onApplyColor}>
                  ✓ Apply Color
                </button>

                <button className="btn btn-primary" onClick={onDownload}>
                  ⬇ Download PNG
                </button>
              </>
            )}
          </>
        )}
      </div>

      {hasImage && !hasClosedPath && (
        <div className="toolbar-hints">
          <p className="hint">
            💡 <strong>Click</strong> to place anchors • Path snaps to edges • <strong>Click near first anchor</strong> to close
          </p>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { Translations, Language } from '../translations';
import { OutputMode } from '../types';

interface ToolbarProps {
  hasImage: boolean;
  hasClosedPath: boolean;
  hasResult: boolean;
  edgeStrength: number;
  backgroundColor: string;
  outputMode: OutputMode;
  onUploadImage: (file: File) => void;
  onEdgeStrengthChange: (value: number) => void;
  onBackgroundColorChange: (color: string) => void;
  onOutputModeChange: (mode: OutputMode) => void;
  onUndo: () => void;
  onReset: () => void;
  onApplyColor: () => void;
  onDownload: () => void;
  translations: Translations;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  hasImage,
  hasClosedPath,
  hasResult,
  edgeStrength,
  backgroundColor,
  outputMode,
  onUploadImage,
  onEdgeStrengthChange,
  onBackgroundColorChange,
  onOutputModeChange,
  onUndo,
  onReset,
  onApplyColor,
  onDownload,
  translations: t,
  language,
  onLanguageChange,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? '⌘' : 'Ctrl';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.match(/^image\/(png|jpeg|jpg|tiff|tif)$/)) {
      onUploadImage(file);
    } else {
      alert(t.invalidFileType);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="toolbar">
      <div className="toolbar-section toolbar-header">
        <div className="title-group">
          <h1 className="app-title">{t.appTitle}</h1>
          <p className="app-subtitle">{t.appSubtitle}</p>
        </div>
        <select 
          value={language} 
          onChange={(e) => onLanguageChange(e.target.value as Language)}
          className="language-select-compact"
        >
          <option value="en">EN</option>
          <option value="fr">FR</option>
          <option value="zh">中文</option>
        </select>
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
          {t.uploadImage} <span className="btn-shortcut">({modKey}+O)</span>
        </button>

        {hasImage && (
          <>
            <div className="divider" />
            
            <button
              className="btn"
              onClick={onUndo}
              title={t.undoTitle}
            >
              {t.undo} <span className="btn-shortcut">({modKey}+Z)</span>
            </button>
            
            <button
              className="btn"
              onClick={onReset}
              title={t.resetTitle}
            >
              {t.reset} <span className="btn-shortcut">(Esc)</span>
            </button>

            <div className="divider" />

            <div className="control-group">
              <label htmlFor="edge-strength">{t.edgeStrength}</label>
              <div className="control-row">
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
            </div>

            {hasClosedPath && (
              <>
                <div className="divider" />
                
                <div className="control-group">
                  <label>{t.outputMode}</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="outputMode"
                        value="background-color"
                        checked={outputMode === 'background-color'}
                        onChange={(e) => onOutputModeChange(e.target.value as OutputMode)}
                      />
                      <span>{t.backgroundColorMode}</span>
                      <small className="radio-hint">{t.applyColorHint}</small>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="outputMode"
                        value="extract-object"
                        checked={outputMode === 'extract-object'}
                        onChange={(e) => onOutputModeChange(e.target.value as OutputMode)}
                      />
                      <span>{t.extractObjectMode}</span>
                      <small className="radio-hint">{t.extractObjectHint}</small>
                    </label>
                  </div>
                </div>

                {outputMode === 'background-color' && (
                  <div className="control-group">
                    <label htmlFor="bg-color">{t.backgroundColor}</label>
                    <input
                      id="bg-color"
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => onBackgroundColorChange(e.target.value)}
                      className="color-picker"
                    />
                  </div>
                )}

                <button className="btn btn-success" onClick={onApplyColor}>
                  {outputMode === 'background-color' ? t.applyColor : t.extractObjectMode} <span className="btn-shortcut">(Enter)</span>
                </button>

                {hasResult && (
                  <button className="btn btn-primary" onClick={onDownload}>
                    {t.downloadPNG} <span className="btn-shortcut">({modKey}+S)</span>
                  </button>
                )}
              </>
            )}
          </>
        )}
      </div>

      {hasImage && !hasClosedPath && (
        <div className="toolbar-hints">
          <p className="hint">
            {t.hint} <strong>{t.hintClick}</strong> • {t.hintSnaps} • <strong>{t.hintClose}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

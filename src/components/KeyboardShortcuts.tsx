import React from 'react';
import { Translations } from '../translations';

interface KeyboardShortcutsProps {
  translations: Translations;
  onClose: () => void;
}

interface Shortcut {
  keys: string[];
  description: string;
}

interface ShortcutSection {
  title: string;
  shortcuts: Shortcut[];
}

export const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ translations: t, onClose }) => {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? '⌘' : 'Ctrl';

  const sections: ShortcutSection[] = [
    {
      title: t.generalSection,
      shortcuts: [
        { keys: [modKey, 'O'], description: t.shortcutUpload },
        { keys: ['?', '/'], description: t.shortcutHelp },
        { keys: ['Esc'], description: t.closeHelp },
      ],
    },
    {
      title: t.editingSection,
      shortcuts: [
        { keys: [modKey, 'Z'], description: t.shortcutUndo },
        { keys: ['Esc'], description: t.shortcutReset },
        { keys: ['Enter'], description: t.shortcutApply },
        { keys: [modKey, 'S'], description: t.shortcutDownload },
      ],
    },
    {
      title: t.viewSection,
      shortcuts: [
        { keys: [modKey, '+'], description: t.shortcutZoomIn },
        { keys: [modKey, '-'], description: t.shortcutZoomOut },
        { keys: [modKey, '0'], description: t.shortcutZoomFit },
      ],
    },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: '600',
              color: '#333',
            }}
          >
            {t.keyboardShortcutsTitle}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#999',
              padding: '4px 8px',
              lineHeight: '1',
            }}
            aria-label={t.closeHelp}
          >
            ×
          </button>
        </div>

        {sections.map((section, sectionIdx) => (
          <div
            key={sectionIdx}
            style={{
              marginBottom: sectionIdx < sections.length - 1 ? '24px' : 0,
            }}
          >
            <h3
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#666',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '12px',
                marginTop: 0,
              }}
            >
              {section.title}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {section.shortcuts.map((shortcut, shortcutIdx) => (
                <div
                  key={shortcutIdx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0',
                  }}
                >
                  <span
                    style={{
                      fontSize: '14px',
                      color: '#333',
                    }}
                  >
                    {shortcut.description}
                  </span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {shortcut.keys.map((key, keyIdx) => (
                      <React.Fragment key={keyIdx}>
                        {keyIdx > 0 && (
                          <span
                            style={{
                              fontSize: '12px',
                              color: '#999',
                              margin: '0 2px',
                            }}
                          >
                            {shortcut.keys.length > 2 ? 'or' : '+'}
                          </span>
                        )}
                        <kbd
                          style={{
                            backgroundColor: '#f5f5f5',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: '12px',
                            fontFamily: 'monospace',
                            fontWeight: '600',
                            color: '#555',
                            minWidth: '24px',
                            textAlign: 'center',
                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                          }}
                        >
                          {key}
                        </kbd>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div
          style={{
            marginTop: '24px',
            paddingTop: '24px',
            borderTop: '1px solid #eee',
            textAlign: 'center',
          }}
        >
          <button
            onClick={onClose}
            className="btn btn-primary"
            style={{
              padding: '10px 24px',
            }}
          >
            {t.closeHelp}
          </button>
        </div>
      </div>
    </div>
  );
};

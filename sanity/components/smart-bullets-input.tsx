'use client';

import React, { useState, useCallback } from 'react';
import { ArrayOfPrimitivesInputProps, set, unset } from 'sanity';
import { ListPlus, Sparkles, X, Check, Trash2 } from 'lucide-react';

/**
 * Normalizes multi-line text pasted from Word, Google Docs, Notion, or text files:
 * 1. Splits lines by newline characters (\r\n or \n).
 * 2. Strips leading bullet symbols: •, -, *, ◦, ‣, ⁃, etc.
 * 3. Strips numbered list markers: "1.", "1)", "(1)", etc.
 * 4. Trims whitespace and removes empty lines.
 */
export function parseBulletLines(rawText: string): string[] {
  if (!rawText) return [];

  return rawText
    .split(/\r?\n+/)
    .map((line) => {
      return line
        .replace(/^[\s\t]*[•\-\*\u2022\u25E6\u2043\u2219\u25AA\u25CF\u25B8\u27A4]+\s*/, '')
        .replace(/^[\s\t]*\(?\d+[\.\)]\s*/, '')
        .trim();
    })
    .filter((line) => line.length > 0);
}

export function SmartBulletsInput(props: ArrayOfPrimitivesInputProps<any>) {
  const { value = [], onChange, readOnly } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [previewItems, setPreviewItems] = useState<string[]>([]);
  const [mode, setMode] = useState<'append' | 'replace'>('append');

  // Live preview as user types/pastes into bulk box
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const raw = e.currentTarget.value;
    setPasteText(raw);
    setPreviewItems(parseBulletLines(raw));
  };

  // Commit split bullets into Sanity array
  const handleApply = useCallback(() => {
    const cleaned = parseBulletLines(pasteText);
    if (cleaned.length === 0) return;

    const currentArray = Array.isArray(value) ? value : [];
    const nextValue = mode === 'replace' ? cleaned : [...currentArray, ...cleaned];
    onChange(set(nextValue));

    // Reset box
    setPasteText('');
    setPreviewItems([]);
    setIsOpen(false);
  }, [pasteText, mode, value, onChange]);

  const handleClearAll = useCallback(() => {
    if (typeof window !== 'undefined' && window.confirm('Are you sure you want to clear all bullet points?')) {
      onChange(unset());
    }
  }, [onChange]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
      {/* Top Banner & Quick Paste Toggle */}
      {!readOnly && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(0, 82, 204, 0.04) 0%, rgba(255, 122, 0, 0.04) 100%)',
            border: '1px solid rgba(0, 82, 204, 0.2)',
            borderRadius: '8px',
            padding: '10px 14px',
            fontFamily: 'inherit',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  background: 'rgba(0, 82, 204, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0052cc',
                }}
              >
                <Sparkles size={14} />
              </div>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#091e42' }}>
                  Smart Multi-line Paste
                </span>
                <span
                  style={{
                    marginLeft: '8px',
                    fontSize: '10px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    background: '#e9f2ff',
                    color: '#0052cc',
                    padding: '2px 6px',
                    borderRadius: '4px',
                  }}
                >
                  Auto-Split
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {Array.isArray(value) && value.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    fontWeight: 500,
                    color: '#c9372c',
                    background: 'transparent',
                    border: '1px solid rgba(201, 55, 44, 0.25)',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  <Trash2 size={12} />
                  Clear All ({value.length})
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: isOpen ? '#ffffff' : '#0052cc',
                  background: isOpen ? '#0052cc' : '#ffffff',
                  border: '1px solid #0052cc',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                }}
              >
                {isOpen ? <X size={13} /> : <ListPlus size={13} />}
                {isOpen ? 'Close Quick-Paste' : 'Paste Multiple Bullets'}
              </button>
            </div>
          </div>

          {/* Quick-Paste Drawer */}
          {isOpen && (
            <div
              style={{
                marginTop: '12px',
                paddingTop: '12px',
                borderTop: '1px solid rgba(0, 82, 204, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <p style={{ margin: 0, fontSize: '12px', color: '#5e6c84', lineHeight: 1.4 }}>
                Copy any bullet list from <strong>Word, Notion, Google Docs, or text files</strong> and paste below.
                It will automatically strip bullet symbols (<code style={{ background: '#f4f5f7', padding: '1px 4px', borderRadius: '3px' }}>•</code>, <code style={{ background: '#f4f5f7', padding: '1px 4px', borderRadius: '3px' }}>-</code>, <code style={{ background: '#f4f5f7', padding: '1px 4px', borderRadius: '3px' }}>1.</code>) and split each line into its own Sanity item.
              </p>

              <textarea
                rows={5}
                value={pasteText}
                onChange={handleTextChange}
                placeholder={`Paste lines here, for example:\n• 1,200t Heavy Lift Crane Capacity\n• 48-Inch HDD Inter-tidal Crossing\n• 3.2M Safe Man-Hours without LTI\n• ISO 9001:2015 Certified Operations`}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  lineHeight: 1.5,
                  borderRadius: '6px',
                  border: '1px solid #c1c7d0',
                  boxSizing: 'border-box',
                  outline: 'none',
                  resize: 'vertical',
                }}
              />

              {previewItems.length > 0 && (
                <div
                  style={{
                    background: '#f3fbf7',
                    border: '1px solid #abf5d1',
                    borderRadius: '6px',
                    padding: '10px 12px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                      flexWrap: 'wrap',
                      gap: '6px',
                    }}
                  >
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#216e4e' }}>
                      Detected {previewItems.length} separate bullet item{previewItems.length === 1 ? '' : 's'}:
                    </span>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => setMode('append')}
                        style={{
                          fontSize: '11px',
                          fontWeight: mode === 'append' ? 700 : 500,
                          padding: '3px 8px',
                          borderRadius: '4px',
                          border: mode === 'append' ? '1px solid #0052cc' : '1px solid #c1c7d0',
                          background: mode === 'append' ? '#0052cc' : '#ffffff',
                          color: mode === 'append' ? '#ffffff' : '#333333',
                          cursor: 'pointer',
                        }}
                      >
                        Append (+{previewItems.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setMode('replace')}
                        style={{
                          fontSize: '11px',
                          fontWeight: mode === 'replace' ? 700 : 500,
                          padding: '3px 8px',
                          borderRadius: '4px',
                          border: mode === 'replace' ? '1px solid #c9372c' : '1px solid #c1c7d0',
                          background: mode === 'replace' ? '#c9372c' : '#ffffff',
                          color: mode === 'replace' ? '#ffffff' : '#333333',
                          cursor: 'pointer',
                        }}
                      >
                        Replace All ({previewItems.length})
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {previewItems.slice(0, 5).map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          fontSize: '12px',
                          color: '#172b4d',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <span style={{ color: '#0052cc', fontWeight: 700, marginRight: '6px' }}>•</span>
                        {item}
                      </div>
                    ))}
                    {previewItems.length > 5 && (
                      <div style={{ fontSize: '11px', color: '#6b778c', fontStyle: 'italic', marginTop: '2px' }}>
                        ...and {previewItems.length - 5} more items
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setPasteText('');
                    setPreviewItems([]);
                  }}
                  style={{
                    background: 'transparent',
                    border: '1px solid #dfe1e6',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#42526e',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={previewItems.length === 0}
                  onClick={handleApply}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    background: previewItems.length === 0 ? '#ebecf0' : '#0052cc',
                    color: previewItems.length === 0 ? '#a5b2c6' : '#ffffff',
                    border: 'none',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: previewItems.length === 0 ? 'not-allowed' : 'pointer',
                    boxShadow: previewItems.length === 0 ? 'none' : '0 1px 3px rgba(0, 82, 204, 0.3)',
                  }}
                >
                  <Check size={13} />
                  Add {previewItems.length || ''} Bullet Point{previewItems.length === 1 ? '' : 's'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Render Sanity default reorderable array list underneath */}
      {props.renderDefault(props)}
    </div>
  );
}

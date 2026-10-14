'use client';

import React from 'react';
import { ObjectInputProps, set, unset } from 'sanity';
import { ExternalLink, Globe, Palette, Check } from 'lucide-react';

interface LinkValue {
  href?: string;
  color?: 'blue' | 'orange' | 'navy' | 'inherit';
  openInNewTab?: boolean;
}

const COLOR_OPTIONS = [
  { value: 'blue', label: 'Brand Blue', hex: '#1470AD' },
  { value: 'orange', label: 'Accent Orange', hex: '#f4691a' },
  { value: 'navy', label: 'Deep Navy', hex: '#001723' },
  { value: 'inherit', label: 'Default Text', hex: '#6b778c' },
] as const;

/**
 * Compact, single-row WordPress / Notion-style link editor for PortableText annotations.
 * Replaces Sanity's tall multi-card modal with a fast, high-density toolbar.
 */
export function CompactLinkInput(props: ObjectInputProps<LinkValue>) {
  const { value, onChange, readOnly } = props;

  const href = value?.href || '';
  const color = value?.color || 'blue';
  const openInNewTab = Boolean(value?.openInNewTab);

  const handleHrefChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextHref = e.target.value;
    if (!nextHref) {
      onChange(unset(['href']));
    } else {
      onChange(set(nextHref, ['href']));
    }
  };

  const handleColorChange = (newColor: 'blue' | 'orange' | 'navy' | 'inherit') => {
    onChange(set(newColor, ['color']));
  };

  const handleToggleTab = () => {
    onChange(set(!openInNewTab, ['openInNewTab']));
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '12px',
        background: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #dfe1e6',
        boxShadow: '0 4px 12px rgba(0, 23, 35, 0.08)',
        fontFamily: 'inherit',
        maxWidth: '480px',
      }}
    >
      {/* Row 1: URL input + Open In New Tab button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            position: 'relative',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Globe
            size={14}
            style={{
              position: 'absolute',
              left: '10px',
              color: '#6b778c',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            value={href}
            onChange={handleHrefChange}
            readOnly={readOnly}
            placeholder="Paste URL or /internal-path (e.g. /capabilities)"
            style={{
              width: '100%',
              padding: '8px 10px 8px 32px',
              fontSize: '13px',
              fontFamily: 'inherit',
              borderRadius: '6px',
              border: '1px solid #c1c7d0',
              outline: 'none',
              boxSizing: 'border-box',
              background: '#fafbfc',
            }}
          />
        </div>

        {/* External test link button */}
        {href && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            title="Test open link in new tab"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              border: '1px solid #dfe1e6',
              background: '#f4f5f7',
              color: '#0052cc',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <ExternalLink size={14} />
          </a>
        )}
      </div>

      {/* Row 2: Color swatches + Open in new tab toggle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          paddingTop: '6px',
          borderTop: '1px solid #ebecf0',
        }}
      >
        {/* Color picker swatches */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Palette size={13} style={{ color: '#6b778c', marginRight: '2px' }} />
          {COLOR_OPTIONS.map((opt) => {
            const isSelected = color === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleColorChange(opt.value)}
                title={opt.label}
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: opt.hex,
                  border: isSelected ? '2px solid #0052cc' : '1px solid rgba(0,0,0,0.15)',
                  boxShadow: isSelected ? '0 0 0 2px rgba(0, 82, 204, 0.25)' : 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  transition: 'transform 0.1s ease',
                  transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                }}
              >
                {isSelected && <Check size={11} color="#ffffff" strokeWidth={3} />}
              </button>
            );
          })}
          <span style={{ fontSize: '11px', color: '#6b778c', marginLeft: '4px' }}>
            {COLOR_OPTIONS.find((c) => c.value === color)?.label}
          </span>
        </div>

        {/* New Tab Toggle */}
        <label
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            color: openInNewTab ? '#0052cc' : '#42526e',
            fontWeight: openInNewTab ? 600 : 500,
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <input
            type="checkbox"
            checked={openInNewTab}
            onChange={handleToggleTab}
            disabled={readOnly}
            style={{ cursor: 'pointer', accentColor: '#0052cc' }}
          />
          Open in new window
        </label>
      </div>
    </div>
  );
}

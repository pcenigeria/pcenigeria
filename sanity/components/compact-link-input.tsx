'use client';

import React from 'react';
import { ObjectInputProps, set, unset } from 'sanity';
import { ExternalLink, Globe, Palette, Check, Trash2, X } from 'lucide-react';

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
 * Provides:
 * 1. Quick URL / Path input
 * 2. Visual color swatches
 * 3. Open in new tab toggle
 * 4. Close button: cleanly dismisses the popover
 * 5. Remove link button: unsets href and color, or triggers Sanity remove
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

  // Helper to programmatically trigger the close of the Sanity popover/modal
  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Search upwards from this component for the popover/modal container and close button
    const container = (e?.currentTarget as HTMLElement)?.closest('[data-ui="Popover__content"], [data-testid="popover-edit-dialog"], [data-ui="Dialog"]');
    if (container) {
      const closeBtn = container.querySelector<HTMLButtonElement>('button[aria-label*="Close"], button[aria-label*="close"], [data-testid="close-button"]');
      if (closeBtn) {
        closeBtn.click();
        return;
      }
    }
    // Fallback: simulate Escape key to dismiss the popover
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true }));
  };

  // Helper to remove link from the selected text
  const handleRemoveLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // 1. Clear all link fields so value is completely empty
    onChange(unset());

    // 2. Look for Sanity's native remove annotation button in the floating popover
    const nativeRemoveBtn = document.querySelector<HTMLButtonElement>('[data-testid^="remove-annotation-button"]');
    if (nativeRemoveBtn) {
      nativeRemoveBtn.click();
    }

    // 3. Close the popover
    setTimeout(() => {
      handleClose();
    }, 50);
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
        boxShadow: '0 4px 14px rgba(0, 23, 35, 0.08)',
        fontFamily: 'inherit',
        maxWidth: '480px',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Header bar: "Edit Link" badge, Remove Link button, and Close (X) button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '8px',
          borderBottom: '1px solid #ebecf0',
        }}
      >
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: '#0052cc',
            background: '#e9f2ff',
            padding: '2px 6px',
            borderRadius: '4px',
          }}
        >
          Edit Link
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {/* Remove Link Button */}
          <button
            type="button"
            onClick={handleRemoveLink}
            title="Remove Link from text"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              background: 'transparent',
              border: 'none',
              color: '#c9372c',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '4px 6px',
              borderRadius: '4px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#ffebe6')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <Trash2 size={12} />
            Remove Link
          </button>

          {/* Close / Dismiss (X) Button */}
          <button
            type="button"
            onClick={handleClose}
            title="Done / Close link editor (Escape)"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              color: '#6b778c',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f4f5f7')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <X size={14} />
          </button>
        </div>
      </div>

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

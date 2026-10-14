'use client';

import React, { useState } from 'react';
import {
  Eye,
  Monitor,
  Tablet,
  Smartphone,
  RotateCw,
  Radio,
  ExternalLink,
} from 'lucide-react';

interface ArticlePreviewPaneProps {
  document?: {
    displayed?: any;
    draft?: any;
    published?: any;
  };
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export function ArticlePreviewPane({ document }: ArticlePreviewPaneProps) {
  const [device, setDevice] = useState<DeviceMode>('desktop');
  const [key, setKey] = useState<number>(0);

  const doc = document?.displayed || document?.draft || document?.published;
  const slug = doc?.slug?.current as string | undefined;
  const title = (doc?.title as string) || 'Untitled Article';

  if (!slug) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: '40px 20px',
          textAlign: 'center',
          backgroundColor: '#0a1017',
          color: '#e6edf3',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            backgroundColor: '#162230',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            border: '1px solid #30363d',
            color: '#38bdf8',
          }}
        >
          <Eye size={30} />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 10px 0', color: '#ffffff' }}>
          URL Slug Required for Live Preview
        </h2>
        <p style={{ maxWidth: '440px', fontSize: '14px', lineHeight: '1.6', color: '#8b949e', margin: '0 0 20px 0' }}>
          Please fill in the <strong>Article Title</strong> in the editor and click <strong>Generate</strong> on the <strong>URL Slug</strong> field. Once a slug is set, live preview will load immediately.
        </p>
      </div>
    );
  }

  const previewUrl = `/api/draft-mode/enable?slug=${encodeURIComponent(slug)}`;

  const deviceWidths: Record<DeviceMode, string> = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  };

  const handleRefresh = () => {
    setKey((prev) => prev + 1);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#070d14',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Preview Header Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          backgroundColor: '#0d1824',
          borderBottom: '1px solid #1c2b3d',
          color: '#ffffff',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {/* Left: Device Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '12px', color: '#8b949e', marginRight: '6px' }}>Device:</span>
          {(['desktop', 'tablet', 'mobile'] as DeviceMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setDevice(mode)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                fontSize: '12px',
                fontWeight: device === mode ? 600 : 400,
                color: device === mode ? '#ffffff' : '#8b949e',
                backgroundColor: device === mode ? '#1470AD' : '#141f2d',
                border: '1px solid',
                borderColor: device === mode ? '#1f8bd4' : '#223447',
                borderRadius: '6px',
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.15s ease',
              }}
            >
              {mode === 'desktop' && <Monitor size={14} />}
              {mode === 'tablet' && <Tablet size={14} />}
              {mode === 'mobile' && <Smartphone size={14} />}
              {mode}
            </button>
          ))}

          <button
            onClick={handleRefresh}
            title="Reload preview"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 10px',
              fontSize: '12px',
              color: '#8b949e',
              backgroundColor: '#141f2d',
              border: '1px solid #223447',
              borderRadius: '6px',
              cursor: 'pointer',
              marginLeft: '6px',
            }}
          >
            <RotateCw size={13} />
            Refresh
          </button>
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              padding: '3px 8px',
              borderRadius: '4px',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              color: '#f59e0b',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              fontWeight: 500,
            }}
          >
            <Radio size={12} color="#f59e0b" />
            Draft Mode Active
          </span>
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: '#38bdf8',
              textDecoration: 'none',
              padding: '5px 10px',
              borderRadius: '6px',
              backgroundColor: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              fontWeight: 500,
            }}
          >
            Open in New Window
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* Preview Frame Wrapper */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: device === 'desktop' ? '0' : '24px 16px',
          backgroundColor: '#050a10',
        }}
      >
        <div
          style={{
            width: deviceWidths[device],
            height: device === 'desktop' ? '100%' : 'calc(100% - 48px)',
            minHeight: device === 'desktop' ? '100%' : '800px',
            maxHeight: '100%',
            backgroundColor: '#ffffff',
            borderRadius: device === 'desktop' ? '0' : '12px',
            overflow: 'hidden',
            boxShadow: device === 'desktop' ? 'none' : '0 20px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)',
            transition: 'width 0.25s ease',
            display: 'flex',
          }}
        >
          <iframe
            key={key}
            src={previewUrl}
            title={`Preview of ${title}`}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              backgroundColor: '#ffffff',
            }}
          />
        </div>
      </div>
    </div>
  );
}

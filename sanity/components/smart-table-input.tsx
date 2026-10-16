'use client';

import React, { useState, useCallback, useId } from 'react';
import { ObjectInputProps, set, unset } from 'sanity';
import {
  Table as TableIcon,
  Sparkles,
  Plus,
  Trash2,
  Heading,
  Check,
  X,
  RotateCcw,
  Rows3,
  Columns3,
  ClipboardPaste,
  HelpCircle,
} from 'lucide-react';

export interface TableRow {
  _key: string;
  cells: string[];
}

export interface TableValue {
  _type?: 'tableWidget';
  title?: string;
  hasHeaderRow?: boolean;
  rows?: TableRow[];
}

/**
 * Parses raw HTML table (copied from Word, Google Docs, or Web browser)
 */
export function parseHtmlTable(html: string): string[][] | null {
  if (!html || !/<table[\s\S]*?>[\s\S]*?<\/table>/i.test(html)) {
    return null;
  }
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const trElements = doc.querySelectorAll('tr');
    if (trElements.length === 0) return null;

    const htmlRows: string[][] = [];
    trElements.forEach((tr) => {
      const cells: string[] = [];
      tr.querySelectorAll('th, td').forEach((cell) => {
        // Clean inner text, replace multiple spaces/newlines inside cell
        const cleanText = (cell.textContent || '')
          .replace(/[\r\n]+/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        cells.push(cleanText);
      });
      if (cells.length > 0 && cells.some((c) => c.length > 0)) {
        htmlRows.push(cells);
      }
    });

    return htmlRows.length > 0 ? htmlRows : null;
  } catch {
    return null;
  }
}

/**
 * Universal Table Parser:
 * Takes text copied from Word, Excel, Google Sheets, HTML tables, or CSV/Markdown,
 * and extracts a 2D matrix of strings (rows & columns).
 */
export function parsePastedTable(
  rawText: string,
  rawHtml?: string,
  forcedColCount?: number
): { rows: string[][]; detectedDelimiter: string } {
  // 1. If HTML table snippet is present (either passed from clipboard or pasted in text)
  if (rawHtml) {
    const fromHtml = parseHtmlTable(rawHtml);
    if (fromHtml && fromHtml.length > 0) {
      return { rows: fromHtml, detectedDelimiter: 'word-html' };
    }
  }

  if (rawText && /<table[\s\S]*?>[\s\S]*?<\/table>/i.test(rawText)) {
    const fromHtml = parseHtmlTable(rawText);
    if (fromHtml && fromHtml.length > 0) {
      return { rows: fromHtml, detectedDelimiter: 'html' };
    }
  }

  if (!rawText || !rawText.trim()) {
    return { rows: [], detectedDelimiter: 'none' };
  }

  // 2. Normalize line breaks
  const rawLines = rawText
    .split(/\r?\n+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (rawLines.length === 0) {
    return { rows: [], detectedDelimiter: 'none' };
  }

  // 3. Check for Markdown table format: | Col 1 | Col 2 |
  const isMarkdown = rawLines.every((l) => l.startsWith('|') && l.endsWith('|'));
  if (isMarkdown && rawLines.length > 0) {
    const mdRows: string[][] = [];
    for (const line of rawLines) {
      if (/^\|[\s\-:]+(\|[\s\-:]+)+\|$/.test(line)) continue;
      const cells = line
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim());
      mdRows.push(cells);
    }
    return { rows: mdRows, detectedDelimiter: 'markdown' };
  }

  // 4. Check for Tab-separated values (Word, Excel, Google Docs table standard)
  const linesWithTabs = rawLines.filter((l) => l.includes('\t'));
  if (linesWithTabs.length >= Math.ceil(rawLines.length * 0.4)) {
    const tsvRows = rawLines.map((l) => l.split('\t').map((c) => c.trim()));
    return { rows: tsvRows, detectedDelimiter: 'tsv (tabs)' };
  }

  // 5. Check for 2+ consecutive spaces as column delimiter (common when copying from PDF / plain text tables)
  const linesWithMultiSpace = rawLines.filter((l) => /\s{2,}/.test(l));
  if (linesWithMultiSpace.length >= Math.ceil(rawLines.length * 0.5)) {
    const spaceRows = rawLines.map((l) => l.split(/\s{2,}/).map((c) => c.trim()));
    return { rows: spaceRows, detectedDelimiter: 'spaced columns' };
  }

  // 6. Check for CSV (Comma-separated)
  const linesWithCommas = rawLines.filter((l) => l.includes(','));
  if (linesWithCommas.length >= Math.ceil(rawLines.length * 0.6)) {
    const csvRows = rawLines.map((l) => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < l.length; i++) {
        const char = l[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    });
    return { rows: csvRows, detectedDelimiter: 'csv' };
  }

  // 7. Check for Semicolon-separated (European Excel export)
  const linesWithSemi = rawLines.filter((l) => l.includes(';'));
  if (linesWithSemi.length >= Math.ceil(rawLines.length * 0.6)) {
    const semiRows = rawLines.map((l) => l.split(';').map((c) => c.trim()));
    return { rows: semiRows, detectedDelimiter: 'semicolon' };
  }

  // 8. If user selected a forced column count (e.g. 3 columns sequential)
  if (forcedColCount && forcedColCount > 1) {
    const chunkedRows: string[][] = [];
    for (let i = 0; i < rawLines.length; i += forcedColCount) {
      const slice = rawLines.slice(i, i + forcedColCount);
      while (slice.length < forcedColCount) {
        slice.push('');
      }
      chunkedRows.push(slice);
    }
    return { rows: chunkedRows, detectedDelimiter: `${forcedColCount}-col sequential` };
  }

  // Fallback: single column list
  const fallbackRows = rawLines.map((l) => [l.trim()]);
  return { rows: fallbackRows, detectedDelimiter: '1-col list' };
}

function generateKey(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function SmartTableInput(props: ObjectInputProps<TableValue>) {
  const { value, onChange, readOnly } = props;
  const componentId = useId();

  const title = value?.title || '';
  const hasHeaderRow = value?.hasHeaderRow !== false; // default true
  const rows: TableRow[] = value?.rows && Array.isArray(value.rows) ? value.rows : [];

  // Determine maximum column count
  const colCount = Math.max(1, ...rows.map((r) => (r.cells ? r.cells.length : 0)));

  // State for Paste Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [cachedHtml, setCachedHtml] = useState<string>('');
  const [splitByCols, setSplitByCols] = useState<number>(0); // 0 = auto-detect, 2 = 2 cols, 3 = 3 cols, etc.
  const [parsedPreview, setParsedPreview] = useState<{ rows: string[][]; detectedDelimiter: string }>({
    rows: [],
    detectedDelimiter: 'none',
  });
  const [headerOption, setHeaderOption] = useState<boolean>(true);
  const [pasteMode, setPasteMode] = useState<'replace' | 'append'>('replace');

  // Trigger parsing with current settings
  const runParser = useCallback(
    (text: string, html: string, cols: number) => {
      const parsed = parsePastedTable(text, html, cols);
      setParsedPreview(parsed);
    },
    []
  );

  // Intercept native onPaste event to capture rich HTML from Word / Excel!
  const handleNativePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const html = e.clipboardData.getData('text/html');
    const text = e.clipboardData.getData('text/plain');

    if (html && /<table/i.test(html)) {
      setCachedHtml(html);
      setPasteText(text);
      runParser(text, html, splitByCols);
    } else {
      setCachedHtml('');
      setPasteText(text);
      runParser(text, '', splitByCols);
    }
  };

  // Live parse as user types or modifies text in textarea
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const raw = e.currentTarget.value;
    setPasteText(raw);
    runParser(raw, cachedHtml, splitByCols);
  };

  // Change column count reshaping setting
  const handleColumnSplitChange = (newCols: number) => {
    setSplitByCols(newCols);
    runParser(pasteText, cachedHtml, newCols);
  };

  // Commit pasted table to Sanity
  const handleApplyPaste = useCallback(() => {
    if (parsedPreview.rows.length === 0) return;

    // Normalize column counts so all rows have equal columns
    const maxCols = Math.max(...parsedPreview.rows.map((r) => r.length));
    const newSanityRows: TableRow[] = parsedPreview.rows.map((row) => {
      const paddedCells = [...row];
      while (paddedCells.length < maxCols) {
        paddedCells.push('');
      }
      return {
        _key: generateKey(),
        cells: paddedCells,
      };
    });

    const finalRows = pasteMode === 'replace' ? newSanityRows : [...rows, ...newSanityRows];

    onChange(
      set({
        ...value,
        _type: 'tableWidget',
        hasHeaderRow: headerOption,
        rows: finalRows,
      })
    );

    // Reset drawer state
    setPasteText('');
    setCachedHtml('');
    setParsedPreview({ rows: [], detectedDelimiter: 'none' });
    setIsDrawerOpen(false);
  }, [parsedPreview, pasteMode, rows, value, headerOption, onChange]);

  // Update a single cell value
  const handleCellChange = (rIdx: number, cIdx: number, newVal: string) => {
    const nextRows = rows.map((r, i) => {
      if (i !== rIdx) return r;
      const nextCells = [...(r.cells || [])];
      while (nextCells.length <= cIdx) nextCells.push('');
      nextCells[cIdx] = newVal;
      return { ...r, cells: nextCells };
    });

    onChange(set(nextRows, ['rows']));
  };

  // Add a new row at bottom
  const handleAddRow = () => {
    const emptyCells = Array.from({ length: colCount }, () => '');
    const newRow: TableRow = {
      _key: generateKey(),
      cells: emptyCells,
    };
    onChange(set([...rows, newRow], ['rows']));
  };

  // Remove a specific row
  const handleDeleteRow = (rIdx: number) => {
    const nextRows = rows.filter((_, i) => i !== rIdx);
    onChange(set(nextRows, ['rows']));
  };

  // Add a new column to the right
  const handleAddColumn = () => {
    if (rows.length === 0) {
      onChange(set([{ _key: generateKey(), cells: [''] }], ['rows']));
      return;
    }
    const nextRows = rows.map((r) => ({
      ...r,
      cells: [...(r.cells || []), ''],
    }));
    onChange(set(nextRows, ['rows']));
  };

  // Delete a specific column across all rows
  const handleDeleteColumn = (cIdx: number) => {
    if (colCount <= 1) return;
    const nextRows = rows.map((r) => {
      const nextCells = (r.cells || []).filter((_, i) => i !== cIdx);
      return { ...r, cells: nextCells };
    });
    onChange(set(nextRows, ['rows']));
  };

  // Toggle Header Row
  const handleToggleHeader = () => {
    onChange(set(!hasHeaderRow, ['hasHeaderRow']));
  };

  // Update Table Title/Caption
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;
    if (!val) {
      onChange(unset(['title']));
    } else {
      onChange(set(val, ['title']));
    }
  };

  // Clear all rows
  const handleClearTable = () => {
    if (typeof window !== 'undefined' && window.confirm('Are you sure you want to clear this entire table?')) {
      onChange(set([], ['rows']));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
      {/* Quick Paste Callout & Action Bar */}
      {!readOnly && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(0, 82, 204, 0.04) 0%, rgba(255, 122, 0, 0.04) 100%)',
            border: '1px solid rgba(0, 82, 204, 0.2)',
            borderRadius: '10px',
            padding: '12px 16px',
            fontFamily: 'inherit',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(0, 82, 204, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0052cc',
                  flexShrink: 0,
                }}
              >
                <TableIcon size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '13px', color: '#101112' }}>
                  Smart Table Editor & Word/Excel Importer
                </div>
                <div style={{ fontSize: '11px', color: '#6e7683' }}>
                  Copy any table directly from Microsoft Word, Excel, or Google Docs and paste it here.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setIsDrawerOpen((prev) => !prev)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  borderRadius: '6px',
                  background: isDrawerOpen ? '#0052cc' : '#ffffff',
                  color: isDrawerOpen ? '#ffffff' : '#0052cc',
                  border: '1px solid #0052cc',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                }}
              >
                <ClipboardPaste size={14} />
                {isDrawerOpen ? 'Close Importer' : 'Paste from Word / Excel'}
              </button>

              {rows.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearTable}
                  title="Clear all rows"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 10px',
                    fontSize: '11px',
                    color: '#c53030',
                    background: 'transparent',
                    border: '1px solid rgba(197, 48, 48, 0.25)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  <RotateCcw size={12} />
                  Clear Table
                </button>
              )}
            </div>
          </div>

          {/* Paste Drawer Panel */}
          {isDrawerOpen && (
            <div
              style={{
                marginTop: '14px',
                paddingTop: '14px',
                borderTop: '1px solid rgba(0, 82, 204, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label
                    htmlFor={`paste-box-${componentId}`}
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      color: '#2a2f36',
                    }}
                  >
                    Paste Copied Table Content Here (Ctrl+V or ⌘V)
                  </label>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    Tip: Copy directly from Microsoft Word / Google Docs with ⌘C or Ctrl+C
                  </span>
                </div>
                <textarea
                  id={`paste-box-${componentId}`}
                  value={pasteText}
                  onChange={handleTextChange}
                  onPaste={handleNativePaste}
                  rows={6}
                  placeholder={`Example copied from Word / Excel:\nProject details\tAKK\tOB3\nPipeline diameter\t40 inches\t48 inches\nHDD crossing length\t1,565 metres\t2,000 metres\nReported crossing depth\t16 metres\t52 metres`}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '12px',
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                    lineHeight: '1.4',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    background: '#ffffff',
                    resize: 'vertical',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Column Splitting & Auto-Format Controls */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px',
                  background: '#ffffff',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}>
                    Format / Layout:
                  </span>
                  {[
                    { label: 'Auto-Detect', val: 0 },
                    { label: '2 Columns', val: 2 },
                    { label: '3 Columns', val: 3 },
                    { label: '4 Columns', val: 4 },
                    { label: '5 Columns', val: 5 },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => handleColumnSplitChange(opt.val)}
                      style={{
                        padding: '4px 8px',
                        fontSize: '11px',
                        fontWeight: splitByCols === opt.val ? 700 : 500,
                        borderRadius: '4px',
                        border: '1px solid',
                        borderColor: splitByCols === opt.val ? '#0052cc' : '#cbd5e1',
                        background: splitByCols === opt.val ? 'rgba(0, 82, 204, 0.08)' : '#ffffff',
                        color: splitByCols === opt.val ? '#0052cc' : '#475569',
                        cursor: 'pointer',
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {parsedPreview.rows.length > 0 && (
                  <div style={{ fontSize: '11px', color: '#0052cc', fontWeight: 600 }}>
                    Detected: {parsedPreview.rows.length} rows ×{' '}
                    {Math.max(...parsedPreview.rows.map((r) => r.length))} cols ({parsedPreview.detectedDelimiter.toUpperCase()})
                  </div>
                )}
              </div>

              {/* Paste Options Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px',
                  fontSize: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={headerOption}
                      onChange={(e) => setHeaderOption(e.target.checked)}
                      style={{ accentColor: '#0052cc' }}
                    />
                    <span style={{ fontWeight: 500, color: '#2a2f36' }}>First row is header</span>
                  </label>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#6e7683' }}>Mode:</span>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name={`paste-mode-${componentId}`}
                        checked={pasteMode === 'replace'}
                        onChange={() => setPasteMode('replace')}
                        style={{ accentColor: '#0052cc' }}
                      />
                      <span>Replace Table</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name={`paste-mode-${componentId}`}
                        checked={pasteMode === 'append'}
                        onChange={() => setPasteMode('append')}
                        style={{ accentColor: '#0052cc' }}
                      />
                      <span>Append Rows</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Live Preview Box */}
              {parsedPreview.rows.length > 0 && (
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '8px 10px',
                    maxHeight: '180px',
                    overflowX: 'auto',
                    overflowY: 'auto',
                  }}
                >
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                    <tbody>
                      {parsedPreview.rows.slice(0, 8).map((row, rIdx) => (
                        <tr
                          key={rIdx}
                          style={{
                            background: rIdx === 0 && headerOption ? '#edf2f7' : '#ffffff',
                            fontWeight: rIdx === 0 && headerOption ? 700 : 400,
                            borderBottom: '1px solid #e2e8f0',
                          }}
                        >
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} style={{ padding: '4px 8px', borderRight: '1px solid #e2e8f0' }}>
                              {cell || <span style={{ color: '#94a3b8' }}>(empty)</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {parsedPreview.rows.length > 8 && (
                    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px', textAlign: 'center' }}>
                      + {parsedPreview.rows.length - 8} more rows detected...
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    background: 'transparent',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    color: '#475569',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={parsedPreview.rows.length === 0}
                  onClick={handleApplyPaste}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: 600,
                    borderRadius: '6px',
                    background: parsedPreview.rows.length === 0 ? '#cbd5e1' : '#0052cc',
                    color: '#ffffff',
                    border: 'none',
                    cursor: parsedPreview.rows.length === 0 ? 'not-allowed' : 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  }}
                >
                  <Check size={14} />
                  Insert {parsedPreview.rows.length} Rows into Table
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Table Metadata Bar (Caption & Header Switch) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          padding: '8px 12px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
        }}
      >
        <div style={{ flex: '1 1 240px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>
            Table Caption / Title:
          </span>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="e.g. Technical Rig Specifications & Capacities"
            disabled={readOnly}
            style={{
              flex: 1,
              padding: '6px 10px',
              fontSize: '12px',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={handleToggleHeader}
            disabled={readOnly}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 10px',
              fontSize: '11px',
              fontWeight: 600,
              borderRadius: '6px',
              background: hasHeaderRow ? 'rgba(0, 82, 204, 0.1)' : '#f1f5f9',
              color: hasHeaderRow ? '#0052cc' : '#64748b',
              border: `1px solid ${hasHeaderRow ? 'rgba(0, 82, 204, 0.3)' : '#cbd5e1'}`,
              cursor: readOnly ? 'default' : 'pointer',
            }}
          >
            <Heading size={12} />
            {hasHeaderRow ? 'Header Row: ON' : 'Header Row: OFF'}
          </button>

          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
            {rows.length} {rows.length === 1 ? 'Row' : 'Rows'} × {colCount}{' '}
            {colCount === 1 ? 'Column' : 'Columns'}
          </span>
        </div>
      </div>

      {/* Spreadsheet Grid Editor */}
      <div
        style={{
          border: '1px solid #cbd5e1',
          borderRadius: '8px',
          overflow: 'hidden',
          background: '#ffffff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '400px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
                <th
                  style={{
                    width: '36px',
                    padding: '6px',
                    fontSize: '10px',
                    color: '#94a3b8',
                    textAlign: 'center',
                    borderRight: '1px solid #e2e8f0',
                  }}
                >
                  #
                </th>
                {Array.from({ length: colCount }).map((_, cIdx) => (
                  <th
                    key={cIdx}
                    style={{
                      padding: '6px 8px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#475569',
                      textAlign: 'left',
                      borderRight: '1px solid #e2e8f0',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>Column {cIdx + 1}</span>
                      {!readOnly && colCount > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteColumn(cIdx)}
                          title="Delete this column"
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            padding: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            borderRadius: '4px',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  </th>
                ))}
                {!readOnly && (
                  <th
                    style={{
                      width: '40px',
                      padding: '6px',
                      textAlign: 'center',
                    }}
                  >
                    <button
                      type="button"
                      onClick={handleAddColumn}
                      title="Add new column to the right"
                      style={{
                        background: 'rgba(0, 82, 204, 0.08)',
                        border: '1px solid rgba(0, 82, 204, 0.25)',
                        color: '#0052cc',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        padding: '3px 6px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        fontSize: '11px',
                        fontWeight: 600,
                      }}
                    >
                      <Plus size={12} />
                    </button>
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={colCount + 2}
                    style={{
                      padding: '28px',
                      textAlign: 'center',
                      color: '#64748b',
                      fontSize: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <TableIcon size={24} style={{ opacity: 0.4 }} />
                      <div>This table currently has no rows.</div>
                      {!readOnly && (
                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                          <button
                            type="button"
                            onClick={handleAddRow}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '5px 10px',
                              fontSize: '11px',
                              background: '#ffffff',
                              border: '1px solid #cbd5e1',
                              borderRadius: '6px',
                              cursor: 'pointer',
                            }}
                          >
                            <Plus size={12} />
                            Add Empty Row
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsDrawerOpen(true)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '5px 10px',
                              fontSize: '11px',
                              background: '#0052cc',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                            }}
                          >
                            <ClipboardPaste size={12} />
                            Paste from Word / Excel
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                rows.map((row, rIdx) => {
                  const isHeader = rIdx === 0 && hasHeaderRow;
                  return (
                    <tr
                      key={row._key || rIdx}
                      style={{
                        background: isHeader ? '#f1f5f9' : rIdx % 2 === 0 ? '#ffffff' : '#fcfcfc',
                        borderBottom: '1px solid #e2e8f0',
                      }}
                    >
                      {/* Row Number */}
                      <td
                        style={{
                          padding: '6px',
                          textAlign: 'center',
                          fontSize: '10px',
                          fontWeight: isHeader ? 700 : 500,
                          color: isHeader ? '#0052cc' : '#94a3b8',
                          borderRight: '1px solid #e2e8f0',
                          userSelect: 'none',
                        }}
                      >
                        {isHeader ? 'HDR' : rIdx + 1}
                      </td>

                      {/* Cells */}
                      {Array.from({ length: colCount }).map((_, cIdx) => {
                        const cellVal = row.cells?.[cIdx] ?? '';
                        return (
                          <td
                            key={cIdx}
                            style={{
                              padding: '4px 6px',
                              borderRight: '1px solid #e2e8f0',
                            }}
                          >
                            <input
                              type="text"
                              value={cellVal}
                              onChange={(e) => handleCellChange(rIdx, cIdx, e.currentTarget.value)}
                              disabled={readOnly}
                              placeholder={isHeader ? `Header ${cIdx + 1}` : '...'}
                              style={{
                                width: '100%',
                                padding: '4px 6px',
                                fontSize: '12px',
                                fontWeight: isHeader ? 700 : 400,
                                color: isHeader ? '#0f172a' : '#1e293b',
                                background: 'transparent',
                                border: '1px solid transparent',
                                borderRadius: '4px',
                                outline: 'none',
                                boxSizing: 'border-box',
                                transition: 'border-color 0.15s ease',
                              }}
                              onFocus={(e) => {
                                e.currentTarget.style.borderColor = '#0052cc';
                                e.currentTarget.style.background = '#ffffff';
                              }}
                              onBlur={(e) => {
                                e.currentTarget.style.borderColor = 'transparent';
                                e.currentTarget.style.background = 'transparent';
                              }}
                            />
                          </td>
                        );
                      })}

                      {/* Row Action (Delete) */}
                      {!readOnly && (
                        <td
                          style={{
                            padding: '4px',
                            textAlign: 'center',
                            width: '32px',
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => handleDeleteRow(rIdx)}
                            title="Delete this row"
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#94a3b8',
                              cursor: 'pointer',
                              padding: '4px',
                              borderRadius: '4px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Bar: Add Row & Quick Stats */}
        {!readOnly && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              background: '#f8fafc',
              borderTop: '1px solid #e2e8f0',
            }}
          >
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={handleAddRow}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '5px 10px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#0052cc',
                  background: 'rgba(0, 82, 204, 0.06)',
                  border: '1px solid rgba(0, 82, 204, 0.2)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                <Plus size={12} />
                Add Row
              </button>

              <button
                type="button"
                onClick={handleAddColumn}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '5px 10px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#475569',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                <Plus size={12} />
                Add Column
              </button>
            </div>

            <div style={{ fontSize: '11px', color: '#64748b' }}>
              Tip: Press <strong>Tab</strong> to navigate between cells.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

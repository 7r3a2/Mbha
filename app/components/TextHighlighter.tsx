'use client';

import { useState, useRef, useEffect } from 'react';

interface Highlight {
  id: string;
  start: number;
  end: number;
  color: string;
  text: string;
}

interface TextHighlighterProps {
  text: string;
  className?: string;
}

const TextHighlighter = ({ text, className = '' }: TextHighlighterProps) => {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [selectedText, setSelectedText] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showRemoveOverlay, setShowRemoveOverlay] = useState(false);
  const [selectedHighlight, setSelectedHighlight] = useState<Highlight | null>(null);
  const [colorPickerPosition, setColorPickerPosition] = useState({ x: 0, y: 0 });
  const [removeOverlayPosition, setRemoveOverlayPosition] = useState({ x: 0, y: 0 });
  const textRef = useRef<HTMLDivElement>(null);

  const highlightColors = [
    '#FFD700', // Yellow
    '#FF6B6B', // Red
    '#4ECDC4', // Cyan
    '#45B7D1', // Blue
    '#96CEB4', // Green
    '#FFEAA7', // Light Yellow
    '#DDA0DD', // Plum
    '#98D8C8', // Mint
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (textRef.current && !textRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
        setShowRemoveOverlay(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getSelectedTextInfo = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString().trim();
    
    if (!selectedText) return null;

    // Check if selection is within our text container
    if (!textRef.current?.contains(range.commonAncestorContainer)) {
      return null;
    }

    // Get the position of the selection
    const rect = range.getBoundingClientRect();
    
    return {
      text: selectedText,
      start: range.startOffset,
      end: range.endOffset,
      position: {
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      }
    };
  };

  const handleTextSelection = () => {
    // Add a small delay to ensure selection is complete
    setTimeout(() => {
      const selectionInfo = getSelectedTextInfo();
      
      if (!selectionInfo) {
        setShowColorPicker(false);
        return;
      }

      setSelectedText(selectionInfo.text);
      setColorPickerPosition(selectionInfo.position);
      setShowColorPicker(true);
      setShowRemoveOverlay(false);
    }, 10);
  };

  const addHighlight = (color: string) => {
    const selectionInfo = getSelectedTextInfo();
    
    if (!selectionInfo) return;

    const newHighlight: Highlight = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      start: selectionInfo.start,
      end: selectionInfo.end,
      color,
      text: selectionInfo.text
    };

    setHighlights(prev => [...prev, newHighlight]);
    setShowColorPicker(false);
    
    // Clear the selection
    window.getSelection()?.removeAllRanges();
  };

  const handleHighlightClick = (highlight: Highlight, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    const rect = event.currentTarget.getBoundingClientRect();
    setSelectedHighlight(highlight);
    setRemoveOverlayPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
    setShowRemoveOverlay(true);
    setShowColorPicker(false);
  };

  const removeHighlight = () => {
    if (selectedHighlight) {
      setHighlights(prev => prev.filter(h => h.id !== selectedHighlight.id));
      setShowRemoveOverlay(false);
      setSelectedHighlight(null);
    }
  };

  const resetAllHighlights = () => {
    setHighlights([]);
    setShowColorPicker(false);
    setShowRemoveOverlay(false);
    setSelectedHighlight(null);
  };

  const renderHighlightedText = () => {
    if (highlights.length === 0) {
      return <span>{text}</span>;
    }

    // Sort highlights by start position
    const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);
    
    const parts: React.ReactElement[] = [];
    let lastIndex = 0;

    sortedHighlights.forEach((highlight, index) => {
      // Add text before highlight
      if (highlight.start > lastIndex) {
        parts.push(
          <span key={`text-${index}`}>
            {text.slice(lastIndex, highlight.start)}
          </span>
        );
      }

      // Add highlighted text
      parts.push(
        <span
          key={highlight.id}
          style={{
            backgroundColor: highlight.color,
            cursor: 'pointer',
            borderRadius: '2px',
            padding: '1px 2px',
            margin: '0 1px',
            position: 'relative',
            display: 'inline-block'
          }}
          onClick={(e) => handleHighlightClick(highlight, e)}
          title="Click to remove highlight"
        >
          {highlight.text}
        </span>
      );

      lastIndex = highlight.end;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(
        <span key="text-end">
          {text.slice(lastIndex)}
        </span>
      );
    }

    return parts;
  };

  return (
    <div className="relative">
      <div
        ref={textRef}
        className={`select-text ${className}`}
        onMouseUp={handleTextSelection}
        style={{ userSelect: 'text' }}
      >
        {renderHighlightedText()}
      </div>

      {/* Color Picker */}
      {showColorPicker && (
        <div
          className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-3"
          style={{
            left: colorPickerPosition.x,
            top: colorPickerPosition.y,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="text-xs text-gray-600 mb-3 text-center">
            Highlight "{selectedText}"
          </div>
          
          {/* Color Grid */}
          <div className="grid grid-cols-4 gap-1 mb-3">
            {highlightColors.map((color) => (
              <button
                key={color}
                className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                onClick={() => addHighlight(color)}
                title={`Highlight with ${color}`}
              />
            ))}
          </div>

          {/* Reset Button */}
          <div className="border-t border-gray-200 pt-2">
            <button
              className="w-full flex items-center justify-center gap-2 px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded transition-colors"
              onClick={resetAllHighlights}
              title="Clear all highlights"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset All
            </button>
          </div>
        </div>
      )}

      {/* Remove Highlight Overlay */}
      {showRemoveOverlay && selectedHighlight && (
        <div
          className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-3"
          style={{
            left: removeOverlayPosition.x,
            top: removeOverlayPosition.y,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="text-sm text-gray-700 mb-3 text-center">
            Remove highlight from "{selectedHighlight.text}"?
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
              onClick={removeHighlight}
            >
              Remove
            </button>
            <button
              className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400 transition-colors"
              onClick={() => {
                setShowRemoveOverlay(false);
                setSelectedHighlight(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextHighlighter; 
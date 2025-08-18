'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function CervicalPathologyPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageError, setImageError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check authentication
  if (!isLoading && !user) {
    router.push('/login');
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-100 items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.min(Math.max(prev * delta, 0.5), 3));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleImageError = () => {
    console.error('Failed to load SVG image');
    setImageError(true);
  };

  return (
    <div className="h-full bg-gradient-to-br from-pink-50 to-purple-100 overflow-hidden">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm p-3 sm:p-4 shadow-sm flex items-center justify-between">
        <h1 className="text-lg sm:text-2xl font-bold text-purple-600">Cervical Pathology</h1>
        <button
          onClick={resetView}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Reset View
        </button>
      </div>

      {/* Main Content */}
      <div 
        ref={containerRef}
        className="h-full relative overflow-hidden cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
          }}
        >
          <div className="max-w-4xl w-full h-full flex items-center justify-center p-8">
            {!imageError ? (
              <img
                src="/images/test flowchart.svg"
                alt="Cervical Pathology Flowchart"
                className="w-full h-auto max-h-full object-contain"
                onError={handleImageError}
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              />
            ) : (
              <div className="text-center">
                <div className="w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">SVG Loading Error</h1>
                <p className="text-gray-600 mb-4">
                  Failed to load the flowchart SVG. Please check the file path.
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Expected path: /images/test flowchart.svg
                </p>
                <button
                  onClick={() => setImageError(false)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Retry Loading
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <button
            onClick={() => setScale(prev => Math.min(prev * 1.2, 3))}
            className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg flex items-center justify-center hover:bg-white transition-colors"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          <button
            onClick={() => setScale(prev => Math.max(prev * 0.8, 0.5))}
            className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg flex items-center justify-center hover:bg-white transition-colors"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
        </div>

        {/* Scale Indicator */}
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-lg shadow-lg">
          <span className="text-sm text-gray-700 font-medium">
            {Math.round(scale * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
} 
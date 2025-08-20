'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function OvarianCancerPage({ 
  frameFullScreen = false, 
  onToggleFrameFullScreen = () => {} 
}: { 
  frameFullScreen?: boolean; 
  onToggleFrameFullScreen?: () => void; 
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

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

  return (
    <OvarianCancerFlowchart 
      frameFullScreen={frameFullScreen}
      onToggleFrameFullScreen={onToggleFrameFullScreen}
    />
  );
}

// Ovarian Cancer Flowchart Component
const OvarianCancerFlowchart = ({ frameFullScreen = false, onToggleFrameFullScreen = () => {} }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [scale, setScale] = useState(1);
  const [zoomScale, setZoomScale] = useState(1);
  const [isZooming, setIsZooming] = useState(false);
  const [initialDistance, setInitialDistance] = useState(0);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const [lastTouchX, setLastTouchX] = useState(0);
  const [lastTouchY, setLastTouchY] = useState(0);
  const [mouseStartPos, setMouseStartPos] = useState({ x: 0, y: 0 });

  // Check if mobile/tablet on mount and resize
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setIsMobile(width < 1024);
      
      // Responsive flowchart that fits all devices
      const flowchartWidth = 1800;
      const flowchartHeight = 1400;
      
      // Calculate scale to fit the device properly
      const scaleX = (width * 0.9) / flowchartWidth; // 90% of screen width
      const scaleY = (height * 0.8) / flowchartHeight; // 80% of screen height
      
      // Use the smaller scale to ensure it fits completely
      const autoScale = Math.min(scaleX, scaleY, 1); // Cap at 1.0
      
      setScale(autoScale);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Mouse and touch panning functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start panning if clicking on empty space (not on SVG elements)
    const target = e.target as HTMLElement;
    if (target.closest('svg, path, rect, circle, text')) {
      return;
    }
    
    e.preventDefault();
    setIsPanning(true);
    setMouseStartPos({ x: e.clientX - panX, y: e.clientY - panY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    e.preventDefault();
    
    // Direct, responsive panning without borders
    const newX = e.clientX - mouseStartPos.x;
    const newY = e.clientY - mouseStartPos.y;
    
    setPanX(newX);
    setPanY(newY);
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Scroll to zoom functionality for desktop - zoom to mouse position
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    
    // Only zoom if not panning and not on mobile
    if (!isPanning && !isMobile) {
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1; // Zoom out on scroll down, zoom in on scroll up
      const newZoomScale = Math.max(0.3, Math.min(5, zoomScale * zoomFactor));
      
      // Get mouse position relative to the flowchart container
      const rect = e.currentTarget.getBoundingClientRect();
      const mouseX = e.clientX - rect.left - rect.width / 2;
      const mouseY = e.clientY - rect.top - rect.height / 2;
      
      // Calculate new pan position to zoom towards mouse
      const scaleChange = newZoomScale / zoomScale;
      const newPanX = panX - (mouseX * (scaleChange - 1));
      const newPanY = panY - (mouseY * (scaleChange - 1));
      
      setZoomScale(newZoomScale);
      setPanX(newPanX);
      setPanY(newPanY);
    }
  };

  // Touch panning functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Two finger touch - start zooming
      e.preventDefault();
      setIsZooming(true);
      setIsPanning(false);
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setInitialDistance(distance);
    } else if (e.touches.length === 1) {
      // Single finger touch - start panning
      const target = e.target as HTMLElement;
      if (target.closest('svg, path, rect, circle, text')) {
        return;
      }
      
      e.preventDefault();
      setIsPanning(true);
      setIsZooming(false);
      setLastTouchX(e.touches[0].clientX);
      setLastTouchY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && isZooming) {
      // Two finger zoom
      e.preventDefault();
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      
      const scaleFactor = distance / initialDistance;
      const newZoomScale = Math.max(0.3, Math.min(5, zoomScale * scaleFactor));
      setZoomScale(newZoomScale);
      setInitialDistance(distance);
    } else if (e.touches.length === 1 && isPanning) {
      // Single finger pan - direct and responsive
      e.preventDefault();
      const touch = e.touches[0];
      const deltaX = touch.clientX - lastTouchX;
      const deltaY = touch.clientY - lastTouchY;
      
      setPanX(prev => prev + deltaX);
      setPanY(prev => prev + deltaY);
      
      setLastTouchX(touch.clientX);
      setLastTouchY(touch.clientY);
    }
  };

  const handleTouchEnd = () => {
    setIsZooming(false);
    setIsPanning(false);
  };

  // Full screen toggle - only for the flowchart frame
  const toggleFullScreen = () => {
    onToggleFrameFullScreen();
  };

  return (
    <div className="h-full bg-gradient-to-br from-pink-50 to-purple-100 overflow-hidden">
      {/* Header with full screen button */}
      <div className="bg-white/90 backdrop-blur-sm p-3 sm:p-4 shadow-sm flex items-center justify-between">
        <h1 className="text-lg sm:text-2xl font-bold text-purple-600">Ovarian Cancer</h1>
        <button
          onClick={toggleFullScreen}
          className="px-3 py-2 sm:px-4 sm:py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 text-sm sm:text-base"
          title={frameFullScreen ? "Exit Full Screen" : "Full Screen"}
        >
          {frameFullScreen ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Exit Full Screen</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <span>Full Screen</span>
            </>
          )}
        </button>
      </div>

      {/* Main flowchart container */}
      <div 
        className="relative w-full h-full overflow-hidden flex items-center justify-center"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ 
          cursor: isPanning ? 'grabbing' : 'grab',
          touchAction: 'none',
          pointerEvents: 'auto',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none'
        }}
      >
        
        {/* Flowchart content - centered and responsive */}
        <div
          className="relative"
          style={{
            transform: `scale(${scale * zoomScale}) translate(${panX}px, ${panY}px)`,
            width: '1800px',
            height: '1400px',
            pointerEvents: 'auto',
            transformOrigin: 'center',
            transition: isZooming ? 'none' : 'none',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            imageRendering: 'crisp-edges',
            textRendering: 'optimizeLegibility',
            transformStyle: 'preserve-3d',
            perspective: '1000px'
          }}
        >
          {/* SVG Flowchart */}
          <div className="w-full h-full flex items-center justify-center">
            <Image
              src="/images/test flowchart.svg"
              alt="Ovarian Cancer Flowchart"
              width={1800}
              height={1400}
              className="w-full h-full object-contain"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                pointerEvents: 'none' // Prevent SVG from interfering with pan/zoom
              }}
              onError={(e) => {
                console.error('Failed to load SVG:', e);
                // Fallback to a placeholder if SVG fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const container = target.parentElement;
                if (container) {
                  container.innerHTML = `
                    <div class="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                      <div class="text-center">
                        <div class="text-2xl font-bold text-gray-600 mb-4">SVG Flowchart</div>
                        <div class="text-gray-500">Ovarian Cancer Diagnostic Flowchart</div>
                      </div>
                    </div>
                  `;
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Instructions overlay */}
      {!frameFullScreen && (
        <div className="absolute bottom-4 left-4 bg-black/70 text-white p-3 rounded-lg text-sm max-w-xs">
          <div className="font-semibold mb-2">Navigation:</div>
          <div>• Mouse wheel: Zoom in/out</div>
          <div>• Click & drag: Pan around</div>
          <div>• Two fingers: Pinch to zoom in/out</div>
          <div>• One finger: Drag to pan around flowchart</div>
        </div>
      )}
    </div>
  );
}; 
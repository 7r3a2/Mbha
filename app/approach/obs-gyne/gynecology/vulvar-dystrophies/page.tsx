"use client";

import React, { useRef, useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";

// Main title box component (Gray)
const TitleBox = ({ title, style = {} }: { title: string; style?: React.CSSProperties }) => (
  <div 
    className="bg-gray-200 border-2 border-gray-400 px-6 py-4 text-center rounded-lg shadow-md text-lg font-bold text-gray-800"
    style={{
      minHeight: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style
    }}
  >
    {title}
  </div>
);

// Decision/Question box component (Gray)
const DecisionBox = ({ title, style = {} }: { title: string; style?: React.CSSProperties }) => (
  <div 
    className="bg-gray-200 border-2 border-gray-400 px-4 py-3 text-center rounded-lg shadow-md text-sm font-medium text-gray-800"
    style={{
      minHeight: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style
    }}
  >
    {title}
  </div>
);

// Symptom/Finding box component (Light Green)
const FindingBox = ({ title, style = {} }: { title: string; style?: React.CSSProperties }) => (
  <div 
    className="bg-green-100 border-2 border-green-400 px-4 py-3 text-center rounded-lg shadow-md text-sm font-medium text-gray-800"
    style={{
      minHeight: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style
    }}
  >
    {title}
  </div>
);

// Diagnosis box component (Orange, Hexagonal)
const DiagnosisBox = ({ title, style = {} }: { title: string; style?: React.CSSProperties }) => (
  <div 
    className="bg-orange-300 border-2 border-orange-500 px-4 py-3 text-center shadow-md text-sm font-bold text-gray-800"
    style={{
      minHeight: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      clipPath: 'polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)',
      ...style
    }}
  >
    {title}
  </div>
);

// Treatment/Action box component (Light Blue)
const TreatmentBox = ({ title, style = {} }: { title: string; style?: React.CSSProperties }) => (
  <div 
    className="bg-blue-200 border-2 border-blue-400 px-4 py-3 text-center rounded-lg shadow-md text-sm font-medium text-gray-800"
    style={{
      minHeight: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style
    }}
  >
    {title}
  </div>
);

// Assessment box component (Light Gray)
const AssessmentBox = ({ title, style = {} }: { title: string; style?: React.CSSProperties }) => (
  <div 
    className="bg-gray-100 border-2 border-gray-400 px-4 py-3 text-center rounded-lg shadow-md text-sm font-medium text-gray-700"
    style={{
      minHeight: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style
    }}
  >
    {title}
  </div>
);

// Footnotes box component (Gray)
const FootnotesBox = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div 
    className="bg-gray-100 border-2 border-gray-400 px-4 py-3 rounded-lg shadow-md text-xs text-gray-700"
    style={{
      ...style
    }}
  >
    {children}
  </div>
);

// Vertical line component
const VerticalLine = ({ x, startY, endY }: { x: number; startY: number; endY: number }) => (
  <div
    className="absolute pointer-events-none"
    style={{
      left: x - 0.5,
      top: startY,
      width: 1,
      height: endY - startY,
      backgroundColor: '#374151',
      zIndex: 10,
    }}
  />
);

// Horizontal line component
const HorizontalLine = ({ y, startX, endX }: { y: number; startX: number; endX: number }) => (
  <div
    className="absolute pointer-events-none"
    style={{
      left: startX,
      top: y - 0.5,
      width: endX - startX,
      height: 1,
      backgroundColor: '#374151',
      zIndex: 10,
    }}
  />
);

// Arrow head component
const ArrowHead = ({ x, y, direction = 'down' }: { x: number; y: number; direction?: 'down' | 'right' | 'left' | 'up' }) => {
  const getArrowStyle = () => {
    switch (direction) {
      case 'down':
        return {
          left: x - 3,
          top: y - 6,
          borderLeft: '3px solid transparent',
          borderRight: '3px solid transparent',
          borderTop: '6px solid #374151',
        };
      case 'right':
        return {
          left: x - 6,
          top: y - 3,
          borderTop: '3px solid transparent',
          borderBottom: '3px solid transparent',
          borderLeft: '6px solid #374151',
        };
      case 'left':
        return {
          left: x,
          top: y - 3,
          borderTop: '3px solid transparent',
          borderBottom: '3px solid transparent',
          borderRight: '6px solid #374151',
        };
      case 'up':
        return {
          left: x - 3,
          top: y,
          borderLeft: '3px solid transparent',
          borderRight: '3px solid transparent',
          borderBottom: '6px solid #374151',
        };
      default:
        return {};
    }
  };

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        width: 0,
        height: 0,
        zIndex: 11,
        ...getArrowStyle(),
      }}
    />
  );
};

export default function VulvarDystrophiesFlowchart({ 
  frameFullScreen = false, 
  onToggleFrameFullScreen = () => {} 
}: { 
  frameFullScreen?: boolean; 
  onToggleFrameFullScreen?: () => void; 
}) {
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
      const flowchartWidth = 3600;
      const flowchartHeight = 2800;
      
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
    // Only start panning if clicking on empty space (not on boxes)
    const target = e.target as HTMLElement;
    if (target.closest('.flowchart-box, .reference-box, .text-box')) {
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
      if (target.closest('.flowchart-box, .reference-box, .text-box')) {
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
    <>
      <Head>
        <title>Vulvar Dystrophies</title>
        <meta name="description" content="Medical flowchart for vulvar dystrophies evaluation" />
      </Head>
      
      <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
        {/* Header with full screen button */}
        <div className="bg-white/90 backdrop-blur-sm p-3 sm:p-4 shadow-sm flex items-center justify-between">
          <h1 className="text-lg sm:text-2xl font-bold text-blue-600">Vulvar Dystrophies</h1>
          <button
            onClick={toggleFullScreen}
            className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm sm:text-base"
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

        {/* Main flowchart container - no nested frame */}
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
            touchAction: 'none', // Prevent page refresh on iPad
            pointerEvents: 'auto',
            WebkitTouchCallout: 'none', // Prevent iOS touch callouts
            WebkitUserSelect: 'none' // Prevent text selection
          }}
        >
          
          {/* Flowchart content - centered and responsive */}
          <div
            className="relative"
            style={{
              transform: `scale(${scale * zoomScale}) translate(${panX}px, ${panY}px)`,
              width: '3600px',
              height: '2800px',
              pointerEvents: 'auto', // Enable interaction with boxes
              transformOrigin: 'center',
              transition: isZooming ? 'none' : 'none', // Remove transition for instant panning
              willChange: 'transform', // Optimize for animations
              backfaceVisibility: 'hidden', // Reduce blur on touch
              WebkitBackfaceVisibility: 'hidden', // Safari support
              // Improve rendering quality for zoom
              imageRendering: 'crisp-edges',
              // Better text rendering
              textRendering: 'optimizeLegibility',
              // Prevent blur during zoom
              transformStyle: 'preserve-3d',
              perspective: '1000px'
            }}
          >
            {/* Main Title - Starting Point */}
            <TitleBox
              title="Vulvar Pruritis"
              style={{ position: 'absolute', left: 700, top: 50, width: 200 }}
            />

            {/* LEFT BRANCH: Low estrogen age */}
            <FindingBox
              title="Low estrogen age¹ ± history autoimmune disease"
              style={{ position: 'absolute', left: 200, top: 200, width: 240 }}
            />

            {/* Left side image - bigger size with pink border */}
            <div
              style={{ 
                position: 'absolute', 
                left: 200, 
                top: 480, 
                width: 300, 
                height: 200,
                border: '3px solid #ec4899',
                borderRadius: '8px',
                padding: '4px',
                backgroundColor: 'white'
              }}
            >
              <Image
                src="/images/approaches images/obs & gyne/Vulvar Dystrophies right.png"
                alt="Vulvar Dystrophies Right"
                width={300}
                height={200}
                style={{ objectFit: 'contain', width: '100%', height: '100%', borderRadius: '4px' }}
              />
            </div>

            <DecisionBox
              title="Confirm with biopsy"
              style={{ position: 'absolute', left: 240, top: 720, width: 160 }}
            />

            <DiagnosisBox
              title="Lichen Sclerosus"
              style={{ position: 'absolute', left: 250, top: 860, width: 140 }}
            />

            <TreatmentBox
              title="Topical corticosteroids, topical calcineurin inhibitors (if refractory)"
              style={{ position: 'absolute', left: 180, top: 1000, width: 280 }}
            />

            {/* CENTER BRANCH: Vulvar pain ± oral involvement */}
            <FindingBox
              title="Vulvar pain ± oral involvement"
              style={{ position: 'absolute', left: 600, top: 200, width: 200 }}
            />

            <FindingBox
              title="Glossy, red vulvar erosions"
              style={{ position: 'absolute', left: 620, top: 340, width: 160 }}
            />

            <DecisionBox
              title="Confirm with biopsy"
              style={{ position: 'absolute', left: 640, top: 480, width: 160 }}
            />

            <DiagnosisBox
              title="Lichen Planus"
              style={{ position: 'absolute', left: 650, top: 620, width: 140 }}
            />

            <TreatmentBox
              title="Topical corticosteroids, topical calcineurin inhibitors (if refractory)"
              style={{ position: 'absolute', left: 580, top: 760, width: 280 }}
            />

            {/* RIGHT BRANCH: Chronic nocturnal pruritis */}
            <FindingBox
              title="Chronic nocturnal pruritis ± history of atopic disease"
              style={{ position: 'absolute', left: 1000, top: 200, width: 240 }}
            />

            <FindingBox
              title="Epidermal thickening with pruritic plaques"
              style={{ position: 'absolute', left: 1020, top: 340, width: 200 }}
            />

            {/* Right side image - bigger size with pink border */}
            <div
              style={{ 
                position: 'absolute', 
                left: 1000, 
                top: 480, 
                width: 300, 
                height: 200,
                border: '3px solid #ec4899',
                borderRadius: '8px',
                padding: '4px',
                backgroundColor: 'white'
              }}
            >
              <Image
                src="/images/approaches images/obs & gyne/Vulvar Dystrophies left.png"
                alt="Vulvar Dystrophies Left"
                width={300}
                height={200}
                style={{ objectFit: 'contain', width: '100%', height: '100%', borderRadius: '4px' }}
              />
            </div>

            <DiagnosisBox
              title="Lichen Simplex Chronicus"
              style={{ position: 'absolute', left: 1040, top: 860, width: 160 }}
            />

            <TreatmentBox
              title="Avoid irritants. Topical corticosteroids, antihistamines, or TCAs. If refractory, systemic corticosteroids, calcineurin inhibitors."
              style={{ position: 'absolute', left: 960, top: 1000, width: 320 }}
            />

            {/* Footnotes */}
            <FootnotesBox
              style={{ position: 'absolute', left: 400, top: 1200, width: 600, minHeight: 80 }}
            >
              <div className="text-sm leading-relaxed">
                <div className="font-bold text-lg mb-3 text-gray-800">Footnote</div>
                <div className="mb-2"><strong>1.</strong> Low estrogen ages = pre-menarchal child, postmenopausal adult.</div>
              </div>
            </FootnotesBox>

            {/* CONNECTING LINES AND ARROWS */}
            
            {/* From Main Title to three branches */}
            <VerticalLine x={800} startY={100} endY={160} />
            <HorizontalLine y={160} startX={320} endX={1120} />
            
            {/* To left branch */}
            <VerticalLine x={320} startY={160} endY={200} />
            <ArrowHead x={320} y={200} direction="down" />
            
            {/* To center branch */}
            <VerticalLine x={700} startY={160} endY={200} />
            <ArrowHead x={700} y={200} direction="down" />
            
            {/* To right branch */}
            <VerticalLine x={1120} startY={160} endY={200} />
            <ArrowHead x={1120} y={200} direction="down" />

            {/* LEFT BRANCH connections */}
            <VerticalLine x={320} startY={250} endY={340} />
            <ArrowHead x={320} y={340} direction="down" />

            {/* Line from image to decision box - positioned below image */}
            <VerticalLine x={320} startY={680} endY={720} />
            <ArrowHead x={320} y={720} direction="down" />

            <VerticalLine x={320} startY={770} endY={860} />
            <ArrowHead x={320} y={860} direction="down" />

            <VerticalLine x={320} startY={870} endY={960} />
            <ArrowHead x={320} y={960} direction="down" />

            {/* CENTER BRANCH connections */}
            <VerticalLine x={700} startY={250} endY={340} />
            <ArrowHead x={700} y={340} direction="down" />

            <VerticalLine x={700} startY={390} endY={480} />
            <ArrowHead x={700} y={480} direction="down" />

            <VerticalLine x={720} startY={530} endY={620} />
            <ArrowHead x={720} y={620} direction="down" />

            <VerticalLine x={720} startY={670} endY={760} />
            <ArrowHead x={720} y={760} direction="down" />

            {/* RIGHT BRANCH connections */}
            <VerticalLine x={1120} startY={250} endY={340} />
            <ArrowHead x={1120} y={340} direction="down" />

            <VerticalLine x={1120} startY={390} endY={480} />
            <ArrowHead x={1120} y={480} direction="down" />

            {/* Line from image to diagnosis box - positioned below image */}
            <VerticalLine x={1120} startY={680} endY={720} />
            <ArrowHead x={1120} y={720} direction="down" />

            <VerticalLine x={1120} startY={770} endY={860} />
            <ArrowHead x={1120} y={860} direction="down" />

            <VerticalLine x={1120} startY={870} endY={960} />
            <ArrowHead x={1120} y={960} direction="down" />

          </div>
        </div>
      </div>
    </>
  );
} 
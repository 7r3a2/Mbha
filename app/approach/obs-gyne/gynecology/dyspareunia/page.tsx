'use client';

import React, { useRef, useState, useEffect } from "react";

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
    className="absolute bg-gray-600"
    style={{
      left: x - 1,
      top: startY,
      width: 2,
      height: endY - startY,
      zIndex: 1,
    }}
  />
);

// Horizontal line component
const HorizontalLine = ({ y, startX, endX }: { y: number; startX: number; endX: number }) => (
  <div
    className="absolute bg-gray-600"
    style={{
      left: startX,
      top: y - 1,
      width: endX - startX,
      height: 2,
      zIndex: 1,
    }}
  />
);

// Arrow head component
const ArrowHead = ({ x, y, direction = 'down' }: { x: number; y: number; direction?: 'down' | 'right' | 'left' | 'up' }) => {
  const getArrowStyle = () => {
    const baseStyle = {
      position: 'absolute' as const,
      width: 0,
      height: 0,
      zIndex: 2,
    };

    switch (direction) {
      case 'down':
        return {
          ...baseStyle,
          left: x - 5,
          top: y,
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderTop: '8px solid #4B5563',
        };
      case 'up':
        return {
          ...baseStyle,
          left: x - 5,
          top: y - 8,
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderBottom: '8px solid #4B5563',
        };
      case 'right':
        return {
          ...baseStyle,
          left: x,
          top: y - 5,
          borderTop: '5px solid transparent',
          borderBottom: '5px solid transparent',
          borderLeft: '8px solid #4B5563',
        };
      case 'left':
        return {
          ...baseStyle,
          left: x - 8,
          top: y - 5,
          borderTop: '5px solid transparent',
          borderBottom: '5px solid transparent',
          borderRight: '8px solid #4B5563',
        };
      default:
        return baseStyle;
    }
  };

  return <div style={getArrowStyle()} />;
};

// Plus/Minus indicator component
const PlusMinusIndicator = ({ type, x, y }: { type: 'plus' | 'minus'; x: number; y: number }) => (
  <div
    className="absolute pointer-events-none bg-white border border-gray-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-700"
    style={{
      left: x - 12,
      top: y - 12,
      zIndex: 12,
    }}
  >
    {type === 'plus' ? '+' : '−'}
  </div>
);

export default function DyspareuniaPage({ 
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
      const flowchartWidth = 1600;
      const flowchartHeight = 1300;
      
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
      
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      setInitialDistance(distance);
    } else if (e.touches.length === 1) {
      // Single touch - start panning
      const touch = e.touches[0];
      setIsPanning(true);
      setIsZooming(false);
      setLastTouchX(touch.clientX);
      setLastTouchY(touch.clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && isZooming) {
      // Two finger touch - zooming
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      if (initialDistance > 0) {
        const scaleChange = distance / initialDistance;
        const newZoomScale = Math.max(0.3, Math.min(5, zoomScale * scaleChange));
        setZoomScale(newZoomScale);
        setInitialDistance(distance);
      }
    } else if (e.touches.length === 1 && isPanning) {
      // Single touch - panning
      e.preventDefault();
      const touch = e.touches[0];
      const deltaX = touch.clientX - lastTouchX;
      const deltaY = touch.clientY - lastTouchY;
      
      setPanX(panX + deltaX);
      setPanY(panY + deltaY);
      setLastTouchX(touch.clientX);
      setLastTouchY(touch.clientY);
    }
  };

  const handleTouchEnd = () => {
    setIsPanning(false);
    setIsZooming(false);
    setInitialDistance(0);
  };

  const toggleFullScreen = () => {
    onToggleFrameFullScreen();
  };

  return (
    <div className="h-full bg-gradient-to-br from-green-50 to-emerald-100 overflow-hidden">
      {/* Header with full screen button */}
      <div className="bg-white/90 backdrop-blur-sm p-3 sm:p-4 shadow-sm flex items-center justify-between">
        <h1 className="text-lg sm:text-2xl font-bold text-green-600">Dyspareunia</h1>
        <button
          onClick={toggleFullScreen}
          className="px-3 py-2 sm:px-4 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 text-sm sm:text-base"
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
            width: '1600px',
            height: '1300px',
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
          {/* Main Title - Centered at top */}
          <TitleBox
            title="Where Does the Pain Occur?"
            style={{ position: 'absolute', left: 650, top: 20, width: 280 }}
          />

          {/* LEFT BRANCH: Vulva or introitus */}
          <FindingBox
            title="Vulva or introitus"
            style={{ position: 'absolute', left: 300, top: 180, width: 200 }}
          />

          {/* Visual inspection ± pelvic exam */}
          <DecisionBox
            title="Visual inspection ± pelvic exam"
            style={{ position: 'absolute', left: 280, top: 320, width: 240 }}
          />

          {/* Three findings from Visual inspection */}
          <FindingBox
            title="Atrophy"
            style={{ position: 'absolute', left: 50, top: 480, width: 120 }}
          />

          <FindingBox
            title="Lesions, fissures, ulcerations"
            style={{ position: 'absolute', left: 280, top: 480, width: 200 }}
          />

          <FindingBox
            title="Normal exam"
            style={{ position: 'absolute', left: 510, top: 480, width: 120 }}
          />

          {/* From Atrophy to diagnosis */}
          <DiagnosisBox
            title="Atrophic vaginitis"
            style={{ position: 'absolute', left: 50, top: 580, width: 120 }}
          />

          {/* From Lesions to diagnosis */}
          <DiagnosisBox
            title="Vulvar dermatoses"
            style={{ position: 'absolute', left: 280, top: 580, width: 200 }}
          />

          {/* From Normal exam to next decision */}
          <DecisionBox
            title="Abnormal vaginal discharge?"
            style={{ position: 'absolute', left: 510, top: 580, width: 200 }}
          />

          {/* From Atrophic vaginitis to treatment */}
          <TreatmentBox
            title="Topical estrogen"
            style={{ position: 'absolute', left: 50, top: 680, width: 120 }}
          />

          {/* From Vulvar dermatoses to treatment */}
          <TreatmentBox
            title="Topical steroids"
            style={{ position: 'absolute', left: 280, top: 680, width: 200 }}
          />

          {/* From Abnormal vaginal discharge - split to two diagnoses */}
          <DiagnosisBox
            title="Vaginitis or Cervicitis"
            style={{ position: 'absolute', left: 700, top: 680, width: 200 }}
          />

          <DiagnosisBox
            title="Vaginismus"
            style={{ position: 'absolute', left: 940, top: 680, width: 120 }}
          />

          {/* From Vaginitis or Cervicitis to See Vaginal Discharge */}
          <TreatmentBox
            title="See Vaginal Discharge approach"
            style={{ position: 'absolute', left: 700, top: 780, width: 200 }}
          />

          {/* From Vaginismus to therapy treatment */}
          <TreatmentBox
            title="Pelvic floor therapy"
            style={{ position: 'absolute', left: 940, top: 780, width: 120 }}
          />

          {/* RIGHT BRANCH: Deep pelvis pathway */}
          <FindingBox
            title="Deep pelvis"
            style={{ position: 'absolute', left: 1300, top: 180, width: 200 }}
          />

          <DecisionBox
            title="Pain associated with menstrual cycle?"
            style={{ position: 'absolute', left: 1280, top: 320, width: 240 }}
          />

          <FindingBox
            title="Dymenorrhea, pelvic ligament nodularity on exam"
            style={{ position: 'absolute', left: 1200, top: 480, width: 280 }}
          />

          <DecisionBox
            title="Bimanual exam"
            style={{ position: 'absolute', left: 1630, top: 480, width: 140 }}
          />

          <DiagnosisBox
            title="Endometriosis"
            style={{ position: 'absolute', left: 1200, top: 580, width: 280 }}
          />

          {/* Four findings from Bimanual exam */}
          <FindingBox
            title="Uterine tenderness"
            style={{ position: 'absolute', left: 1350, top: 580, width: 140 }}
          />

          <FindingBox
            title="Adnexal tenderness"
            style={{ position: 'absolute', left: 1600, top: 580, width: 140 }}
          />

          <FindingBox
            title="Cervical motion tenderness"
            style={{ position: 'absolute', left: 1850, top: 580, width: 180 }}
          />

          <FindingBox
            title="Nodularity in uterosacral ligaments"
            style={{ position: 'absolute', left: 2090, top: 580, width: 200 }}
          />

          {/* Four diagnoses from findings */}
          <DiagnosisBox
            title="PID"
            style={{ position: 'absolute', left: 1350, top: 680, width: 140 }}
          />

          <DiagnosisBox
            title="Ovarian cyst"
            style={{ position: 'absolute', left: 1600, top: 680, width: 140 }}
          />

          <DiagnosisBox
            title="Cervicitis"
            style={{ position: 'absolute', left: 1850, top: 680, width: 180 }}
          />

          <DiagnosisBox
            title="Endometriosis"
            style={{ position: 'absolute', left: 2090, top: 680, width: 200 }}
          />

          {/* Four treatments from diagnoses */}
          <TreatmentBox
            title="Antibiotics"
            style={{ position: 'absolute', left: 1350, top: 780, width: 140 }}
          />

          <TreatmentBox
            title="Surgery if needed"
            style={{ position: 'absolute', left: 1600, top: 780, width: 140 }}
          />

          <TreatmentBox
            title="Antibiotics"
            style={{ position: 'absolute', left: 1850, top: 780, width: 180 }}
          />

          <TreatmentBox
            title="Hormonal therapy"
            style={{ position: 'absolute', left: 2090, top: 780, width: 200 }}
          />

          {/* LINES AND ARROWS */}
          {/* From main title to two branches */}
          <VerticalLine x={800} startY={80} endY={180} />
          <VerticalLine x={1400} startY={80} endY={180} />
          <ArrowHead x={800} y={180} direction="down" />
          <ArrowHead x={1400} y={180} direction="down" />

          {/* LEFT BRANCH: From Vulva or introitus to Visual inspection */}
          <VerticalLine x={400} startY={230} endY={320} />
          <ArrowHead x={400} y={320} direction="down" />

          {/* From Visual inspection to three findings */}
          <VerticalLine x={400} startY={370} endY={480} />
          <HorizontalLine y={480} startX={110} endX={630} />
          
          <VerticalLine x={110} startY={480} endY={520} />
          <VerticalLine x={380} startY={480} endY={520} />
          <VerticalLine x={630} startY={480} endY={520} />
          
          <ArrowHead x={110} y={520} direction="down" />
          <ArrowHead x={380} y={520} direction="down" />
          <ArrowHead x={630} y={520} direction="down" />

          {/* From findings to diagnoses/treatments */}
          <VerticalLine x={110} startY={530} endY={580} />
          <ArrowHead x={110} y={580} direction="down" />

          <VerticalLine x={380} startY={530} endY={580} />
          <ArrowHead x={380} y={580} direction="down" />

          <VerticalLine x={630} startY={530} endY={580} />
          <ArrowHead x={630} y={580} direction="down" />

          {/* From diagnoses to treatments */}
          <VerticalLine x={110} startY={630} endY={680} />
          <ArrowHead x={110} y={680} direction="down" />

          <VerticalLine x={380} startY={630} endY={680} />
          <ArrowHead x={380} y={680} direction="down" />

          {/* From Normal exam to Abnormal vaginal discharge */}
          <VerticalLine x={610} startY={530} endY={580} />
          <ArrowHead x={610} y={580} direction="down" />

          {/* From Abnormal vaginal discharge - split to two diagnoses */}
          <VerticalLine x={800} startY={630} endY={680} />
          <HorizontalLine y={680} startX={700} endX={1000} />
          
          <VerticalLine x={800} startY={680} endY={720} />
          <VerticalLine x={1000} startY={680} endY={720} />
          
          <ArrowHead x={800} y={720} direction="down" />
          <ArrowHead x={1000} y={720} direction="down" />

          {/* From diagnoses to treatments */}
          <VerticalLine x={800} startY={730} endY={780} />
          <ArrowHead x={800} y={780} direction="down" />

          <VerticalLine x={1000} startY={730} endY={780} />
          <ArrowHead x={1000} y={780} direction="down" />

          {/* RIGHT BRANCH: Deep pelvis pathway */}
          <VerticalLine x={1400} startY={230} endY={320} />
          <ArrowHead x={1400} y={320} direction="down" />

          {/* From Deep pelvis to Pain associated with menstrual cycle */}
          <VerticalLine x={1400} startY={370} endY={440} />
          <HorizontalLine y={440} startX={1200} endX={1700} />
          
          <VerticalLine x={1340} startY={440} endY={480} />
          <VerticalLine x={1700} startY={440} endY={480} />
          
          <ArrowHead x={1340} y={480} direction="down" />
          <ArrowHead x={1700} y={480} direction="down" />

          {/* From findings to diagnoses */}
          <VerticalLine x={1340} startY={530} endY={580} />
          <ArrowHead x={1340} y={580} direction="down" />

          <VerticalLine x={1700} startY={530} endY={580} />
          <ArrowHead x={1700} y={580} direction="down" />

          {/* From Bimanual exam to four findings */}
          <VerticalLine x={1700} startY={530} endY={660} />
          <HorizontalLine y={660} startX={1420} endX={2190} />
          
          <VerticalLine x={1420} startY={660} endY={700} />
          <VerticalLine x={1670} startY={660} endY={700} />
          <VerticalLine x={1940} startY={660} endY={700} />
          <VerticalLine x={2190} startY={660} endY={700} />
          
          <ArrowHead x={1420} y={700} direction="down" />
          <ArrowHead x={1670} y={700} direction="down" />
          <ArrowHead x={1940} y={700} direction="down" />
          <ArrowHead x={2190} y={700} direction="down" />

          {/* From findings to diagnoses */}
          <VerticalLine x={1420} startY={750} endY={800} />
          <ArrowHead x={1420} y={800} direction="down" />

          <VerticalLine x={1670} startY={750} endY={800} />
          <ArrowHead x={1670} y={800} direction="down" />

          <VerticalLine x={1940} startY={750} endY={800} />
          <ArrowHead x={1940} y={800} direction="down" />

          <VerticalLine x={2190} startY={750} endY={800} />
          <ArrowHead x={2190} y={800} direction="down" />

          {/* From diagnoses to treatments */}
          <VerticalLine x={1420} startY={850} endY={900} />
          <ArrowHead x={1420} y={900} direction="down" />

          <VerticalLine x={1670} startY={850} endY={900} />
          <ArrowHead x={1670} y={900} direction="down" />

          <VerticalLine x={1940} startY={850} endY={900} />
          <ArrowHead x={1940} y={900} direction="down" />

          <VerticalLine x={2190} startY={850} endY={900} />
          <ArrowHead x={2190} y={900} direction="down" />

        </div>
      </div>

      {/* Instructions overlay */}
      <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg text-sm text-gray-600">
        <div className="font-semibold mb-1">Instructions:</div>
        <div>• Click and drag to pan around the flowchart</div>
        <div>• Use touch gestures on mobile devices</div>
        <div>• Scroll to zoom in/out</div>
      </div>
    </div>
  );
} 
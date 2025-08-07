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

export default function GenitalUlcersFlowchart({ 
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
      const flowchartWidth = 4200;
      const flowchartHeight = 3200;
      
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
        <title>Genital Ulcers</title>
        <meta name="description" content="Medical flowchart for genital ulcers evaluation" />
      </Head>
      
      <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
        {/* Header with full screen button */}
        <div className="bg-white/90 backdrop-blur-sm p-3 sm:p-4 shadow-sm flex items-center justify-between">
          <h1 className="text-lg sm:text-2xl font-bold text-blue-600">Genital Ulcers</h1>
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
              width: '4200px',
              height: '3200px',
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
            {/* Main Decision Point */}
            <DecisionBox
              title="Is the Ulcer Painful?"
              style={{ position: 'absolute', left: 900, top: 50, width: 200 }}
            />

            {/* LEFT BRANCH: Painful */}
            <FindingBox
              title="Painful"
              style={{ position: 'absolute', left: 300, top: 180, width: 120 }}
            />

            {/* LEFT SUB-BRANCH 1: Behçet Disease */}
            <FindingBox
              title="Recurrent aphthous and genital ulcers, uveitis, skin lesions (erythema nodosum, acneiform), thrombosis"
              style={{ position: 'absolute', left: 50, top: 300, width: 280 }}
            />

            <DiagnosisBox
              title="Behçet Disease"
              style={{ position: 'absolute', left: 150, top: 450, width: 120 }}
            />

            <TreatmentBox
              title="Steroids"
              style={{ position: 'absolute', left: 150, top: 550, width: 120 }}
            />

            {/* Image for Behçet Disease */}
            <div
              style={{ position: 'absolute', left: 100, top: 650, width: 220, height: 150 }}
            >
              <Image
                src="/images/approaches images/obs & gyne/Genital Ulcers/1.png"
                alt="Behçet Disease - Large mononuclear cell with multiple Donovan bodies"
                width={220}
                height={150}
                style={{ objectFit: 'contain', width: '100%', height: '100%' }}
              />
            </div>
            
            {/* Caption for Image 1 */}
            <div
              style={{ 
                position: 'absolute', 
                left: 100, 
                top: 810, 
                width: 220, 
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: '500',
                color: '#374151',
                lineHeight: '1.2'
              }}
            >
              Large, mononuclear cell with multiple Donovan bodies
            </div>

            {/* LEFT SUB-BRANCH 2: Herpes Simplex */}
            <FindingBox
              title="Multiple vesicular lesions"
              style={{ position: 'absolute', left: 380, top: 300, width: 180 }}
            />

            <AssessmentBox
              title="Viral culture, PCR, direct fluorescent antigen, serology or Tzanck smear"
              style={{ position: 'absolute', left: 370, top: 400, width: 200 }}
            />

            <DiagnosisBox
              title="Herpes Simplex Virus"
              style={{ position: 'absolute', left: 400, top: 520, width: 140 }}
            />

            <TreatmentBox
              title="Acyclovir, famciclovir, or valacyclovir"
              style={{ position: 'absolute', left: 380, top: 620, width: 180 }}
            />

            {/* Image for Herpes Simplex */}
            <div
              style={{ position: 'absolute', left: 360, top: 720, width: 220, height: 150 }}
            >
              <Image
                src="/images/approaches images/obs & gyne/Genital Ulcers/2.png"
                alt="Herpes Simplex - Multiple superficial ulcerations of primary genital herpes"
                width={220}
                height={150}
                style={{ objectFit: 'contain', width: '100%', height: '100%' }}
              />
            </div>
            
            {/* Caption for Image 2 */}
            <div
              style={{ 
                position: 'absolute', 
                left: 360, 
                top: 880, 
                width: 220, 
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: '500',
                color: '#374151',
                lineHeight: '1.2'
              }}
            >
              Multiple superficial ulcerations of primary genital herpes
            </div>

            {/* LEFT SUB-BRANCH 3: Chancroid */}
            <FindingBox
              title="Large deep ulcer(s)"
              style={{ position: 'absolute', left: 620, top: 300, width: 150 }}
            />

            <DiagnosisBox
              title="Chancroid"
              style={{ position: 'absolute', left: 650, top: 420, width: 120 }}
            />

            <TreatmentBox
              title="Single-dose azithromycin or ceftriaxone"
              style={{ position: 'absolute', left: 600, top: 520, width: 200 }}
            />

            {/* Image for Chancroid */}
            <div
              style={{ position: 'absolute', left: 620, top: 620, width: 180, height: 150 }}
            >
              <Image
                src="/images/approaches images/obs & gyne/Genital Ulcers/3.png"
                alt="Chancroid - Ulcerative lesion typical of chancroid"
                width={180}
                height={150}
                style={{ objectFit: 'contain', width: '100%', height: '100%' }}
              />
            </div>

            {/* RIGHT BRANCH: Painless */}
            <FindingBox
              title="Painless"
              style={{ position: 'absolute', left: 1500, top: 180, width: 120 }}
            />

            {/* Syphilis Testing Decision */}
            <DecisionBox
              title="Syphilis Testing (VDRL, RPR)"
              style={{ position: 'absolute', left: 1450, top: 280, width: 220 }}
            />

            {/* RIGHT SUB-BRANCH 1: Lymphogranuloma Venereum */}
            <FindingBox
              title="Small shallow ulcers, painful lymphadenopathy"
              style={{ position: 'absolute', left: 1050, top: 420, width: 220 }}
            />

            <AssessmentBox
              title="C. trachomatis NAAT testing"
              style={{ position: 'absolute', left: 1070, top: 520, width: 180 }}
            />

            <DiagnosisBox
              title="Lymphogranuloma Venereum"
              style={{ position: 'absolute', left: 1080, top: 620, width: 160 }}
            />

            <TreatmentBox
              title="Doxycycline or azithromycin"
              style={{ position: 'absolute', left: 1080, top: 720, width: 160 }}
            />

            {/* Image for Lymphogranuloma Venereum */}
            <div
              style={{ position: 'absolute', left: 1070, top: 820, width: 180, height: 150 }}
            >
              <Image
                src="/images/approaches images/obs & gyne/Genital Ulcers/4.png"
                alt="Lymphogranuloma Venereum - Swollen lymph nodes or affected area"
                width={180}
                height={150}
                style={{ objectFit: 'contain', width: '100%', height: '100%' }}
              />
            </div>

            {/* RIGHT SUB-BRANCH 2: Granuloma Inguinale */}
            <FindingBox
              title="Extensive, progressive ulcers"
              style={{ position: 'absolute', left: 1450, top: 420, width: 180 }}
            />

            <AssessmentBox
              title="Biopsy (Donovan bodies)"
              style={{ position: 'absolute', left: 1460, top: 520, width: 160 }}
            />

            <DiagnosisBox
              title="Granuloma Inguinale"
              style={{ position: 'absolute', left: 1470, top: 620, width: 140 }}
            />

            <TreatmentBox
              title="Doxycycline or azithromycin"
              style={{ position: 'absolute', left: 1450, top: 720, width: 180 }}
            />

            {/* Image for Granuloma Inguinale */}
            <div
              style={{ position: 'absolute', left: 1420, top: 820, width: 240, height: 150 }}
            >
              <Image
                src="/images/approaches images/obs & gyne/Genital Ulcers/5.png"
                alt="Granuloma Inguinale - Characteristic beefy red ulcer of granuloma inguinale"
                width={240}
                height={150}
                style={{ objectFit: 'contain', width: '100%', height: '100%' }}
              />
            </div>

            {/* RIGHT SUB-BRANCH 3: Syphilis */}
            <FindingBox
              title="Single large ulcer (chancre)"
              style={{ position: 'absolute', left: 1720, top: 420, width: 180 }}
            />

            <DiagnosisBox
              title="Syphilis"
              style={{ position: 'absolute', left: 1770, top: 540, width: 120 }}
            />

            <TreatmentBox
              title="IM penicillin G"
              style={{ position: 'absolute', left: 1750, top: 640, width: 140 }}
            />

            {/* Image for Syphilis */}
            <div
              style={{ position: 'absolute', left: 1740, top: 740, width: 160, height: 150 }}
            >
              <Image
                src="/images/approaches images/obs & gyne/Genital Ulcers/6.png"
                alt="Syphilis - Syphilitic chancre"
                width={160}
                height={150}
                style={{ objectFit: 'contain', width: '100%', height: '100%' }}
              />
            </div>

            {/* CONNECTING LINES AND ARROWS */}
            
            {/* From main decision to Painful and Painless */}
            <VerticalLine x={1000} startY={100} endY={140} />
            <HorizontalLine y={140} startX={360} endX={1560} />
            
            {/* To Painful branch */}
            <VerticalLine x={360} startY={140} endY={180} />
            <ArrowHead x={360} y={180} direction="down" />
            
            {/* To Painless branch */}
            <VerticalLine x={1560} startY={140} endY={180} />
            <ArrowHead x={1560} y={180} direction="down" />

            {/* From Painful to three sub-branches */}
            <VerticalLine x={360} startY={230} endY={260} />
            <HorizontalLine y={260} startX={190} endX={695} />
            
            {/* To Behçet Disease */}
            <VerticalLine x={190} startY={260} endY={300} />
            <ArrowHead x={190} y={300} direction="down" />
            
            {/* To Herpes Simplex */}
            <VerticalLine x={470} startY={260} endY={300} />
            <ArrowHead x={470} y={300} direction="down" />
            
            {/* To Chancroid */}
            <VerticalLine x={695} startY={260} endY={300} />
            <ArrowHead x={695} y={300} direction="down" />

            {/* From Painless to Syphilis Testing */}
            <VerticalLine x={1560} startY={230} endY={280} />
            <ArrowHead x={1560} y={280} direction="down" />

            {/* From Syphilis Testing to three outcomes */}
            <VerticalLine x={1560} startY={330} endY={380} />
            <HorizontalLine y={380} startX={1160} endX={1810} />
            
            {/* Negative results */}
            <VerticalLine x={1160} startY={380} endY={420} />
            <ArrowHead x={1160} y={420} direction="down" />
            
            <VerticalLine x={1540} startY={380} endY={420} />
            <ArrowHead x={1540} y={420} direction="down" />
            
            {/* Positive result */}
            <VerticalLine x={1810} startY={380} endY={420} />
            <ArrowHead x={1810} y={420} direction="down" />

            {/* BEHÇET DISEASE pathway */}
            <VerticalLine x={190} startY={380} endY={450} />
            <ArrowHead x={190} y={450} direction="down" />
            
            <VerticalLine x={190} startY={500} endY={550} />
            <ArrowHead x={190} y={550} direction="down" />

            {/* Line from treatment to image */}
            <VerticalLine x={190} startY={600} endY={650} />
            <ArrowHead x={190} y={650} direction="down" />

            {/* HERPES SIMPLEX pathway */}
            <VerticalLine x={470} startY={350} endY={400} />
            <ArrowHead x={470} y={400} direction="down" />
            
            <VerticalLine x={470} startY={450} endY={520} />
            <ArrowHead x={470} y={520} direction="down" />
            
            <VerticalLine x={470} startY={570} endY={620} />
            <ArrowHead x={470} y={620} direction="down" />

            {/* Line from treatment to image */}
            <VerticalLine x={470} startY={670} endY={720} />
            <ArrowHead x={470} y={720} direction="down" />

            {/* CHANCROID pathway */}
            <VerticalLine x={695} startY={350} endY={420} />
            <ArrowHead x={695} y={420} direction="down" />
            
            <VerticalLine x={695} startY={470} endY={520} />
            <ArrowHead x={695} y={520} direction="down" />

            {/* Line from treatment to image */}
            <VerticalLine x={695} startY={570} endY={620} />
            <ArrowHead x={695} y={620} direction="down" />

            {/* LYMPHOGRANULOMA VENEREUM pathway */}
            <VerticalLine x={1160} startY={470} endY={520} />
            <ArrowHead x={1160} y={520} direction="down" />
            
            <VerticalLine x={1160} startY={570} endY={620} />
            <ArrowHead x={1160} y={620} direction="down" />
            
            <VerticalLine x={1160} startY={670} endY={720} />
            <ArrowHead x={1160} y={720} direction="down" />

            {/* Line from treatment to image */}
            <VerticalLine x={1160} startY={770} endY={820} />
            <ArrowHead x={1160} y={820} direction="down" />

            {/* GRANULOMA INGUINALE pathway */}
            <VerticalLine x={1540} startY={470} endY={520} />
            <ArrowHead x={1540} y={520} direction="down" />
            
            <VerticalLine x={1540} startY={570} endY={620} />
            <ArrowHead x={1540} y={620} direction="down" />
            
            <VerticalLine x={1540} startY={670} endY={720} />
            <ArrowHead x={1540} y={720} direction="down" />

            {/* Line from treatment to image */}
            <VerticalLine x={1540} startY={770} endY={820} />
            <ArrowHead x={1540} y={820} direction="down" />

            {/* SYPHILIS pathway */}
            <VerticalLine x={1810} startY={470} endY={540} />
            <ArrowHead x={1810} y={540} direction="down" />
            
            <VerticalLine x={1810} startY={590} endY={640} />
            <ArrowHead x={1810} y={640} direction="down" />

            {/* Line from treatment to image */}
            <VerticalLine x={1810} startY={690} endY={740} />
            <ArrowHead x={1810} y={740} direction="down" />

            {/* Plus/Minus indicators for syphilis testing */}
            <PlusMinusIndicator type="minus" x={1160} y={380} />
            <PlusMinusIndicator type="minus" x={1540} y={380} />
            <PlusMinusIndicator type="plus" x={1810} y={380} />

          </div>
        </div>
      </div>
    </>
  );
} 
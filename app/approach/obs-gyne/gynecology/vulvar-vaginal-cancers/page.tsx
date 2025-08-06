'use client';

import React, { useRef, useState, useEffect } from 'react';
import Head from "next/head";

// Main title box component (Gray)
const TitleBox = ({ title, style = {} }: { title: string; style?: React.CSSProperties }) => (
  <div 
    className="flowchart-box bg-gray-200 border-2 border-gray-400 px-6 py-4 text-center rounded-lg shadow-md text-lg font-bold text-gray-800"
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
    className="flowchart-box bg-gray-200 border-2 border-gray-400 px-4 py-3 text-center rounded-lg shadow-md text-sm font-medium text-gray-800"
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
    className="flowchart-box bg-green-100 border-2 border-green-400 px-4 py-3 text-center rounded-lg shadow-md text-sm font-medium text-gray-800"
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
    className="flowchart-box bg-orange-300 border-2 border-orange-500 px-4 py-3 text-center shadow-md text-sm font-bold text-gray-800"
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
    className="flowchart-box bg-blue-200 border-2 border-blue-400 px-4 py-3 text-center rounded-lg shadow-md text-sm font-medium text-gray-800"
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
    className="flowchart-box bg-gray-100 border-2 border-gray-400 px-4 py-3 text-center rounded-lg shadow-md text-sm font-medium text-gray-700"
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
    className="flowchart-box bg-gray-100 border-2 border-gray-400 px-4 py-3 rounded-lg shadow-md text-xs text-gray-700"
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

export default function VulvarVaginalCancersPage({ frameFullScreen, onToggleFrameFullScreen }: { frameFullScreen: boolean; onToggleFrameFullScreen: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [scale, setScale] = useState(1);
  const [zoomScale, setZoomScale] = useState(1);
  const [initialDistance, setInitialDistance] = useState(0);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [lastTouchX, setLastTouchX] = useState(0);
  const [lastTouchY, setLastTouchY] = useState(0);
  const [mouseStartPos, setMouseStartPos] = useState({ x: 0, y: 0 });

  // Check if mobile/tablet on mount and resize
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
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

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.flowchart-box')) return;
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
    
    // Only zoom if not panning
    if (!isPanning) {
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
      if (target.closest('.flowchart-box')) {
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

  return (
    <>
      <Head>
        <title>Vulvar/Vaginal Cancers</title>
        <meta name="description" content="Medical flowchart for vulvar and vaginal cancer evaluation" />
      </Head>
      
      <div className={`${frameFullScreen ? 'fixed inset-0 z-50 bg-gray-100' : 'h-screen bg-gray-100'} overflow-hidden flex flex-col`}>
        {/* Header - Fixed at top */}
        <div className="bg-white p-4 shadow-sm flex items-center justify-between flex-shrink-0 border-b border-gray-200 z-10 relative">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-blue-600">Vulvar/Vaginal Cancers</h1>
          </div>
          <button
            onClick={onToggleFrameFullScreen}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
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

        {/* Main flowchart container - Takes remaining space */}
        <div
          ref={containerRef}
          className="relative w-full flex-grow overflow-hidden flex items-center justify-center"
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
            {/* Main Title - Centered at top */}
            <TitleBox
              title="Post-coital or Postmenopausal Painless Vaginal Bleeding"
              style={{ position: 'absolute', left: 600, top: 10, width: 400 }}
            />

            {/* LEFT BRANCH: Chronic vulvar pruritis */}
            <FindingBox
              title="Chronic vulvar pruritis"
              style={{ position: 'absolute', left: 300, top: 180, width: 200 }}
            />

            <DecisionBox
              title="Pelvic exam"
              style={{ position: 'absolute', left: 320, top: 320, width: 160 }}
            />

            {/* Three branches from Pelvic exam */}
            {/* LEFT: Vulvar lump or mass */}
            <FindingBox
              title="Vulvar lump or mass¹"
              style={{ position: 'absolute', left: 80, top: 480, width: 180 }}
            />

            <DecisionBox
              title="Biopsy"
              style={{ position: 'absolute', left: 70, top: 620, width: 100 }}
            />

            <DiagnosisBox
              title="Vulvar Cancer"
              style={{ position: 'absolute', left: 50, top: 760, width: 140 }}
            />

            <TreatmentBox
              title="Surgical resection, chemotherapy for systemic metastasis"
              style={{ position: 'absolute', left: 10, top: 900, width: 220 }}
            />

            {/* CENTER: Multiple suspicious vulvar lesions */}
            <FindingBox
              title="Multiple suspicious vulvar lesions¹"
              style={{ position: 'absolute', left: 320, top: 480, width: 220 }}
            />

            <DecisionBox
              title="Biopsy"
              style={{ position: 'absolute', left: 380, top: 620, width: 100 }}
            />

            <DiagnosisBox
              title="Vulvar Intraepithelial Neoplasia"
              style={{ position: 'absolute', left: 320, top: 760, width: 220 }}
            />

            {/* VIN splits into two types */}
            <DiagnosisBox
              title="Differentiated VIN"
              style={{ position: 'absolute', left: 250, top: 900, width: 140 }}
            />

            <DiagnosisBox
              title="Vulvar HSIL"
              style={{ position: 'absolute', left: 430, top: 900, width: 120 }}
            />

            {/* Differentiated VIN pathway */}
            <TreatmentBox
              title="Surgical excision"
              style={{ position: 'absolute', left: 270, top: 1040, width: 100 }}
            />

            {/* Vulvar HSIL pathway */}
            <TreatmentBox
              title="Topical imiquimod"
              style={{ position: 'absolute', left: 420, top: 1040, width: 140 }}
            />

            {/* Treatment outcomes for Vulvar HSIL */}
            <FindingBox
              title="Treatment success"
              style={{ position: 'absolute', left: 360, top: 1180, width: 120 }}
            />

            <FindingBox
              title="Treatment failure"
              style={{ position: 'absolute', left: 520, top: 1180, width: 120 }}
            />

            <TreatmentBox
              title="Surgical excision or laser ablation"
              style={{ position: 'absolute', left: 500, top: 1320, width: 160 }}
            />

            {/* Annual monitoring - shared endpoint */}
            <TreatmentBox
              title="Annual visual vulvar inspection to monitor for recurrence or vulvar cancer"
              style={{ position: 'absolute', left: 240, top: 1460, width: 280 }}
            />

            {/* RIGHT: Eczematoid vulvar lesion */}
            <FindingBox
              title="Eczematoid vulvar lesion"
              style={{ position: 'absolute', left: 600, top: 480, width: 180 }}
            />

            <DecisionBox
              title="Biopsy"
              style={{ position: 'absolute', left: 640, top: 620, width: 100 }}
            />

            <DiagnosisBox
              title="Paget Disease"
              style={{ position: 'absolute', left: 620, top: 760, width: 140 }}
            />

            <AssessmentBox
              title="Assess for underlying invasive cancers not primary to the vulva"
              style={{ position: 'absolute', left: 580, top: 900, width: 220 }}
            />

            <TreatmentBox
              title="Surgical excision"
              style={{ position: 'absolute', left: 640, top: 1040, width: 100 }}
            />

            {/* RIGHT BRANCH: Speculum exam pathway */}
            <DecisionBox
              title="Speculum exam"
              style={{ position: 'absolute', left: 1200, top: 180, width: 160 }}
            />

            <FindingBox
              title="Vaginal mass"
              style={{ position: 'absolute', left: 1200, top: 320, width: 160 }}
            />

            <DecisionBox
              title="Biopsy ± colposcopy"
              style={{ position: 'absolute', left: 1180, top: 460, width: 200 }}
            />

            <DiagnosisBox
              title="Vaginal Cancer"
              style={{ position: 'absolute', left: 1200, top: 600, width: 160 }}
            />

            <DecisionBox
              title="Clinical staging"
              style={{ position: 'absolute', left: 1200, top: 740, width: 160 }}
            />

            <TreatmentBox
              title="Radiation ± surgical resection"
              style={{ position: 'absolute', left: 1160, top: 880, width: 240 }}
            />

            {/* Footnotes */}
            <FootnotesBox
              style={{ position: 'absolute', left: 800, top: 1200, width: 600, minHeight: 120 }}
            >
              <div className="text-sm leading-relaxed">
                <div className="font-bold text-lg mb-3 text-gray-800">Footnotes</div>
                <div className="mb-2"><strong>1.</strong> Features of suspicious lesions: Confluent and wartlike; persistent ulceration and pruritis; change in color, elevation, or surface of lesion; condylomatas not responsive to treatment.</div>
              </div>
            </FootnotesBox>

            {/* CONNECTING LINES AND ARROWS */}
            
            {/* From Main Title to left and right branches */}
            <VerticalLine x={800} startY={80} endY={150} />
            <HorizontalLine y={150} startX={400} endX={1280} />
            
            {/* To Chronic vulvar pruritis (LEFT BRANCH) */}
            <VerticalLine x={400} startY={150} endY={180} />
            <ArrowHead x={400} y={180} direction="down" />
            <PlusMinusIndicator type="minus" x={380} y={165} />
            
            {/* To Speculum exam (RIGHT BRANCH) */}
            <VerticalLine x={1280} startY={150} endY={180} />
            <ArrowHead x={1280} y={180} direction="down" />
            <PlusMinusIndicator type="plus" x={1300} y={165} />

            {/* LEFT BRANCH: Chronic vulvar pruritis to Pelvic exam */}
            <VerticalLine x={400} startY={230} endY={320} />
            <ArrowHead x={400} y={320} direction="down" />

            {/* From Pelvic exam to three findings */}
            <VerticalLine x={400} startY={370} endY={440} />
            <HorizontalLine y={440} startX={120} endX={690} />
            
            {/* To three findings */}
            <VerticalLine x={120} startY={440} endY={480} />
            <VerticalLine x={430} startY={440} endY={480} />
            <VerticalLine x={690} startY={440} endY={480} />
            
            <ArrowHead x={120} y={480} direction="down" />
            <ArrowHead x={430} y={480} direction="down" />
            <ArrowHead x={690} y={480} direction="down" />

            {/* LEFT PATH: Vulvar lump or mass */}
            <VerticalLine x={120} startY={530} endY={620} />
            <ArrowHead x={120} y={620} direction="down" />

            <VerticalLine x={120} startY={670} endY={760} />
            <ArrowHead x={120} y={760} direction="down" />

            <VerticalLine x={120} startY={810} endY={900} />
            <ArrowHead x={120} y={900} direction="down" />

            {/* CENTER PATH: Multiple suspicious vulvar lesions */}
            <VerticalLine x={430} startY={530} endY={620} />
            <ArrowHead x={430} y={620} direction="down" />

            <VerticalLine x={430} startY={670} endY={760} />
            <ArrowHead x={430} y={760} direction="down" />

            {/* From VIN to two types */}
            <VerticalLine x={430} startY={810} endY={860} />
            <HorizontalLine y={860} startX={320} endX={490} />
            
            <VerticalLine x={320} startY={860} endY={900} />
            <VerticalLine x={490} startY={860} endY={900} />
            
            <ArrowHead x={320} y={900} direction="down" />
            <ArrowHead x={490} y={900} direction="down" />

            {/* From Differentiated VIN to Surgical excision */}
            <VerticalLine x={320} startY={950} endY={1040} />
            <ArrowHead x={320} y={1040} direction="down" />

            {/* From Vulvar HSIL to Topical imiquimod */}
            <VerticalLine x={490} startY={950} endY={1040} />
            <ArrowHead x={490} y={1040} direction="down" />

            {/* From Topical imiquimod to treatment outcomes */}
            <VerticalLine x={490} startY={1090} endY={1140} />
            <HorizontalLine y={1140} startX={420} endX={580} />
            
            <VerticalLine x={420} startY={1140} endY={1180} />
            <VerticalLine x={580} startY={1140} endY={1180} />
            
            <ArrowHead x={420} y={1180} direction="down" />
            <ArrowHead x={580} y={1180} direction="down" />

            {/* From Treatment failure to Surgical excision */}
            <VerticalLine x={580} startY={1230} endY={1320} />
            <ArrowHead x={580} y={1320} direction="down" />

            {/* To Annual monitoring - multiple connections */}
            <VerticalLine x={320} startY={1090} endY={1420} />
            <VerticalLine x={420} startY={1230} endY={1420} />
            <VerticalLine x={580} startY={1370} endY={1420} />
            
            <HorizontalLine y={1420} startX={320} endX={580} />
            
            {/* Connection to Annual monitoring box */}
            <VerticalLine x={380} startY={1420} endY={1460} />
            <ArrowHead x={380} y={1460} direction="down" />

            {/* RIGHT PATH: Eczematoid vulvar lesion */}
            <VerticalLine x={690} startY={530} endY={620} />
            <ArrowHead x={690} y={620} direction="down" />

            <VerticalLine x={690} startY={670} endY={760} />
            <ArrowHead x={690} y={760} direction="down" />

            <VerticalLine x={690} startY={810} endY={900} />
            <ArrowHead x={690} y={900} direction="down" />

            <VerticalLine x={690} startY={950} endY={1040} />
            <ArrowHead x={690} y={1040} direction="down" />

            {/* RIGHT BRANCH: Speculum exam pathway */}
            <VerticalLine x={1280} startY={230} endY={320} />
            <ArrowHead x={1280} y={320} direction="down" />

            <VerticalLine x={1280} startY={370} endY={460} />
            <ArrowHead x={1280} y={460} direction="down" />

            <VerticalLine x={1280} startY={510} endY={600} />
            <ArrowHead x={1280} y={600} direction="down" />

            <VerticalLine x={1280} startY={650} endY={740} />
            <ArrowHead x={1280} y={740} direction="down" />

            <VerticalLine x={1280} startY={790} endY={880} />
            <ArrowHead x={1280} y={880} direction="down" />

          </div>
        </div>
      </div>
    </>
  );
} 
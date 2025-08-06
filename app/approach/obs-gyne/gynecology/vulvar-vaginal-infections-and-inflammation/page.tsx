'use client';

import React, { useRef, useState, useEffect } from 'react';

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

// Reference box component (Red)
const ReferenceBox = ({ text, style = {} }: { text: string; style?: React.CSSProperties }) => (
  <div 
    className="flowchart-box bg-red-300 border-2 border-red-500 px-4 py-3 text-center rounded-lg shadow-md text-sm font-semibold text-black"
    style={{
      minHeight: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style
    }}
  >
    {text}
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

export default function VulvarVaginalInfectionsAndInflammationPage({ frameFullScreen, onToggleFrameFullScreen }: { frameFullScreen: boolean; onToggleFrameFullScreen: () => void }) {
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
    <div className={`${frameFullScreen ? 'fixed inset-0 z-50 bg-gray-100' : 'h-screen bg-gray-100'} overflow-hidden flex flex-col`}>
        {/* Header - Fixed at top */}
        <div className="bg-white p-4 shadow-sm flex items-center justify-between flex-shrink-0 border-b border-gray-200 z-10 relative">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-blue-600">Vulvar/Vaginal Infections and Inflammation</h1>
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
            <DecisionBox
              title="Is the Lesion Painful?"
              style={{ position: 'absolute', left: 650, top: 50, width: 300 }}
            />

            {/* LEFT BRANCH: Painful */}
            <FindingBox
              title="Painful"
              style={{ position: 'absolute', left: 300, top: 180, width: 150 }}
            />

            {/* RIGHT BRANCH: Painless */}
            <FindingBox
              title="Painless"
              style={{ position: 'absolute', left: 1500, top: 180, width: 150 }}
            />

            {/* PAINFUL BRANCH - Split into Chronic/Acute */}
            <FindingBox
              title="Chronic"
              style={{ position: 'absolute', left: 150, top: 320, width: 120 }}
            />

            <FindingBox
              title="Acute"
              style={{ position: 'absolute', left: 640, top: 320, width: 120 }}
            />

            {/* CHRONIC PAINFUL - Two presentations */}
            <FindingBox
              title="Normal-appearing vulva ± erythema"
              style={{ position: 'absolute', left: 50, top: 480, width: 200 }}
            />

            <FindingBox
              title="Erythematous nodules ± pustules"
              style={{ position: 'absolute', left: 280, top: 480, width: 200 }}
            />

            {/* Normal-appearing vulva pathway */}
            <AssessmentBox
              title=">3 months, no identifiable etiology"
              style={{ position: 'absolute', left: 70, top: 620, width: 160 }}
            />

            <AssessmentBox
              title="Positive cotton swab test¹"
              style={{ position: 'absolute', left: 80, top: 760, width: 140 }}
            />

            <DiagnosisBox
              title="Localized Provoked Vulvodynia"
              style={{ position: 'absolute', left: 50, top: 900, width: 200 }}
            />

            <TreatmentBox
              title="Lifestyle changes, pelvic floor PT, psychological intervention, medications. Vestibulectomy if no resolution"
              style={{ position: 'absolute', left: 20, top: 1040, width: 260 }}
            />

            {/* Erythematous nodules pathway */}
            <DiagnosisBox
              title="Hidradenitis Suppurativa"
              style={{ position: 'absolute', left: 310, top: 620, width: 140 }}
            />

            <ReferenceBox
              text="See Dermatology"
              style={{ position: 'absolute', left: 320, top: 760, width: 120 }}
            />

            {/* ACUTE PAINFUL - Two presentations */}
            <FindingBox
              title="Tender, warm, fluctuant mass posterior to vaginal introitus ± purulent discharge"
              style={{ position: 'absolute', left: 500, top: 480, width: 240 }}
            />

            <FindingBox
              title="Painful, fluid-filled vesicle(s) that evolve into pustules or ulcers"
              style={{ position: 'absolute', left: 780, top: 480, width: 240 }}
            />

            {/* Bartholin Abscess pathway */}
            <DiagnosisBox
              title="Bartholin Abscess"
              style={{ position: 'absolute', left: 570, top: 620, width: 100 }}
            />

            <TreatmentBox
              title="I&D with exudate culture, biopsy if malignancy concern"
              style={{ position: 'absolute', left: 540, top: 760, width: 154 }}
            />

            {/* Herpes pathway */}
            <DiagnosisBox
              title="Herpes Simplex Virus"
              style={{ position: 'absolute', left: 840, top: 620, width: 120 }}
            />

            <AssessmentBox
              title="Viral culture, PCR, direct fluorescent antigen, serology or Tzanck smear"
              style={{ position: 'absolute', left: 800, top: 760, width: 200 }}
            />

            <ReferenceBox
              text="See Genital Ulcers"
              style={{ position: 'absolute', left: 830, top: 900, width: 140 }}
            />

            {/* PAINLESS BRANCH - Four presentations */}
            <FindingBox
              title="Non-tender, soft mass posterior to vaginal introitus with white/clear discharge"
              style={{ position: 'absolute', left: 1080, top: 320, width: 280 }}
            />

            <FindingBox
              title="Firm, dome-shaped with central umbilication"
              style={{ position: 'absolute', left: 1400, top: 320, width: 180 }}
            />

            <FindingBox
              title="Hypopigmented, flat, wart-like, moist papules"
              style={{ position: 'absolute', left: 1620, top: 320, width: 180 }}
            />

            <FindingBox
              title="Soft, flat, pedunculated papules to large cauliflower-like lesions"
              style={{ position: 'absolute', left: 1840, top: 320, width: 240 }}
            />

            {/* Bartholin Cyst pathway */}
            <DiagnosisBox
              title="Bartholin Cyst"
              style={{ position: 'absolute', left: 1160, top: 480, width: 120 }}
            />

            <TreatmentBox
              title="Monitor (<3 cm) or I&D (≥3 cm), biopsy if malignancy concern"
              style={{ position: 'absolute', left: 1120, top: 620, width: 200 }}
            />

            {/* VERTICAL PATHWAY 1: Firm, dome-shaped → Pruritis → Molluscum Contagiosum → See Dermatology */}
            <FindingBox
              title="Pruritis"
              style={{ position: 'absolute', left: 1430, top: 480, width: 120 }}
            />

            <DiagnosisBox
              title="Molluscum Contagiosum"
              style={{ position: 'absolute', left: 1410, top: 620, width: 160 }}
            />

            <ReferenceBox
              text="See Dermatology"
              style={{ position: 'absolute', left: 1430, top: 760, width: 120 }}
            />

            {/* VERTICAL PATHWAY 2: Hypopigmented → Rash → Serology → Condylomata Lata → See Genital Ulcers */}
            <FindingBox
              title="Rash, constitutional symptoms"
              style={{ position: 'absolute', left: 1640, top: 480, width: 140 }}
            />

            <AssessmentBox
              title="Serology, biopsy"
              style={{ position: 'absolute', left: 1640, top: 620, width: 100 }}
            />

            <DiagnosisBox
              title="Condylomata Lata"
              style={{ position: 'absolute', left: 1640, top: 760, width: 120 }}
            />

            <ReferenceBox
              text="See Genital Ulcers"
              style={{ position: 'absolute', left: 1640, top: 900, width: 140 }}
            />

            {/* Condylomata Acuminata pathway */}
            <DiagnosisBox
              title="Condylomata Acuminata"
              style={{ position: 'absolute', left: 1890, top: 480, width: 140 }}
            />

            <TreatmentBox
              title="STI evaluation and counseling, medical treatment (if symptomatic), surgical treatment (if large or refractory)"
              style={{ position: 'absolute', left: 1840, top: 620, width: 240 }}
            />

            {/* Footnotes */}
            <FootnotesBox
              style={{ position: 'absolute', left: 1200, top: 1200, width: 600, minHeight: 80 }}
            >
              <div className="text-sm leading-relaxed">
                <div className="font-bold text-lg mb-3 text-gray-800">Footnote</div>
                <div className="mb-2"><strong>1.</strong> Significant pain provoked upon focal pressure point testing with a cotton swab.</div>
              </div>
            </FootnotesBox>

            {/* CONNECTING LINES AND ARROWS */}
            
            {/* From Main Title to left and right branches */}
            <VerticalLine x={800} startY={100} endY={140} />
            <HorizontalLine y={140} startX={375} endX={1575} />
            
            {/* To Painful (LEFT BRANCH) */}
            <VerticalLine x={375} startY={140} endY={180} />
            <ArrowHead x={375} y={180} direction="down" />
            <PlusMinusIndicator type="plus" x={355} y={160} />
            
            {/* To Painless (RIGHT BRANCH) */}
            <VerticalLine x={1575} startY={140} endY={180} />
            <ArrowHead x={1575} y={180} direction="down" />
            <PlusMinusIndicator type="minus" x={1595} y={160} />

            {/* PAINFUL BRANCH: Split into Chronic/Acute */}
            <VerticalLine x={375} startY={230} endY={280} />
            <HorizontalLine y={280} startX={210} endX={700} />
            
            <VerticalLine x={210} startY={280} endY={320} />
            <VerticalLine x={700} startY={280} endY={320} />
            
            <ArrowHead x={210} y={320} direction="down" />
            <ArrowHead x={700} y={320} direction="down" />

            {/* CHRONIC: Split into two presentations */}
            <VerticalLine x={210} startY={370} endY={440} />
            <HorizontalLine y={440} startX={150} endX={380} />
            
            <VerticalLine x={150} startY={440} endY={480} />
            <VerticalLine x={380} startY={440} endY={480} />
            
            <ArrowHead x={150} y={480} direction="down" />
            <ArrowHead x={380} y={480} direction="down" />

            {/* Normal-appearing vulva pathway */}
            <VerticalLine x={150} startY={530} endY={620} />
            <ArrowHead x={150} y={620} direction="down" />

            <VerticalLine x={150} startY={670} endY={760} />
            <ArrowHead x={150} y={760} direction="down" />

            <VerticalLine x={150} startY={810} endY={900} />
            <ArrowHead x={150} y={900} direction="down" />

            <VerticalLine x={150} startY={950} endY={1040} />
            <ArrowHead x={150} y={1040} direction="down" />

            {/* Erythematous nodules pathway */}
            <VerticalLine x={380} startY={530} endY={620} />
            <ArrowHead x={380} y={620} direction="down" />

            <VerticalLine x={380} startY={670} endY={760} />
            <ArrowHead x={380} y={760} direction="down" />

            {/* ACUTE: Split into two presentations */}
            <VerticalLine x={700} startY={370} endY={440} />
            <HorizontalLine y={440} startX={620} endX={900} />
            
            <VerticalLine x={620} startY={440} endY={480} />
            <VerticalLine x={900} startY={440} endY={480} />
            
            <ArrowHead x={620} y={480} direction="down" />
            <ArrowHead x={900} y={480} direction="down" />

            {/* Bartholin Abscess pathway */}
            <VerticalLine x={620} startY={530} endY={620} />
            <ArrowHead x={620} y={620} direction="down" />

            <VerticalLine x={620} startY={670} endY={760} />
            <ArrowHead x={620} y={760} direction="down" />

            {/* Herpes pathway */}
            <VerticalLine x={900} startY={530} endY={620} />
            <ArrowHead x={900} y={620} direction="down" />

            <VerticalLine x={900} startY={670} endY={760} />
            <ArrowHead x={900} y={760} direction="down" />

            <VerticalLine x={900} startY={810} endY={900} />
            <ArrowHead x={900} y={900} direction="down" />

            {/* PAINLESS BRANCH: Split into four presentations */}
            <VerticalLine x={1575} startY={230} endY={280} />
            <HorizontalLine y={280} startX={1220} endX={1960} />
            
            <VerticalLine x={1220} startY={280} endY={320} />
            <VerticalLine x={1490} startY={280} endY={320} />
            <VerticalLine x={1710} startY={280} endY={320} />
            <VerticalLine x={1960} startY={280} endY={320} />
            
            <ArrowHead x={1220} y={320} direction="down" />
            <ArrowHead x={1490} y={320} direction="down" />
            <ArrowHead x={1710} y={320} direction="down" />
            <ArrowHead x={1960} y={320} direction="down" />

            {/* Bartholin Cyst pathway */}
            <VerticalLine x={1220} startY={370} endY={480} />
            <ArrowHead x={1220} y={480} direction="down" />

            <VerticalLine x={1220} startY={530} endY={620} />
            <ArrowHead x={1220} y={620} direction="down" />

            {/* Molluscum Contagiosum pathway - right vertical */}
            <VerticalLine x={1490} startY={370} endY={480} />
            <ArrowHead x={1490} y={480} direction="down" />

            <VerticalLine x={1490} startY={530} endY={620} />
            <ArrowHead x={1490} y={620} direction="down" />

            <VerticalLine x={1490} startY={670} endY={760} />
            <ArrowHead x={1490} y={760} direction="down" />

            {/* Condylomata Lata pathway - left vertical */}
            <VerticalLine x={1710} startY={370} endY={480} />
            <ArrowHead x={1710} y={480} direction="down" />
            
            <VerticalLine x={1700} startY={530} endY={620} />
            <ArrowHead x={1700} y={620} direction="down" />

            <VerticalLine x={1700} startY={670} endY={760} />
            <ArrowHead x={1700} y={760} direction="down" />

            <VerticalLine x={1700} startY={810} endY={900} />
            <ArrowHead x={1700} y={900} direction="down" />

            {/* Condylomata Acuminata pathway */}
            <VerticalLine x={1960} startY={370} endY={480} />
            <ArrowHead x={1960} y={480} direction="down" />

            <VerticalLine x={1960} startY={530} endY={620} />
            <ArrowHead x={1960} y={620} direction="down" />

          </div>
        </div>
      </div>
  );
} 
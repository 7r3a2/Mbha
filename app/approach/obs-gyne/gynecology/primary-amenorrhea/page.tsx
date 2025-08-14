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

// Diagnosis box component (Gold/Orange)
const DiagnosisBox = ({ title, style = {} }: { title: string; style?: React.CSSProperties }) => (
  <div 
    className="flowchart-box bg-yellow-100 border-2 border-yellow-400 px-4 py-3 text-center rounded-lg shadow-md text-sm font-semibold text-gray-800"
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

// Treatment box component (Light Blue)
const TreatmentBox = ({ title, style = {} }: { title: string; style?: React.CSSProperties }) => (
  <div 
    className="flowchart-box bg-blue-100 border-2 border-blue-400 px-4 py-3 text-center rounded-lg shadow-md text-sm font-medium text-gray-800"
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

// Assessment box component (Purple)
const AssessmentBox = ({ title, style = {} }: { title: string; style?: React.CSSProperties }) => (
  <div 
    className="flowchart-box bg-purple-100 border-2 border-purple-400 px-4 py-3 text-center rounded-lg shadow-md text-sm font-medium text-gray-800"
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

// Definition box component (Light Blue)
const DefinitionBox = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div 
    className="flowchart-box bg-blue-50 border-2 border-blue-400 px-4 py-3 rounded-lg shadow-md text-xs text-gray-700"
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

export default function PrimaryAmenorrheaPage({ frameFullScreen, onToggleFrameFullScreen }: { frameFullScreen: boolean; onToggleFrameFullScreen: () => void }) {
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
      const flowchartWidth = 3000;
      const flowchartHeight = 2000;
      
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
            <h1 className="text-2xl font-bold text-blue-600">Primary Amenorrhea</h1>
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
              width: '3000px',
              height: '2000px',
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
            {/* Title Box in flowchart */}
            <TitleBox 
              title="Primary Amenorrhea" 
              style={{ position: 'absolute', left: '650px', top: '10px', width: '200px' }} 
            />

            {/* Initial Assessment */}
            <DecisionBox 
              title="Pelvic examination or ultrasonography" 
              style={{ position: 'absolute', left: '600px', top: '170px', width: '300px' }} 
            />

            {/* Main vertical line from title to assessment */}
            <VerticalLine x={750} startY={110} endY={170} />
            <ArrowHead x={750} y={170} direction="down" />

            {/* Three main branches from assessment */}
            <VerticalLine x={750} startY={230} endY={290} />
            <HorizontalLine y={290} startX={150} endX={1300} />
            
            {/* Left branch - Uterus Present */}
            <VerticalLine x={150} startY={290} endY={340} />
            <ArrowHead x={150} y={340} direction="down" />
            <FindingBox 
              title="Uterus present" 
              style={{ position: 'absolute', left: '50px', top: '340px', width: '200px' }} 
            />

            {/* Middle branch - Uterus Absent */}
            <VerticalLine x={750} startY={290} endY={340} />
            <ArrowHead x={750} y={340} direction="down" />
            <FindingBox 
              title="Uterus absent" 
              style={{ position: 'absolute', left: '650px', top: '340px', width: '200px' }} 
            />

            {/* Right branch - Outflow Tract Obstruction */}
            <VerticalLine x={1300} startY={290} endY={340} />
            <ArrowHead x={1300} y={340} direction="down" />
            <FindingBox 
              title="Bulging, violaceous, imperforate hymen¹" 
              style={{ position: 'absolute', left: '1170px', top: '340px', width: '260px' }} 
            />

            {/* LEFT BRANCH - Uterus Present Path */}
            <VerticalLine x={150} startY={400} endY={450} />
            <ArrowHead x={150} y={450} direction="down" />
            <AssessmentBox 
              title="Serum FSH" 
              style={{ position: 'absolute', left: '90px', top: '450px', width: '120px' }} 
            />

            {/* FSH branches */}
            <VerticalLine x={150} startY={510} endY={560} />
            <HorizontalLine y={560} startX={40} endX={260} />

            {/* Low FSH branch */}
            <VerticalLine x={40} startY={560} endY={610} />
            <ArrowHead x={40} y={610} direction="down" />
            <FindingBox 
              title="Low FSH" 
              style={{ position: 'absolute', left: '-10px', top: '610px', width: '100px' }} 
            />

            <VerticalLine x={40} startY={670} endY={720} />
            <ArrowHead x={40} y={720} direction="down" />
            <DiagnosisBox 
              title="HPA Axis Disorder" 
              style={{ position: 'absolute', left: '-30px', top: '720px', width: '140px' }} 
            />

            <VerticalLine x={40} startY={780} endY={830} />
            <ArrowHead x={40} y={830} direction="down" />
            <TreatmentBox 
              title="Further workup required to determine underlying cause²" 
              style={{ position: 'absolute', left: '-60px', top: '830px', width: '200px' }} 
            />

            {/* High FSH branch */}
            <VerticalLine x={260} startY={560} endY={610} />
            <ArrowHead x={260} y={610} direction="down" />
            <FindingBox 
              title="High FSH" 
              style={{ position: 'absolute', left: '210px', top: '610px', width: '100px' }} 
            />

            <VerticalLine x={260} startY={670} endY={720} />
            <ArrowHead x={260} y={720} direction="down" />
            <AssessmentBox 
              title="Karyotype" 
              style={{ position: 'absolute', left: '220px', top: '720px', width: '80px' }} 
            />

            {/* High FSH karyotype branches */}
            <VerticalLine x={260} startY={780} endY={830} />
            <HorizontalLine y={830} startX={190} endX={330} />

            {/* 46,XX branch */}
            <VerticalLine x={190} startY={830} endY={880} />
            <ArrowHead x={190} y={880} direction="down" />
            <FindingBox 
              title="46,XX" 
              style={{ position: 'absolute', left: '160px', top: '880px', width: '60px' }} 
            />

            <VerticalLine x={190} startY={940} endY={990} />
            <ArrowHead x={190} y={990} direction="down" />
            <DiagnosisBox 
              title="Primary Ovarian Insufficiency" 
              style={{ position: 'absolute', left: '120px', top: '990px', width: '140px' }} 
            />

            <VerticalLine x={190} startY={1050} endY={1100} />
            <ArrowHead x={190} y={1100} direction="down" />
            <TreatmentBox 
              title="Estrogen replacement" 
              style={{ position: 'absolute', left: '130px', top: '1100px', width: '120px' }} 
            />

            {/* 45,XO branch */}
            <VerticalLine x={330} startY={830} endY={880} />
            <ArrowHead x={330} y={880} direction="down" />
            <FindingBox 
              title="45,XO" 
              style={{ position: 'absolute', left: '300px', top: '880px', width: '60px' }} 
            />

            <VerticalLine x={330} startY={940} endY={990} />
            <ArrowHead x={330} y={990} direction="down" />
            <DiagnosisBox 
              title="Turner Syndrome" 
              style={{ position: 'absolute', left: '280px', top: '990px', width: '100px' }} 
            />

            <VerticalLine x={330} startY={1050} endY={1100} />
            <ArrowHead x={330} y={1100} direction="down" />
            <TreatmentBox 
              title="Estrogen and growth hormone therapy" 
              style={{ position: 'absolute', left: '260px', top: '1100px', width: '140px' }} 
            />

            {/* MIDDLE BRANCH - Uterus Absent Path */}
            <VerticalLine x={750} startY={400} endY={450} />
            <ArrowHead x={750} y={450} direction="down" />
            <AssessmentBox 
              title="Karyotype, serum testosterone, serum dihydrotestosterone" 
              style={{ position: 'absolute', left: '580px', top: '450px', width: '340px' }} 
            />

            {/* Uterus absent branches */}
            <VerticalLine x={750} startY={510} endY={560} />
            <HorizontalLine y={560} startX={560} endX={940} />

            {/* 46,XX normal female testosterone branch */}
            <VerticalLine x={560} startY={560} endY={610} />
            <ArrowHead x={560} y={610} direction="down" />
            <FindingBox 
              title="46,XX, normal female testosterone levels" 
              style={{ position: 'absolute', left: '460px', top: '610px', width: '200px' }} 
            />

            <VerticalLine x={560} startY={670} endY={720} />
            <ArrowHead x={560} y={720} direction="down" />
            <DiagnosisBox 
              title="Müllerian Agenesis" 
              style={{ position: 'absolute', left: '490px', top: '720px', width: '140px' }} 
            />

            <VerticalLine x={560} startY={780} endY={830} />
            <ArrowHead x={560} y={830} direction="down" />
            <TreatmentBox 
              title="Primary vaginal dilation" 
              style={{ position: 'absolute', left: '490px', top: '830px', width: '140px' }} 
            />

            {/* 46,XY normal male testosterone branch */}
            <VerticalLine x={940} startY={560} endY={610} />
            <ArrowHead x={940} y={610} direction="down" />
            <FindingBox 
              title="46,XY, normal male testosterone levels" 
              style={{ position: 'absolute', left: '840px', top: '610px', width: '200px' }} 
            />

            <VerticalLine x={940} startY={670} endY={720} />
            <ArrowHead x={940} y={720} direction="down" />
            <AssessmentBox 
              title="Low dihydrotestosterone (DHT)" 
              style={{ position: 'absolute', left: '840px', top: '720px', width: '200px' }} 
            />

            {/* DHT test branches */}
            <VerticalLine x={940} startY={780} endY={830} />
            <HorizontalLine y={830} startX={780} endX={1100} />

            {/* Negative DHT (Androgen Insensitivity) */}
            <VerticalLine x={780} startY={830} endY={880} />
            <ArrowHead x={780} y={880} direction="down" />
            <FindingBox 
              title="Negative" 
              style={{ position: 'absolute', left: '740px', top: '880px', width: '80px' }} 
            />

            <VerticalLine x={780} startY={940} endY={990} />
            <ArrowHead x={780} y={990} direction="down" />
            <DiagnosisBox 
              title="Androgen Insensitivity" 
              style={{ position: 'absolute', left: '710px', top: '990px', width: '140px' }} 
            />

            <VerticalLine x={780} startY={1050} endY={1100} />
            <ArrowHead x={780} y={1100} direction="down" />
            <TreatmentBox 
              title="Estrogen replacement therapy (after puberty)³" 
              style={{ position: 'absolute', left: '660px', top: '1100px', width: '240px' }} 
            />

            {/* Positive DHT (5-Alpha-Reductase Deficiency) */}
            <VerticalLine x={1100} startY={830} endY={880} />
            <ArrowHead x={1100} y={880} direction="down" />
            <FindingBox 
              title="Positive" 
              style={{ position: 'absolute', left: '1070px', top: '880px', width: '60px' }} 
            />

            <VerticalLine x={1100} startY={940} endY={990} />
            <ArrowHead x={1100} y={990} direction="down" />
            <DiagnosisBox 
              title="5-Alpha-Reductase Deficiency" 
              style={{ position: 'absolute', left: '1020px', top: '990px', width: '160px' }} 
            />

            <VerticalLine x={1100} startY={1050} endY={1100} />
            <ArrowHead x={1100} y={1100} direction="down" />
            <TreatmentBox 
              title="Gender-affirming surgery depending on gender identity of child" 
              style={{ position: 'absolute', left: '980px', top: '1100px', width: '240px' }} 
            />

            {/* RIGHT BRANCH - Outflow Tract Obstruction */}
            <VerticalLine x={1300} startY={400} endY={450} />
            <ArrowHead x={1300} y={450} direction="down" />
            <DiagnosisBox 
              title="Outflow Tract Obstruction¹" 
              style={{ position: 'absolute', left: '1210px', top: '450px', width: '180px' }} 
            />

            <VerticalLine x={1300} startY={510} endY={560} />
            <ArrowHead x={1300} y={560} direction="down" />
            <TreatmentBox 
              title="Surgical correction of obstruction" 
              style={{ position: 'absolute', left: '1220px', top: '560px', width: '160px' }} 
            />

            {/* Footnotes */}
            <FootnotesBox
              style={{ position: 'absolute', left: '50px', top: '1250px', width: '800px', minHeight: '120px' }}
            >
              <div className="text-sm leading-relaxed">
                <div className="font-bold text-lg mb-3 text-gray-800">Footnotes</div>
                <div className="mb-2"><strong>¹</strong> Examples of outflow tract obstructions include imperforate hymen, transverse vaginal septum, and vaginal agenesis.</div>
                <div className="mb-2"><strong>²</strong> Possible HPA axis disorders include Kallmann syndrome, constitutional delay, and functional hypothalamic amenorrhea.</div>
                <div><strong>³</strong> Undescended testicles are removed due to cancer risk. Treatment is based on gender identity.</div>
              </div>
            </FootnotesBox>

            {/* Definition */}
            <DefinitionBox
              style={{ position: 'absolute', left: '900px', top: '1250px', width: '400px', minHeight: '120px' }}
            >
              <div className="text-sm leading-relaxed">
                <div className="font-bold text-lg mb-3 text-gray-800">Definition</div>
                <div>Primary amenorrhea is defined as the absence of menses at age 15 in the presence of secondary sexual characteristics and normal growth.</div>
              </div>
            </DefinitionBox>

          </div>
        </div>
      </div>
  );
}

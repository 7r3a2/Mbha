"use client";

import React, { useRef, useState, useEffect } from "react";
import Head from "next/head";

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

export default function IncontinenceFlowchart({ 
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
      const flowchartHeight = 3400;
      
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
        <title>Incontinence</title>
        <meta name="description" content="Medical flowchart for incontinence evaluation" />
      </Head>
      
      <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
        {/* Header with full screen button */}
        <div className="bg-white/90 backdrop-blur-sm p-3 sm:p-4 shadow-sm flex items-center justify-between">
          <h1 className="text-lg sm:text-2xl font-bold text-blue-600">Incontinence</h1>
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
              height: '3400px',
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
            {/* Main Starting Point */}
            <TitleBox
              title="Urinary Incontinence"
              style={{ position: 'absolute', left: 800, top: 20, width: 200 }}
            />

            {/* First Decision Point */}
            <DecisionBox
              title="Is the incontinence transient?"
              style={{ position: 'absolute', left: 780, top: 150, width: 240 }}
            />

            {/* LEFT BRANCH: Transient */}
            <FindingBox
              title="Transient¹"
              style={{ position: 'absolute', left: 400, top: 280, width: 120 }}
            />

            <TreatmentBox
              title="Identify and treat reversible cause"
              style={{ position: 'absolute', left: 340, top: 380, width: 240 }}
            />

            {/* RIGHT BRANCH: Chronic */}
            <FindingBox
              title="Chronic"
              style={{ position: 'absolute', left: 1200, top: 280, width: 120 }}
            />

            {/* Assess Pattern Decision */}
            <DecisionBox
              title="Assess pattern of leakage"
              style={{ position: 'absolute', left: 1120, top: 380, width: 280 }}
            />

            {/* SUB-BRANCH 1: Stress Incontinence */}
            <FindingBox
              title="Leakage with exercise, cough, Valsalva"
              style={{ position: 'absolute', left: 750, top: 520, width: 240 }}
            />

            <AssessmentBox
              title="Cough stress test and post-void residual (PVR)"
              style={{ position: 'absolute', left: 750, top: 620, width: 240 }}
            />

            <FindingBox
              title="Positive cough stress test. PVR < 50 mL"
              style={{ position: 'absolute', left: 750, top: 720, width: 240 }}
            />

            <DiagnosisBox
              title="Stress Incontinence"
              style={{ position: 'absolute', left: 800, top: 840, width: 140 }}
            />

            <TreatmentBox
              title="Lifestyle modification, Pelvic floor exercises, Topical estrogen, Pessary, Pelvic floor surgery"
              style={{ position: 'absolute', left: 700, top: 940, width: 340 }}
            />

            {/* SUB-BRANCH 2: Overflow Incontinence */}
            <FindingBox
              title="Frequent and involuntary dribbling"
              style={{ position: 'absolute', left: 1220, top: 520, width: 220 }}
            />

            <AssessmentBox
              title="Cough stress test and post-void residual (PVR)"
              style={{ position: 'absolute', left: 1220, top: 620, width: 220 }}
            />

            <FindingBox
              title="Negative cough stress test. PVR > 200 mL"
              style={{ position: 'absolute', left: 1220, top: 720, width: 220 }}
            />

            <DiagnosisBox
              title="Overflow Incontinence"
              style={{ position: 'absolute', left: 1260, top: 840, width: 140 }}
            />

            <TreatmentBox
              title="Intermittent catheterization for chronic retention, SNS² (sacral nerve stimulation), Evaluation for anatomic cause (e.g., prolapse, bladder outlet obstruction)"
              style={{ position: 'absolute', left: 1120, top: 940, width: 360 }}
            />

            {/* SUB-BRANCH 3: Urge Incontinence */}
            <FindingBox
              title="Strong, sudden urge to urinate"
              style={{ position: 'absolute', left: 1650, top: 520, width: 200 }}
            />

            <FindingBox
              title="Negative cough stress test. PVR < 50 mL"
              style={{ position: 'absolute', left: 1650, top: 620, width: 200 }}
            />

            <DiagnosisBox
              title="Urge Incontinence"
              style={{ position: 'absolute', left: 1680, top: 740, width: 140 }}
            />

            <TreatmentBox
              title="Lifestyle modification, Bladder training, Anticholinergics"
              style={{ position: 'absolute', left: 1610, top: 840, width: 280 }}
            />

            {/* Footnotes */}
            <FootnotesBox
              style={{ position: 'absolute', left: 200, top: 1200, width: 800, minHeight: 200 }}
            >
              <div className="text-sm leading-relaxed">
                <div className="font-bold text-lg mb-3 text-gray-800">Footnotes</div>
                <div className="mb-4">
                  <strong>1.</strong> Transient causes can be remembered by DIAPPERS:
                </div>
                <ul className="list-disc ml-6 space-y-1 mb-4">
                  <li><strong>D</strong>elirium/confusion</li>
                  <li><strong>I</strong>nfection (UTI)</li>
                  <li><strong>A</strong>trophic urethritis/vaginitis</li>
                  <li><strong>P</strong>harmaceutical</li>
                  <li><strong>P</strong>sychiatric causes (especially depression)</li>
                  <li><strong>E</strong>xcessive urine output (hyperglycemia, hypercalcemia, CHF)</li>
                  <li><strong>R</strong>estricted mobility</li>
                  <li><strong>S</strong>tool impaction</li>
                </ul>
                <div className="mb-2"><strong>2.</strong> SNS = Sacral nerve stimulation.</div>
              </div>
            </FootnotesBox>

            {/* CONNECTING LINES AND ARROWS */}
            
            {/* From Urinary Incontinence to decision */}
            <VerticalLine x={900} startY={100} endY={150} />
            <ArrowHead x={900} y={150} direction="down" />

            {/* From decision to Transient and Chronic */}
            <VerticalLine x={900} startY={200} endY={240} />
            <HorizontalLine y={240} startX={460} endX={1260} />
            
            {/* To Transient */}
            <VerticalLine x={460} startY={240} endY={280} />
            <ArrowHead x={460} y={280} direction="down" />
            
            {/* To Chronic */}
            <VerticalLine x={1260} startY={240} endY={280} />
            <ArrowHead x={1260} y={280} direction="down" />

            {/* Transient pathway */}
            <VerticalLine x={460} startY={330} endY={380} />
            <ArrowHead x={460} y={380} direction="down" />

            {/* From Chronic to Assess Pattern */}
            <VerticalLine x={1260} startY={330} endY={380} />
            <ArrowHead x={1260} y={380} direction="down" />

            {/* From Assess Pattern to three sub-branches */}
            <VerticalLine x={1260} startY={430} endY={480} />
            <HorizontalLine y={480} startX={870} endX={1750} />
            
            {/* To Stress Incontinence */}
            <VerticalLine x={870} startY={480} endY={520} />
            <ArrowHead x={870} y={520} direction="down" />
            
            {/* To Overflow Incontinence */}
            <VerticalLine x={1330} startY={480} endY={520} />
            <ArrowHead x={1330} y={520} direction="down" />
            
            {/* To Urge Incontinence */}
            <VerticalLine x={1750} startY={480} endY={520} />
            <ArrowHead x={1750} y={520} direction="down" />

            {/* STRESS INCONTINENCE pathway */}
            <VerticalLine x={870} startY={570} endY={620} />
            <ArrowHead x={870} y={620} direction="down" />
            
            <VerticalLine x={870} startY={670} endY={720} />
            <ArrowHead x={870} y={720} direction="down" />
            
            <VerticalLine x={870} startY={770} endY={840} />
            <ArrowHead x={870} y={840} direction="down" />
            
            <VerticalLine x={870} startY={890} endY={940} />
            <ArrowHead x={870} y={940} direction="down" />

            {/* OVERFLOW INCONTINENCE pathway */}
            <VerticalLine x={1330} startY={570} endY={620} />
            <ArrowHead x={1330} y={620} direction="down" />
            
            <VerticalLine x={1330} startY={670} endY={720} />
            <ArrowHead x={1330} y={720} direction="down" />
            
            <VerticalLine x={1330} startY={770} endY={840} />
            <ArrowHead x={1330} y={840} direction="down" />
            
            <VerticalLine x={1330} startY={890} endY={940} />
            <ArrowHead x={1330} y={940} direction="down" />

            {/* URGE INCONTINENCE pathway */}
            <VerticalLine x={1750} startY={570} endY={620} />
            <ArrowHead x={1750} y={620} direction="down" />
            
            <VerticalLine x={1750} startY={670} endY={740} />
            <ArrowHead x={1750} y={740} direction="down" />
            
            <VerticalLine x={1750} startY={790} endY={840} />
            <ArrowHead x={1750} y={840} direction="down" />

          </div>
        </div>
      </div>
    </>
  );
} 
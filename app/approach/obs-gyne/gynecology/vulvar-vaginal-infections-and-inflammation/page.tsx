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

// Decision box component (Blue)
const DecisionBox = ({ title, style = {} }: { title: string; style?: React.CSSProperties }) => (
  <div 
    className="flowchart-box bg-blue-200 border-2 border-blue-400 px-6 py-4 text-center rounded-lg shadow-md text-lg font-bold text-blue-800"
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

// Finding box component (Green)
const FindingBox = ({ title, style = {} }: { title: string; style?: React.CSSProperties }) => (
  <div 
    className="flowchart-box bg-green-200 border-2 border-green-400 px-6 py-4 text-center rounded-lg shadow-md text-lg font-bold text-green-800"
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

// Diagnosis box component (Orange)
const DiagnosisBox = ({ title, style = {} }: { title: string; style?: React.CSSProperties }) => (
  <div 
    className="flowchart-box bg-orange-200 border-2 border-orange-400 px-6 py-4 text-center rounded-lg shadow-md text-lg font-bold text-orange-800"
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

// Treatment box component (Purple)
const TreatmentBox = ({ title, style = {} }: { title: string; style?: React.CSSProperties }) => (
  <div 
    className="flowchart-box bg-purple-200 border-2 border-purple-400 px-6 py-4 text-center rounded-lg shadow-md text-lg font-bold text-purple-800"
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

// Assessment box component (Yellow)
const AssessmentBox = ({ title, style = {} }: { title: string; style?: React.CSSProperties }) => (
  <div 
    className="flowchart-box bg-yellow-200 border-2 border-yellow-400 px-6 py-4 text-center rounded-lg shadow-md text-lg font-bold text-yellow-800"
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

// Footnotes box component (Light Gray)
const FootnotesBox = ({ title, style = {} }: { title: string; style?: React.CSSProperties }) => (
  <div 
    className="flowchart-box bg-gray-100 border-2 border-gray-300 px-6 py-4 text-center rounded-lg shadow-md text-lg font-bold text-gray-700"
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

// Vertical line component
const VerticalLine = ({ style = {} }: { style?: React.CSSProperties }) => (
  <div 
    className="bg-black"
    style={{
      width: '4px',
      height: '60px',
      margin: '0 auto',
      ...style
    }}
  />
);

// Horizontal line component
const HorizontalLine = ({ style = {} }: { style?: React.CSSProperties }) => (
  <div 
    className="bg-black"
    style={{
      height: '4px',
      width: '100px',
      margin: '0 auto',
      ...style
    }}
  />
);

// Arrow head component
const ArrowHead = ({ style = {} }: { style?: React.CSSProperties }) => (
  <div 
    className="border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-black"
    style={{
      width: '0',
      height: '0',
      margin: '0 auto',
      ...style
    }}
  />
);

// Plus/Minus indicator component
const PlusMinusIndicator = ({ text, style = {} }: { text: string; style?: React.CSSProperties }) => (
  <div 
    className="flowchart-box bg-white border-2 border-black px-4 py-2 text-center rounded-lg shadow-md text-lg font-bold text-black"
    style={{
      minHeight: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style
    }}
  >
    {text}
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
    <>
      <Head>
        <title>Vulvar/Vaginal Infections and Inflammation</title>
        <meta name="description" content="Medical flowchart for vulvar and vaginal infections and inflammation evaluation" />
      </Head>
      
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
            {/* Main Title */}
            <TitleBox
              title="Vulvar/Vaginal Infections and Inflammation"
              style={{ position: 'absolute', left: 1500, top: 50, width: 600 }}
            />

            {/* Initial Assessment */}
            <DecisionBox
              title="Vulvar/Vaginal Symptoms Present?"
              style={{ position: 'absolute', left: 1500, top: 150, width: 600 }}
            />

            {/* Yes Branch */}
            <VerticalLine style={{ position: 'absolute', left: 1800, top: 210 }} />
            <ArrowHead style={{ position: 'absolute', left: 1796, top: 270 }} />

            {/* Symptom Assessment */}
            <DecisionBox
              title="Type of Symptoms?"
              style={{ position: 'absolute', left: 1500, top: 320, width: 600 }}
            />

            {/* Itching Branch */}
            <HorizontalLine style={{ position: 'absolute', left: 1600, top: 380, width: 200 }} />
            <ArrowHead style={{ position: 'absolute', left: 1796, top: 376, transform: 'rotate(90deg)' }} />

            <FindingBox
              title="Itching"
              style={{ position: 'absolute', left: 1300, top: 400, width: 200 }}
            />

            <VerticalLine style={{ position: 'absolute', left: 1400, top: 460 }} />
            <ArrowHead style={{ position: 'absolute', left: 1396, top: 520 }} />

            <DecisionBox
              title="Associated Symptoms?"
              style={{ position: 'absolute', left: 1200, top: 570, width: 400 }}
            />

            {/* Discharge Branch */}
            <HorizontalLine style={{ position: 'absolute', left: 1600, top: 380, width: 200, transform: 'translateX(200px)' }} />
            <ArrowHead style={{ position: 'absolute', left: 1996, top: 376, transform: 'rotate(90deg)' }} />

            <FindingBox
              title="Discharge"
              style={{ position: 'absolute', left: 2100, top: 400, width: 200 }}
            />

            <VerticalLine style={{ position: 'absolute', left: 2200, top: 460 }} />
            <ArrowHead style={{ position: 'absolute', left: 2196, top: 520 }} />

            <DecisionBox
              title="Discharge Characteristics?"
              style={{ position: 'absolute', left: 2000, top: 570, width: 400 }}
            />

            {/* Pain Branch */}
            <HorizontalLine style={{ position: 'absolute', left: 1600, top: 380, width: 200, transform: 'translateX(400px)' }} />
            <ArrowHead style={{ position: 'absolute', left: 2196, top: 376, transform: 'rotate(90deg)' }} />

            <FindingBox
              title="Pain"
              style={{ position: 'absolute', left: 2900, top: 400, width: 200 }}
            />

            <VerticalLine style={{ position: 'absolute', left: 3000, top: 460 }} />
            <ArrowHead style={{ position: 'absolute', left: 2996, top: 520 }} />

            <DecisionBox
              title="Pain Characteristics?"
              style={{ position: 'absolute', left: 2800, top: 570, width: 400 }}
            />

            {/* Itching Assessment */}
            <HorizontalLine style={{ position: 'absolute', left: 1200, top: 630, width: 150 }} />
            <ArrowHead style={{ position: 'absolute', left: 1346, top: 626, transform: 'rotate(90deg)' }} />

            <FindingBox
              title="White, curdy discharge"
              style={{ position: 'absolute', left: 1000, top: 650, width: 200 }}
            />

            <HorizontalLine style={{ position: 'absolute', left: 1200, top: 630, width: 150, transform: 'translateX(200px)' }} />
            <ArrowHead style={{ position: 'absolute', left: 1546, top: 626, transform: 'rotate(90deg)' }} />

            <FindingBox
              title="No discharge"
              style={{ position: 'absolute', left: 1400, top: 650, width: 200 }}
            />

            <VerticalLine style={{ position: 'absolute', left: 1100, top: 710 }} />
            <ArrowHead style={{ position: 'absolute', left: 1096, top: 770 }} />

            <DiagnosisBox
              title="Candidiasis"
              style={{ position: 'absolute', left: 900, top: 820, width: 200 }}
            />

            <VerticalLine style={{ position: 'absolute', left: 1000, top: 880 }} />
            <ArrowHead style={{ position: 'absolute', left: 996, top: 940 }} />

            <TreatmentBox
              title="Topical antifungal"
              style={{ position: 'absolute', left: 800, top: 990, width: 200 }}
            />

            <VerticalLine style={{ position: 'absolute', left: 1500, top: 710 }} />
            <ArrowHead style={{ position: 'absolute', left: 1496, top: 770 }} />

            <DiagnosisBox
              title="Contact dermatitis"
              style={{ position: 'absolute', left: 1300, top: 820, width: 200 }}
            />

            <VerticalLine style={{ position: 'absolute', left: 1400, top: 880 }} />
            <ArrowHead style={{ position: 'absolute', left: 1396, top: 940 }} />

            <TreatmentBox
              title="Remove irritant + topical steroid"
              style={{ position: 'absolute', left: 1200, top: 990, width: 200 }}
            />

            {/* Discharge Assessment */}
            <HorizontalLine style={{ position: 'absolute', left: 2000, top: 630, width: 150 }} />
            <ArrowHead style={{ position: 'absolute', left: 2146, top: 626, transform: 'rotate(90deg)' }} />

            <FindingBox
              title="Yellow/green, foul odor"
              style={{ position: 'absolute', left: 1800, top: 650, width: 200 }}
            />

            <HorizontalLine style={{ position: 'absolute', left: 2000, top: 630, width: 150, transform: 'translateX(200px)' }} />
            <ArrowHead style={{ position: 'absolute', left: 2346, top: 626, transform: 'rotate(90deg)' }} />

            <FindingBox
              title="Gray, fishy odor"
              style={{ position: 'absolute', left: 2200, top: 650, width: 200 }}
            />

            <VerticalLine style={{ position: 'absolute', left: 1900, top: 710 }} />
            <ArrowHead style={{ position: 'absolute', left: 1896, top: 770 }} />

            <DiagnosisBox
              title="Trichomoniasis"
              style={{ position: 'absolute', left: 1700, top: 820, width: 200 }}
            />

            <VerticalLine style={{ position: 'absolute', left: 1800, top: 880 }} />
            <ArrowHead style={{ position: 'absolute', left: 1796, top: 940 }} />

            <TreatmentBox
              title="Metronidazole"
              style={{ position: 'absolute', left: 1600, top: 990, width: 200 }}
            />

            <VerticalLine style={{ position: 'absolute', left: 2300, top: 710 }} />
            <ArrowHead style={{ position: 'absolute', left: 2296, top: 770 }} />

            <DiagnosisBox
              title="Bacterial vaginosis"
              style={{ position: 'absolute', left: 2100, top: 820, width: 200 }}
            />

            <VerticalLine style={{ position: 'absolute', left: 2200, top: 880 }} />
            <ArrowHead style={{ position: 'absolute', left: 2196, top: 940 }} />

            <TreatmentBox
              title="Metronidazole or clindamycin"
              style={{ position: 'absolute', left: 2000, top: 990, width: 200 }}
            />

            {/* Pain Assessment */}
            <HorizontalLine style={{ position: 'absolute', left: 2800, top: 630, width: 150 }} />
            <ArrowHead style={{ position: 'absolute', left: 2946, top: 626, transform: 'rotate(90deg)' }} />

            <FindingBox
              title="Dyspareunia"
              style={{ position: 'absolute', left: 2600, top: 650, width: 200 }}
            />

            <HorizontalLine style={{ position: 'absolute', left: 2800, top: 630, width: 150, transform: 'translateX(200px)' }} />
            <ArrowHead style={{ position: 'absolute', left: 3146, top: 626, transform: 'rotate(90deg)' }} />

            <FindingBox
              title="Vulvodynia"
              style={{ position: 'absolute', left: 3000, top: 650, width: 200 }}
            />

            <VerticalLine style={{ position: 'absolute', left: 2700, top: 710 }} />
            <ArrowHead style={{ position: 'absolute', left: 2696, top: 770 }} />

            <DiagnosisBox
              title="Vulvovaginitis"
              style={{ position: 'absolute', left: 2500, top: 820, width: 200 }}
            />

            <VerticalLine style={{ position: 'absolute', left: 2600, top: 880 }} />
            <ArrowHead style={{ position: 'absolute', left: 2596, top: 940 }} />

            <TreatmentBox
              title="Treat underlying cause"
              style={{ position: 'absolute', left: 2400, top: 990, width: 200 }}
            />

            <VerticalLine style={{ position: 'absolute', left: 3100, top: 710 }} />
            <ArrowHead style={{ position: 'absolute', left: 3096, top: 770 }} />

            <DiagnosisBox
              title="Vulvodynia"
              style={{ position: 'absolute', left: 2900, top: 820, width: 200 }}
            />

            <VerticalLine style={{ position: 'absolute', left: 3000, top: 880 }} />
            <ArrowHead style={{ position: 'absolute', left: 2996, top: 940 }} />

            <TreatmentBox
              title="Multimodal therapy"
              style={{ position: 'absolute', left: 2800, top: 990, width: 200 }}
            />

            {/* Follow-up Assessment */}
            <HorizontalLine style={{ position: 'absolute', left: 1600, top: 1050, width: 200 }} />
            <ArrowHead style={{ position: 'absolute', left: 1796, top: 1046, transform: 'rotate(90deg)' }} />

            <AssessmentBox
              title="Symptoms Resolved?"
              style={{ position: 'absolute', left: 1500, top: 1070, width: 600 }}
            />

            {/* Yes Branch */}
            <HorizontalLine style={{ position: 'absolute', left: 1500, top: 1130, width: 150 }} />
            <ArrowHead style={{ position: 'absolute', left: 1646, top: 1126, transform: 'rotate(90deg)' }} />

            <TreatmentBox
              title="Continue current treatment"
              style={{ position: 'absolute', left: 1300, top: 1150, width: 200 }}
            />

            {/* No Branch */}
            <HorizontalLine style={{ position: 'absolute', left: 1500, top: 1130, width: 150, transform: 'translateX(300px)' }} />
            <ArrowHead style={{ position: 'absolute', left: 1946, top: 1126, transform: 'rotate(90deg)' }} />

            <DecisionBox
              title="Re-evaluate Diagnosis"
              style={{ position: 'absolute', left: 2100, top: 1150, width: 400 }}
            />

            <VerticalLine style={{ position: 'absolute', left: 2300, top: 1210 }} />
            <ArrowHead style={{ position: 'absolute', left: 2296, top: 1270 }} />

            <TreatmentBox
              title="Consider specialist referral"
              style={{ position: 'absolute', left: 2100, top: 1320, width: 400 }}
            />

            {/* Footnotes */}
            <FootnotesBox
              title="Consider STI testing if indicated"
              style={{ position: 'absolute', left: 100, top: 1400, width: 300 }}
            />

            <FootnotesBox
              title="Rule out malignancy in persistent cases"
              style={{ position: 'absolute', left: 500, top: 1400, width: 300 }}
            />

            <FootnotesBox
              title="Consider vulvar biopsy if suspicious"
              style={{ position: 'absolute', left: 900, top: 1400, width: 300 }}
            />

            <FootnotesBox
              title="Screen for diabetes in recurrent candidiasis"
              style={{ position: 'absolute', left: 1300, top: 1400, width: 300 }}
            />

            <FootnotesBox
              title="Consider hormonal therapy for atrophic vaginitis"
              style={{ position: 'absolute', left: 1700, top: 1400, width: 300 }}
            />

            <FootnotesBox
              title="Evaluate for underlying systemic disease"
              style={{ position: 'absolute', left: 2100, top: 1400, width: 300 }}
            />

            <FootnotesBox
              title="Consider psychological factors in chronic cases"
              style={{ position: 'absolute', left: 2500, top: 1400, width: 300 }}
            />

            <FootnotesBox
              title="Document treatment response and side effects"
              style={{ position: 'absolute', left: 2900, top: 1400, width: 300 }}
            />

            {/* No Symptoms Branch */}
            <HorizontalLine style={{ position: 'absolute', left: 1500, top: 150, width: 150, transform: 'translateX(300px)' }} />
            <ArrowHead style={{ position: 'absolute', left: 1946, top: 146, transform: 'rotate(90deg)' }} />

            <TreatmentBox
              title="No treatment needed"
              style={{ position: 'absolute', left: 2100, top: 170, width: 200 }}
            />

            <VerticalLine style={{ position: 'absolute', left: 2200, top: 230 }} />
            <ArrowHead style={{ position: 'absolute', left: 2196, top: 290 }} />

            <AssessmentBox
              title="Routine follow-up"
              style={{ position: 'absolute', left: 2100, top: 340, width: 200 }}
            />
          </div>
        </div>
      </div>
    </>
  );
} 
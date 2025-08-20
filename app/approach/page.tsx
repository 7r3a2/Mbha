'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import DyspareuniaPage from './obs-gyne/gynecology/dyspareunia/page';
import AcutePelvicPainPage from './obs-gyne/gynecology/acute-pelvic-pain/page';
import VulvarVaginalCancersPage from './obs-gyne/gynecology/vulvar-vaginal-cancers/page';
import VulvarVaginalInfectionsAndInflammationPage from './obs-gyne/gynecology/vulvar-vaginal-infections-and-inflammation/page';
import VulvarDystrophiesPage from './obs-gyne/gynecology/vulvar-dystrophies/page';
import GenitalUlcersPage from './obs-gyne/gynecology/genital-ulcers/page';
import AbnormalVaginalDischargePage from './obs-gyne/gynecology/abnormal-vaginal-discharge/page';
import IncontinencePage from './obs-gyne/gynecology/incontinence/page';
import PrimaryAmenorrheaPage from './obs-gyne/gynecology/primary-amenorrhea/page';
import SecondaryAmenorrheaPage from './obs-gyne/gynecology/secondary-amenorrhea/page';
import OvarianCancerPage from './obs-gyne/gynecology/ovarian-cancer/page';

// Box component that matches the image exactly
const FlowchartBox = ({ 
  title, 
  children, 
  className = "",
  style = {}
}: { 
  title: string; 
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <div 
    className={`
      border-2 border-gray-500 bg-white px-4 py-3 text-center
      rounded-lg shadow-md text-base font-medium text-gray-800
      ${className}
    `}
    style={{
      minHeight: '50px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      ...style
    }}
  >
    <div className="text-base font-semibold">{title}</div>
    {children && <div className="mt-1">{children}</div>}
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

// Red reference box component
const ReferenceBox = ({ text, style = {} }: { text: string; style?: React.CSSProperties }) => (
  <div 
    className="reference-box bg-red-300 border-2 border-gray-500 px-4 py-3 text-center rounded-lg text-base font-semibold text-black shadow-md select-text cursor-text hover:bg-red-400 transition-colors"
    style={{
      minHeight: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      zIndex: 20,
      pointerEvents: 'auto', // Re-enable pointer events for boxes
      // Better rendering quality
      textRendering: 'optimizeLegibility',
      imageRendering: 'crisp-edges',
      ...style
    }}
  >
    {text}
  </div>
);

// Vertical line component - matching image style
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

// Horizontal line component - matching image style
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

// Arrow head component - cleaner style like the image
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

// Acute Pelvic Pain Flowchart Component - Wrapper for imported component
const AcutePelvicPainFlowchart = ({ frameFullScreen = false, onToggleFrameFullScreen = () => {} }) => {
  return (
    <AcutePelvicPainPage 
      frameFullScreen={frameFullScreen}
      onToggleFrameFullScreen={onToggleFrameFullScreen}
    />
  );
};

// Old Acute Pelvic Pain Flowchart Component (replaced by imported version)
const OldAcutePelvicPainFlowchart = ({ frameFullScreen = false, onToggleFrameFullScreen = () => {} }) => {
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
    <div className="h-full bg-gradient-to-br from-pink-50 to-purple-100 overflow-hidden">
      {/* Header with full screen button */}
      <div className="bg-white/90 backdrop-blur-sm p-3 sm:p-4 shadow-sm flex items-center justify-between">
        <h1 className="text-lg sm:text-2xl font-bold text-purple-600">Acute Pelvic Pain</h1>
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
          {/* 1. ROOT NODE: Acute Pelvic Pain */}
          <div 
            className="bg-green-500 text-white px-6 py-4 text-center rounded-lg shadow-md text-lg font-bold"
            style={{
              position: 'absolute',
              left: 450,
              top: 20,
              width: 200,
              minHeight: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Acute Pelvic Pain
          </div>

          {/* 2. FIRST LEVEL: Beta-hCG */}
          <div 
            className="bg-gray-200 border-2 border-gray-400 px-4 py-3 text-center rounded-lg shadow-md text-sm font-medium text-gray-800"
            style={{
              position: 'absolute',
              left: 500,
              top: 120,
              width: 100,
              minHeight: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Beta-hCG
          </div>

          {/* 3. SECOND LEVEL: Two main branches */}
          {/* Left branch: Abdominal and pelvic exam */}
          <div 
            className="bg-gray-200 border-2 border-gray-400 px-4 py-3 text-center rounded-lg shadow-md text-sm font-medium text-gray-800"
            style={{
              position: 'absolute',
              left: 200,
              top: 220,
              width: 160,
              minHeight: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Abdominal and pelvic exam
          </div>

          {/* Right branch: Intrauterine pregnancy on TVUS¹ */}
          <div 
            className="bg-green-100 border-2 border-green-400 px-4 py-3 text-center rounded-lg shadow-md text-sm font-medium text-gray-800"
            style={{
              position: 'absolute',
              left: 700,
              top: 220,
              width: 180,
              minHeight: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Intrauterine pregnancy on TVUS¹
          </div>

          {/* 4. THIRD LEVEL: Findings from Abdominal and pelvic exam - arranged horizontally with spacing */}
          {/* 4A. Cervical Motion Tenderness (far left) */}
          <div 
            className="bg-green-100 border-2 border-green-400 px-4 py-3 text-center rounded-lg shadow-md text-sm font-medium text-gray-800"
            style={{
              position: 'absolute',
              left: 30,
              top: 340,
              width: 160,
              minHeight: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Cervical Motion Tenderness
          </div>

          {/* 4B. Severe Unilateral Pain (left center) */}
          <div 
            className="bg-green-100 border-2 border-green-400 px-4 py-3 text-center rounded-lg shadow-md text-sm font-medium text-gray-800"
            style={{
              position: 'absolute',
              left: 220,
              top: 340,
              width: 160,
              minHeight: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Severe Unilateral Pain
          </div>

          {/* 4C. Suprapubic Tenderness (center) */}
          <div 
            className="bg-green-100 border-2 border-green-400 px-4 py-3 text-center rounded-lg shadow-md text-sm font-medium text-gray-800"
            style={{
              position: 'absolute',
              left: 410,
              top: 340,
              width: 160,
              minHeight: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Suprapubic Tenderness
          </div>

          {/* 4D. Cyclic Monthly Pain Episodes (right center) */}
          <div 
            className="bg-green-100 border-2 border-green-400 px-4 py-3 text-center rounded-lg shadow-md text-sm font-medium text-gray-800"
            style={{
              position: 'absolute',
              left: 600,
              top: 340,
              width: 180,
              minHeight: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Cyclic, monthly acute pain episodes
          </div>

          {/* 5. BRANCHES FROM INTRAUTERINE PREGNANCY ON TVUS¹ */}
          {/* 5A. Ectopic Pregnancy (negative branch) */}
          <div 
            className="bg-orange-300 border-2 border-orange-500 px-4 py-3 text-center shadow-md text-sm font-bold text-gray-800"
            style={{
              position: 'absolute',
              left: 620,
              top: 340,
              width: 140,
              minHeight: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              clipPath: 'polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)'
            }}
          >
            Ectopic Pregnancy
          </div>

          {/* 5B. Reference box (positive branch) */}
          <div 
            className="bg-red-300 border-2 border-red-500 px-4 py-3 text-center rounded-lg shadow-md text-sm font-semibold text-black"
            style={{
              position: 'absolute',
              left: 780,
              top: 340,
              width: 180,
              minHeight: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            See Abdominal Pain in Pregnancy, p. 644
          </div>

          {/* 6. DETAILED SUB-BRANCHES */}
          
          {/* 6A. From "Cervical Motion Tenderness" - Vertically arranged */}
          {/* STI testing */}
          <div 
            className="bg-gray-200 border-2 border-gray-400 px-4 py-3 text-center rounded-lg shadow-md text-sm font-medium text-gray-800"
            style={{
              position: 'absolute',
              left: 70,
              top: 460,
              width: 100,
              minHeight: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            STI testing
          </div>

          {/* TVUS¹ */}
          <div 
            className="bg-gray-200 border-2 border-gray-400 px-4 py-3 text-center rounded-lg shadow-md text-sm font-medium text-gray-800"
            style={{
              position: 'absolute',
              left: 90,
              top: 580,
              width: 100,
              minHeight: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            TVUS¹
          </div>

          {/* Then conditionally split horizontally */}
          {/* Left: Pelvic Inflammatory Disease */}
          <div 
            className="bg-orange-300 border-2 border-orange-500 px-4 py-3 text-center shadow-md text-sm font-bold text-gray-800"
            style={{
              position: 'absolute',
              left: 30,
              top: 700,
              width: 160,
              minHeight: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              clipPath: 'polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)'
            }}
          >
            Pelvic Inflammatory Disease
          </div>

          {/* Right: Tubo-ovarian Abscess */}
          <div 
            className="bg-orange-300 border-2 border-orange-500 px-4 py-3 text-center shadow-md text-sm font-bold text-gray-800"
            style={{
              position: 'absolute',
              left: 220,
              top: 700,
              width: 160,
              minHeight: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              clipPath: 'polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)'
            }}
          >
            Tubo-ovarian Abscess
          </div>

          {/* 6B. From "Severe Unilateral Pain" - Vertically */}
          {/* Abdominal ultrasound */}
          <div 
            className="bg-gray-200 border-2 border-gray-400 px-4 py-3 text-center rounded-lg shadow-md text-sm font-medium text-gray-800"
            style={{
              position: 'absolute',
              left: 250,
              top: 460,
              width: 160,
              minHeight: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Abdominal ultrasound
          </div>

          {/* Then horizontally split into 3 child boxes aligned horizontally below */}
          {/* Left: Appendicitis (if appendiceal diameter > 6mm or wall thickening) */}
          <div 
            className="bg-orange-300 border-2 border-orange-500 px-4 py-3 text-center shadow-md text-sm font-bold text-gray-800"
            style={{
              position: 'absolute',
              left: 50,
              top: 580,
              width: 140,
              minHeight: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              clipPath: 'polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)'
            }}
          >
            Appendicitis
          </div>

          {/* Center: Ovarian Cyst Rupture (if intraperitoneal fluid collection) */}
          <div 
            className="bg-orange-300 border-2 border-orange-500 px-4 py-3 text-center shadow-md text-sm font-bold text-gray-800"
            style={{
              position: 'absolute',
              left: 220,
              top: 580,
              width: 160,
              minHeight: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              clipPath: 'polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)'
            }}
          >
            Ovarian Cyst Rupture
          </div>

          {/* Right: Ovarian Torsion (if ↓ ovarian artery flow) */}
          <div 
            className="bg-orange-300 border-2 border-orange-500 px-4 py-3 text-center shadow-md text-sm font-bold text-gray-800"
            style={{
              position: 'absolute',
              left: 410,
              top: 580,
              width: 160,
              minHeight: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              clipPath: 'polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)'
            }}
          >
            Ovarian Torsion
          </div>

          {/* 6C. From "Suprapubic Tenderness" - Vertically */}
          {/* Urinalysis, urine culture */}
          <div 
            className="bg-gray-200 border-2 border-gray-400 px-4 py-3 text-center rounded-lg shadow-md text-sm font-medium text-gray-800"
            style={{
              position: 'absolute',
              left: 450,
              top: 460,
              width: 160,
              minHeight: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Urinalysis, urine culture
          </div>

          {/* Then down to: */}
          <div 
            className="bg-orange-300 border-2 border-orange-500 px-4 py-3 text-center shadow-md text-sm font-bold text-gray-800"
            style={{
              position: 'absolute',
              left: 450,
              top: 580,
              width: 160,
              minHeight: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              clipPath: 'polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)'
            }}
          >
            Urinary Tract Infection²
          </div>

          {/* 6D. From "Cyclic, monthly acute pain episodes" - Two branches horizontally */}
          {/* Left: Mittelschmerz */}
          <div 
            className="bg-orange-300 border-2 border-orange-500 px-4 py-3 text-center shadow-md text-sm font-bold text-gray-800"
            style={{
              position: 'absolute',
              left: 620,
              top: 460,
              width: 120,
              minHeight: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              clipPath: 'polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)'
            }}
          >
            Mittelschmerz
          </div>

          {/* Right: Endometriosis */}
          <div 
            className="bg-orange-300 border-2 border-orange-500 px-4 py-3 text-center shadow-md text-sm font-bold text-gray-800"
            style={{
              position: 'absolute',
              left: 770,
              top: 460,
              width: 140,
              minHeight: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              clipPath: 'polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)'
            }}
          >
            Endometriosis
          </div>

          {/* 7. TREATMENTS */}
          {/* Ectopic Pregnancy treatment */}
          <div 
            className="bg-blue-200 border-2 border-blue-400 px-4 py-3 text-center rounded-lg shadow-md text-sm font-medium text-gray-800"
            style={{
              position: 'absolute',
              left: 650,
              top: 460,
              width: 180,
              minHeight: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Methotrexate or laparoscopy
          </div>

          {/* PID treatment */}
          <div 
            className="bg-blue-200 border-2 border-blue-400 px-4 py-3 text-center rounded-lg shadow-md text-sm font-medium text-gray-800"
            style={{
              position: 'absolute',
              left: 30,
              top: 820,
              width: 220,
              minHeight: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Ceftriaxone 500 mg IM, doxycycline + metronidazole ×14 days
          </div>

          {/* Tubo-ovarian Abscess treatment */}
          <div 
            className="bg-blue-200 border-2 border-blue-400 px-4 py-3 text-center rounded-lg shadow-md text-sm font-medium text-gray-800"
            style={{
              position: 'absolute',
              left: 270,
              top: 820,
              width: 220,
              minHeight: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Broad-spectrum antibiotics³ ± drainage or laparoscopy
          </div>

          {/* Appendicitis treatment */}
          <div 
            className="bg-blue-200 border-2 border-blue-400 px-4 py-3 text-center rounded-lg shadow-md text-sm font-medium text-gray-800"
            style={{
              position: 'absolute',
              left: 50,
              top: 700,
              width: 160,
              minHeight: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Surgery
          </div>

          {/* Ovarian Cyst Rupture treatment */}
          <div 
            className="bg-blue-200 border-2 border-blue-400 px-4 py-3 text-center rounded-lg shadow-md text-sm font-medium text-gray-800"
            style={{
              position: 'absolute',
              left: 220,
              top: 700,
              width: 220,
              minHeight: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Supportive care (if stable), or exploratory laparoscopy (if unstable)
          </div>

          {/* Ovarian Torsion treatment */}
          <div 
            className="bg-blue-200 border-2 border-blue-400 px-4 py-3 text-center rounded-lg shadow-md text-sm font-medium text-gray-800"
            style={{
              position: 'absolute',
              left: 410,
              top: 700,
              width: 160,
              minHeight: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Exploratory laparoscopy
          </div>

          {/* UTI treatment */}
          <div 
            className="bg-blue-200 border-2 border-blue-400 px-4 py-3 text-center rounded-lg shadow-md text-sm font-medium text-gray-800"
            style={{
              position: 'absolute',
              left: 450,
              top: 700,
              width: 160,
              minHeight: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Nitrofurantoin or TMP-SMX
          </div>

          {/* Mittelschmerz treatment */}
          <div 
            className="bg-blue-200 border-2 border-blue-400 px-4 py-3 text-center rounded-lg shadow-md text-sm font-medium text-gray-800"
            style={{
              position: 'absolute',
              left: 620,
              top: 580,
              width: 180,
              minHeight: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Reassurance and supportive care
          </div>

          {/* Endometriosis treatment */}
          <div 
            className="bg-blue-200 border-2 border-blue-400 px-4 py-3 text-center rounded-lg shadow-md text-sm font-medium text-gray-800"
            style={{
              position: 'absolute',
              left: 770,
              top: 580,
              width: 180,
              minHeight: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            OCPs and NSAIDs. Consider diagnostic laparoscopy
          </div>

          {/* Footnotes */}
          <div 
            className="bg-gray-100 border-2 border-gray-400 px-4 py-3 rounded-lg shadow-md text-xs text-gray-700"
            style={{
              position: 'absolute',
              left: 640,
              top: 820,
              width: 280
            }}
          >
            <div className="text-xs leading-relaxed">
              <div><strong>1.</strong> Transvaginal ultrasound.</div>
              <div><strong>2.</strong> Cystitis or pyelonephritis.</div>
              <div><strong>3.</strong> Cephalosporin + doxycycline ± metronidazole.</div>
            </div>
          </div>

          {/* ARROWS - Hierarchical tree structure with proper spacing */}
          
          {/* 1. Acute Pelvic Pain → Beta-hCG */}
          <VerticalLine x={550} startY={80} endY={120} />
          <ArrowHead x={550} y={120} direction="down" />

          {/* 2. Beta-hCG branching */}
          <VerticalLine x={550} startY={170} endY={200} />
          <HorizontalLine y={200} startX={280} endX={820} />
          
          {/* Negative branch to Abdominal exam */}
          <VerticalLine x={280} startY={200} endY={220} />
          <ArrowHead x={280} y={220} direction="down" />
          <div className="absolute pointer-events-none bg-white border border-gray-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-700" style={{ left: 280 - 12, top: 200 - 12, zIndex: 12 }}>−</div>

          {/* Positive branch to Intrauterine pregnancy */}
          <VerticalLine x={790} startY={200} endY={220} />
          <ArrowHead x={790} y={220} direction="down" />
          <div className="absolute pointer-events-none bg-white border border-gray-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-700" style={{ left: 790 - 12, top: 200 - 12, zIndex: 12 }}>+</div>

          {/* 3. Abdominal exam to findings */}
          <VerticalLine x={280} startY={270} endY={320} />
          <HorizontalLine y={320} startX={110} endX={750} />
          
          {/* Arrows down to each finding */}
          <VerticalLine x={110} startY={320} endY={340} />
          <VerticalLine x={300} startY={320} endY={340} />
          <VerticalLine x={490} startY={320} endY={340} />
          <VerticalLine x={690} startY={320} endY={340} />
          <ArrowHead x={110} y={340} direction="down" />
          <ArrowHead x={300} y={340} direction="down" />
          <ArrowHead x={490} y={340} direction="down" />
          <ArrowHead x={690} y={340} direction="down" />

          {/* 4. Intrauterine pregnancy to 2 branches */}
          <VerticalLine x={790} startY={270} endY={320} />
          <HorizontalLine y={320} startX={690} endX={870} />
          
          {/* Negative to Ectopic */}
          <VerticalLine x={690} startY={320} endY={340} />
          <ArrowHead x={690} y={340} direction="down" />
          <div className="absolute pointer-events-none bg-white border border-gray-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-700" style={{ left: 690 - 12, top: 320 - 12, zIndex: 12 }}>−</div>

          {/* Positive to Reference */}
          <VerticalLine x={870} startY={320} endY={340} />
          <ArrowHead x={870} y={340} direction="down" />
          <div className="absolute pointer-events-none bg-white border border-gray-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-700" style={{ left: 870 - 12, top: 320 - 12, zIndex: 12 }}>+</div>

          {/* 5. Detailed sub-branches connections */}
          {/* Cervical Motion → STI test */}
          <VerticalLine x={110} startY={390} endY={460} />
          <ArrowHead x={110} y={460} direction="down" />

          {/* STI test → TVUS */}
          <VerticalLine x={110} startY={510} endY={580} />
          <ArrowHead x={110} y={580} direction="down" />

          {/* TVUS → PID and Tubo-ovarian */}
          <VerticalLine x={110} startY={630} endY={680} />
          <HorizontalLine y={680} startX={110} endX={350} />
          <VerticalLine x={110} startY={680} endY={700} />
          <VerticalLine x={300} startY={680} endY={700} />
          <ArrowHead x={110} y={700} direction="down" />
          <ArrowHead x={300} y={700} direction="down" />

          {/* Severe Pain → Abdominal ultrasound */}
          <VerticalLine x={300} startY={390} endY={460} />
          <ArrowHead x={300} y={460} direction="down" />

          {/* Abdominal ultrasound → 3 findings */}
          <VerticalLine x={300} startY={510} endY={580} />
          <HorizontalLine y={580} startX={120} endX={530} />
          <VerticalLine x={120} startY={580} endY={580} />
          <VerticalLine x={300} startY={580} endY={580} />
          <VerticalLine x={490} startY={580} endY={580} />
          <ArrowHead x={120} y={580} direction="down" />
          <ArrowHead x={300} y={580} direction="down" />
          <ArrowHead x={490} y={580} direction="down" />

          {/* Suprapubic → UA findings → UTI */}
          <VerticalLine x={490} startY={390} endY={460} />
          <ArrowHead x={490} y={460} direction="down" />
          <VerticalLine x={490} startY={510} endY={580} />
          <ArrowHead x={490} y={580} direction="down" />

          {/* Cyclic pain → 2 branches */}
          <VerticalLine x={690} startY={390} endY={460} />
          <HorizontalLine y={460} startX={680} endX={840} />
          <VerticalLine x={680} startY={460} endY={460} />
          <VerticalLine x={840} startY={460} endY={460} />
          <ArrowHead x={680} y={460} direction="down" />
          <ArrowHead x={840} y={460} direction="down" />

          {/* Ectopic → Treatment */}
          <VerticalLine x={740} startY={390} endY={460} />
          <ArrowHead x={740} y={460} direction="down" />

          {/* Treatments connections */}
          <VerticalLine x={30} startY={750} endY={820} />
          <VerticalLine x={270} startY={750} endY={820} />
          <VerticalLine x={50} startY={630} endY={700} />
          <VerticalLine x={220} startY={630} endY={700} />
          <VerticalLine x={410} startY={630} endY={700} />
          <VerticalLine x={450} startY={630} endY={700} />
          <VerticalLine x={620} startY={510} endY={580} />
          <VerticalLine x={770} startY={510} endY={580} />
          <ArrowHead x={30} y={820} direction="down" />
          <ArrowHead x={270} y={820} direction="down" />
          <ArrowHead x={50} y={700} direction="down" />
          <ArrowHead x={220} y={700} direction="down" />
          <ArrowHead x={410} y={700} direction="down" />
          <ArrowHead x={450} y={700} direction="down" />
          <ArrowHead x={620} y={580} direction="down" />
          <ArrowHead x={770} y={580} direction="down" />
          
        </div>
      </div>
      
      {/* Mobile-friendly instruction overlay */}
      {isMobile && (
        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg text-xs text-gray-600">
          <div className="font-semibold mb-1">Touch Controls:</div>
          <div>• Two fingers: Pinch to zoom in/out</div>
          <div>• One finger: Drag to pan around flowchart</div>
          <div>• Tap boxes to select and copy text</div>
          <div>• Use full screen for better view</div>
        </div>
      )}
    </div>
  );
};

// Chest Pain Flowchart Component
const ChestPainFlowchart = ({ frameFullScreen = false, onToggleFrameFullScreen = () => {} }) => {
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
    <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      {/* Header with full screen button */}
      <div className="bg-white/90 backdrop-blur-sm p-3 sm:p-4 shadow-sm flex items-center justify-between">
        <h1 className="text-lg sm:text-2xl font-bold text-blue-600">Chest Pain</h1>
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
          {/* Chest Pain - Main box */}
          <FlowchartBox
            title="Chest Pain"
            style={{ position: 'absolute', left: 650, top: 80, width: 140 }}
          />

          {/* Cardiac */}
          <FlowchartBox
            title="Cardiac"
            style={{ position: 'absolute', left: 400, top: 200, width: 120 }}
          />

          {/* Non-Cardiac */}
          <FlowchartBox
            title="Non-Cardiac"
            style={{ position: 'absolute', left: 850, top: 200, width: 120 }}
          />

          {/* See pp. 9-11 */}
          <ReferenceBox
            text="See Non-Ischemic Chest Pain (Pulmonary) approach"
            style={{ position: 'absolute', left: 1020, top: 200, width: 200 }}
          />

          {/* Ischemic */}
          <FlowchartBox
            title="Ischemic"
            style={{ position: 'absolute', left: 280, top: 320, width: 120 }}
          />

          {/* Non-Ischemic */}
          <FlowchartBox
            title="Non-Ischemic"
            style={{ position: 'absolute', left: 550, top: 320, width: 140 }}
          />

          {/* Acute Coronary Syndrome */}
          <FlowchartBox
            title="Acute Coronary Syndrome"
            style={{ position: 'absolute', left: 150, top: 460, width: 160 }}
          />

          {/* Stable/Chronic Angina */}
          <FlowchartBox
            title="Stable/Chronic Angina"
            style={{ position: 'absolute', left: 360, top: 460, width: 160 }}
          />

          {/* Non-Ischemic detailed box */}
          <FlowchartBox
            title=""
            style={{ position: 'absolute', left: 540, top: 460, width: 180, height: 140 }}
          >
            <div className="text-left text-xs leading-relaxed">
              • Pericarditis<br/>
              • Myocarditis<br/>
              • Decompensated<br/>
              &nbsp;&nbsp;Heart Failure<br/>
              • Prinzmetal Angina<br/>
              • Valvular Disease<br/>
              • Aortic Syndromes
            </div>
          </FlowchartBox>

          {/* Reference boxes */}
          <ReferenceBox
            text="See Ischemic Chest Pain approach"
            style={{ position: 'absolute', left: 160, top: 630, width: 200 }}
          />

          <ReferenceBox
            text="See Non-Ischemic Chest Pain (Cardiac) approach"
            style={{ position: 'absolute', left: 480, top: 630, width: 240 }}
          />

          {/* Non-Cardiac causes - properly spaced */}
          <FlowchartBox
            title="Pulmonary Causes"
            style={{ position: 'absolute', left: 950, top: 320, width: 140 }}
          />

          <FlowchartBox
            title="Gastrointestinal Causes"
            style={{ position: 'absolute', left: 950, top: 400, width: 140 }}
          />

          <FlowchartBox
            title="Musculoskeletal Causes"
            style={{ position: 'absolute', left: 950, top: 480, width: 140 }}
          />

          <FlowchartBox
            title="Other Causes (Miscellaneous)"
            style={{ position: 'absolute', left: 950, top: 560, width: 140 }}
          />

          {/* Clean vertical and horizontal lines with arrows */}
          
          {/* From Chest Pain to Cardiac and Non-Cardiac */}
          <VerticalLine x={720} startY={130} endY={170} />
          <HorizontalLine y={170} startX={460} endX={910} />
          <VerticalLine x={460} startY={170} endY={200} />
          <VerticalLine x={910} startY={170} endY={200} />
          <ArrowHead x={460} y={200} direction="down" />
          <ArrowHead x={910} y={200} direction="down" />
          
          {/* From Cardiac to Ischemic and Non-Ischemic */}
          <VerticalLine x={460} startY={250} endY={290} />
          <HorizontalLine y={290} startX={340} endX={620} />
          <VerticalLine x={340} startY={290} endY={320} />
          <VerticalLine x={620} startY={290} endY={320} />
          <ArrowHead x={340} y={320} direction="down" />
          <ArrowHead x={620} y={320} direction="down" />
          
          {/* From Ischemic to its sub-branches */}
          <VerticalLine x={340} startY={370} endY={430} />
          <HorizontalLine y={430} startX={230} endX={440} />
          <VerticalLine x={230} startY={430} endY={460} />
          <VerticalLine x={440} startY={430} endY={460} />
          <ArrowHead x={230} y={460} direction="down" />
          <ArrowHead x={440} y={460} direction="down" />
          
          {/* From Non-Ischemic to detailed box */}
          <VerticalLine x={620} startY={370} endY={460} />
          <ArrowHead x={620} y={460} direction="down" />
          
          {/* From Acute Coronary Syndrome to reference */}
          <VerticalLine x={230} startY={510} endY={620} />
          <ArrowHead x={230} y={620} direction="down" />
          
          {/* From Non-Ischemic detailed box to reference */}
          <VerticalLine x={620} startY={600} endY={630} />
          <ArrowHead x={620} y={630} direction="down" />
          
          {/* From Non-Cardiac to reference - horizontal */}
          <HorizontalLine y={225} startX={970} endX={1020} />
          <ArrowHead x={1020} y={225} direction="right" />
          
          {/* From Non-Cardiac to all cause boxes - lines connect to center of boxes */}
          <VerticalLine x={910} startY={250} endY={320} />
          <HorizontalLine y={320} startX={910} endX={1020} />
          <ArrowHead x={1020} y={320} direction="right" />
          
          <VerticalLine x={910} startY={250} endY={400} />
          <HorizontalLine y={400} startX={910} endX={1020} />
          <ArrowHead x={1020} y={400} direction="right" />
          
          <VerticalLine x={910} startY={250} endY={480} />
          <HorizontalLine y={480} startX={910} endX={1020} />
          <ArrowHead x={1020} y={480} direction="right" />
          
          <VerticalLine x={910} startY={250} endY={560} />
          <HorizontalLine y={560} startX={910} endX={1020} />
          <ArrowHead x={1020} y={560} direction="right" />

                     {/* Large text box - now part of the moveable flowchart */}
           <div 
             className="text-box absolute bg-white border-2 border-gray-500 p-6 rounded-lg shadow-lg select-text cursor-text hover:bg-gray-50 transition-colors"
             style={{ 
               left: 50, 
               top: 720, 
               width: 'min(1500px, 90vw)', 
               height: 'auto',
               minHeight: 400,
               overflow: 'visible',
               position: 'relative',
               zIndex: 20,
               pointerEvents: 'auto', // Re-enable pointer events for text box
               // Better rendering quality
               textRendering: 'optimizeLegibility',
               imageRendering: 'crisp-edges'
             }}
           >
            <div className="text-sm leading-6 text-gray-800">
              <p className="mb-3">
                <strong>Chest pain is one of the most common reasons in which a patient presents for medical care.</strong> There are many etiologies of chest pain or discomfort, 
                and certain life-threatening pathologies cannot be missed. Acute chest pain or discomfort can be framed into 3 primary categories: Myocardial ischemia, 
                non-ischemic cardiac chest pain, and non-cardiac chest pain.
              </p>
              <p className="mb-3">
                <strong>Myocardial ischemia usually presents with typical chest pain,</strong> which often consists of chest, arm, and/or jaw pain described as dull, heavy, tight, or crushing. 
                It may be accompanied by dyspnea, nausea, vomiting, abdominal pain, diaphoresis, as well as a sense of anxiety or uneasiness, and can be triggered or 
                exacerbated by physical exertion and stress. If ongoing myocardial ischemia is suspected, the patient should be evaluated with history, physical exam, 
                EKG and cardiac biomarkers for acute coronary syndrome, a spectrum of clinical presentations caused by plaque disruption or coronary vasospasm 
                leading to inadequate oxygen delivery to meet the heart's metabolic demands. If myocardial ischemia is severe or prolonged in duration, irreversible 
                ischemic injury occurs, leading to myocardial infarction.
              </p>
              <p className="mb-3">
                <strong>Both non-ischemic cardiac chest pain and non-cardiac chest pain usually present with atypical chest pain,</strong> which is frequently described as epigastric or 
                back pain or pain that is sharp, stabbing, burning, or suggestive of indigestion. If the chest pain has these non-ischemic qualities, there is a 95% negative 
                predictive value. Non-ischemic causes of cardiac chest pain include acute inflammatory or infectious processes (eg, infective endocarditis, pericarditis, 
                disease, aortic dissection, valvular pathologies, and heart failure. The majority of patients that present with chest pain will have a non-cardiac etiology. 
                The most common etiologies of chest pain are pulmonary (eg, pulmonary embolism, pneumonia, gastroesophageal (eg, GERD), dyspepsia), and 
                musculoskeletal (eg, costochondritis). We will discuss these etiologies in more depth in the following pages. In addition, some patients that present 
                with acute chest discomfort may have an underlying psychiatric condition (eg, panic disorder) and experience chest tightness associated with difficulty 
                breathing, anxiety, and heart palpitations.
              </p>
              <p>
                <strong>When a patient presents with chest pain, the first step in management is obtaining vital signs,</strong> including pulse oximetry, and a thorough cardiopulmonary 
                examination. If the patient is hemodynamically unstable, follow the ACLS protocol. If hemodynamically stable, obtain a thorough history on the quality, 
                location (including radiation), and patient attributes including timing, duration, and provoking or alleviating factors of the chest pain. Obtaining a description of associated 
                symptoms (eg, dyspnea, palpitations, hemoptysis) and the patient's prior medical history (eg, coronary artery disease, connective tissue disease, malignancy) 
                is also helpful. Pulmonary causes of chest pain (eg, pulmonary embolism) are usually associated with dyspnea and/or an ^O₂ oxygen requirement, and the chest pain is 
                often pleuritic in nature. Acute aortic dissection often presents with a terrible, tearing chest pain. Musculoskeletal pain is often reproduced with certain 
                movements or upon palpation of a specific area. A burning quality or exacerbation with eating can be suggestive of a gastrointestinal etiology. All together, 
                the patient's demographics and chief pain characteristics, as well as basic diagnostic tools like EKG, chest x-ray, and cardiac biomarkers, narrow the 
                differential and help guide management.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile-friendly instruction overlay */}
      {isMobile && (
        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg text-xs text-gray-600">
          <div className="font-semibold mb-1">Touch Controls:</div>
          <div>• Two fingers: Pinch to zoom in/out</div>
          <div>• One finger: Drag to pan around flowchart</div>
          <div>• Tap boxes to select and copy text</div>
          <div>• Use full screen for better view</div>
        </div>
      )}
    </div>
  );
};

export default function ApproachPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedLecture, setSelectedLecture] = useState<string | null>(null);
  const [isFrameFullscreen, setIsFrameFullscreen] = useState(false);

  const subjects = [
    {
      id: 'internal-medicine',
      name: 'Internal Medicine',
      folders: [
        {
          id: 'cardiology',
          name: 'Cardiology',
          lectures: [
            { id: 'card-5', name: 'Chest Pain', content: 'Chest pain evaluation flowchart and approach...' },
          ]
        }
      ]
    },
    {
      id: 'surgery',
      name: 'Surgery',
      folders: [
        {
          id: 'general-surgery',
          name: 'General Surgery',
          lectures: []
        },
        {
          id: 'specialized-surgery',
          name: 'Specialized Surgery',
          lectures: []
        }
      ]
    },
    {
      id: 'pediatrics',
      name: 'Pediatrics',
      folders: [
        {
          id: 'general-pediatrics',
          name: 'General Pediatrics',
          lectures: []
        },
        {
          id: 'pediatric-specialties',
          name: 'Pediatric Specialties',
          lectures: []
        }
      ]
    },
    {
      id: 'obs-gyne',
      name: 'Obs & Gyne',
      folders: [
        {
          id: 'obstetrics',
          name: 'Obstetrics',
          lectures: []
        },
        {
          id: 'gynecology',
          name: 'Gynecology',
          lectures: [
            { id: 'acute-pelvic-pain', name: 'Acute Pelvic Pain', content: 'Acute pelvic pain evaluation and management...' },
            { id: 'dyspareunia', name: 'Dyspareunia', content: 'Painful intercourse evaluation and treatment...' },
            { id: 'vulvar-vaginal-cancers', name: 'Vulvar/Vaginal Cancers', content: 'Vulvar and vaginal cancer diagnosis and management...' },
            { id: 'vulvar-vaginal-infections-and-inflammation', name: 'Vulvar/Vaginal Infections and Inflammation', content: 'Infections and inflammatory conditions...' },
            { id: 'vulvar-dystrophies', name: 'Vulvar Dystrophies', content: 'Vulvar dystrophic conditions...' },
            { id: 'genital-ulcers', name: 'Genital Ulcers', content: 'Genital ulcer evaluation and differential diagnosis...' },
            { id: 'abnormal-vaginal-discharge', name: 'Abnormal Vaginal Discharge', content: 'Evaluation of abnormal vaginal discharge...' },
            { id: 'incontinence', name: 'Incontinence', content: 'Urinary and fecal incontinence management...' },
            { id: 'primary-amenorrhea', name: 'Primary Amenorrhea', content: 'Primary amenorrhea evaluation and causes...' },
            { id: 'secondary-amenorrhea', name: 'Secondary Amenorrhea', content: 'Secondary amenorrhea evaluation and management...' },
            { id: 'dysmenorrhea', name: 'Dysmenorrhea', content: 'Painful menstruation evaluation and treatment...' },
            { id: 'abnormal-uterine-bleeding', name: 'Abnormal Uterine Bleeding', content: 'Abnormal uterine bleeding evaluation...' },
            { id: 'adnexal-mass', name: 'Adnexal Mass', content: 'Adnexal mass evaluation and management...' },
            { id: 'ovarian-cancer', name: 'Ovarian Cancer', content: 'Ovarian cancer diagnosis and treatment...' },
            { id: 'cervical-pathology', name: 'Cervical Pathology', content: 'Cervical pathology evaluation and management...' }
          ]
        }
      ]
    }
  ];

  // Check authentication and approach access
  if (!isLoading && (!user || !user.hasApproachAccess)) {
    router.push('/wizary-exam');
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-100 items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  const handleExit = () => {
    router.push('/dashboard');
  };

  const getSelectedContent = () => {
    if (!selectedSubject || !selectedFolder || !selectedLecture) return null;
    
    const subject = subjects.find(s => s.id === selectedSubject);
    if (!subject) return null;
    
    const folder = subject.folders.find(f => f.id === selectedFolder);
    if (!folder) return null;
    
    const lecture = folder.lectures.find(l => l.id === selectedLecture);
    return { subject, folder, lecture };
  };

  const selectedContent = getSelectedContent();

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Sidebar - Same design as dashboard */}
      <div 
        className={`bg-[#1E2A38] text-white flex flex-col transition-all duration-300 ${
          isOpen ? 'w-48 sm:w-56 md:w-64' : 'w-12 sm:w-14 md:w-16'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center border-b border-gray-700">
          <div className={`flex items-center ${isOpen ? 'px-4' : 'justify-center w-full'}`}>
            <div className="w-8 h-8 flex items-center justify-center">
              <Image 
                src="/images/logo lander.png" 
                alt="MBHA Logo" 
                width={32} 
                height={32} 
                className="w-8 h-8 object-contain"
              />
            </div>
            {isOpen && (
              <span className="text-xl font-bold ml-3 text-white">MBHA</span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-2 px-2">
            {/* Main Menu - Subjects */}
            {subjects.map((subject) => (
              <li key={subject.id}>
                <button 
                  onClick={() => setSelectedSubject(selectedSubject === subject.id ? null : subject.id)}
                  className={`flex items-center w-full transition-all duration-300 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg ${
                    isOpen ? 'px-4 py-3' : 'justify-center p-3'
                  } ${selectedSubject === subject.id ? 'bg-[#3A8431] text-white' : ''}`}
                >
                  <svg className={`${isOpen ? 'w-5 h-5' : 'w-6 h-6'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  {isOpen && <span className="ml-3 font-medium text-sm">{subject.name}</span>}
                </button>

                {/* Folders - Only show if subject is selected and sidebar is open */}
                {selectedSubject === subject.id && isOpen && (
                  <div className="ml-6 mt-2 space-y-1">
                    {subject.folders.map((folder) => (
                      <div key={folder.id}>
                        <button 
                          onClick={() => setSelectedFolder(selectedFolder === folder.id ? null : folder.id)}
                          className={`flex items-center w-full transition-all duration-300 text-gray-400 hover:bg-gray-600 hover:text-white rounded-lg px-3 py-2 ${
                            selectedFolder === folder.id ? 'bg-gray-600 text-white' : ''
                          }`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                          </svg>
                          <span className="ml-2 text-sm">{folder.name}</span>
                        </button>

                        {/* Lectures - Only show if folder is selected */}
                        {selectedFolder === folder.id && (
                          <div className="ml-6 mt-1 space-y-1">
                            {folder.lectures.map((lecture) => (
                              <button 
                                key={lecture.id}
                                onClick={() => setSelectedLecture(lecture.id)}
                                className={`flex items-center w-full transition-all duration-300 text-gray-500 hover:bg-gray-500 hover:text-white rounded-lg px-3 py-1 ${
                                  selectedLecture === lecture.id ? 'bg-[#3A8431] text-white' : ''
                                }`}
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="ml-2 text-xs">{lecture.name}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile & Logout */}
        <div className="border-t border-gray-700">
          {/* User Profile */}
          <div className={`p-4 ${isOpen ? '' : 'pb-2'}`}>
            <div className={`flex items-center ${isOpen ? 'mb-3' : 'justify-center'}`}>
              <div className="w-8 h-8 bg-[#3A8431] rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              {isOpen && (
                <div className="ml-3">
                  <p className="font-semibold text-white text-sm">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Logout Button */}
          <div className={`${isOpen ? 'px-4 pb-4' : 'px-2 pb-4'}`}>
            <button 
              onClick={handleExit}
              className={`w-full bg-red-600 text-white font-bold py-2 px-3 rounded-lg hover:bg-red-700 transition-all duration-300 text-sm flex items-center justify-center`}
            >
              {isOpen ? (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Exit
                </>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-[#3A8431] shadow-md h-12 sm:h-14 md:h-16 flex items-center justify-between px-3 sm:px-4 md:px-6">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:text-gray-200 transition-colors duration-300 p-2 rounded-lg hover:bg-white/10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg sm:text-xl font-semibold text-white">Approach</h1>
          <div className="w-6"></div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-2 sm:p-4 md:p-6 overflow-hidden min-w-0">
          {selectedContent && selectedContent.lecture ? (
            <div className={`${(selectedContent.lecture.id === 'card-5' || selectedContent.lecture.id === 'acute-pelvic-pain' || selectedContent.lecture.id === 'dyspareunia' || selectedContent.lecture.id === 'vulvar-vaginal-cancers' || selectedContent.lecture.id === 'vulvar-vaginal-infections-and-inflammation' || selectedContent.lecture.id === 'vulvar-dystrophies' || selectedContent.lecture.id === 'genital-ulcers' || selectedContent.lecture.id === 'abnormal-vaginal-discharge' || selectedContent.lecture.id === 'incontinence' || selectedContent.lecture.id === 'primary-amenorrhea' || selectedContent.lecture.id === 'secondary-amenorrhea') && isFrameFullscreen ? 'fixed inset-0 z-50' : 'h-full w-full'} bg-white/95 backdrop-blur-sm border-2 border-blue-300 rounded-xl overflow-hidden shadow-xl`}>
              {selectedContent.lecture.id === 'card-5' ? (
                // Render Chest Pain flowchart directly as component
                <ChestPainFlowchart 
                  frameFullScreen={isFrameFullscreen}
                  onToggleFrameFullScreen={() => setIsFrameFullscreen(!isFrameFullscreen)}
                />
              ) : selectedContent.lecture.id === 'acute-pelvic-pain' ? (
                // Render Acute Pelvic Pain flowchart directly as component
                <AcutePelvicPainFlowchart 
                  frameFullScreen={isFrameFullscreen}
                  onToggleFrameFullScreen={() => setIsFrameFullscreen(!isFrameFullscreen)}
                />
              ) : selectedContent.lecture.id === 'dyspareunia' ? (
                // Render Dyspareunia page directly as component
                <DyspareuniaPage 
                  frameFullScreen={isFrameFullscreen}
                  onToggleFrameFullScreen={() => setIsFrameFullscreen(!isFrameFullscreen)}
                />
              ) : selectedContent.lecture.id === 'vulvar-vaginal-cancers' ? (
                // Render Vulvar/Vaginal Cancers page directly as component
                <VulvarVaginalCancersPage 
                  frameFullScreen={isFrameFullscreen}
                  onToggleFrameFullScreen={() => setIsFrameFullscreen(!isFrameFullscreen)}
                />
              ) : selectedContent.lecture.id === 'vulvar-vaginal-infections-and-inflammation' ? (
                // Render Vulvar/Vaginal Infections and Inflammation page directly as component
                <VulvarVaginalInfectionsAndInflammationPage 
                  frameFullScreen={isFrameFullscreen}
                  onToggleFrameFullScreen={() => setIsFrameFullscreen(!isFrameFullscreen)}
                />
              ) : selectedContent.lecture.id === 'vulvar-dystrophies' ? (
                // Render Vulvar Dystrophies page directly as component
                <VulvarDystrophiesPage 
                  frameFullScreen={isFrameFullscreen}
                  onToggleFrameFullScreen={() => setIsFrameFullscreen(!isFrameFullscreen)}
                />
              ) : selectedContent.lecture.id === 'genital-ulcers' ? (
                // Render Genital Ulcers page directly as component
                <GenitalUlcersPage 
                  frameFullScreen={isFrameFullscreen}
                  onToggleFrameFullScreen={() => setIsFrameFullscreen(!isFrameFullscreen)}
                />
              ) : selectedContent.lecture.id === 'abnormal-vaginal-discharge' ? (
                // Render Abnormal Vaginal Discharge page directly as component
                <AbnormalVaginalDischargePage 
                  frameFullScreen={isFrameFullscreen}
                  onToggleFrameFullScreen={() => setIsFrameFullscreen(!isFrameFullscreen)}
                />
              ) : selectedContent.lecture.id === 'incontinence' ? (
                // Render Incontinence page directly as component
                <IncontinencePage 
                  frameFullScreen={isFrameFullscreen}
                  onToggleFrameFullScreen={() => setIsFrameFullscreen(!isFrameFullscreen)}
                />
              ) : selectedContent.lecture.id === 'primary-amenorrhea' ? (
                // Render Primary Amenorrhea page directly as component
                <PrimaryAmenorrheaPage 
                  frameFullScreen={isFrameFullscreen}
                  onToggleFrameFullScreen={() => setIsFrameFullscreen(!isFrameFullscreen)}
                />
              ) : selectedContent.lecture.id === 'secondary-amenorrhea' ? (
                // Render Secondary Amenorrhea page directly as component
                <SecondaryAmenorrheaPage 
                  frameFullScreen={isFrameFullscreen}
                  onToggleFrameFullScreen={() => setIsFrameFullscreen(!isFrameFullscreen)}
                />
              ) : selectedContent.lecture.id === 'ovarian-cancer' ? (
                // Render Ovarian Cancer page directly as component
                <OvarianCancerPage 
                  frameFullScreen={isFrameFullscreen}
                  onToggleFrameFullScreen={() => setIsFrameFullscreen(!isFrameFullscreen)}
                />
              ) : (
                // Default content for other lectures
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
                      <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h1 className="text-5xl font-bold text-gray-900 mb-6">Coming Soon</h1>
                    <p className="text-2xl text-gray-600 max-w-lg mx-auto">
                      {selectedContent.lecture.name} content will be available soon.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full bg-white/95 backdrop-blur-sm border-2 border-blue-300 rounded-xl flex items-center justify-center shadow-xl">
              <div className="text-center">
                <div className="w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h1 className="text-5xl font-bold text-gray-900 mb-6">Coming Soon</h1>
                <p className="text-2xl text-gray-600 max-w-lg mx-auto">
                  The Approach content will be available soon.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
} 
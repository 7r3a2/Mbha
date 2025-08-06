'use client';

import React, { useRef, useState, useEffect } from "react";
import Head from "next/head";

// Main title box component (Green)
const TitleBox = ({ title, style = {} }: { title: string; style?: React.CSSProperties }) => (
  <div 
    className="bg-green-500 text-white px-6 py-4 text-center rounded-lg shadow-md text-lg font-bold"
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

// Symptom/Finding box component (Green)
const FindingBox = ({ title, icon, style = {} }: { title: string; icon?: string; style?: React.CSSProperties }) => (
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
    <div className="flex items-center space-x-2">
      {icon && <span className="text-lg">{icon}</span>}
      <span>{title}</span>
    </div>
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

// Reference box component (Red)
const ReferenceBox = ({ text, style = {} }: { text: string; style?: React.CSSProperties }) => (
  <div 
    className="bg-red-300 border-2 border-red-500 px-4 py-3 text-center rounded-lg shadow-md text-sm font-semibold text-black"
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

export default function DyspareuniaPage({ 
  frameFullScreen = false, 
  onToggleFrameFullScreen = () => {} 
}: { 
  frameFullScreen?: boolean; 
  onToggleFrameFullScreen?: () => void; 
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [scrollPos, setScrollPos] = useState({ x: 0, y: 0 });

  // Panning functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    setStartPos({ x: e.clientX - scrollPos.x, y: e.clientY - scrollPos.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    const newX = e.clientX - startPos.x;
    const newY = e.clientY - startPos.y;
    setScrollPos({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsPanning(true);
    setStartPos({ x: touch.clientX - scrollPos.x, y: touch.clientY - scrollPos.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPanning) return;
    const touch = e.touches[0];
    const newX = touch.clientX - startPos.x;
    const newY = touch.clientY - startPos.y;
    setScrollPos({ x: newX, y: newY });
  };

  const handleTouchEnd = () => {
    setIsPanning(false);
  };

  const toggleFullScreen = () => {
    onToggleFrameFullScreen();
  };

  return (
    <>
      <Head>
        <title>Dyspareunia</title>
        <meta name="description" content="Medical flowchart for dyspareunia evaluation" />
      </Head>
      
      <div className="h-screen bg-gray-100 overflow-hidden">
        {/* Title */}
        <div className="bg-white p-4 shadow-sm flex items-center justify-between">
          <h1 className="text-2xl font-bold text-green-600">Dyspareunia</h1>
          <button
            onClick={toggleFullScreen}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
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
          ref={containerRef}
          className="relative w-full h-full cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
        >
          <div
            className="relative"
            style={{
              transform: `translate(${scrollPos.x}px, ${scrollPos.y}px)`,
              width: '1800px',
              height: '1400px',
            }}
          >
            {/* Main Title */}
            <TitleBox
              title="Dyspareunia"
              style={{ position: 'absolute', left: 400, top: 20, width: 200 }}
            />

            {/* Where Does the Pain Occur? */}
            <DecisionBox
              title="Where Does the Pain Occur?"
              style={{ position: 'absolute', left: 650, top: 100, width: 280 }}
            />

            {/* Vulva or introitus */}
            <FindingBox
              title="Vulva or introitus"
              icon="🩺"
              style={{ position: 'absolute', left: 300, top: 200, width: 200 }}
            />

            {/* Deep pelvis */}
            <FindingBox
              title="Deep pelvis"
              icon="🩺"
              style={{ position: 'absolute', left: 1300, top: 200, width: 200 }}
            />

            {/* Visual inspection ± pelvic exam */}
            <DecisionBox
              title="Visual inspection ± pelvic exam"
              style={{ position: 'absolute', left: 280, top: 320, width: 240 }}
            />

            {/* Pain associated with menstrual cycle? */}
            <DecisionBox
              title="Pain associated with menstrual cycle?"
              style={{ position: 'absolute', left: 1280, top: 320, width: 240 }}
            />

            {/* Findings from Visual inspection */}
            <FindingBox
              title="Atrophy"
              icon="🔍"
              style={{ position: 'absolute', left: 50, top: 420, width: 120 }}
            />

            <FindingBox
              title="Lesions, fissures, ulcerations"
              icon="🔍"
              style={{ position: 'absolute', left: 280, top: 420, width: 200 }}
            />

            <FindingBox
              title="No abnormal findings or mild erythema"
              icon="🔍"
              style={{ position: 'absolute', left: 510, top: 420, width: 200 }}
            />

            {/* Findings from Deep pelvis */}
            <FindingBox
              title="Dysmenorrhea, pelvic ligament nodularity on exam"
              icon="🔍"
              style={{ position: 'absolute', left: 1200, top: 420, width: 280 }}
            />

            <DecisionBox
              title="Bimanual exam"
              style={{ position: 'absolute', left: 1630, top: 420, width: 140 }}
            />

            {/* Diagnoses from Vulva branch */}
            <DiagnosisBox
              title="Atrophic vaginitis"
              style={{ position: 'absolute', left: 50, top: 520, width: 120 }}
            />

            <DiagnosisBox
              title="Vulvar dermatoses"
              style={{ position: 'absolute', left: 280, top: 520, width: 200 }}
            />

            <DecisionBox
              title="Abnormal vaginal discharge?"
              style={{ position: 'absolute', left: 510, top: 520, width: 200 }}
            />

            {/* Diagnoses from Deep pelvis branch */}
            <DiagnosisBox
              title="Endometriosis"
              style={{ position: 'absolute', left: 1200, top: 520, width: 280 }}
            />

            {/* Findings from Bimanual exam */}
            <FindingBox
              title="Uterine tenderness"
              icon="🔍"
              style={{ position: 'absolute', left: 1350, top: 520, width: 140 }}
            />

            <FindingBox
              title="Adnexal tenderness"
              icon="🔍"
              style={{ position: 'absolute', left: 1600, top: 520, width: 140 }}
            />

            <FindingBox
              title="Cervical motion tenderness"
              icon="🔍"
              style={{ position: 'absolute', left: 1850, top: 520, width: 180 }}
            />

            <FindingBox
              title="Nodularity in uterosacral ligaments"
              icon="🔍"
              style={{ position: 'absolute', left: 2090, top: 520, width: 200 }}
            />

            {/* Diagnoses from Abnormal vaginal discharge */}
            <DiagnosisBox
              title="Vaginitis or Cervicitis"
              style={{ position: 'absolute', left: 700, top: 620, width: 200 }}
            />

            <DiagnosisBox
              title="Vaginismus"
              style={{ position: 'absolute', left: 940, top: 620, width: 120 }}
            />

            {/* Diagnoses from Bimanual exam findings */}
            <DiagnosisBox
              title="PID"
              style={{ position: 'absolute', left: 1350, top: 620, width: 140 }}
            />

            <DiagnosisBox
              title="Ovarian cyst"
              style={{ position: 'absolute', left: 1600, top: 620, width: 140 }}
            />

            <DiagnosisBox
              title="Cervicitis"
              style={{ position: 'absolute', left: 1850, top: 620, width: 180 }}
            />

            <DiagnosisBox
              title="Endometriosis"
              style={{ position: 'absolute', left: 2090, top: 620, width: 200 }}
            />

            {/* Treatments */}
            <TreatmentBox
              title="Topical estrogen"
              style={{ position: 'absolute', left: 50, top: 720, width: 120 }}
            />

            <TreatmentBox
              title="Topical steroids"
              style={{ position: 'absolute', left: 280, top: 720, width: 200 }}
            />

            <TreatmentBox
              title="See Vaginal Discharge approach"
              style={{ position: 'absolute', left: 700, top: 720, width: 200 }}
            />

            <TreatmentBox
              title="Pelvic floor therapy"
              style={{ position: 'absolute', left: 940, top: 720, width: 120 }}
            />

            <TreatmentBox
              title="Antibiotics"
              style={{ position: 'absolute', left: 1350, top: 720, width: 140 }}
            />

            <TreatmentBox
              title="Surgery if needed"
              style={{ position: 'absolute', left: 1600, top: 720, width: 140 }}
            />

            <TreatmentBox
              title="Antibiotics"
              style={{ position: 'absolute', left: 1850, top: 720, width: 180 }}
            />

            <TreatmentBox
              title="Hormonal therapy"
              style={{ position: 'absolute', left: 2090, top: 720, width: 200 }}
            />

            {/* Lines and Arrows */}
            {/* From Dyspareunia to Where Does the Pain Occur? */}
            <VerticalLine x={500} startY={70} endY={100} />
            <ArrowHead x={500} y={100} direction="down" />

            {/* From Where Does the Pain Occur? branching */}
            <VerticalLine x={500} startY={150} endY={170} />
            <HorizontalLine y={170} startX={400} endX={1400} />
            
            {/* Left branch to Vulva or introitus */}
            <VerticalLine x={400} startY={170} endY={200} />
            <ArrowHead x={400} y={200} direction="down" />
            <PlusMinusIndicator type="minus" x={400} y={200} />

            {/* Right branch to Deep pelvis */}
            <VerticalLine x={1400} startY={170} endY={200} />
            <ArrowHead x={1400} y={200} direction="down" />
            <PlusMinusIndicator type="plus" x={1400} y={200} />

            {/* From Vulva or introitus to Visual inspection */}
            <VerticalLine x={400} startY={250} endY={320} />
            <ArrowHead x={400} y={320} direction="down" />

            {/* From Deep pelvis to Pain associated with menstrual cycle */}
            <VerticalLine x={1400} startY={250} endY={320} />
            <ArrowHead x={1400} y={320} direction="down" />

            {/* From Visual inspection to findings */}
            <VerticalLine x={400} startY={370} endY={420} />
            <HorizontalLine y={420} startX={110} endX={710} />
            
            {/* To Atrophy */}
            <VerticalLine x={110} startY={420} endY={460} />
            <ArrowHead x={110} y={460} direction="down" />
            
            {/* To Lesions */}
            <VerticalLine x={380} startY={420} endY={460} />
            <ArrowHead x={380} y={460} direction="down" />
            
            {/* To Normal exam */}
            <VerticalLine x={610} startY={420} endY={460} />
            <ArrowHead x={610} y={460} direction="down" />

            {/* From Pain associated with menstrual cycle branching */}
            <VerticalLine x={1400} startY={370} endY={440} />
            <HorizontalLine y={440} startX={1340} endX={1700} />
            
            {/* To Dysmenorrhea */}
            <VerticalLine x={1340} startY={440} endY={460} />
            <ArrowHead x={1340} y={460} direction="down" />
            
            {/* To Bimanual exam */}
            <VerticalLine x={1700} startY={440} endY={460} />
            <ArrowHead x={1700} y={460} direction="down" />

            {/* From findings to diagnoses */}
            <VerticalLine x={110} startY={470} endY={520} />
            <ArrowHead x={110} y={520} direction="down" />

            <VerticalLine x={380} startY={470} endY={520} />
            <ArrowHead x={380} y={520} direction="down" />

            <VerticalLine x={610} startY={470} endY={520} />
            <ArrowHead x={610} y={520} direction="down" />

            <VerticalLine x={1340} startY={470} endY={520} />
            <ArrowHead x={1340} y={520} direction="down" />

            <VerticalLine x={1700} startY={470} endY={520} />
            <ArrowHead x={1700} y={520} direction="down" />

            {/* From Bimanual exam to findings */}
            <VerticalLine x={1700} startY={470} endY={660} />
            <HorizontalLine y={660} startX={1420} endX={2190} />
            
            <VerticalLine x={1420} startY={660} endY={700} />
            <VerticalLine x={1670} startY={660} endY={700} />
            <VerticalLine x={1940} startY={660} endY={700} />
            <VerticalLine x={2190} startY={660} endY={700} />
            
            <ArrowHead x={1420} y={700} direction="down" />
            <ArrowHead x={1670} y={700} direction="down" />
            <ArrowHead x={1940} y={700} direction="down" />
            <ArrowHead x={2190} y={700} direction="down" />

            {/* From Abnormal vaginal discharge branching */}
            <VerticalLine x={610} startY={570} endY={620} />
            <HorizontalLine y={620} startX={700} endX={1000} />
            
            <VerticalLine x={800} startY={620} endY={660} />
            <VerticalLine x={1000} startY={620} endY={660} />
            
            <ArrowHead x={800} y={660} direction="down" />
            <ArrowHead x={1000} y={660} direction="down" />

            {/* From findings to diagnoses */}
            <VerticalLine x={1420} startY={750} endY={800} />
            <ArrowHead x={1420} y={800} direction="down" />

            <VerticalLine x={1670} startY={750} endY={800} />
            <ArrowHead x={1670} y={800} direction="down" />

            <VerticalLine x={1940} startY={750} endY={800} />
            <ArrowHead x={1940} y={800} direction="down" />

            <VerticalLine x={2190} startY={750} endY={800} />
            <ArrowHead x={2190} y={800} direction="down" />

            <VerticalLine x={800} startY={710} endY={760} />
            <ArrowHead x={800} y={760} direction="down" />

            <VerticalLine x={1000} startY={710} endY={760} />
            <ArrowHead x={1000} y={760} direction="down" />

            {/* From diagnoses to treatments */}
            <VerticalLine x={110} startY={570} endY={720} />
            <ArrowHead x={110} y={720} direction="down" />

            <VerticalLine x={380} startY={570} endY={720} />
            <ArrowHead x={380} y={720} direction="down" />

            <VerticalLine x={800} startY={770} endY={820} />
            <ArrowHead x={800} y={820} direction="down" />

            <VerticalLine x={1000} startY={770} endY={820} />
            <ArrowHead x={1000} y={820} direction="down" />

            <VerticalLine x={1420} startY={670} endY={720} />
            <ArrowHead x={1420} y={720} direction="down" />

            <VerticalLine x={1670} startY={670} endY={720} />
            <ArrowHead x={1670} y={720} direction="down" />

            <VerticalLine x={1940} startY={670} endY={720} />
            <ArrowHead x={1940} y={720} direction="down" />

            <VerticalLine x={2190} startY={670} endY={720} />
            <ArrowHead x={2190} y={720} direction="down" />

          </div>
        </div>
      </div>
    </>
  );
} 
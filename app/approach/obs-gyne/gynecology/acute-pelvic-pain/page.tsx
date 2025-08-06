'use client';

import React, { useRef, useState } from 'react';
import Head from "next/head";

// Main title box component (Green)
const TitleBox = ({ title, style = {} }: { title: string; style?: React.CSSProperties }) => (
  <div 
    className="flowchart-box bg-green-500 text-white px-6 py-4 text-center rounded-lg shadow-md text-lg font-bold"
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

// Symptom/Finding box component (Green)
const FindingBox = ({ title, icon, style = {} }: { title: string; icon?: string; style?: React.CSSProperties }) => (
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
    <div className="flex items-center space-x-2">
      {icon && <span className="text-lg">{icon}</span>}
      <span>{title}</span>
    </div>
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

export default function AcutePelvicPainFlowchart({ frameFullScreen, onToggleFrameFullScreen }: { frameFullScreen: boolean; onToggleFrameFullScreen: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [scrollPos, setScrollPos] = useState({ x: 0, y: 0 });
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [lastTouchPos, setLastTouchPos] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.flowchart-box')) return;
    setIsPanning(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    e.preventDefault();
    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;
    setScrollPos(prev => ({
      x: prev.x + deltaX,
      y: Math.max(0, prev.y + deltaY) // Prevent scrolling above the header
    }));
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.flowchart-box')) return;
    if (e.touches.length === 1) {
      setIsPanning(true);
      setLastTouchPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPanning || e.touches.length !== 1) return;
    e.preventDefault();
    const deltaX = e.touches[0].clientX - lastTouchPos.x;
    const deltaY = e.touches[0].clientY - lastTouchPos.y;
    setScrollPos(prev => ({
      x: prev.x + deltaX,
      y: Math.max(0, prev.y + deltaY) // Prevent scrolling above the header
    }));
    setLastTouchPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchEnd = () => {
    setIsPanning(false);
  };

  return (
    <>
      <Head>
        <title>Acute Pelvic Pain - MBHA</title>
        <meta name="description" content="Medical flowchart for acute pelvic pain evaluation" />
      </Head>
      
      <div className={`${frameFullScreen ? 'fixed inset-0 z-50 bg-gray-100' : 'h-screen bg-gray-100'} overflow-hidden flex flex-col`}>
        {/* Header - Fixed at top */}
        <div className="bg-white p-4 shadow-sm flex items-center justify-between flex-shrink-0 border-b border-gray-200 z-10 relative">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-blue-600">Acute Pelvic Pain</h1>
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
          className="relative w-full flex-grow cursor-grab active:cursor-grabbing overflow-hidden"
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
              transform: `translate3d(${scrollPos.x}px, ${scrollPos.y}px, 0)`,
              width: '3600px',
              height: '2800px',
              willChange: 'transform',
            }}
          >
            {/* Main Title - Centered at top */}
            <TitleBox
              title="Acute Pelvic Pain"
              style={{ position: 'absolute', left: 650, top: 50, width: 280 }}
            />

            {/* Beta-hCG - Directly below main title */}
            <DecisionBox
              title="Beta-hCG"
              style={{ position: 'absolute', left: 690, top: 180, width: 200 }}
            />

            {/* LEFT BRANCH: Beta-hCG Negative */}
            {/* Abdominal and pelvic exam - SHIFTED LEFT */}
            <DecisionBox
              title="Abdominal and pelvic exam"
              style={{ position: 'absolute', left: 50, top: 350, width: 220 }}
            />

            {/* Four symptom boxes - MUCH WIDER SPACING for clear separation */}
            <FindingBox
              title="Cervical motion tenderness"
              style={{ position: 'absolute', left: 50, top: 520, width: 200 }}
            />

            <FindingBox
              title="Severe unilateral pain"
              style={{ position: 'absolute', left: 350, top: 520, width: 200 }}
            />

            <FindingBox
              title="Suprapubic tenderness"
              style={{ position: 'absolute', left: 650, top: 520, width: 200 }}
            />

            <FindingBox
              title="Cyclic, monthly acute pain episodes"
              style={{ position: 'absolute', left: 950, top: 520, width: 280 }}
            />

            {/* PATH 1: Cervical motion tenderness - Complete vertical pathway */}
            <DecisionBox
              title="STI testing"
              style={{ position: 'absolute', left: 80, top: 680, width: 140 }}
            />

            <DecisionBox
              title="TVUS¹"
              style={{ position: 'absolute', left: 110, top: 840, width: 120 }}
            />

            {/* Test results - Centered for proper branching */}
            <FindingBox
              title="Thick-walled cystic collection in adnexa?"
              style={{ position: 'absolute', left: 50, top: 1000, width: 240 }}
            />

            {/* Diagnoses - CLEAR LEFT/RIGHT BRANCHING with proper spacing */}
            <DiagnosisBox
              title="Pelvic Inflammatory Disease"
              style={{ position: 'absolute', left: 20, top: 1180, width: 140 }}
            />

            <DiagnosisBox
              title="Tubo-ovarian Abscess"
              style={{ position: 'absolute', left: 200, top: 1180, width: 140 }}
            />

            {/* Treatments - ALIGNED UNDER PARENT DIAGNOSES */}
            <TreatmentBox
              title="Ceftriaxone 500 mg IM, doxycycline + metronidazole x14 days"
              style={{ position: 'absolute', left: 10, top: 1320, width: 160 }}
            />

            <TreatmentBox
              title="Broad-spectrum antibiotics³ ± drainage or laparoscopy"
              style={{ position: 'absolute', left: 190, top: 1320, width: 160 }}
            />

            {/* PATH 2: Severe unilateral pain - Complete vertical pathway with proper spacing */}
            <DecisionBox
              title="Abdominal ultrasound"
              style={{ position: 'absolute', left: 380, top: 680, width: 180 }}
            />

            {/* Three findings with proper spacing - positioned BELOW PATH 1 treatments */}
            <FindingBox
              title="Appendiceal diameter >6 mm or appendiceal wall thickening"
              style={{ position: 'absolute', left: 300, top: 1520, width: 140 }}
            />

            <FindingBox
              title="Intraperitoneal fluid collection"
              style={{ position: 'absolute', left: 470, top: 1520, width: 140 }}
            />

            <FindingBox
              title="↓ Ovarian artery flow"
              style={{ position: 'absolute', left: 640, top: 1520, width: 140 }}
            />

            {/* Diagnoses for PATH 2 */}
            <DiagnosisBox
              title="Appendicitis"
              style={{ position: 'absolute', left: 320, top: 1680, width: 100 }}
            />

            <DiagnosisBox
              title="Ovarian Cyst Rupture"
              style={{ position: 'absolute', left: 480, top: 1680, width: 120 }}
            />

            <DiagnosisBox
              title="Ovarian Torsion"
              style={{ position: 'absolute', left: 650, top: 1680, width: 110 }}
            />

            {/* Treatments for PATH 2 diagnoses */}
            <TreatmentBox
              title="Supportive care (if stable), or exploratory laparoscopy (if unstable)"
              style={{ position: 'absolute', left: 460, top: 1820, width: 160 }}
            />

            <TreatmentBox
              title="Exploratory laparoscopy"
              style={{ position: 'absolute', left: 635, top: 1820, width: 140 }}
            />

            {/* PATH 3: Suprapubic tenderness - Complete pathway */}
            <DecisionBox
              title="Urinalysis, urine culture"
              style={{ position: 'absolute', left: 680, top: 680, width: 180 }}
            />

            {/* UA results box - positioned between Urinalysis and UTI diagnosis */}
            <FindingBox
              title="UA: WBCs ± nitrites\nUrine culture: >100 K\nsingle organism colonies"
              style={{ position: 'absolute', left: 650, top: 840, width: 240 }}
            />

            <DiagnosisBox
              title="Urinary Tract Infection²"
              style={{ position: 'absolute', left: 700, top: 1000, width: 140 }}
            />

            {/* PATH 4: Cyclic pain - Placeholder for later */}
            <FindingBox
              title="Monthly mid-cycle pain"
              style={{ position: 'absolute', left: 950, top: 680, width: 140 }}
            />

            <FindingBox
              title="Dysmenorrhea, GI or urinary symptoms"
              style={{ position: 'absolute', left: 1120, top: 680, width: 180 }}
            />

            <DiagnosisBox
              title="Mittelschmerz"
              style={{ position: 'absolute', left: 970, top: 840, width: 100 }}
            />

            <DiagnosisBox
              title="Endometriosis"
              style={{ position: 'absolute', left: 1140, top: 840, width: 140 }}
            />

            {/* RIGHT BRANCH: Beta-hCG Positive */}
            <FindingBox
              title="Intrauterine pregnancy on TVUS¹"
              style={{ position: 'absolute', left: 1600, top: 350, width: 280 }}
            />

            <ReferenceBox
              text="See Abdominal Pain in Pregnancy, Vaginal Bleeding in Pregnancy"
              style={{ position: 'absolute', left: 1550, top: 520, width: 280 }}
            />

            <DiagnosisBox
              title="Ectopic Pregnancy"
              style={{ position: 'absolute', left: 1950, top: 520, width: 200 }}
            />

            {/* Remaining treatments for PATH 3 and 4 */}
            <TreatmentBox
              title="Nitrofurantoin or TMP-SMX"
              style={{ position: 'absolute', left: 680, top: 1140, width: 180 }}
            />

            <TreatmentBox
              title="Reassurance and supportive care"
              style={{ position: 'absolute', left: 950, top: 1140, width: 140 }}
            />

            <TreatmentBox
              title="OCPs and NSAIDs. Consider diagnostic laparoscopy"
              style={{ position: 'absolute', left: 1120, top: 1140, width: 180 }}
            />

            <TreatmentBox
              title="Methotrexate or laparoscopy"
              style={{ position: 'absolute', left: 1950, top: 680, width: 250 }}
            />

            {/* Footnotes - Better positioned and styled with clear title */}
            <FootnotesBox
              style={{ position: 'absolute', left: 1600, top: 1400, width: 550, minHeight: 120 }}
            >
              <div className="text-sm leading-relaxed">
                <div className="font-bold text-lg mb-3 text-gray-800">Footnotes</div>
                <div className="mb-2"><strong>1.</strong> Transvaginal ultrasound.</div>
                <div className="mb-2"><strong>2.</strong> Cystitis or pyelonephritis.</div>
                <div><strong>3.</strong> Cephalosporin + doxycycline ± metronidazole.</div>
              </div>
            </FootnotesBox>

            {/* CONNECTING LINES AND ARROWS - COMPLETELY REDESIGNED */}
            
            {/* From Main Title to Beta-hCG */}
            <VerticalLine x={790} startY={110} endY={180} />
            <ArrowHead x={790} y={180} direction="down" />

            {/* From Beta-hCG split - Main branching */}
            <VerticalLine x={790} startY={230} endY={290} />
            <HorizontalLine y={290} startX={160} endX={1740} />
            
            {/* To Abdominal exam (LEFT BRANCH - Beta-hCG Negative) */}
            <VerticalLine x={160} startY={290} endY={350} />
            <ArrowHead x={160} y={350} direction="down" />
            <PlusMinusIndicator type="minus" x={160} y={320} />
            
            {/* To Intrauterine pregnancy (RIGHT BRANCH - Beta-hCG Positive) */}
            <VerticalLine x={1740} startY={290} endY={350} />
            <ArrowHead x={1740} y={350} direction="down" />
            <PlusMinusIndicator type="plus" x={1740} y={320} />

            {/* From Abdominal exam to 4 symptoms - UPDATED SPACING */}
            <VerticalLine x={160} startY={400} endY={480} />
            <HorizontalLine y={480} startX={150} endX={1090} />
            
            {/* Clear vertical lines to each symptom box */}
            <VerticalLine x={150} startY={480} endY={520} />
            <VerticalLine x={450} startY={480} endY={520} />
            <VerticalLine x={750} startY={480} endY={520} />
            <VerticalLine x={1090} startY={480} endY={520} />
            
            <ArrowHead x={150} y={520} direction="down" />
            <ArrowHead x={450} y={520} direction="down" />
            <ArrowHead x={750} y={520} direction="down" />
            <ArrowHead x={1090} y={520} direction="down" />

            {/* PATH 1: Cervical motion tenderness → STI testing → TVUS → Cystic collection → PID/TOA → Treatments */}
            <VerticalLine x={150} startY={570} endY={680} />
            <ArrowHead x={150} y={680} direction="down" />

            {/* From STI testing to TVUS - FIXED ARROW ALIGNMENT */}
            <VerticalLine x={150} startY={730} endY={840} />
            <ArrowHead x={150} y={840} direction="down" />

            {/* From TVUS to thick-walled cystic collection question - FIXED ALIGNMENT */}
            <VerticalLine x={170} startY={890} endY={1000} />
            <ArrowHead x={170} y={1000} direction="down" />

            {/* From thick-walled cystic collection CLEAR LEFT/RIGHT BRANCHING - ARROWS TO BOX BORDERS */}
            <VerticalLine x={170} startY={1050} endY={1140} />
            <HorizontalLine y={1140} startX={90} endX={270} />
            
            {/* To PID (Negative result - NO cyst) - LEFT BRANCH - ARROW TO BOX BORDER */}
            <VerticalLine x={90} startY={1140} endY={1180} />
            <ArrowHead x={90} y={1180} direction="down" />
            <PlusMinusIndicator type="minus" x={70} y={1160} />
            
            {/* To Tubo-ovarian Abscess (Positive result - YES cyst) - RIGHT BRANCH - ARROW TO BOX BORDER */}
            <VerticalLine x={270} startY={1140} endY={1180} />
            <ArrowHead x={270} y={1180} direction="down" />
            <PlusMinusIndicator type="plus" x={290} y={1160} />

            {/* From diagnoses to treatments - PATH 1 - FROM BOTTOM OF DIAGNOSIS TO TOP OF TREATMENT */}
            <VerticalLine x={90} startY={1230} endY={1320} />
            <ArrowHead x={90} y={1320} direction="down" />

            <VerticalLine x={270} startY={1230} endY={1320} />
            <ArrowHead x={270} y={1320} direction="down" />

            {/* PATH 2: Severe unilateral pain → Abdominal ultrasound → 3 findings → diagnoses → treatments */}
            <VerticalLine x={450} startY={570} endY={680} />
            <ArrowHead x={450} y={680} direction="down" />

            {/* From Abdominal ultrasound down with long space to be below PATH 1 treatments */}
            <VerticalLine x={470} startY={730} endY={1480} />
            <HorizontalLine y={1480} startX={370} endX={710} />
            
            {/* To three findings - ARROWS TO BOX BORDERS */}
            <VerticalLine x={370} startY={1480} endY={1520} />
            <VerticalLine x={540} startY={1480} endY={1520} />
            <VerticalLine x={710} startY={1480} endY={1520} />
            
            <ArrowHead x={370} y={1520} direction="down" />
            <ArrowHead x={540} y={1520} direction="down" />
            <ArrowHead x={710} y={1520} direction="down" />

            {/* From findings to diagnoses - FIXED TO CONNECT TO BOX BORDERS */}
            <VerticalLine x={370} startY={1570} endY={1680} />
            <VerticalLine x={540} startY={1570} endY={1680} />
            <VerticalLine x={710} startY={1570} endY={1680} />
            
            <ArrowHead x={370} y={1680} direction="down" />
            <ArrowHead x={540} y={1680} direction="down" />
            <ArrowHead x={710} y={1680} direction="down" />

            {/* From Ovarian Cyst Rupture and Ovarian Torsion to their treatments - ONLY 2 ARROWS */}
            <VerticalLine x={540} startY={1730} endY={1820} />
            <ArrowHead x={540} y={1820} direction="down" />

            <VerticalLine x={710} startY={1730} endY={1820} />
            <ArrowHead x={710} y={1820} direction="down" />

            {/* PATH 3: Suprapubic tenderness → Urinalysis → UA results → UTI → Treatment */}
            <VerticalLine x={750} startY={570} endY={680} />
            <ArrowHead x={750} y={680} direction="down" />

            {/* From Urinalysis to UA results - ARROW TO BOX BORDER */}
            <VerticalLine x={770} startY={730} endY={840} />
            <ArrowHead x={770} y={840} direction="down" />

            {/* From UA results to UTI diagnosis - FIXED ALIGNMENT */}
            <VerticalLine x={770} startY={890} endY={1000} />
            <ArrowHead x={770} y={1000} direction="down" />

            {/* From UTI to treatment - FIXED ALIGNMENT */}
            <VerticalLine x={770} startY={1050} endY={1140} />
            <ArrowHead x={770} y={1140} direction="down" />

            {/* PATH 4: Cyclic pain → Two branches (simple pathway) */}
            <VerticalLine x={1090} startY={570} endY={640} />
            <HorizontalLine y={640} startX={1020} endX={1210} />
            
            <VerticalLine x={1020} startY={640} endY={680} />
            <VerticalLine x={1210} startY={640} endY={680} />
            
            <ArrowHead x={1020} y={680} direction="down" />
            <ArrowHead x={1210} y={680} direction="down" />

            <VerticalLine x={1020} startY={730} endY={840} />
            <VerticalLine x={1210} startY={730} endY={840} />
            
            <ArrowHead x={1020} y={840} direction="down" />
            <ArrowHead x={1210} y={840} direction="down" />

            <VerticalLine x={1020} startY={890} endY={1140} />
            <VerticalLine x={1210} startY={890} endY={1140} />
            
            <ArrowHead x={1020} y={1140} direction="down" />
            <ArrowHead x={1210} y={1140} direction="down" />

            {/* RIGHT BRANCH: Intrauterine pregnancy split */}
            <VerticalLine x={1740} startY={400} endY={480} />
            <HorizontalLine y={480} startX={1690} endX={2050} />
            
            {/* To Reference (Positive - intrauterine pregnancy found) */}
            <VerticalLine x={1690} startY={480} endY={520} />
            <ArrowHead x={1690} y={520} direction="down" />
            <PlusMinusIndicator type="plus" x={1710} y={500} />
            
            {/* To Ectopic Pregnancy (Negative - no intrauterine pregnancy) */}
            <VerticalLine x={2050} startY={480} endY={520} />
            <ArrowHead x={2050} y={520} direction="down" />
            <PlusMinusIndicator type="minus" x={2070} y={500} />

            {/* From Ectopic Pregnancy to treatment */}
            <VerticalLine x={2050} startY={570} endY={680} />
            <ArrowHead x={2050} y={680} direction="down" />

          </div>
        </div>
      </div>
    </>
  );
} 
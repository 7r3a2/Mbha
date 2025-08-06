'use client';

import React, { useRef, useEffect, useState } from "react";
import Head from "next/head";

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

// Red reference box component
const ReferenceBox = ({ text, style = {} }: { text: string; style?: React.CSSProperties }) => (
  <div 
    className="bg-red-300 border-2 border-gray-500 px-4 py-3 text-center rounded-lg text-base font-semibold text-black shadow-md"
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

export default function DyspareuniaFlowchart() {
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

  return (
    <>
      <Head>
        <title>Dyspareunia - MBHA</title>
        <meta name="description" content="Medical flowchart for dyspareunia evaluation" />
      </Head>
      
      <div className="h-screen bg-gray-100 overflow-hidden">
        {/* Header with back button */}
        <div className="bg-white p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold text-purple-600">Dyspareunia</h1>
          </div>
          <div className="text-sm text-gray-600">
            Gynecology • Approach
          </div>
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
              width: '3600px',
              height: '2800px',
            }}
          >
            {/* Main Title - Centered at top */}
            <FlowchartBox
              title="Where Does the Pain Occur?"
              style={{ position: 'absolute', left: 650, top: 20, width: 280 }}
            />

            {/* LEFT BRANCH: Vulva or introitus */}
            <FlowchartBox
              title="Vulva or introitus"
              style={{ position: 'absolute', left: 300, top: 180, width: 200 }}
            />

            {/* Visual inspection ± pelvic exam */}
            <FlowchartBox
              title="Visual inspection ± pelvic exam"
              style={{ position: 'absolute', left: 280, top: 320, width: 240 }}
            />

            {/* Three findings from Visual inspection */}
            <FlowchartBox
              title="Atrophy"
              style={{ position: 'absolute', left: 50, top: 480, width: 120 }}
            />

            <FlowchartBox
              title="Lesions, fissures, ulcerations"
              style={{ position: 'absolute', left: 280, top: 480, width: 200 }}
            />

            <FlowchartBox
              title="No abnormal findings or mild erythema"
              style={{ position: 'absolute', left: 600, top: 480, width: 220 }}
            />

            {/* Diagnoses for first two findings */}
            <FlowchartBox
              title="Atrophic Vaginitis"
              style={{ position: 'absolute', left: 40, top: 620, width: 140 }}
            />

            <FlowchartBox
              title="Vaginal or Vulvar Lesion"
              style={{ position: 'absolute', left: 280, top: 620, width: 200 }}
            />

            {/* Treatments for first two diagnoses */}
            <FlowchartBox
              title="Lubricants"
              style={{ position: 'absolute', left: 60, top: 760, width: 100 }}
            />

            <FlowchartBox
              title="See Vaginal/Vulvar Lesions"
              style={{ position: 'absolute', left: 280, top: 760, width: 200 }}
            />

            {/* Additional treatment for Atrophic Vaginitis */}
            <FlowchartBox
              title="Topical estrogen"
              style={{ position: 'absolute', left: 40, top: 900, width: 140 }}
            />

            {/* Third pathway - Localized vestibular tenderness */}
            <FlowchartBox
              title="Localized vestibular tenderness on pressure point testing¹"
              style={{ position: 'absolute', left: 580, top: 620, width: 260 }}
            />

            {/* Split from Localized vestibular tenderness */}
            <FlowchartBox
              title="Localized Vulvodynia²"
              style={{ position: 'absolute', left: 500, top: 780, width: 180 }}
            />

            <FlowchartBox
              title="Abnormal vaginal discharge"
              style={{ position: 'absolute', left: 800, top: 780, width: 200 }}
            />

            {/* Treatments from Localized Vulvodynia */}
            <FlowchartBox
              title="Topical anesthetic"
              style={{ position: 'absolute', left: 520, top: 920, width: 140 }}
            />

            {/* Split from Abnormal vaginal discharge */}
            <FlowchartBox
              title="Vaginitis or Cervicitis"
              style={{ position: 'absolute', left: 720, top: 920, width: 160 }}
            />

            <FlowchartBox
              title="Vaginismus"
              style={{ position: 'absolute', left: 980, top: 920, width: 120 }}
            />

            {/* Treatments from discharge pathway */}
            <FlowchartBox
              title="See Vaginal Discharge Algorithm, p. 694"
              style={{ position: 'absolute', left: 700, top: 1060, width: 200 }}
            />

            <FlowchartBox
              title="Topical anesthetic, physical therapy, vaginal dilators, and cognitive behavioral therapy"
              style={{ position: 'absolute', left: 940, top: 1060, width: 200 }}
            />

            {/* RIGHT BRANCH: Deep pelvis */}
            <FlowchartBox
              title="Deep pelvis"
              style={{ position: 'absolute', left: 1200, top: 180, width: 200 }}
            />

            {/* Pain associated with menstrual cycle */}
            <FlowchartBox
              title="Pain associated with menstrual cycle"
              style={{ position: 'absolute', left: 1150, top: 320, width: 300 }}
            />

            {/* Dymenorrhea, pelvic ligament nodularity on exam */}
            <FlowchartBox
              title="Dymenorrhea, pelvic ligament nodularity on exam"
              style={{ position: 'absolute', left: 1120, top: 480, width: 360 }}
            />

            {/* Endometriosis diagnosis */}
            <FlowchartBox
              title="Endometriosis"
              style={{ position: 'absolute', left: 1200, top: 620, width: 200 }}
            />

            {/* Bimanual exam */}
            <FlowchartBox
              title="Bimanual exam"
              style={{ position: 'absolute', left: 1650, top: 480, width: 160 }}
            />

            {/* Four findings from Bimanual exam */}
            <FlowchartBox
              title="Fixation of pelvic organs"
              style={{ position: 'absolute', left: 1350, top: 700, width: 200 }}
            />

            <FlowchartBox
              title="Adnexal fullness or mass"
              style={{ position: 'absolute', left: 1600, top: 700, width: 200 }}
            />

            <FlowchartBox
              title="Abnormal pelvic floor muscle"
              style={{ position: 'absolute', left: 1850, top: 700, width: 200 }}
            />

            <FlowchartBox
              title="Pudendal nerve pain"
              style={{ position: 'absolute', left: 2100, top: 700, width: 180 }}
            />

            {/* Diagnoses for the four findings */}
            <FlowchartBox
              title="Pelvic Adhesions"
              style={{ position: 'absolute', left: 1380, top: 860, width: 140 }}
            />

            <FlowchartBox
              title="Ovarian Tumor²"
              style={{ position: 'absolute', left: 1620, top: 860, width: 160 }}
            />

            <FlowchartBox
              title="Pelvic Floor Dysfunction³"
              style={{ position: 'absolute', left: 1850, top: 860, width: 200 }}
            />

            <FlowchartBox
              title="Pudendal Neuralgia³"
              style={{ position: 'absolute', left: 2100, top: 860, width: 180 }}
            />

            {/* Treatments */}
            <FlowchartBox
              title="Surgical resection"
              style={{ position: 'absolute', left: 1380, top: 1020, width: 140 }}
            />

            <FlowchartBox
              title="Ovarian tumor workup and treatment"
              style={{ position: 'absolute', left: 1580, top: 1020, width: 240 }}
            />

            <FlowchartBox
              title="Pelvic exercises ± physical therapy"
              style={{ position: 'absolute', left: 1850, top: 1020, width: 200 }}
            />

            <FlowchartBox
              title="Medication and physical therapy"
              style={{ position: 'absolute', left: 2070, top: 1020, width: 240 }}
            />

            {/* Footnotes */}
            <div 
              className="absolute bg-white border-2 border-gray-500 p-6 rounded-lg shadow-lg"
              style={{ 
                left: 200, 
                top: 1200, 
                width: 600, 
                height: 'auto',
                minHeight: 120,
                overflow: 'visible'
              }}
            >
              <div className="text-sm leading-relaxed text-gray-800">
                <div className="font-bold text-lg mb-3">Footnotes</div>
                <div className="mb-2"><strong>1.</strong> Pressure point testing is performed with a cotton swab.</div>
                <div className="mb-2"><strong>2.</strong> Localized vulvodynia is also known as vulvar vestibulitis. Generalized vulvodynia often presents without specific physical exam findings.</div>
                <div><strong>3.</strong> Pain can occur outside of sexual contact, such as with prolonged sitting.</div>
              </div>
            </div>

            {/* CONNECTING LINES AND ARROWS */}
            
            {/* From Main Title to left and right branches */}
            <VerticalLine x={790} startY={80} endY={150} />
            <HorizontalLine y={150} startX={400} endX={1300} />
            
            {/* To Vulva or introitus (LEFT BRANCH) */}
            <VerticalLine x={400} startY={150} endY={180} />
            <ArrowHead x={400} y={180} direction="down" />
            
            {/* To Deep pelvis (RIGHT BRANCH) */}
            <VerticalLine x={1300} startY={150} endY={180} />
            <ArrowHead x={1300} y={180} direction="down" />

            {/* LEFT BRANCH: Vulva or introitus pathway */}
            {/* From Vulva or introitus to Visual inspection */}
            <VerticalLine x={400} startY={230} endY={320} />
            <ArrowHead x={400} y={320} direction="down" />

            {/* From Visual inspection to three findings */}
            <VerticalLine x={400} startY={370} endY={440} />
            <HorizontalLine y={440} startX={110} endX={710} />
            
            {/* To three findings */}
            <VerticalLine x={110} startY={440} endY={480} />
            <VerticalLine x={380} startY={440} endY={480} />
            <VerticalLine x={710} startY={440} endY={480} />
            
            <ArrowHead x={110} y={480} direction="down" />
            <ArrowHead x={380} y={480} direction="down" />
            <ArrowHead x={710} y={480} direction="down" />

            {/* From Atrophy to Atrophic Vaginitis */}
            <VerticalLine x={110} startY={530} endY={620} />
            <ArrowHead x={110} y={620} direction="down" />

            {/* From Lesions to Vaginal or Vulvar Lesion */}
            <VerticalLine x={380} startY={530} endY={620} />
            <ArrowHead x={380} y={620} direction="down" />

            {/* From Atrophic Vaginitis to Lubricants */}
            <VerticalLine x={110} startY={670} endY={760} />
            <ArrowHead x={110} y={760} direction="down" />

            {/* From Vaginal or Vulvar Lesion to See Vaginal/Vulvar Lesions */}
            <VerticalLine x={380} startY={670} endY={760} />
            <ArrowHead x={380} y={760} direction="down" />

            {/* From Lubricants to Topical estrogen */}
            <VerticalLine x={110} startY={810} endY={900} />
            <ArrowHead x={110} y={900} direction="down" />

            {/* From No abnormal findings to Localized vestibular tenderness */}
            <VerticalLine x={710} startY={530} endY={620} />
            <ArrowHead x={710} y={620} direction="down" />

            {/* From Localized vestibular tenderness - split to two paths */}
            <VerticalLine x={710} startY={670} endY={740} />
            <HorizontalLine y={740} startX={590} endX={900} />
            
            {/* To Localized Vulvodynia (LEFT PATH - positive) */}
            <VerticalLine x={590} startY={740} endY={780} />
            <ArrowHead x={590} y={780} direction="down" />
            
            {/* To Abnormal vaginal discharge (RIGHT PATH - negative) */}
            <VerticalLine x={900} startY={740} endY={780} />
            <ArrowHead x={900} y={780} direction="down" />

            {/* From Localized Vulvodynia to Topical anesthetic */}
            <VerticalLine x={590} startY={830} endY={920} />
            <ArrowHead x={590} y={920} direction="down" />

            {/* From Abnormal vaginal discharge - split to two diagnoses */}
            <VerticalLine x={900} startY={830} endY={880} />
            <HorizontalLine y={880} startX={800} endX={1040} />
            
            {/* To Vaginitis or Cervicitis (LEFT PATH - positive) */}
            <VerticalLine x={800} startY={880} endY={920} />
            <ArrowHead x={800} y={920} direction="down" />
            
            {/* To Vaginismus (RIGHT PATH - negative) */}
            <VerticalLine x={1040} startY={880} endY={920} />
            <ArrowHead x={1040} y={920} direction="down" />

            {/* From Vaginitis or Cervicitis to See Vaginal Discharge */}
            <VerticalLine x={800} startY={970} endY={1060} />
            <ArrowHead x={800} y={1060} direction="down" />

            {/* From Vaginismus to therapy treatment */}
            <VerticalLine x={1040} startY={970} endY={1060} />
            <ArrowHead x={1040} y={1060} direction="down" />

            {/* RIGHT BRANCH: Deep pelvis pathway */}
            {/* From Deep pelvis to Pain associated with menstrual cycle */}
            <VerticalLine x={1300} startY={230} endY={320} />
            <ArrowHead x={1300} y={320} direction="down" />

            {/* From Pain associated with menstrual cycle - split to two paths */}
            <VerticalLine x={1300} startY={370} endY={440} />
            <HorizontalLine y={440} startX={1300} endX={1730} />
            
            {/* To Dymenorrhea, pelvic ligament nodularity on exam (LEFT PATH - positive) */}
            <VerticalLine x={1300} startY={440} endY={480} />
            <ArrowHead x={1300} y={480} direction="down" />
            
            {/* To Bimanual exam (RIGHT PATH - negative) */}
            <VerticalLine x={1730} startY={440} endY={480} />
            <ArrowHead x={1730} y={480} direction="down" />

            {/* From Dymenorrhea to Endometriosis */}
            <VerticalLine x={1300} startY={530} endY={620} />
            <ArrowHead x={1300} y={620} direction="down" />

            {/* From Bimanual exam to four findings - LONG ARROW DOWN */}
            <VerticalLine x={1730} startY={530} endY={660} />
            <HorizontalLine y={660} startX={1450} endX={2190} />
            
            {/* To four findings */}
            <VerticalLine x={1450} startY={660} endY={700} />
            <VerticalLine x={1700} startY={660} endY={700} />
            <VerticalLine x={1950} startY={660} endY={700} />
            <VerticalLine x={2190} startY={660} endY={700} />
            
            <ArrowHead x={1450} y={700} direction="down" />
            <ArrowHead x={1700} y={700} direction="down" />
            <ArrowHead x={1950} y={700} direction="down" />
            <ArrowHead x={2190} y={700} direction="down" />

            {/* From findings to diagnoses */}
            <VerticalLine x={1450} startY={750} endY={860} />
            <ArrowHead x={1450} y={860} direction="down" />

            <VerticalLine x={1700} startY={750} endY={860} />
            <ArrowHead x={1700} y={860} direction="down" />

            <VerticalLine x={1950} startY={750} endY={860} />
            <ArrowHead x={1950} y={860} direction="down" />

            <VerticalLine x={2190} startY={750} endY={860} />
            <ArrowHead x={2190} y={860} direction="down" />

            {/* From diagnoses to treatments */}
            <VerticalLine x={1450} startY={910} endY={1020} />
            <ArrowHead x={1450} y={1020} direction="down" />

            <VerticalLine x={1700} startY={910} endY={1020} />
            <ArrowHead x={1700} y={1020} direction="down" />

            <VerticalLine x={1950} startY={910} endY={1020} />
            <ArrowHead x={1950} y={1020} direction="down" />

            <VerticalLine x={2190} startY={910} endY={1020} />
            <ArrowHead x={2190} y={1020} direction="down" />

          </div>
        </div>

        {/* Instructions overlay */}
        <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg text-sm text-gray-600">
          <div className="font-semibold mb-1">Instructions:</div>
          <div>• Click and drag to pan around the flowchart</div>
          <div>• Use touch gestures on mobile devices</div>
        </div>
      </div>
    </>
  );
} 
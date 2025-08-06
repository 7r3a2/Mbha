'use client';

import React, { useRef, useState, useEffect } from "react";
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

export default function DyspareuniaPage({ frameFullScreen = false, onToggleFrameFullScreen = () => {} }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [scrollPos, setScrollPos] = useState({ x: 0, y: 0 });

  // Panning functionality - smooth and fast like chest-pain
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    setStartPos({ x: e.clientX - scrollPos.x, y: e.clientY - scrollPos.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    e.preventDefault();
    const newX = e.clientX - startPos.x;
    const newY = e.clientY - startPos.y;
    setScrollPos({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Touch events for mobile - smooth and fast
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsPanning(true);
    setStartPos({ x: touch.clientX - scrollPos.x, y: touch.clientY - scrollPos.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPanning) return;
    e.preventDefault();
    const touch = e.touches[0];
    const newX = touch.clientX - startPos.x;
    const newY = touch.clientY - startPos.y;
    setScrollPos({ x: newX, y: newY });
  };

  const handleTouchEnd = () => {
    setIsPanning(false);
  };

  // Full screen toggle - only for the flowchart frame
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
        {/* Header with back button */}
        <div className="bg-white p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold text-blue-600">Dyspareunia</h1>
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
              transform: `translate3d(${scrollPos.x}px, ${scrollPos.y}px, 0)`,
              width: '3600px',
              height: '2800px',
              willChange: 'transform',
            }}
          >
            {/* Main Title - Centered at top - RAISED HIGHER */}
            <TitleBox
              title="Where Does the Pain Occur?"
              style={{ position: 'absolute', left: 650, top: 20, width: 280 }}
            />

            {/* LEFT BRANCH: Vulva or introitus - Complete pathway */}
            <FindingBox
              title="Vulva or introitus"
              style={{ position: 'absolute', left: 300, top: 180, width: 200 }}
            />

            {/* Visual inspection ± pelvic exam */}
            <DecisionBox
              title="Visual inspection ± pelvic exam"
              style={{ position: 'absolute', left: 280, top: 320, width: 240 }}
            />

            {/* Three findings from Visual inspection - INCREASED SPACING */}
            <FindingBox
              title="Atrophy"
              style={{ position: 'absolute', left: 50, top: 480, width: 120 }}
            />

            <FindingBox
              title="Lesions, fissures, ulcerations"
              style={{ position: 'absolute', left: 280, top: 480, width: 200 }}
            />

            <FindingBox
              title="No abnormal findings or mild erythema"
              style={{ position: 'absolute', left: 600, top: 480, width: 220 }}
            />

            {/* Diagnoses for first two findings - INCREASED SPACING */}
            <DiagnosisBox
              title="Atrophic Vaginitis"
              style={{ position: 'absolute', left: 40, top: 620, width: 140 }}
            />

            <DiagnosisBox
              title="Vaginal or Vulvar Lesion"
              style={{ position: 'absolute', left: 280, top: 620, width: 200 }}
            />

            {/* Treatments for first two diagnoses - INCREASED SPACING */}
            <TreatmentBox
              title="Lubricants"
              style={{ position: 'absolute', left: 60, top: 760, width: 100 }}
            />

            <TreatmentBox
              title="See Vaginal/Vulvar Lesions"
              style={{ position: 'absolute', left: 280, top: 760, width: 200 }}
            />

            {/* Additional treatment for Atrophic Vaginitis - INCREASED SPACING */}
            <TreatmentBox
              title="Topical estrogen"
              style={{ position: 'absolute', left: 40, top: 900, width: 140 }}
            />

            {/* Third pathway - Localized vestibular tenderness - INCREASED SPACING */}
            <FindingBox
              title="Localized vestibular tenderness on pressure point testing¹"
              style={{ position: 'absolute', left: 580, top: 620, width: 260 }}
            />

            {/* Split from Localized vestibular tenderness - UPDATED POSITIONS */}
            <DiagnosisBox
              title="Localized Vulvodynia²"
              style={{ position: 'absolute', left: 500, top: 780, width: 180 }}
            />

            <FindingBox
              title="Abnormal vaginal discharge"
              style={{ position: 'absolute', left: 800, top: 780, width: 200 }}
            />

            {/* Treatments from Localized Vulvodynia - UPDATED POSITIONS */}
            <TreatmentBox
              title="Topical anesthetic"
              style={{ position: 'absolute', left: 520, top: 920, width: 140 }}
            />

            {/* Split from Abnormal vaginal discharge - MOVED FURTHER RIGHT */}
            <DiagnosisBox
              title="Vaginitis or Cervicitis"
              style={{ position: 'absolute', left: 720, top: 920, width: 160 }}
            />

            <DiagnosisBox
              title="Vaginismus"
              style={{ position: 'absolute', left: 980, top: 920, width: 120 }}
            />

            {/* Treatments from discharge pathway - MOVED FURTHER RIGHT */}
            <TreatmentBox
              title="See Vaginal Discharge Algorithm, p. 694"
              style={{ position: 'absolute', left: 700, top: 1060, width: 200 }}
            />

            <TreatmentBox
              title="Topical anesthetic, physical therapy, vaginal dilators, and cognitive behavioral therapy"
              style={{ position: 'absolute', left: 940, top: 1060, width: 200 }}
            />

            {/* RIGHT BRANCH: Deep pelvis - MOVED FURTHER RIGHT */}
            <FindingBox
              title="Deep pelvis"
              style={{ position: 'absolute', left: 1200, top: 180, width: 200 }}
            />

            {/* Pain associated with menstrual cycle - MOVED RIGHT */}
            <FindingBox
              title="Pain associated with menstrual cycle"
              style={{ position: 'absolute', left: 1150, top: 320, width: 300 }}
            />

            {/* Dymenorrhea, pelvic ligament nodularity on exam - MOVED RIGHT */}
            <FindingBox
              title="Dymenorrhea, pelvic ligament nodularity on exam"
              style={{ position: 'absolute', left: 1120, top: 480, width: 360 }}
            />

            {/* Endometriosis diagnosis - MOVED RIGHT */}
            <DiagnosisBox
              title="Endometriosis"
              style={{ position: 'absolute', left: 1200, top: 620, width: 200 }}
            />

            {/* Bimanual exam - MOVED RIGHT */}
            <DecisionBox
              title="Bimanual exam"
              style={{ position: 'absolute', left: 1650, top: 480, width: 160 }}
            />

            {/* Four findings from Bimanual exam - MOVED RIGHT */}
            <FindingBox
              title="Fixation of pelvic organs"
              style={{ position: 'absolute', left: 1350, top: 700, width: 200 }}
            />

            <FindingBox
              title="Adnexal fullness or mass"
              style={{ position: 'absolute', left: 1600, top: 700, width: 200 }}
            />

            <FindingBox
              title="Abnormal pelvic floor muscle"
              style={{ position: 'absolute', left: 1850, top: 700, width: 200 }}
            />

            <FindingBox
              title="Pudendal nerve pain"
              style={{ position: 'absolute', left: 2100, top: 700, width: 180 }}
            />

            {/* Diagnoses for the four findings - MOVED RIGHT */}
            <DiagnosisBox
              title="Pelvic Adhesions"
              style={{ position: 'absolute', left: 1380, top: 860, width: 140 }}
            />

            <DiagnosisBox
              title="Ovarian Tumor²"
              style={{ position: 'absolute', left: 1620, top: 860, width: 160 }}
            />

            <DiagnosisBox
              title="Pelvic Floor Dysfunction³"
              style={{ position: 'absolute', left: 1850, top: 860, width: 200 }}
            />

            <DiagnosisBox
              title="Pudendal Neuralgia³"
              style={{ position: 'absolute', left: 2100, top: 860, width: 180 }}
            />

            {/* Treatments - MOVED RIGHT */}
            <TreatmentBox
              title="Surgical resection"
              style={{ position: 'absolute', left: 1380, top: 1020, width: 140 }}
            />

            <TreatmentBox
              title="Ovarian tumor workup and treatment"
              style={{ position: 'absolute', left: 1580, top: 1020, width: 240 }}
            />

            <TreatmentBox
              title="Pelvic exercises ± physical therapy"
              style={{ position: 'absolute', left: 1850, top: 1020, width: 200 }}
            />

            <TreatmentBox
              title="Medication and physical therapy"
              style={{ position: 'absolute', left: 2070, top: 1020, width: 240 }}
            />

            {/* Footnotes */}
            <FootnotesBox
              style={{ position: 'absolute', left: 200, top: 1200, width: 600, minHeight: 120 }}
            >
              <div className="text-sm leading-relaxed">
                <div className="font-bold text-lg mb-3 text-gray-800">Footnotes</div>
                <div className="mb-2"><strong>1.</strong> Pressure point testing is performed with a cotton swab.</div>
                <div className="mb-2"><strong>2.</strong> Localized vulvodynia is also known as vulvar vestibulitis. Generalized vulvodynia often presents without specific physical exam findings.</div>
                <div><strong>3.</strong> Pain can occur outside of sexual contact, such as with prolonged sitting.</div>
              </div>
            </FootnotesBox>

            {/* CONNECTING LINES AND ARROWS */}
            
            {/* From Main Title to left and right branches - UPDATED FOR RAISED TITLE */}
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

            {/* From Visual inspection to three findings - UPDATED FOR NEW SPACING */}
            <VerticalLine x={400} startY={370} endY={440} />
            <HorizontalLine y={440} startX={110} endX={710} />
            
            {/* To three findings - UPDATED POSITIONS */}
            <VerticalLine x={110} startY={440} endY={480} />
            <VerticalLine x={380} startY={440} endY={480} />
            <VerticalLine x={710} startY={440} endY={480} />
            
            <ArrowHead x={110} y={480} direction="down" />
            <ArrowHead x={380} y={480} direction="down" />
            <ArrowHead x={710} y={480} direction="down" />

            {/* From Atrophy to Atrophic Vaginitis - UPDATED */}
            <VerticalLine x={110} startY={530} endY={620} />
            <ArrowHead x={110} y={620} direction="down" />

            {/* From Lesions to Vaginal or Vulvar Lesion - UPDATED */}
            <VerticalLine x={380} startY={530} endY={620} />
            <ArrowHead x={380} y={620} direction="down" />

            {/* From Atrophic Vaginitis to Lubricants - UPDATED */}
            <VerticalLine x={110} startY={670} endY={760} />
            <ArrowHead x={110} y={760} direction="down" />

            {/* From Vaginal or Vulvar Lesion to See Vaginal/Vulvar Lesions - UPDATED */}
            <VerticalLine x={380} startY={670} endY={760} />
            <ArrowHead x={380} y={760} direction="down" />

            {/* From Lubricants to Topical estrogen - UPDATED */}
            <VerticalLine x={110} startY={810} endY={900} />
            <ArrowHead x={110} y={900} direction="down" />

            {/* From No abnormal findings to Localized vestibular tenderness - UPDATED */}
            <VerticalLine x={710} startY={530} endY={620} />
            <ArrowHead x={710} y={620} direction="down" />

            {/* From Localized vestibular tenderness - split to two paths - UPDATED FOR MOVED DISCHARGE */}
            <VerticalLine x={710} startY={670} endY={740} />
            <HorizontalLine y={740} startX={590} endX={900} />
            
            {/* To Localized Vulvodynia (LEFT PATH - positive) - UPDATED */}
            <VerticalLine x={590} startY={740} endY={780} />
            <ArrowHead x={590} y={780} direction="down" />
            <PlusMinusIndicator type="plus" x={570} y={760} />
            
            {/* To Abnormal vaginal discharge (RIGHT PATH - negative) - MOVED FURTHER RIGHT */}
            <VerticalLine x={900} startY={740} endY={780} />
            <ArrowHead x={900} y={780} direction="down" />
            <PlusMinusIndicator type="minus" x={920} y={760} />

            {/* From Localized Vulvodynia to Topical anesthetic - UPDATED */}
            <VerticalLine x={590} startY={830} endY={920} />
            <ArrowHead x={590} y={920} direction="down" />

            {/* From Abnormal vaginal discharge - split to two diagnoses - UPDATED FOR MOVED POSITIONS */}
            <VerticalLine x={900} startY={830} endY={880} />
            <HorizontalLine y={880} startX={800} endX={1040} />
            
            {/* To Vaginitis or Cervicitis (LEFT PATH - positive) - UPDATED */}
            <VerticalLine x={800} startY={880} endY={920} />
            <ArrowHead x={800} y={920} direction="down" />
            <PlusMinusIndicator type="plus" x={780} y={900} />
            
            {/* To Vaginismus (RIGHT PATH - negative) - UPDATED */}
            <VerticalLine x={1040} startY={880} endY={920} />
            <ArrowHead x={1040} y={920} direction="down" />
            <PlusMinusIndicator type="minus" x={1060} y={900} />

            {/* From Vaginitis or Cervicitis to See Vaginal Discharge - UPDATED */}
            <VerticalLine x={800} startY={970} endY={1060} />
            <ArrowHead x={800} y={1060} direction="down" />

            {/* From Vaginismus to therapy treatment - UPDATED */}
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
            <PlusMinusIndicator type="plus" x={1320} y={460} />
            
            {/* To Bimanual exam (RIGHT PATH - negative) */}
            <VerticalLine x={1730} startY={440} endY={480} />
            <ArrowHead x={1730} y={480} direction="down" />
            <PlusMinusIndicator type="minus" x={1750} y={460} />

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
      </div>
    </>
  );
} 
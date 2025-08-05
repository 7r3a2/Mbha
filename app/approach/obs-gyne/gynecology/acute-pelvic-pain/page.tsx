'use client';

import React, { useRef, useState } from "react";
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

export default function AcutePelvicPainPage() {
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
        <title>Acute Pelvic Pain</title>
        <meta name="description" content="Medical flowchart for acute pelvic pain evaluation" />
      </Head>
      
      <div className="h-screen bg-gray-100 overflow-hidden">
        {/* Title */}
        <div className="bg-white p-4 shadow-sm">
          <h1 className="text-2xl font-bold text-purple-600">Acute Pelvic Pain</h1>
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
              title="Acute Pelvic Pain"
              style={{ position: 'absolute', left: 400, top: 20, width: 200 }}
            />

            {/* Beta-hCG */}
            <DecisionBox
              title="Beta-hCG"
              style={{ position: 'absolute', left: 450, top: 100, width: 100 }}
            />

            {/* Abdominal and pelvic exam */}
            <DecisionBox
              title="Abdominal and pelvic exam"
              style={{ position: 'absolute', left: 200, top: 180, width: 160 }}
            />

            {/* Intrauterine pregnancy on TVUS¹ */}
            <FindingBox
              title="Intrauterine pregnancy on TVUS¹"
              icon="🔬"
              style={{ position: 'absolute', left: 600, top: 180, width: 180 }}
            />

            {/* Findings from exam - Row 1 with proper spacing */}
            <FindingBox
              title="Cervical motion tenderness"
              icon="🩺"
              style={{ position: 'absolute', left: 50, top: 280, width: 140 }}
            />

            <FindingBox
              title="Severe unilateral pain"
              icon="🩺"
              style={{ position: 'absolute', left: 200, top: 280, width: 140 }}
            />

            <FindingBox
              title="Suprapubic tenderness"
              icon="🩺"
              style={{ position: 'absolute', left: 350, top: 280, width: 140 }}
            />

            <FindingBox
              title="Cyclic, monthly acute pain episodes"
              icon="📅"
              style={{ position: 'absolute', left: 500, top: 280, width: 160 }}
            />

            {/* Tests - Row 2 with proper spacing */}
            <DecisionBox
              title="STI testing"
              style={{ position: 'absolute', left: 120, top: 380, width: 100 }}
            />

            <DecisionBox
              title="Abdominal ultrasound"
              style={{ position: 'absolute', left: 200, top: 380, width: 140 }}
            />

            <DecisionBox
              title="Urinalysis, urine culture"
              style={{ position: 'absolute', left: 350, top: 380, width: 140 }}
            />

            {/* TVUS¹ */}
            <DecisionBox
              title="TVUS¹"
              style={{ position: 'absolute', left: 120, top: 480, width: 80 }}
            />

            {/* Test Results - Row 3 with proper spacing */}
            <FindingBox
              title="Thick-walled cystic collection in adnexa?"
              icon="🔬"
              style={{ position: 'absolute', left: 50, top: 580, width: 160 }}
            />

            <FindingBox
              title="UA: WBCs ± nitrites Urine culture: >100 K single organism colonies"
              icon="🧪"
              style={{ position: 'absolute', left: 350, top: 480, width: 250 }}
            />

            <FindingBox
              title="Monthly mid-cycle pain"
              icon="📅"
              style={{ position: 'absolute', left: 500, top: 480, width: 140 }}
            />

            <FindingBox
              title="Dysmenorrhea, GI or urinary symptoms"
              icon="🔍"
              style={{ position: 'absolute', left: 650, top: 480, width: 180 }}
            />

            {/* Diagnoses - Row 4 with proper spacing */}
            <DiagnosisBox
              title="Ectopic Pregnancy"
              style={{ position: 'absolute', left: 800, top: 280, width: 140 }}
            />

            <DiagnosisBox
              title="Pelvic Inflammatory Disease"
              style={{ position: 'absolute', left: 50, top: 680, width: 140 }}
            />

            <DiagnosisBox
              title="Tubo-ovarian Abscess"
              style={{ position: 'absolute', left: 210, top: 680, width: 140 }}
            />

            <DiagnosisBox
              title="Urinary Tract Infection²"
              style={{ position: 'absolute', left: 350, top: 580, width: 140 }}
            />

            <DiagnosisBox
              title="Mittelschmerz"
              style={{ position: 'absolute', left: 500, top: 580, width: 120 }}
            />

            <DiagnosisBox
              title="Endometriosis"
              style={{ position: 'absolute', left: 650, top: 580, width: 120 }}
            />

            {/* Ultrasound Findings - Row 5 with better spacing */}
            <FindingBox
              title="Appendiceal diameter >6 mm or appendiceal wall thickening"
              icon="🔬"
              style={{ position: 'absolute', left: 50, top: 780, width: 180 }}
            />

            <FindingBox
              title="Intraperitoneal fluid collection"
              icon="🔬"
              style={{ position: 'absolute', left: 240, top: 780, width: 160 }}
            />

            <FindingBox
              title="↓ Ovarian artery flow"
              icon="🔬"
              style={{ position: 'absolute', left: 410, top: 780, width: 140 }}
            />

            {/* Final Diagnoses - Row 6 with proper spacing */}
            <DiagnosisBox
              title="Appendicitis"
              style={{ position: 'absolute', left: 80, top: 880, width: 120 }}
            />

            <DiagnosisBox
              title="Ovarian Cyst Rupture"
              style={{ position: 'absolute', left: 240, top: 880, width: 140 }}
            />

            <DiagnosisBox
              title="Ovarian Torsion"
              style={{ position: 'absolute', left: 410, top: 880, width: 140 }}
            />

            {/* Treatments with proper spacing */}
            <TreatmentBox
              title="Methotrexate or laparoscopy"
              style={{ position: 'absolute', left: 800, top: 380, width: 160 }}
            />

            <TreatmentBox
              title="Ceftriaxone 500 mg IM, doxycycline + metronidazole x14 days"
              style={{ position: 'absolute', left: 50, top: 780, width: 180 }}
            />

            <TreatmentBox
              title="Broad-spectrum antibiotics³ ± drainage or laparoscopy"
              style={{ position: 'absolute', left: 210, top: 780, width: 200 }}
            />

            <TreatmentBox
              title="Nitrofurantoin or TMP-SMX"
              style={{ position: 'absolute', left: 350, top: 680, width: 140 }}
            />

            <TreatmentBox
              title="Reassurance and supportive care"
              style={{ position: 'absolute', left: 500, top: 680, width: 160 }}
            />

            <TreatmentBox
              title="OCPs and NSAIDs. Consider diagnostic laparoscopy"
              style={{ position: 'absolute', left: 650, top: 680, width: 180 }}
            />

            <TreatmentBox
              title="Supportive care (if stable), or exploratory laparoscopy (if unstable)"
              style={{ position: 'absolute', left: 80, top: 980, width: 280 }}
            />

            <TreatmentBox
              title="Exploratory laparoscopy"
              style={{ position: 'absolute', left: 240, top: 980, width: 140 }}
            />

            <TreatmentBox
              title="Exploratory laparoscopy"
              style={{ position: 'absolute', left: 410, top: 980, width: 140 }}
            />

            {/* Reference */}
            <ReferenceBox
              text="See Abdominal Pain in Pregnancy, p. 644"
              style={{ position: 'absolute', left: 650, top: 280, width: 180 }}
            />

            {/* Footnotes - Moved closer to flowchart */}
            <FootnotesBox
              style={{ position: 'absolute', left: 600, top: 880, width: 280 }}
            >
              <div className="text-xs leading-relaxed">
                <div><strong>1.</strong> Transvaginal ultrasound.</div>
                <div><strong>2.</strong> Cystitis or pyelonephritis.</div>
                <div><strong>3.</strong> Cephalosporin + doxycycline ± metronidazole.</div>
              </div>
            </FootnotesBox>

            {/* Lines and Arrows - Updated for new positioning */}
            {/* From Acute Pelvic Pain to Beta-hCG */}
            <VerticalLine x={500} startY={70} endY={100} />
            <ArrowHead x={500} y={100} direction="down" />

            {/* From Beta-hCG branching left and right */}
            <VerticalLine x={500} startY={150} endY={170} />
            <HorizontalLine y={170} startX={280} endX={690} />
            
            {/* Left branch to Abdominal and pelvic exam */}
            <VerticalLine x={280} startY={170} endY={180} />
            <ArrowHead x={280} y={180} direction="down" />
            <PlusMinusIndicator type="minus" x={280} y={180} />

            {/* Right branch to Intrauterine pregnancy */}
            <VerticalLine x={690} startY={170} endY={180} />
            <ArrowHead x={690} y={180} direction="down" />
            <PlusMinusIndicator type="plus" x={690} y={180} />

            {/* From Abdominal and pelvic exam to findings */}
            <VerticalLine x={280} startY={240} endY={260} />
            <HorizontalLine y={260} startX={120} endX={580} />
            
            {/* To Cervical motion tenderness */}
            <VerticalLine x={120} startY={260} endY={280} />
            <ArrowHead x={120} y={280} direction="down" />
            
            {/* To Severe unilateral pain */}
            <VerticalLine x={270} startY={260} endY={280} />
            <ArrowHead x={270} y={280} direction="down" />
            
            {/* To Suprapubic tenderness */}
            <VerticalLine x={420} startY={260} endY={280} />
            <ArrowHead x={420} y={280} direction="down" />
            
            {/* To Cyclic pain */}
            <VerticalLine x={580} startY={260} endY={280} />
            <ArrowHead x={580} y={280} direction="down" />

            {/* From findings to next tests */}
            {/* From Cervical motion tenderness to STI testing */}
            <VerticalLine x={120} startY={350} endY={380} />
            <ArrowHead x={170} y={380} direction="down" />

            {/* From Severe unilateral pain to Abdominal ultrasound */}
            <VerticalLine x={270} startY={350} endY={380} />
            <ArrowHead x={270} y={380} direction="down" />

            {/* From Suprapubic tenderness to Urinalysis */}
            <VerticalLine x={420} startY={350} endY={380} />
            <ArrowHead x={420} y={380} direction="down" />

            {/* From STI testing to TVUS */}
            <VerticalLine x={170} startY={430} endY={480} />
            <ArrowHead x={160} y={480} direction="down" />

            {/* From TVUS to findings */}
            <VerticalLine x={160} startY={530} endY={580} />
            <ArrowHead x={130} y={580} direction="down" />

            {/* From Thick-walled cystic collection branching */}
            <VerticalLine x={130} startY={630} endY={650} />
            <HorizontalLine y={650} startX={120} endX={280} />
            
            {/* To PID */}
            <VerticalLine x={120} startY={650} endY={680} />
            <ArrowHead x={120} y={680} direction="down" />
            <PlusMinusIndicator type="minus" x={120} y={680} />
            
            {/* To Tubo-ovarian Abscess */}
            <VerticalLine x={280} startY={650} endY={680} />
            <ArrowHead x={280} y={680} direction="down" />
            <PlusMinusIndicator type="plus" x={280} y={680} />

            {/* From Abdominal ultrasound to findings */}
            <VerticalLine x={270} startY={430} endY={450} />
            <HorizontalLine y={450} startX={140} endX={490} />
            <VerticalLine x={140} startY={450} endY={780} />
            <VerticalLine x={320} startY={450} endY={780} />
            <VerticalLine x={490} startY={450} endY={780} />
            <ArrowHead x={140} y={780} direction="down" />
            <ArrowHead x={320} y={780} direction="down" />
            <ArrowHead x={490} y={780} direction="down" />

            {/* From Urinalysis to findings */}
            <VerticalLine x={420} startY={430} endY={480} />
            <ArrowHead x={475} y={480} direction="down" />

            {/* From Cyclic pain to findings */}
            <VerticalLine x={580} startY={350} endY={450} />
            <HorizontalLine y={450} startX={570} endX={740} />
            <VerticalLine x={570} startY={450} endY={480} />
            <VerticalLine x={740} startY={450} endY={480} />
            <ArrowHead x={570} y={480} direction="down" />
            <ArrowHead x={740} y={480} direction="down" />

            {/* From Intrauterine pregnancy branching */}
            <VerticalLine x={690} startY={240} endY={260} />
            <HorizontalLine y={260} startX={740} endX={870} />
            
            {/* To Ectopic Pregnancy */}
            <VerticalLine x={870} startY={260} endY={280} />
            <ArrowHead x={870} y={280} direction="down" />
            <PlusMinusIndicator type="minus" x={870} y={280} />
            
            {/* To Reference */}
            <VerticalLine x={740} startY={260} endY={280} />
            <ArrowHead x={740} y={280} direction="down" />
            <PlusMinusIndicator type="plus" x={740} y={280} />

            {/* From findings to diagnoses */}
            <VerticalLine x={140} startY={830} endY={880} />
            <VerticalLine x={320} startY={830} endY={880} />
            <VerticalLine x={490} startY={830} endY={880} />
            <ArrowHead x={140} y={880} direction="down" />
            <ArrowHead x={320} y={880} direction="down" />
            <ArrowHead x={490} y={880} direction="down" />

            <VerticalLine x={475} startY={530} endY={580} />
            <VerticalLine x={570} startY={530} endY={580} />
            <VerticalLine x={740} startY={530} endY={580} />
            <ArrowHead x={420} y={580} direction="down" />
            <ArrowHead x={560} y={580} direction="down" />
            <ArrowHead x={710} y={580} direction="down" />

            {/* From diagnoses to treatments */}
            <VerticalLine x={870} startY={330} endY={380} />
            <ArrowHead x={880} y={380} direction="down" />

            <VerticalLine x={120} startY={730} endY={780} />
            <VerticalLine x={280} startY={730} endY={780} />
            <VerticalLine x={420} startY={630} endY={680} />
            <VerticalLine x={560} startY={630} endY={680} />
            <VerticalLine x={740} startY={630} endY={680} />
            <ArrowHead x={140} y={780} direction="down" />
            <ArrowHead x={280} y={780} direction="down" />
            <ArrowHead x={420} y={680} direction="down" />
            <ArrowHead x={560} y={680} direction="down" />
            <ArrowHead x={740} y={680} direction="down" />

            <VerticalLine x={140} startY={930} endY={980} />
            <VerticalLine x={320} startY={930} endY={980} />
            <VerticalLine x={490} startY={930} endY={980} />
            <ArrowHead x={140} y={980} direction="down" />
            <ArrowHead x={320} y={980} direction="down" />
            <ArrowHead x={490} y={980} direction="down" />

          </div>
        </div>
      </div>
    </>
  );
} 
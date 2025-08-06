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

export default function ChestPainFlowchart() {
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
    e.preventDefault();
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
    e.preventDefault();
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
        <title>Chest Pain - MBHA</title>
        <meta name="description" content="Medical flowchart for chest pain evaluation" />
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
            <h1 className="text-2xl font-bold text-blue-600">Chest Pain</h1>
          </div>
          <div className="text-sm text-gray-600">
            Cardiology • Approach
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
              width: '1600px',
              height: '1300px',
              willChange: 'transform',
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
              className="absolute bg-white border-2 border-gray-500 p-6 rounded-lg shadow-lg"
              style={{ 
                left: 50, 
                top: 720, 
                width: 1500, 
                height: 'auto',
                minHeight: 400,
                overflow: 'visible'
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
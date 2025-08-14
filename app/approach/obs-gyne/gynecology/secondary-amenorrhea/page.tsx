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

// Vertical line component
const VerticalLine = ({ x, y, height, style = {} }: { x: number; y: number; height: number; style?: React.CSSProperties }) => (
  <div
    className="absolute bg-gray-600"
    style={{
      left: x,
      top: y,
      width: '2px',
      height: height,
      ...style
    }}
  />
);

// Horizontal line component
const HorizontalLine = ({ x, y, width, style = {} }: { x: number; y: number; width: number; style?: React.CSSProperties }) => (
  <div
    className="absolute bg-gray-600"
    style={{
      left: x,
      top: y,
      height: '2px',
      width: width,
      ...style
    }}
  />
);

// Arrow head component
const ArrowHead = ({ x, y, direction = 'down', style = {} }: { x: number; y: number; direction?: 'down' | 'right' | 'left' | 'up'; style?: React.CSSProperties }) => {
  const arrowSize = 8;
  let points = '';
  
  switch (direction) {
    case 'down':
      points = `${x},${y} ${x - arrowSize},${y - arrowSize} ${x + arrowSize},${y - arrowSize}`;
      break;
    case 'right':
      points = `${x},${y} ${x - arrowSize},${y - arrowSize} ${x - arrowSize},${y + arrowSize}`;
      break;
    case 'left':
      points = `${x},${y} ${x + arrowSize},${y - arrowSize} ${x + arrowSize},${y + arrowSize}`;
      break;
    case 'up':
      points = `${x},${y} ${x - arrowSize},${y + arrowSize} ${x + arrowSize},${y + arrowSize}`;
      break;
  }

  return (
    <svg
      className="absolute"
      style={{
        left: x - arrowSize,
        top: y - arrowSize,
        width: arrowSize * 2,
        height: arrowSize * 2,
        ...style
      }}
    >
      <polygon points={points} fill="#4B5563" />
    </svg>
  );
};

// Main Secondary Amenorrhea Flowchart Component
const SecondaryAmenorrheaFlowchart = ({ 
  frameFullScreen = false, 
  onToggleFrameFullScreen 
}: { 
  frameFullScreen?: boolean; 
  onToggleFrameFullScreen?: () => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Pan and zoom functionality
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.5, Math.min(3, scale * delta));
    setScale(newScale);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left click only
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className={`${frameFullScreen ? 'fixed inset-0 z-50' : 'h-full w-full'} bg-white flex flex-col`}>
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Secondary Amenorrhea Flowchart</h1>
        <div className="flex gap-2">
          <button
            onClick={resetView}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded-lg text-sm font-medium transition-colors"
          >
            Reset View
          </button>
          {onToggleFrameFullScreen && (
            <button
              onClick={onToggleFrameFullScreen}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded-lg text-sm font-medium transition-colors"
            >
              {frameFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </button>
          )}
        </div>
      </div>

      {/* Flowchart Container */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-hidden relative cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="absolute inset-0"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: '0 0',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
          }}
        >
          {/* Flowchart Content */}
          <div className="relative w-[1200px] h-[800px] bg-white p-8">
            
            {/* Title */}
            <TitleBox 
              title="Secondary Amenorrhea" 
              style={{ position: 'absolute', left: 450, top: 20, width: 300 }}
            />

            {/* Initial Assessment */}
            <DecisionBox 
              title="Secondary Amenorrhea: No menses for 3+ months in previously menstruating woman" 
              style={{ position: 'absolute', left: 400, top: 100, width: 400 }}
            />

            {/* First Branch - Pregnancy */}
            <DecisionBox 
              title="Pregnancy Test" 
              style={{ position: 'absolute', left: 200, top: 200, width: 150 }}
            />
            <VerticalLine x={275} y={250} height={50} />
            <ArrowHead x={275} y={300} direction="down" />

            <FindingBox 
              title="Positive" 
              style={{ position: 'absolute', left: 150, top: 320, width: 100 }}
            />
            <FindingBox 
              title="Negative" 
              style={{ position: 'absolute', left: 300, top: 320, width: 100 }}
            />

            {/* Pregnancy Positive Path */}
            <HorizontalLine x={200} y={370} width={50} />
            <ArrowHead x={250} y={370} direction="right" />
            <DiagnosisBox 
              title="Pregnancy" 
              style={{ position: 'absolute', left: 150, top: 390, width: 100 }}
            />

            {/* Pregnancy Negative Path - Continue Evaluation */}
            <HorizontalLine x={400} y={370} width={50} />
            <ArrowHead x={450} y={370} direction="right" />

            {/* Hormonal Evaluation */}
            <DecisionBox 
              title="FSH Level" 
              style={{ position: 'absolute', left: 500, top: 320, width: 150 }}
            />
            <VerticalLine x={575} y={370} height={50} />
            <ArrowHead x={575} y={420} direction="down" />

            {/* FSH High */}
            <FindingBox 
              title="FSH > 40 mIU/mL" 
              style={{ position: 'absolute', left: 450, top: 440, width: 150 }}
            />
            <HorizontalLine x={525} y={490} width={50} />
            <ArrowHead x={575} y={490} direction="right" />
            <DiagnosisBox 
              title="Premature Ovarian Failure" 
              style={{ position: 'absolute', left: 450, top: 510, width: 150 }}
            />

            {/* FSH Normal/Low */}
            <FindingBox 
              title="FSH < 40 mIU/mL" 
              style={{ position: 'absolute', left: 650, top: 440, width: 150 }}
            />
            <HorizontalLine x={725} y={490} width={50} />
            <ArrowHead x={775} y={490} direction="right" />

            {/* Prolactin Level */}
            <DecisionBox 
              title="Prolactin Level" 
              style={{ position: 'absolute', left: 800, top: 440, width: 150 }}
            />
            <VerticalLine x={875} y={490} height={50} />
            <ArrowHead x={875} y={540} direction="down" />

            {/* Prolactin High */}
            <FindingBox 
              title="Prolactin > 25 ng/mL" 
              style={{ position: 'absolute', left: 750, top: 560, width: 150 }}
            />
            <HorizontalLine x={825} y={610} width={50} />
            <ArrowHead x={875} y={610} direction="right" />
            <DiagnosisBox 
              title="Hyperprolactinemia" 
              style={{ position: 'absolute', left: 750, top: 630, width: 150 }}
            />

            {/* Prolactin Normal */}
            <FindingBox 
              title="Prolactin < 25 ng/mL" 
              style={{ position: 'absolute', left: 950, top: 560, width: 150 }}
            />
            <HorizontalLine x={1025} y={610} width={50} />
            <ArrowHead x={1075} y={610} direction="right" />

            {/* TSH Level */}
            <DecisionBox 
              title="TSH Level" 
              style={{ position: 'absolute', left: 1100, top: 560, width: 150 }}
            />
            <VerticalLine x={1175} y={610} height={50} />
            <ArrowHead x={1175} y={660} direction="down" />

            {/* TSH High */}
            <FindingBox 
              title="TSH > 4.5 mIU/L" 
              style={{ position: 'absolute', left: 1050, top: 680, width: 150 }}
            />
            <HorizontalLine x={1125} y={730} width={50} />
            <ArrowHead x={1175} y={730} direction="right" />
            <DiagnosisBox 
              title="Hypothyroidism" 
              style={{ position: 'absolute', left: 1050, top: 750, width: 150 }}
            />

            {/* TSH Normal */}
            <FindingBox 
              title="TSH < 4.5 mIU/L" 
              style={{ position: 'absolute', left: 1250, top: 680, width: 150 }}
            />
            <HorizontalLine x={1325} y={730} width={50} />
            <ArrowHead x={1375} y={730} direction="right" />

            {/* Androgen Evaluation */}
            <DecisionBox 
              title="Testosterone & DHEAS" 
              style={{ position: 'absolute', left: 1400, top: 680, width: 150 }}
            />
            <VerticalLine x={1475} y={730} height={50} />
            <ArrowHead x={1475} y={780} direction="down" />

            {/* Androgens High */}
            <FindingBox 
              title="Testosterone > 80 ng/dL or DHEAS > 350 μg/dL" 
              style={{ position: 'absolute', left: 1350, top: 800, width: 200 }}
            />
            <HorizontalLine x={1450} y={850} width={50} />
            <ArrowHead x={1500} y={850} direction="right" />
            <DiagnosisBox 
              title="PCOS or Androgen-secreting tumor" 
              style={{ position: 'absolute', left: 1350, top: 870, width: 200 }}
            />

            {/* Androgens Normal */}
            <FindingBox 
              title="Testosterone < 80 ng/dL & DHEAS < 350 μg/dL" 
              style={{ position: 'absolute', left: 1550, top: 800, width: 200 }}
            />
            <HorizontalLine x={1650} y={850} width={50} />
            <ArrowHead x={1700} y={850} direction="right" />

            {/* Estrogen Status */}
            <DecisionBox 
              title="Estrogen Status (Progesterone Challenge)" 
              style={{ position: 'absolute', left: 1725, top: 800, width: 200 }}
            />
            <VerticalLine x={1825} y={850} height={50} />
            <ArrowHead x={1825} y={900} direction="down" />

            {/* Estrogen Present */}
            <FindingBox 
              title="Withdrawal Bleeding" 
              style={{ position: 'absolute', left: 1675, top: 920, width: 150 }}
            />
            <HorizontalLine x={1750} y={970} width={50} />
            <ArrowHead x={1800} y={970} direction="right" />
            <DiagnosisBox 
              title="Hypothalamic Amenorrhea" 
              style={{ position: 'absolute', left: 1675, top: 990, width: 150 }}
            />

            {/* Estrogen Absent */}
            <FindingBox 
              title="No Withdrawal Bleeding" 
              style={{ position: 'absolute', left: 1875, top: 920, width: 150 }}
            />
            <HorizontalLine x={1950} y={970} width={50} />
            <ArrowHead x={2000} y={970} direction="right" />
            <DiagnosisBox 
              title="Asherman Syndrome or Uterine Outflow Obstruction" 
              style={{ position: 'absolute', left: 1875, top: 990, width: 200 }}
            />

            {/* Treatment Options */}
            <TitleBox 
              title="Treatment Options" 
              style={{ position: 'absolute', left: 450, top: 1100, width: 300 }}
            />

            {/* Treatment Boxes */}
            <TreatmentBox 
              title="Pregnancy: Prenatal care" 
              style={{ position: 'absolute', left: 150, top: 1170, width: 150 }}
            />
            <TreatmentBox 
              title="POF: HRT, fertility options" 
              style={{ position: 'absolute', left: 350, top: 1170, width: 150 }}
            />
            <TreatmentBox 
              title="Hyperprolactinemia: Bromocriptine" 
              style={{ position: 'absolute', left: 550, top: 1170, width: 150 }}
            />
            <TreatmentBox 
              title="Hypothyroidism: Levothyroxine" 
              style={{ position: 'absolute', left: 750, top: 1170, width: 150 }}
            />
            <TreatmentBox 
              title="PCOS: OCPs, metformin" 
              style={{ position: 'absolute', left: 950, top: 1170, width: 150 }}
            />
            <TreatmentBox 
              title="Hypothalamic: Address underlying cause" 
              style={{ position: 'absolute', left: 1150, top: 1170, width: 150 }}
            />
            <TreatmentBox 
              title="Asherman: Hysteroscopic adhesiolysis" 
              style={{ position: 'absolute', left: 1350, top: 1170, width: 150 }}
            />

            {/* Assessment Boxes */}
            <AssessmentBox 
              title="Monitor response to treatment" 
              style={{ position: 'absolute', left: 450, top: 1250, width: 300 }}
            />
            <AssessmentBox 
              title="Regular follow-up every 3-6 months" 
              style={{ position: 'absolute', left: 800, top: 1250, width: 300 }}
            />

          </div>
        </div>
      </div>
    </div>
  );
};

// Main Page Component
const SecondaryAmenorrheaPage = ({ 
  frameFullScreen = false, 
  onToggleFrameFullScreen 
}: { 
  frameFullScreen?: boolean; 
  onToggleFrameFullScreen?: () => void;
}) => {
  return (
    <SecondaryAmenorrheaFlowchart 
      frameFullScreen={frameFullScreen}
      onToggleFrameFullScreen={onToggleFrameFullScreen}
    />
  );
};

export default SecondaryAmenorrheaPage;

import React, { useRef, useState } from "react";
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

// Image placeholder box component (Light Pink)
const ImageBox = ({ title, style = {} }: { title: string; style?: React.CSSProperties }) => (
  <div 
    className="bg-pink-100 border-2 border-pink-400 px-4 py-8 text-center rounded-lg shadow-md text-sm font-medium text-gray-700"
    style={{
      minHeight: '80px',
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

export default function VulvarDystrophiesFlowchart() {
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
        <title>Vulvar Dystrophies</title>
        <meta name="description" content="Medical flowchart for vulvar dystrophies evaluation" />
      </Head>
      
      <div className="h-screen bg-white overflow-hidden">
        {/* Title */}
        <div className="bg-white p-4 shadow-sm">
          <h1 className="text-2xl font-bold text-blue-600">Vulvar Dystrophies</h1>
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
            {/* Main Title - Starting Point */}
            <TitleBox
              title="Vulvar Pruritis"
              style={{ position: 'absolute', left: 700, top: 50, width: 200 }}
            />

            {/* LEFT BRANCH: Low estrogen age */}
            <FindingBox
              title="Low estrogen age¹ ± history autoimmune disease"
              style={{ position: 'absolute', left: 200, top: 200, width: 240 }}
            />

            <ImageBox
              title="[Image Placeholder - Will be added later]"
              style={{ position: 'absolute', left: 200, top: 340, width: 240 }}
            />

            <DecisionBox
              title="Confirm with biopsy"
              style={{ position: 'absolute', left: 240, top: 480, width: 160 }}
            />

            <DiagnosisBox
              title="Lichen Sclerosus"
              style={{ position: 'absolute', left: 250, top: 620, width: 140 }}
            />

            <TreatmentBox
              title="Topical corticosteroids, topical calcineurin inhibitors (if refractory)"
              style={{ position: 'absolute', left: 180, top: 760, width: 280 }}
            />

            {/* CENTER BRANCH: Vulvar pain ± oral involvement */}
            <FindingBox
              title="Vulvar pain ± oral involvement"
              style={{ position: 'absolute', left: 600, top: 200, width: 200 }}
            />

            <FindingBox
              title="Glossy, red vulvar erosions"
              style={{ position: 'absolute', left: 620, top: 340, width: 160 }}
            />

            <DecisionBox
              title="Confirm with biopsy"
              style={{ position: 'absolute', left: 640, top: 480, width: 160 }}
            />

            <DiagnosisBox
              title="Lichen Planus"
              style={{ position: 'absolute', left: 650, top: 620, width: 140 }}
            />

            <TreatmentBox
              title="Topical corticosteroids, topical calcineurin inhibitors (if refractory)"
              style={{ position: 'absolute', left: 580, top: 760, width: 280 }}
            />

            {/* RIGHT BRANCH: Chronic nocturnal pruritis */}
            <FindingBox
              title="Chronic nocturnal pruritis ± history of atopic disease"
              style={{ position: 'absolute', left: 1000, top: 200, width: 240 }}
            />

            <FindingBox
              title="Epidermal thickening with pruritic plaques"
              style={{ position: 'absolute', left: 1020, top: 340, width: 200 }}
            />

            <ImageBox
              title="[Image Placeholder - Will be added later]"
              style={{ position: 'absolute', left: 1000, top: 480, width: 240 }}
            />

            <DiagnosisBox
              title="Lichen Simplex Chronicus"
              style={{ position: 'absolute', left: 1040, top: 620, width: 160 }}
            />

            <TreatmentBox
              title="Avoid irritants. Topical corticosteroids, antihistamines, or TCAs. If refractory, systemic corticosteroids, calcineurin inhibitors."
              style={{ position: 'absolute', left: 960, top: 760, width: 320 }}
            />

            {/* Footnotes */}
            <FootnotesBox
              style={{ position: 'absolute', left: 400, top: 1000, width: 600, minHeight: 80 }}
            >
              <div className="text-sm leading-relaxed">
                <div className="font-bold text-lg mb-3 text-gray-800">Footnote</div>
                <div className="mb-2"><strong>1.</strong> Low estrogen ages = pre-menarchal child, postmenopausal adult.</div>
              </div>
            </FootnotesBox>

            {/* CONNECTING LINES AND ARROWS */}
            
            {/* From Main Title to three branches */}
            <VerticalLine x={800} startY={100} endY={160} />
            <HorizontalLine y={160} startX={320} endX={1120} />
            
            {/* To left branch */}
            <VerticalLine x={320} startY={160} endY={200} />
            <ArrowHead x={320} y={200} direction="down" />
            
            {/* To center branch */}
            <VerticalLine x={700} startY={160} endY={200} />
            <ArrowHead x={700} y={200} direction="down" />
            
            {/* To right branch */}
            <VerticalLine x={1120} startY={160} endY={200} />
            <ArrowHead x={1120} y={200} direction="down" />

            {/* LEFT BRANCH connections */}
            <VerticalLine x={320} startY={250} endY={340} />
            <ArrowHead x={320} y={340} direction="down" />

            <VerticalLine x={320} startY={420} endY={480} />
            <ArrowHead x={320} y={480} direction="down" />

            <VerticalLine x={320} startY={530} endY={620} />
            <ArrowHead x={320} y={620} direction="down" />

            <VerticalLine x={320} startY={670} endY={760} />
            <ArrowHead x={320} y={760} direction="down" />

            {/* CENTER BRANCH connections */}
            <VerticalLine x={700} startY={250} endY={340} />
            <ArrowHead x={700} y={340} direction="down" />

            <VerticalLine x={700} startY={390} endY={480} />
            <ArrowHead x={700} y={480} direction="down" />

            <VerticalLine x={720} startY={530} endY={620} />
            <ArrowHead x={720} y={620} direction="down" />

            <VerticalLine x={720} startY={670} endY={760} />
            <ArrowHead x={720} y={760} direction="down" />

            {/* RIGHT BRANCH connections */}
            <VerticalLine x={1120} startY={250} endY={340} />
            <ArrowHead x={1120} y={340} direction="down" />

            <VerticalLine x={1120} startY={390} endY={480} />
            <ArrowHead x={1120} y={390} direction="down" />

            <VerticalLine x={1120} startY={560} endY={620} />
            <ArrowHead x={1120} y={620} direction="down" />

            <VerticalLine x={1120} startY={670} endY={760} />
            <ArrowHead x={1120} y={760} direction="down" />

          </div>
        </div>
      </div>
    </>
  );
} 
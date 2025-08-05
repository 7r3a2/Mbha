'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';

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
      select-text cursor-text hover:bg-gray-50 transition-colors
      ${className}
    `}
    style={{
      minHeight: '50px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      position: 'relative',
      zIndex: 20,
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
    className="bg-red-300 border-2 border-gray-500 px-4 py-3 text-center rounded-lg text-base font-semibold text-black shadow-md select-text cursor-text hover:bg-red-400 transition-colors"
    style={{
      minHeight: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      zIndex: 20,
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

// Chest Pain Flowchart Component
const ChestPainFlowchart = () => {
  const [isPanning, setIsPanning] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [scrollPos, setScrollPos] = useState({ x: 0, y: 0 });
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Panning functionality with faster response
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
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
    e.preventDefault();
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

  // Full screen toggle
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div className={`${isFullScreen ? 'fixed inset-0 z-50' : 'h-full'} bg-gray-100 overflow-hidden`}>
      {/* Header with full screen button */}
      <div className="bg-white p-4 shadow-sm flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-600">Chest Pain</h1>
        <button
          onClick={toggleFullScreen}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          {isFullScreen ? (
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
       <div className="relative w-full h-full overflow-hidden">
         {/* Panning area - only around the flowchart */}
         <div
           className="absolute inset-0 cursor-grab active:cursor-grabbing"
           onMouseDown={handleMouseDown}
           onMouseMove={handleMouseMove}
           onMouseUp={handleMouseUp}
           onMouseLeave={handleMouseUp}
           onTouchStart={handleTouchStart}
           onTouchMove={handleTouchMove}
           onTouchEnd={handleTouchEnd}
           style={{ 
             cursor: isPanning ? 'grabbing' : 'grab',
             touchAction: 'none' // Prevents default touch behaviors
           }}
         />
         
         {/* Flowchart content - interactive */}
         <div
           className="relative"
           style={{
             transform: `translate(${scrollPos.x}px, ${scrollPos.y}px)`,
             width: '1600px',
             height: '1300px',
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
             className="absolute bg-white border-2 border-gray-500 p-6 rounded-lg shadow-lg select-text cursor-text hover:bg-gray-50 transition-colors"
             style={{ 
               left: 50, 
               top: 720, 
               width: 1500, 
               height: 'auto',
               minHeight: 400,
               overflow: 'visible',
               position: 'relative',
               zIndex: 20
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
         <div>• Click and drag empty areas to pan</div>
         <div>• Touch and drag on mobile devices</div>
         <div>• Click on boxes to select and copy text</div>
         <div>• Use full screen button for better view</div>
       </div>
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

  const subjects = [
    {
      id: 'internal-medicine',
      name: 'Internal Medicine',
      folders: [
        {
          id: 'cardiology',
          name: 'Cardiology',
          lectures: [
            { id: 'card-1', name: 'Heart Failure', content: 'Heart failure content coming soon...' },
            { id: 'card-2', name: 'Coronary Artery Disease', content: 'CAD content coming soon...' },
            { id: 'card-3', name: 'Arrhythmias', content: 'Arrhythmias content coming soon...' },
            { id: 'card-4', name: 'Hypertension', content: 'Hypertension content coming soon...' },
            { id: 'card-5', name: 'Chest Pain', content: 'Chest pain evaluation flowchart and approach...' },
          ]
        },
        {
          id: 'endocrinology',
          name: 'Endocrinology',
          lectures: [
            { id: 'endo-1', name: 'Diabetes Mellitus', content: 'Diabetes content coming soon...' },
            { id: 'endo-2', name: 'Thyroid Disorders', content: 'Thyroid content coming soon...' },
            { id: 'endo-3', name: 'Adrenal Disorders', content: 'Adrenal content coming soon...' },
          ]
        },
        {
          id: 'gastroenterology',
          name: 'Gastroenterology',
          lectures: [
            { id: 'gastro-1', name: 'Peptic Ulcer Disease', content: 'PUD content coming soon...' },
            { id: 'gastro-2', name: 'Inflammatory Bowel Disease', content: 'IBD content coming soon...' },
            { id: 'gastro-3', name: 'Liver Disease', content: 'Liver disease content coming soon...' },
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
          lectures: [
            { id: 'gen-1', name: 'Appendicitis', content: 'Appendicitis content coming soon...' },
            { id: 'gen-2', name: 'Hernia', content: 'Hernia content coming soon...' },
            { id: 'gen-3', name: 'Gallbladder Disease', content: 'Gallbladder content coming soon...' },
          ]
        },
        {
          id: 'orthopedics',
          name: 'Orthopedics',
          lectures: [
            { id: 'ortho-1', name: 'Fractures', content: 'Fractures content coming soon...' },
            { id: 'ortho-2', name: 'Joint Disorders', content: 'Joint disorders content coming soon...' },
            { id: 'ortho-3', name: 'Spine Surgery', content: 'Spine surgery content coming soon...' },
          ]
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
          lectures: [
            { id: 'ped-1', name: 'Growth and Development', content: 'Growth content coming soon...' },
            { id: 'ped-2', name: 'Immunization', content: 'Immunization content coming soon...' },
            { id: 'ped-3', name: 'Common Infections', content: 'Infections content coming soon...' },
          ]
        },
        {
          id: 'neonatology',
          name: 'Neonatology',
          lectures: [
            { id: 'neo-1', name: 'Prematurity', content: 'Prematurity content coming soon...' },
            { id: 'neo-2', name: 'Neonatal Jaundice', content: 'Jaundice content coming soon...' },
            { id: 'neo-3', name: 'Respiratory Distress', content: 'Respiratory distress content coming soon...' },
          ]
        }
      ]
    }
  ];

  // Check authentication only (allow all authenticated users)
  if (!isLoading && !user) {
    router.push('/login');
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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Same design as dashboard */}
      <div 
        className={`bg-[#1E2A38] text-white flex flex-col transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-16'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center border-b border-gray-700">
          <div className={`flex items-center ${isOpen ? 'px-4' : 'justify-center w-full'}`}>
            <div className="w-8 h-8 flex items-center justify-center">
              <Image 
                src="/images/logo.png" 
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
      <div className="flex-1 flex flex-col">
                 {/* Header */}
         <header className="bg-[#3A8431] shadow-md h-16 flex items-center justify-between px-6">
           <button 
             onClick={() => setIsOpen(!isOpen)}
             className="text-white hover:text-gray-200 transition-colors duration-300 p-2 rounded-lg hover:bg-white/10"
           >
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
             </svg>
           </button>
           <h1 className="text-xl font-semibold text-white">Approach</h1>
           <div className="w-6"></div>
         </header>

                 {/* Main Content */}
         <main className="flex-1 p-6 overflow-hidden">
           {selectedContent && selectedContent.lecture ? (
             <div className="h-full bg-white border-2 border-green-500 rounded-lg overflow-hidden">
               {selectedContent.lecture.id === 'card-5' ? (
                 // Render Chest Pain flowchart directly as component
                 <ChestPainFlowchart />
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
             <div className="h-full bg-white border-2 border-green-500 rounded-lg flex items-center justify-center">
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
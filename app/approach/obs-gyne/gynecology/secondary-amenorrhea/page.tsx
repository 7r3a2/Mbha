import React, { useRef, useState } from "react";
import Head from "next/head";

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

// Finding/Assessment box component (Light Green)
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

// Diagnosis box component (Yellow)
const DiagnosisBox = ({ title, style = {} }: { title: string; style?: React.CSSProperties }) => (
  <div 
    className="bg-yellow-200 border-2 border-yellow-400 px-4 py-3 text-center rounded-lg shadow-md text-sm font-medium text-gray-800"
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
    className="bg-blue-100 border-2 border-blue-400 px-4 py-3 text-center rounded-lg shadow-md text-sm font-medium text-gray-800"
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

// Assessment/Test box component (Light Purple)
const AssessmentBox = ({ title, style = {} }: { title: string; style?: React.CSSProperties }) => (
  <div 
    className="bg-purple-100 border-2 border-purple-400 px-4 py-3 text-center rounded-lg shadow-md text-sm font-medium text-gray-800"
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

// Connecting line components
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

const SecondaryAmenorrheaFlowchart = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ 
        x: e.touches[0].clientX - pan.x, 
        y: e.touches[0].clientY - pan.y 
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    e.preventDefault();
    setPan({ 
      x: e.touches[0].clientX - dragStart.x, 
      y: e.touches[0].clientY - dragStart.y 
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <>
      <Head>
        <title>Secondary Amenorrhea Flowchart</title>
        <meta name="description" content="Interactive flowchart for diagnosing secondary amenorrhea" />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <h1 className="text-2xl font-bold text-blue-600 pt-8 pb-4 pl-8">Secondary Amenorrhea</h1>
        <div 
          ref={containerRef}
          className="w-full h-screen overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className="relative"
            style={{
              width: '3000px',
              height: '2500px',
              transform: `translate(${pan.x}px, ${pan.y}px)`,
              transition: 'transform 0.1s ease-out',
            }}
          >
            {/* Start Point */}
            <FindingBox 
              title="> 3 Months of No Menses With Prior Regular Cycle" 
              style={{ position: 'absolute', left: '550px', top: '100px', width: '400px' }} 
            />

          {/* Main vertical line from start to hCG test */}
          <VerticalLine x={750} startY={160} endY={210} />
          <ArrowHead x={750} y={210} direction="down" />

          {/* hCG Test */}
          <AssessmentBox 
            title="Qualitative hCG test" 
            style={{ position: 'absolute', left: '650px', top: '210px', width: '200px' }} 
          />

          {/* hCG branches - separate left and right */}
          <VerticalLine x={750} startY={270} endY={320} />
          <HorizontalLine y={320} startX={300} endX={1200} />

          {/* RIGHT SIDE: Positive hCG - Pregnancy */}
          <VerticalLine x={1200} startY={320} endY={370} />
          <ArrowHead x={1200} y={370} direction="down" />
          <div style={{ 
            position: 'absolute', 
            left: '1185px', 
            top: '325px', 
            width: '30px', 
            height: '30px', 
            borderRadius: '50%', 
            backgroundColor: 'white', 
            border: '2px solid #374151', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '16px', 
            fontWeight: 'bold', 
            color: 'black',
            zIndex: 15
          }}>+</div>
          
          <DiagnosisBox 
            title="Pregnancy" 
            style={{ position: 'absolute', left: '1150px', top: '370px', width: '100px' }} 
          />

          <VerticalLine x={1200} startY={430} endY={480} />
          <ArrowHead x={1200} y={480} direction="down" />
          <TreatmentBox 
            title="Discuss desired next steps with patient" 
            style={{ position: 'absolute', left: '1100px', top: '480px', width: '200px' }} 
          />

          {/* LEFT SIDE: Negative hCG - Continue workup */}
          <VerticalLine x={300} startY={320} endY={370} />
          <ArrowHead x={300} y={370} direction="down" />
          <div style={{ 
            position: 'absolute', 
            left: '285px', 
            top: '325px', 
            width: '30px', 
            height: '30px', 
            borderRadius: '50%', 
            backgroundColor: 'white', 
            border: '2px solid #374151', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '16px', 
            fontWeight: 'bold', 
            color: 'black',
            zIndex: 15
          }}>-</div>
          
          <AssessmentBox 
            title="FSH, TSH, prolactin testing" 
            style={{ position: 'absolute', left: '200px', top: '370px', width: '200px' }} 
          />

          {/* Hormone testing branches from left side - 4 parts with large spacing */}
          <VerticalLine x={300} startY={430} endY={480} />
          <HorizontalLine y={480} startX={100} endX={1000} />

          {/* LEFT PART: Normal FSH, TSH, prolactin */}
          <VerticalLine x={100} startY={480} endY={530} />
          <ArrowHead x={100} y={530} direction="down" />
          <FindingBox 
            title="Normal FSH, TSH, prolactin" 
            style={{ position: 'absolute', left: '20px', top: '530px', width: '160px' }} 
          />

          {/* CENTER-LEFT: High FSH */}
          <VerticalLine x={350} startY={480} endY={530} />
          <ArrowHead x={350} y={530} direction="down" />
          <FindingBox 
            title="↑ FSH" 
            style={{ position: 'absolute', left: '310px', top: '530px', width: '80px' }} 
          />

          {/* CENTER-RIGHT: High TSH */}
          <VerticalLine x={600} startY={480} endY={530} />
          <ArrowHead x={600} y={530} direction="down" />
          <FindingBox 
            title="↑ TSH" 
            style={{ position: 'absolute', left: '560px', top: '530px', width: '80px' }} 
          />

          {/* RIGHT PART: High Prolactin */}
          <VerticalLine x={1000} startY={480} endY={530} />
          <ArrowHead x={1000} y={530} direction="down" />
          <FindingBox 
            title="↑ Prolactin" 
            style={{ position: 'absolute', left: '950px', top: '530px', width: '100px' }} 
          />

          {/* LEFT PART: Normal FSH, TSH, prolactin pathway */}
          <VerticalLine x={100} startY={590} endY={640} />
          <ArrowHead x={100} y={640} direction="down" />
          <AssessmentBox 
            title="Progestin challenge" 
            style={{ position: 'absolute', left: '20px', top: '640px', width: '160px' }} 
          />

          {/* Progestin challenge down to Withdrawal bleed */}
          <VerticalLine x={100} startY={700} endY={750} />
          <ArrowHead x={100} y={750} direction="down" />
          <FindingBox 
            title="Withdrawal bleed" 
            style={{ position: 'absolute', left: '40px', top: '750px', width: '120px' }} 
          />

          {/* Withdrawal bleed branches */}
          <VerticalLine x={100} startY={810} endY={860} />
          <HorizontalLine y={860} startX={50} endX={200} />

          {/* Withdrawal bleed branches */}
          <VerticalLine x={100} startY={810} endY={860} />
          <HorizontalLine y={860} startX={-67} endX={300} />

          {/* LEFT SIDE: Withdrawal bleed + */}
          <VerticalLine x={-67} startY={860} endY={920} />
          <ArrowHead x={-67} y={920} direction="down" />
          <div style={{ 
            position: 'absolute', 
            left: '-82px', 
            top: '865px', 
            width: '30px', 
            height: '30px', 
            borderRadius: '50%', 
            backgroundColor: 'white', 
            border: '2px solid #374151', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '16px', 
            fontWeight: 'bold', 
            color: 'black',
            zIndex: 15
          }}>+</div>
          <FindingBox 
            title="Obese or clinical hyperandrogenism⁴" 
            style={{ position: 'absolute', left: '-142px', top: '920px', width: '150px' }} 
          />

          {/* Obesity/hyperandrogenism pathway */}
          <VerticalLine x={-67} startY={980} endY={1080} />
          <ArrowHead x={-67} y={1080} direction="down" />
          <AssessmentBox 
            title="17-OHP, 24-hour urine cortisol, testosterone, DHEA-S" 
            style={{ position: 'absolute', left: '-142px', top: '1080px', width: '150px' }} 
          />

          {/* Direct connection to hormone test result branches */}
          <VerticalLine x={-67} startY={1180} endY={1320} />
          <HorizontalLine y={1320} startX={-180} endX={45} />

          {/* PCOS pathway (left) */}
          <VerticalLine x={-180} startY={1320} endY={1430} />
          <ArrowHead x={-180} y={1430} direction="down" />
          <FindingBox 
            title="↑ Testosterone and DHEA-S, normal 17-OHP and 24-hour urine cortisol" 
            style={{ position: 'absolute', left: '-255px', top: '1430px', width: '180px' }} 
          />

          <VerticalLine x={-180} startY={1520} endY={1600} />
          <ArrowHead x={-180} y={1600} direction="down" />
          <DiagnosisBox 
            title="PCOS⁸" 
            style={{ position: 'absolute', left: '-205px', top: '1600px', width: '80px' }} 
          />

          <VerticalLine x={-180} startY={1660} endY={1780} />
          <ArrowHead x={-180} y={1780} direction="down" />
          <TreatmentBox 
            title="OCP, ovulation induction for fertility" 
            style={{ position: 'absolute', left: '-240px', top: '1780px', width: '150px' }} 
          />

          {/* Adrenal Disease pathway (right) */}
          <VerticalLine x={45} startY={1320} endY={1380} />
          <ArrowHead x={45} y={1380} direction="down" />
          <FindingBox 
            title="↑ Testosterone DHEA-S, 17-OHP, and 24-hour urine cortisol" 
            style={{ position: 'absolute', left: '-25px', top: '1380px', width: '170px' }} 
          />

          <VerticalLine x={45} startY={1470} endY={1600} />
          <ArrowHead x={45} y={1600} direction="down" />
          <DiagnosisBox 
            title="Adrenal Disease⁷" 
            style={{ position: 'absolute', left: '5px', top: '1600px', width: '80px' }} 
          />

          <VerticalLine x={45} startY={1660} endY={1780} />
          <ArrowHead x={45} y={1780} direction="down" />
          <TreatmentBox 
            title="Identify and treat cause" 
            style={{ position: 'absolute', left: '-15px', top: '1780px', width: '120px' }} 
          />

          {/* RIGHT SIDE: Withdrawal bleed - */}
          <VerticalLine x={300} startY={860} endY={920} />
          <ArrowHead x={300} y={920} direction="down" />
          <div style={{ 
            position: 'absolute', 
            left: '285px', 
            top: '865px', 
            width: '30px', 
            height: '30px', 
            borderRadius: '50%', 
            backgroundColor: 'white', 
            border: '2px solid #374151', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '16px', 
            fontWeight: 'bold', 
            color: 'black',
            zIndex: 15
          }}>-</div>
          <AssessmentBox 
            title="Estrogen/progestin challenge" 
            style={{ position: 'absolute', left: '230px', top: '920px', width: '140px' }} 
          />

          <VerticalLine x={300} startY={980} endY={1040} />
          <ArrowHead x={300} y={1040} direction="down" />
          <AssessmentBox 
            title="Withdrawal bleed" 
            style={{ position: 'absolute', left: '250px', top: '1040px', width: '100px' }} 
          />

          {/* Withdrawal bleed branches */}
          <VerticalLine x={300} startY={1100} endY={1160} />
          <HorizontalLine y={1160} startX={260} endX={400} />

          {/* Withdrawal bleed + (Functional Hypothalamic Amenorrhea) */}
          <VerticalLine x={260} startY={1160} endY={1220} />
          <ArrowHead x={260} y={1220} direction="down" />
          <div style={{ 
            position: 'absolute', 
            left: '245px', 
            top: '1165px', 
            width: '30px', 
            height: '30px', 
            borderRadius: '50%', 
            backgroundColor: 'white', 
            border: '2px solid #374151', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '16px', 
            fontWeight: 'bold', 
            color: 'black',
            zIndex: 15
          }}>+</div>
          <DiagnosisBox 
            title="Functional Hypothalamic Amenorrhea⁶" 
            style={{ position: 'absolute', left: '180px', top: '1220px', width: '160px' }} 
          />

          <VerticalLine x={260} startY={1300} endY={1340} />
          <ArrowHead x={260} y={1340} direction="down" />
          <TreatmentBox 
            title="Lifestyle changes, GnRH agonists" 
            style={{ position: 'absolute', left: '180px', top: '1340px', width: '160px' }} 
          />

          {/* Withdrawal bleed - (Asherman Syndrome) */}
          <VerticalLine x={400} startY={1160} endY={1220} />
          <ArrowHead x={400} y={1220} direction="down" />
          <div style={{ 
            position: 'absolute', 
            left: '385px', 
            top: '1165px', 
            width: '30px', 
            height: '30px', 
            borderRadius: '50%', 
            backgroundColor: 'white', 
            border: '2px solid #6b7280', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '16px', 
            fontWeight: 'bold', 
            color: 'black',
            zIndex: 15
          }}>-</div>
          <DiagnosisBox 
            title="Asherman Syndrome" 
            style={{ position: 'absolute', left: '360px', top: '1220px', width: '80px' }} 
          />

          <VerticalLine x={400} startY={1280} endY={1340} />
          <ArrowHead x={400} y={1340} direction="down" />
          <TreatmentBox 
            title="Surgery" 
            style={{ position: 'absolute', left: '360px', top: '1340px', width: '80px' }} 
          />

          {/* CENTER-LEFT: High FSH pathway */}
          <VerticalLine x={350} startY={590} endY={640} />
          <ArrowHead x={350} y={640} direction="down" />
          <DiagnosisBox 
            title="Hypergonadotrophic Hypogonadism¹" 
            style={{ position: 'absolute', left: '250px', top: '640px', width: '200px' }} 
          />

          <VerticalLine x={350} startY={700} endY={750} />
          <ArrowHead x={350} y={750} direction="down" />
          <TreatmentBox 
            title="OCP, HRT² (primary ovarian insufficiency)" 
            style={{ position: 'absolute', left: '250px', top: '750px', width: '200px' }} 
          />

          {/* CENTER-RIGHT: High TSH pathway */}
          <VerticalLine x={600} startY={590} endY={640} />
          <ArrowHead x={600} y={640} direction="down" />
          <DiagnosisBox 
            title="Hypothyroidism" 
            style={{ position: 'absolute', left: '540px', top: '640px', width: '120px' }} 
          />

          <VerticalLine x={600} startY={700} endY={750} />
          <ArrowHead x={600} y={750} direction="down" />
          <TreatmentBox 
            title="Levothyroxine" 
            style={{ position: 'absolute', left: '550px', top: '750px', width: '100px' }} 
          />

          {/* RIGHT PART: High Prolactin pathway */}
          <VerticalLine x={1000} startY={590} endY={640} />
          <ArrowHead x={1000} y={640} direction="down" />
          <AssessmentBox 
            title="Medication history" 
            style={{ position: 'absolute', left: '930px', top: '640px', width: '140px' }} 
          />

          {/* Medication history - direct to No known medication exposure */}
          <VerticalLine x={1000} startY={700} endY={750} />
          <ArrowHead x={1000} y={750} direction="down" />

          {/* No known medication exposure */}
          <FindingBox 
            title="No known medication exposure³" 
            style={{ position: 'absolute', left: '900px', top: '750px', width: '200px' }} 
          />

          <VerticalLine x={1000} startY={810} endY={860} />
          <ArrowHead x={1000} y={860} direction="down" />
          <AssessmentBox 
            title="MRI" 
            style={{ position: 'absolute', left: '970px', top: '860px', width: '60px' }} 
          />

          <VerticalLine x={1000} startY={920} endY={970} />
          <ArrowHead x={1000} y={970} direction="down" />
          <div style={{ 
            position: 'absolute', 
            left: '930px', 
            top: '970px', 
            width: '140px', 
            height: '80px',
            backgroundColor: '#f5f5f5', 
            border: '2px dashed #999',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontStyle: 'italic',
            color: '#666'
          }}>
            Placeholder for Image
          </div>

          <VerticalLine x={1000} startY={1050} endY={1100} />
          <ArrowHead x={1000} y={1100} direction="down" />
          <DiagnosisBox 
            title="Hypothalamic Pituitary Lesion⁵" 
            style={{ position: 'absolute', left: '900px', top: '1100px', width: '200px' }} 
          />

          <VerticalLine x={1000} startY={1160} endY={1210} />
          <ArrowHead x={1000} y={1210} direction="down" />
          <TreatmentBox 
            title="Dopamine agonists (prolactinoma), possible surgical resection" 
            style={{ position: 'absolute', left: '880px', top: '1210px', width: '240px' }} 
          />
          {/* Footnotes */}
          <div style={{ 
            position: 'absolute', 
            left: '200px', 
            top: '1500px', 
            fontSize: '14px', 
            lineHeight: '1.6',
            maxWidth: '800px',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #ccc'
          }}>
            <h4 className="font-bold mb-2">Footnotes</h4>
            <p className="mb-2">
              ¹ Possible causes: Primary ovarian insufficiency, menopause.
            </p>
            <p className="mb-2">
              ² Hormone replacement therapy.
            </p>
            <p className="mb-2">
              ³ Oral contraceptives, antipsychotics, and chemotherapeutic drugs are some medications that may cause drug-induced hyperprolactinemia.
            </p>
            <p className="mb-2">
              ⁴ Features can include hirsutism, acne, male pattern balding, virilization.
            </p>
            <p className="mb-2">
              ⁵ Possible causes: Prolactinoma (most common), Sheehan syndrome, pituitary adenoma, craniopharyngioma.
            </p>
            <p className="mb-2">
              ⁶ Form of hypogonadotropic hypogonadism.
            </p>
            <p className="mb-2">
              ⁷ Possible causes: Congenital adrenal hyperplasia, androgen-secreting tumors, Cushing's syndrome.
            </p>
            <p>
              ⁸ Polycystic ovarian syndrome.
            </p>
          </div>

          {/* Definition */}
          <div style={{ 
            position: 'absolute', 
            left: '1050px', 
            top: '1500px', 
            fontSize: '14px', 
            lineHeight: '1.6',
            maxWidth: '400px',
            backgroundColor: '#f0f8ff',
            padding: '20px',
            borderRadius: '8px',
            border: '2px solid #4682b4'
          }}>
            <h4 className="font-bold mb-2">Definition</h4>
            <p>
              Secondary amenorrhea is defined as the absence of menses for more than 3 months in women with previously regular cycles.
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default SecondaryAmenorrheaFlowchart;

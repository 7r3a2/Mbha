'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';

function CoursePageContent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect all users away from courses page
  useEffect(() => {
    if (!isLoading) {
      router.push('/dashboard');
    }
  }, [isLoading, router]);
  const searchParams = useSearchParams();
  
  const [courseId, setCourseId] = useState('obs-gyne');
  const [selectedLecture, setSelectedLecture] = useState('lecture-1');
  const [completedLectures, setCompletedLectures] = useState<Set<string>>(new Set());
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set(['subject-1']));
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // Helper function to convert duration string to seconds
  const durationToSeconds = (duration: string) => {
    const parts = duration.split(':');
    if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    return 0;
  };

  // Helper function to generate realistic part timestamps
  const generatePartTimestamps = (duration: string, partTitles: string[]) => {
    const totalSeconds = durationToSeconds(duration);
    const parts = [];
    
    for (let i = 0; i < partTitles.length; i++) {
      let time;
      if (i === 0) {
        time = 0; // First part always starts at 0
      } else if (i === partTitles.length - 1) {
        time = Math.max(totalSeconds - 30, totalSeconds * 0.8); // Last part near the end
      } else {
        // Distribute parts evenly across the video
        const progress = i / (partTitles.length - 1);
        time = Math.floor(totalSeconds * progress * 0.8); // Use 80% of video for parts
      }
      parts.push({ id: `part-${i + 1}`, title: partTitles[i], time });
    }
    
    return parts;
  };

  // Get course from URL
  useEffect(() => {
    if (searchParams) {
      const course = searchParams.get('course');
      if (course) {
        setCourseId(course);
      }
    }
  }, [searchParams]);

  // Course data with comprehensive structure like Qbank
  const courses = {
    'obs-gyne': {
      title: 'Obs & Gyne',
      subjects: [
        {
          id: 'basic-pregnancy',
          title: 'Basic sign and normal pregnancy',
          lectures: [
            { 
              id: 'lecture-1', 
              name: 'Physiological changes in pregnancy', 
              video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 
              duration: '15:32',
              parts: generatePartTimestamps('15:32', [
                'Introduction',
                'Cardiovascular Changes', 
                'Respiratory Changes',
                'Renal Changes',
                'Summary'
              ])
            },
            { 
              id: 'lecture-2', 
              name: 'Anatomy and embryology', 
              video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', 
              duration: '18:15',
              parts: generatePartTimestamps('18:15', [
                'Introduction',
                'Embryonic Development',
                'Fetal Development',
                'Placental Anatomy',
                'Clinical Correlations'
              ])
            }
          ]
        },
        {
          id: 'maternal-medicine',
          title: 'Maternal Medicine',
          lectures: [
            { 
              id: 'lecture-3', 
              name: 'D.M. in pregnancy', 
              video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', 
              duration: '22:54',
              parts: generatePartTimestamps('22:54', [
                'Introduction',
                'Gestational Diabetes',
                'Pre-existing Diabetes',
                'Management',
                'Complications'
              ])
            },
            { 
              id: 'lecture-4', 
              name: 'Hypertensive disorder in pregnancy', 
              video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', 
              duration: '20:02',
              parts: generatePartTimestamps('20:02', [
                'Introduction',
                'Preeclampsia',
                'Eclampsia',
                'HELLP Syndrome',
                'Management'
              ])
            },
            { 
              id: 'lecture-5', 
              name: 'Heart disease in pregnancy', 
              video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 
              duration: '25:18',
              parts: generatePartTimestamps('25:18', [
                'Introduction',
                'Congenital Heart Disease',
                'Acquired Heart Disease',
                'Risk Assessment',
                'Management'
              ])
            }
          ]
        },
        {
          id: 'birth-labour',
          title: 'Birth & labour',
          lectures: [
            { 
              id: 'lecture-6', 
              name: 'Normal Labour', 
              video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 
              duration: '28:45',
              parts: generatePartTimestamps('28:45', [
                'Introduction',
                'Stages of Labour',
                'Mechanisms of Labour',
                'Pain Management',
                'Delivery'
              ])
            },
            { 
              id: 'lecture-7', 
              name: 'Abnormal labor', 
              video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', 
              duration: '24:30',
              parts: generatePartTimestamps('24:30', [
                'Introduction',
                'Prolonged Labour',
                'Obstructed Labour',
                'Interventions',
                'Complications'
              ])
            }
          ]
        },
        {
          id: 'early-pregnancy',
          title: 'Early pregnancy problem',
          lectures: [
            { 
              id: 'lecture-8', 
              name: 'Ectopic pregnancy', 
              video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', 
              duration: '21:15',
              parts: generatePartTimestamps('21:15', [
                'Introduction',
                'Risk Factors',
                'Clinical Presentation',
                'Diagnosis',
                'Management'
              ])
            },
            { 
              id: 'lecture-9', 
              name: 'Miscarriage', 
              video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', 
              duration: '19:20',
              parts: generatePartTimestamps('19:20', [
                'Introduction',
                'Types of Miscarriage',
                'Causes',
                'Management',
                'Prevention'
              ])
            }
          ]
        }
      ]
    },
    'pediatrics': {
      title: 'Pediatrics',
      subjects: [
        {
          id: 'subject-1',
          title: 'Child Development',
          lectures: [
            { 
              id: 'lecture-1', 
              name: 'Child Development', 
              video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 
              duration: '24:20',
              parts: generatePartTimestamps('24:20', [
                'Introduction',
                'Physical Development',
                'Cognitive Development',
                'Social Development',
                'Summary'
              ])
            }
          ]
        },
        {
          id: 'subject-2',
          title: 'Clinical Pediatrics',
          lectures: [
            { 
              id: 'lecture-2', 
              name: 'Pediatric Assessment', 
              video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 
              duration: '26:45',
              parts: generatePartTimestamps('26:45', [
                'Introduction',
                'History Taking',
                'Physical Examination',
                'Assessment Tools',
                'Summary'
              ])
            },
            { 
              id: 'lecture-3', 
              name: 'Emergency Care', 
              video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', 
              duration: '21:15',
              parts: generatePartTimestamps('21:15', [
                'Introduction',
                'Emergency Assessment',
                'Common Emergencies',
                'Treatment Protocols',
                'Summary'
              ])
            }
          ]
        }
      ]
    },
    'internal-medicine': {
      title: 'Internal Medicine',
      subjects: [
        {
          id: 'subject-1',
          title: 'Cardiology',
          lectures: [
            { 
              id: 'lecture-1', 
              name: 'Heart Failure', 
              video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', 
              duration: '28:30',
              parts: generatePartTimestamps('28:30', [
                'Introduction',
                'Pathophysiology',
                'Clinical Presentation',
                'Management',
                'Summary'
              ])
            },
            { 
              id: 'lecture-2', 
              name: 'Coronary Artery Disease', 
              video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', 
              duration: '32:15',
              parts: generatePartTimestamps('32:15', [
                'Introduction',
                'Risk Factors',
                'Diagnosis',
                'Treatment',
                'Summary'
              ])
            }
          ]
        },
        {
          id: 'subject-2',
          title: 'Endocrinology',
          lectures: [
            { 
              id: 'lecture-3', 
              name: 'Diabetes Management', 
              video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 
              duration: '35:40',
              parts: generatePartTimestamps('35:40', [
                'Introduction',
                'Types of Diabetes',
                'Complications',
                'Management',
                'Summary'
              ])
            }
          ]
        }
      ]
    },
    'surgery': {
      title: 'Surgery',
      subjects: [
        {
          id: 'subject-1',
          title: 'General Surgery',
          lectures: [
            { 
              id: 'lecture-1', 
              name: 'Surgical Principles', 
              video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', 
              duration: '30:15',
              parts: generatePartTimestamps('30:15', [
                'Introduction',
                'Surgical Techniques',
                'Sterilization',
                'Safety Protocols',
                'Summary'
              ])
            },
            { 
              id: 'lecture-2', 
              name: 'Preoperative Care', 
              video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', 
              duration: '26:30',
              parts: generatePartTimestamps('26:30', [
                'Introduction',
                'Patient Assessment',
                'Preoperative Preparation',
                'Risk Assessment',
                'Summary'
              ])
            }
          ]
        },
        {
          id: 'subject-2',
          title: 'Emergency Surgery',
          lectures: [
            { 
              id: 'lecture-3', 
              name: 'Trauma Management', 
              video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', 
              duration: '38:45',
              parts: generatePartTimestamps('38:45', [
                'Introduction',
                'Trauma Assessment',
                'Resuscitation',
                'Definitive Care',
                'Summary'
              ])
            }
          ]
        }
      ]
    }
  };

  const currentCourse = courses[courseId as keyof typeof courses] || courses['obs-gyne'];
  
  // Find current lecture
  let currentLecture = null;
  for (const subject of currentCourse.subjects) {
    const lecture = subject.lectures.find(l => l.id === selectedLecture);
    if (lecture) {
      currentLecture = lecture;
      break;
    }
  }

  // Check authentication
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

  const selectLecture = (lectureId: string) => {
    setSelectedLecture(lectureId);
  };

  const toggleLectureComplete = (lectureId: string) => {
    const newCompleted = new Set(completedLectures);
    if (newCompleted.has(lectureId)) {
      newCompleted.delete(lectureId);
    } else {
      newCompleted.add(lectureId);
    }
    setCompletedLectures(newCompleted);
  };

  const toggleSubject = (subjectId: string) => {
    const newExpanded = new Set(expandedSubjects);
    if (newExpanded.has(subjectId)) {
      newExpanded.delete(subjectId);
    } else {
      newExpanded.add(subjectId);
    }
    setExpandedSubjects(newExpanded);
  };

  const handleSidebarToggle = () => {
    setSidebarCollapsed(prev => !prev);
  };

  const seekTo = (time: number) => {
    if (videoRef.current) {
      try {
        videoRef.current.currentTime = time;
        videoRef.current.play().catch(() => {
          // Handle play error silently
        });
      } catch (error) {
        console.error('Error seeking video:', error);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const isCurrentLectureCompleted = completedLectures.has(selectedLecture);
  
  // Calculate total progress
  let totalLectures = 0;
  let completedCount = 0;
  for (const subject of currentCourse.subjects) {
    totalLectures += subject.lectures.length;
    for (const lecture of subject.lectures) {
      if (completedLectures.has(lecture.id)) {
        completedCount++;
      }
    }
  }
  const progressPercentage = totalLectures > 0 ? (completedCount / totalLectures) * 100 : 0;

  return (
    <div className="flex h-screen bg-gray-100">
             {/* Sidebar - Collapsible on Mobile */}
       <div className={`bg-[#1E2A38] text-white flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'} md:w-64`}>
                   {/* Logo - Same height as dashboard header */}
          <div className="h-16 flex items-center border-b border-gray-700">
            <div className="flex items-center px-4">
              <div className="w-8 h-8 flex items-center justify-center">
                <Image 
                  src="/images/logo.png" 
                  alt="MBHA Logo" 
                  width={32} 
                  height={32} 
                  className="w-8 h-8 object-contain"
                />
              </div>
              {!sidebarCollapsed && <span className="text-xl font-bold ml-3 text-white">MBHA</span>}
            </div>
          </div>

                 {/* Course Title */}
         <div className="py-4">
           <div className="flex items-center px-4 py-3 bg-[#3A8431] text-white mx-2 rounded-lg">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
             </svg>
             {!sidebarCollapsed && <span className="ml-3 font-medium text-sm">{currentCourse.title}</span>}
           </div>
         </div>

                 {/* Progress Bar - With Better Spacing */}
         <div className={`${sidebarCollapsed ? 'px-2' : 'px-4'} mb-6`}>
           {!sidebarCollapsed && (
             <div className="flex items-center justify-between mb-3">
               <span className="text-sm font-medium text-gray-300">Progress</span>
               <span className="text-xs text-gray-400">{completedCount}/{totalLectures}</span>
             </div>
           )}
           <div className="w-full bg-gray-600 rounded-full h-2 shadow-inner">
             <div 
               className="bg-[#3A8431] h-2 rounded-full transition-all duration-500 shadow-sm"
               style={{ width: `${progressPercentage}%` }}
             ></div>
           </div>
         </div>

        {/* Hierarchical Menu - Improved Design */}
        <nav className="flex-1 overflow-y-auto">
          <ul className={`space-y-3 ${sidebarCollapsed ? 'px-1' : 'px-3'} pt-2`}>
            {currentCourse.subjects.map((subject) => (
              <li key={subject.id}>
                                 <button
                   onClick={() => toggleSubject(subject.id)}
                   className={`flex items-center w-full transition-all duration-300 rounded-xl border ${sidebarCollapsed ? 'px-2 py-3 justify-center' : 'px-4 py-3'} ${
                     expandedSubjects.has(subject.id) 
                       ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-white border-gray-500 shadow-lg transform scale-[1.02]' 
                       : 'text-gray-300 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-650 hover:text-white border-gray-600 hover:border-gray-500 hover:shadow-md hover:transform hover:scale-[1.01]'
                   }`}
                 >
                   <div className="flex items-center justify-between w-full">
                     <div className="flex items-center">
                       {/* Subject Icon */}
                       <div className="w-2 h-2 bg-[#3A8431] rounded-full mr-3 flex-shrink-0"></div>
                       {!sidebarCollapsed && <span className="text-sm font-medium leading-tight">{subject.title}</span>}
                     </div>
                     {!sidebarCollapsed && (
                       <svg 
                         className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${
                           expandedSubjects.has(subject.id) ? 'rotate-90' : ''
                         }`} 
                         fill="none" 
                         stroke="currentColor" 
                         viewBox="0 0 24 24"
                       >
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                       </svg>
                     )}
                   </div>
                 </button>

                {/* Lectures - Enhanced Design */}
                <div className={`${sidebarCollapsed ? 'ml-0' : 'ml-4'} mt-2 space-y-2 transition-all duration-300 overflow-hidden ${
                  expandedSubjects.has(subject.id) ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <ul className="space-y-1">
                    {subject.lectures.map((lecture) => (
                      <li key={lecture.id}>
                                                 <button
                           onClick={() => selectLecture(lecture.id)}
                           className={`flex items-center w-full transition-all duration-300 rounded-lg border ${sidebarCollapsed ? 'px-2 py-2 justify-center' : 'px-3 py-2'} ${
                             selectedLecture === lecture.id 
                               ? 'bg-gradient-to-r from-[#3A8431] to-[#2d6a27] text-white border-[#3A8431] shadow-lg transform scale-[1.02]' 
                               : 'text-gray-400 hover:bg-gray-700 hover:text-white border-gray-700 hover:border-gray-600 hover:shadow-sm'
                           }`}
                         >
                           <div className="flex items-center justify-between w-full">
                             <div className="flex items-center min-w-0 flex-1">
                               <input
                                 type="checkbox"
                                 checked={completedLectures.has(lecture.id)}
                                 onChange={(e) => {
                                   e.stopPropagation();
                                   toggleLectureComplete(lecture.id);
                                 }}
                                 className="w-3 h-3 mr-3 text-[#3A8431] bg-gray-600 border-gray-500 rounded focus:ring-[#3A8431] focus:ring-1 flex-shrink-0"
                               />
                               {!sidebarCollapsed && <span className="text-xs leading-tight truncate">{lecture.name}</span>}
                             </div>
                             {!sidebarCollapsed && (
                               <span className={`text-xs font-mono flex-shrink-0 ml-2 ${
                                 selectedLecture === lecture.id ? 'text-white opacity-90' : 'text-gray-500'
                               }`}>
                                 {lecture.duration}
                               </span>
                             )}
                           </div>
                         </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile & Exit Button - Matching Dashboard */}
        <div className="border-t border-gray-700">
                     {/* User Profile */}
           <div className={`${sidebarCollapsed ? 'p-2' : 'p-4'}`}>
             <div className="flex items-center mb-3">
               <div className="w-8 h-8 bg-[#3A8431] rounded-full flex items-center justify-center">
                 <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                 </svg>
               </div>
               {!sidebarCollapsed && (
                 <div className="ml-3">
                   <p className="font-semibold text-white text-sm">
                     {user?.firstName} {user?.lastName}
                   </p>
                   <p className="text-xs text-gray-400">{user?.email}</p>
                 </div>
               )}
             </div>
           </div>
           
           {/* Exit Button - Separated */}
           <div className={`${sidebarCollapsed ? 'px-2' : 'px-4'} pb-4`}>
                         <button 
               onClick={handleExit}
               className={`w-full bg-red-600 text-white font-bold py-2 ${sidebarCollapsed ? 'px-2' : 'px-3'} rounded-lg hover:bg-red-700 transition-all duration-300 text-sm flex items-center justify-center`}
             >
               <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
               </svg>
               {!sidebarCollapsed && "Exit"}
             </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
                 {/* Header - Matching Dashboard Header Height and Style */}
         <header className="bg-[#3A8431] shadow-md h-16 flex items-center justify-between px-6">
           <button
             onClick={handleSidebarToggle}
             className="md:hidden p-2 text-white hover:bg-[#2d6a27] rounded-lg transition-colors duration-200"
           >
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
             </svg>
           </button>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-lg font-semibold text-white">{currentLecture?.name}</h1>
              <p className="text-xs text-gray-200">Duration: {currentLecture?.duration}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => toggleLectureComplete(selectedLecture)}
              className={`flex items-center px-3 py-1 rounded-lg font-medium transition-colors text-sm ${
                isCurrentLectureCompleted
                  ? 'bg-green-100 text-green-800'
                  : 'bg-white text-[#3A8431] hover:bg-gray-100'
              }`}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {isCurrentLectureCompleted ? 'Done' : 'Mark Complete'}
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="w-full max-w-7xl mx-auto">
            {/* Video Player */}
            <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg mb-6">
              <video 
                ref={videoRef}
                className="w-full h-full" 
                controls
                src={currentLecture?.video}
                onError={(e) => {
                  console.error('Video error:', e);
                }}
              >
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Lecture Parts - Improved Design */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="bg-[#3A8431] p-3 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Lecture Parts</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentLecture?.parts.map((part, index) => (
                  <button
                    key={part.id}
                    onClick={() => seekTo(part.time)}
                    className="bg-white p-4 rounded-xl border-2 border-gray-200 hover:border-[#3A8431] hover:shadow-lg transition-all duration-300 text-left group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="bg-[#3A8431] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className="text-sm text-gray-500 font-mono bg-gray-100 px-3 py-1 rounded-lg">
                        {formatTime(part.time)}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-base text-gray-800 group-hover:text-[#3A8431] transition-colors block">
                        {part.title}
                      </span>
                      <div className="flex items-center text-sm text-gray-500 mt-2">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Click to jump to this part
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function CoursePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CoursePageContent />
    </Suspense>
  );
} 
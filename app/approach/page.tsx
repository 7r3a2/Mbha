'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';

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
         </main>
      </div>
    </div>
  );
} 
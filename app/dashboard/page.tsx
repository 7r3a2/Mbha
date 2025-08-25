'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Debug: Log user permissions
  useEffect(() => {
    if (user) {
      console.log('🔍 Dashboard - User permissions:', {
        email: user.email,
        hasApproachAccess: user.hasApproachAccess,
        hasQbankAccess: user.hasQbankAccess,
        hasCoursesAccess: user.hasCoursesAccess,
        hasWizaryExamAccess: user.hasWizaryExamAccess,
        uniqueCode: user.uniqueCode
      });
    }
  }, [user]);

  const courses = [
    {
      id: 1,
      title: 'Internal Medicine',
      image: '/images/internal med course.png',
      progress: 45,
      courseId: 'internal-medicine'
    },
    {
      id: 2,
      title: 'Surgery',
      image: '/images/surgery course.png',
      progress: 75,
      courseId: 'surgery'
    },
    {
      id: 3,
      title: 'Obs & Gyne',
      image: '/images/gyne course.png',
      progress: 20,
      courseId: 'obs-gyne'
    },
    {
      id: 4,
      title: 'Pediatrics',
      image: '/images/PEDIATRICS course.png',
      progress: 60,
      courseId: 'pediatrics'
    }
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleQbankClick = () => {
    window.location.href = '/qbank';
  };

  const handleWizaryExamClick = () => {
    window.location.href = '/wizary-exam';
  };

  const handleApproachClick = () => {
    window.location.href = '/approach';
  };

  const handleResumeClick = (courseId: string) => {
    window.location.href = `/course?course=${courseId}`;
  };



  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-100 items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
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
                src="/images/logo lander.png" 
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
        <nav className="flex-1 py-4 overflow-hidden">
          <ul className="space-y-2 px-2">
            {/* Courses - Admin Only */}
            {user?.hasCoursesAccess && (user?.uniqueCode === 'ADMIN' || user?.email?.includes('admin')) && (
              <li>
                <button className={`flex items-center w-full transition-all duration-300 rounded-lg ${
                  isOpen ? 'px-4 py-3' : 'justify-center p-3'
                } bg-[#3A8431] text-white`}>
                  <svg className={`${isOpen ? 'w-5 h-5' : 'w-6 h-6'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {isOpen && <span className="ml-3 font-medium text-sm">Courses</span>}
                </button>
              </li>
            )}

            {/* Qbank */}
            {user?.hasQbankAccess && (
              <li>
                <button 
                  onClick={handleQbankClick}
                  className={`flex items-center w-full transition-all duration-300 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg ${
                    isOpen ? 'px-4 py-3' : 'justify-center p-3'
                  }`}>
                  <svg className={`${isOpen ? 'w-5 h-5' : 'w-6 h-6'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {isOpen && <span className="ml-3 font-medium text-sm">Qbank</span>}
                </button>
              </li>
            )}

            {/* Wizary Exam - Always Available */}
            <li>
              <button 
                onClick={handleWizaryExamClick}
                className={`flex items-center w-full transition-all duration-300 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg ${
                  isOpen ? 'px-4 py-3' : 'justify-center p-3'
                }`}>
                <svg className={`${isOpen ? 'w-5 h-5' : 'w-6 h-6'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {isOpen && <span className="ml-3 font-medium text-sm">Wizary Exam</span>}
              </button>
            </li>



            {/* Approach */}
            {user?.hasApproachAccess && (
              <li>
                <button 
                  onClick={handleApproachClick}
                  className={`flex items-center w-full transition-all duration-300 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg ${
                    isOpen ? 'px-4 py-3' : 'justify-center p-3'
                  }`}>
                  <svg className={`${isOpen ? 'w-5 h-5' : 'w-6 h-6'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  {isOpen && <span className="ml-3 font-medium text-sm">Approach</span>}
                </button>
              </li>
            )}
          </ul>
        </nav>

        {/* User Profile & Logout */}
        <div className="border-t border-gray-700">
          {/* Subscription Status */}
          {isOpen && (
            <div className="px-4 py-2 border-b border-gray-700">
              <div className="text-center">
                {(() => {
                  if (user?.trialActive && !user?.subscriptionActive && user?.trialEndsAt) {
                    const trialEnd = new Date(user.trialEndsAt);
                    return (
                      <div className="bg-blue-500/20 border border-blue-400 rounded-lg px-3 py-2">
                        <p className="text-xs font-medium text-blue-300">Free Trial</p>
                        <p className="text-xs text-blue-200">Until {trialEnd.toLocaleDateString()}</p>
                      </div>
                    );
                  }
                  if (user?.subscriptionActive && user?.subscriptionExpiresAt) {
                    const subEnd = new Date(user.subscriptionExpiresAt);
                    return (
                      <div className="bg-green-500/20 border border-green-400 rounded-lg px-3 py-2">
                        <p className="text-xs font-medium text-green-300">Subscribed</p>
                        <p className="text-xs text-green-200">Until {subEnd.toLocaleDateString()}</p>
                      </div>
                    );
                  }
                  return (
                    <div className="bg-gray-500/20 border border-gray-400 rounded-lg px-3 py-2">
                      <p className="text-xs font-medium text-gray-300">No Subscription</p>
                      <p className="text-xs text-gray-400">Basic Access Only</p>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

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
          
          {/* Logout Button - Separated */}
          <div className={`${isOpen ? 'px-4 pb-4' : 'px-2 pb-4'}`}>
            <button 
              onClick={handleLogout}
              className={`w-full bg-[#3A8431] text-white font-bold py-2 px-3 rounded-lg hover:bg-[#2d6a27] transition-all duration-300 text-sm flex items-center justify-center`}
            >
              {isOpen ? (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
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
          <h1 className="text-xl font-semibold text-white">My Courses</h1>
          <div className="w-6"></div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                 {/* Access Status Message */}
       {(!user?.hasApproachAccess && !user?.hasQbankAccess && !user?.hasCoursesAccess) && (
         <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
           <div className="flex">
             <div className="flex-shrink-0">
               <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                 <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
               </svg>
             </div>
             <div className="ml-3">
               <h3 className="text-sm font-medium text-yellow-800">
                 Basic Access
               </h3>
               <div className="mt-2 text-sm text-yellow-700">
                 <p>
                   You currently have Basic Access (Wizary Exam only). Get a subscription to unlock Full Access to all sections.
                 </p>
               </div>
             </div>
           </div>
         </div>
       )}
          
          {user?.hasCoursesAccess && (user?.uniqueCode === 'ADMIN' || user?.email?.includes('admin')) && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-xl shadow-lg border-2 border-green-500 overflow-hidden transform hover:scale-105 transition-all duration-300">
                {/* Course Image */}
                <div className="h-48 overflow-hidden">
                  <Image
                    src={course.image}
                    alt={course.title}
                    width={400}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Course Content */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">{course.title}</h3>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div 
                      className="bg-[#3A8431] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-bold text-[#3A8431]">{course.progress}%</span>
                  </div>
                  
                  {/* Resume Button */}
                  <button 
                    onClick={() => handleResumeClick(course.courseId)}
                    className="w-full bg-[#3A8431] text-white py-2 px-4 rounded-lg hover:bg-[#2d6a27] transition-colors duration-200 font-semibold"
                  >
                    Resume
                  </button>
                </div>
              </div>
            ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
} 
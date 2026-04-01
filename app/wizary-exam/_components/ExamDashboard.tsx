'use client';

import { wizaryExamStyles } from '../_lib/exam-styles';
import { subjects, BaghdadTime } from '../_lib/exam-types';
import { CurrentView } from '../_lib/exam-types';

interface ExamDashboardProps {
  user: any;
  currentView: CurrentView;
  setCurrentView: (view: CurrentView) => void;
  dashboardSidebarCollapsed: boolean;
  handleDashboardSidebarToggle: () => void;
  isMobile: boolean;
  handleBackToDashboard: () => void;
  selectedSubject: string;
  setSelectedSubject: (subject: string) => void;
  examMenuOpen: boolean;
  setExamMenuOpen: (open: boolean) => void;
  loadingExams: boolean;
  currentExams: any[];
  startExam: (exam: any) => void;
  startIndex: number;
  totalPages: number;
  currentPage: number;
  handlePageChange: (page: number) => void;
  getBaghdadTime: () => BaghdadTime;
}

export default function ExamDashboard({
  user,
  currentView,
  setCurrentView,
  dashboardSidebarCollapsed,
  handleDashboardSidebarToggle,
  isMobile,
  handleBackToDashboard,
  selectedSubject,
  setSelectedSubject,
  examMenuOpen,
  setExamMenuOpen,
  loadingExams,
  currentExams,
  startExam,
  startIndex,
  totalPages,
  currentPage,
  handlePageChange,
  getBaghdadTime,
}: ExamDashboardProps) {
  if (currentView === 'dashboard') {
    return (
      <div className="flex h-screen bg-gray-100 wizary-exam-page" style={{ minHeight: '100dvh' }}>
        <style dangerouslySetInnerHTML={{ __html: wizaryExamStyles }} />

        {/* Sidebar */}
        <div className={`bg-gray-800 text-white flex flex-col transition-all duration-300 ${dashboardSidebarCollapsed ? 'w-16' : 'w-64'}`}>
          {/* User Profile */}
          <div className="p-4 border-b border-gray-700">
            <div className={`flex items-center ${dashboardSidebarCollapsed ? 'justify-center' : 'space-x-3'}`}>
              <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-orange-600">
                  {user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : 'ف'}
                </span>
              </div>
              {!dashboardSidebarCollapsed && (
                <div>
                  <p className="text-sm font-medium text-white">{user ? `${user.firstName} ${user.lastName}` : 'اسم الطالب'}</p>
                  <p className="text-xs font-medium text-gray-300">{user?.email || 'ايميل الطالب'}</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4">
            <ul className={`space-y-2 ${dashboardSidebarCollapsed ? 'px-2' : 'px-4'}`}>
              <li>
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`flex items-center w-full transition-all duration-200 rounded-lg ${dashboardSidebarCollapsed ? 'justify-center p-3' : 'px-4 py-3'} bg-orange-600 text-white`}
                >
                  <svg className={`${dashboardSidebarCollapsed ? 'w-6 h-6' : 'w-6 h-6 mr-3'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  {!dashboardSidebarCollapsed && <span className="font-medium text-sm">لوحة التحكم</span>}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('exam-list')}
                  className={`flex items-center w-full transition-all duration-200 rounded-lg ${dashboardSidebarCollapsed ? 'justify-center p-3' : 'px-4 py-3'} text-white hover:bg-gray-700`}
                >
                  <svg className={`${dashboardSidebarCollapsed ? 'w-6 h-6' : 'w-6 h-6 mr-3'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  {!dashboardSidebarCollapsed && <span className="font-medium text-sm">الامتحانات</span>}
                </button>
              </li>
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleBackToDashboard}
              className={`w-full bg-red-600 text-white font-bold py-2 px-3 rounded-lg hover:bg-red-700 transition-all duration-300 text-sm flex items-center ${dashboardSidebarCollapsed ? 'justify-center' : 'justify-center'}`}
            >
              <svg className={`${dashboardSidebarCollapsed ? 'w-6 h-6' : 'w-4 h-4 mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {!dashboardSidebarCollapsed && <span>خروج</span>}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-orange-500 shadow-md p-2 sm:p-3 flex justify-between items-center text-white">
            <div className="flex items-center">
              <button
                onClick={handleDashboardSidebarToggle}
                className={`p-1 sm:p-2 mr-2 sm:mr-3 text-white rounded-lg transition-colors duration-200 ${
                  isMobile && dashboardSidebarCollapsed
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-orange-600'
                }`}
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">MBHA</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
            </div>
          </header>

          {/* Dashboard Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {/* Account Information */}
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-4">معلومات الحساب</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-200">
                    <span className="text-gray-600 text-sm sm:text-lg">Name:</span>
                    <span className="text-gray-800 text-sm sm:text-lg font-medium">{user ? `${user.firstName} ${user.lastName}` : 'فلان فلان'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-200">
                    <span className="text-gray-600 text-sm sm:text-lg">Gender:</span>
                    <span className="text-gray-800 text-sm sm:text-lg font-medium">{user?.gender || 'غير محدد'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-200">
                    <span className="text-gray-600 text-sm sm:text-lg">Email:</span>
                    <span className="text-gray-800 text-sm sm:text-lg font-medium">{user?.email || 'student@university.edu'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-200">
                    <span className="text-gray-600 text-sm sm:text-lg">University:</span>
                    <span className="text-gray-800 text-sm sm:text-lg font-medium">{user?.university || 'كلية الطب'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 sm:py-3">
                    <span className="text-gray-600 text-sm sm:text-lg">Class:</span>
                    <span className="text-gray-800 text-sm sm:text-lg font-medium">المرحلة السادسة</span>
                  </div>
                </div>
              </div>

              {/* Exam Instructions */}
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="bg-orange-500 text-white p-3 sm:p-4 rounded-lg mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-right">قبل الدخول الى الامتحان</h3>
                </div>
                <div className="text-gray-700 space-y-3 text-right" dir="rtl">
                  <p className="text-sm sm:text-lg">مرحباً بك عزيزي الطالب ، من هنا يمكنك الدخول واداء الامتحان لكن يرجى ملاحظة التالي:</p>
                  <ul className="list-disc list-inside space-y-2 text-sm sm:text-base pr-4">
                    <li>يجب الاجابة خلال الوقت المحدد لكل امتحان.</li>
                    <li>تأكد دائماً من قيامك بأداء الامتحان والاجابة على جميع الاسئلة.</li>
                    <li>لا يمكن اعادة الامتحان الا بطلب من رئاسة القسم.</li>
                    <li>تأكد من ادخالك كود الامتحان بشكل صحيح.</li>
                    <li>لدخول الامتحان يرجى الضغط على زر start.</li>
                    <li>عند الانتهاء من الامتحان ستكون الوحيد القادر على رؤية درجاتك ولن يتمكن باقي الطلبة من الاطلاع عليها.</li>
                  </ul>
                </div>
                <button
                  onClick={() => setCurrentView('exam-list')}
                  className="mt-6 bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold text-sm sm:text-base"
                >
                  الذهاب الى قائمة الامتحانات
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // exam-list view
  return (
    <div className="flex h-screen bg-gray-100 wizary-exam-page" style={{ minHeight: '100dvh' }}>
      <style dangerouslySetInnerHTML={{ __html: wizaryExamStyles }} />

      {/* Sidebar */}
      <div className={`bg-gray-800 text-white flex flex-col transition-all duration-300 ${dashboardSidebarCollapsed ? 'w-16' : 'w-64'}`}>
        {/* User Profile */}
        <div className="p-4 border-b border-gray-700">
          <div className={`flex items-center ${dashboardSidebarCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-orange-600">
                {user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : 'ف'}
              </span>
            </div>
            {!dashboardSidebarCollapsed && (
              <div>
                <p className="text-sm font-medium text-white">{user ? `${user.firstName} ${user.lastName}` : 'اسم الطالب'}</p>
                <p className="text-xs font-medium text-gray-300">{user?.email || 'ايميل الطالب'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          <ul className={`space-y-2 ${dashboardSidebarCollapsed ? 'px-2' : 'px-4'}`}>
            <li>
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`flex items-center w-full transition-all duration-200 rounded-lg ${dashboardSidebarCollapsed ? 'justify-center p-3' : 'px-4 py-3'} text-white hover:bg-gray-700`}
              >
                <svg className={`${dashboardSidebarCollapsed ? 'w-6 h-6' : 'w-6 h-6 mr-3'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {!dashboardSidebarCollapsed && <span className="font-medium text-sm">لوحة التحكم</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentView('exam-list')}
                className={`flex items-center w-full transition-all duration-200 rounded-lg ${dashboardSidebarCollapsed ? 'justify-center p-3' : 'px-4 py-3'} bg-orange-600 text-white`}
              >
                <svg className={`${dashboardSidebarCollapsed ? 'w-6 h-6' : 'w-6 h-6 mr-3'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {!dashboardSidebarCollapsed && <span className="font-medium text-sm">الامتحانات</span>}
              </button>
            </li>
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleBackToDashboard}
            className={`w-full bg-red-600 text-white font-bold py-2 px-3 rounded-lg hover:bg-red-700 transition-all duration-300 text-sm flex items-center ${dashboardSidebarCollapsed ? 'justify-center' : 'justify-center'}`}
          >
            <svg className={`${dashboardSidebarCollapsed ? 'w-6 h-6' : 'w-4 h-4 mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {!dashboardSidebarCollapsed && <span>خروج</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-orange-500 shadow-md p-2 sm:p-3 flex justify-between items-center text-white">
          <div className="flex items-center">
            <button
              onClick={handleDashboardSidebarToggle}
              className={`p-1 sm:p-2 mr-2 sm:mr-3 text-white rounded-lg transition-colors duration-200 ${
                isMobile && dashboardSidebarCollapsed
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-orange-600'
              }`}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">MBHA</h1>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
          </div>
        </header>

        {/* Exam List Content */}
        <main className="flex-1 p-2 overflow-y-auto">


          {/* Exam Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mb-4 w-full">
            <div className="bg-green-700 text-white p-2 sm:p-3 rounded text-center">
              <div className="text-sm sm:text-base font-medium">الكلية/القسم</div>
              <div className="text-sm sm:text-base font-bold">كلية الطب</div>
            </div>
            <div className="bg-blue-700 text-white p-2 sm:p-3 rounded text-center">
              <div className="text-sm sm:text-base font-medium">الجامعة</div>
              <div className="text-sm sm:text-base font-bold">{user?.university || 'جامعة فلان'}</div>
            </div>
            <div className="bg-orange-500 text-white p-2 sm:p-3 rounded text-center">
              <div className="text-sm sm:text-base font-medium">التاريخ</div>
              <div className="text-sm sm:text-base font-bold">{getBaghdadTime().day}, {getBaghdadTime().month}, {getBaghdadTime().year}</div>
            </div>
            <div className="bg-red-500 text-white p-2 sm:p-3 rounded text-center">
              <div className="text-sm sm:text-base font-medium">الساعة</div>
              <div className="text-sm sm:text-base font-bold">{getBaghdadTime().time}</div>
            </div>
          </div>

                      {/* Exam List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full flex flex-col">
            <div className="p-2 border-b border-gray-200">
                                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 relative gap-2">
                                      <h3 className="text-sm sm:text-base font-bold text-gray-800">List Exam</h3>
                                                                                          <button
                       onClick={() => setExamMenuOpen(!examMenuOpen)}
                       className="flex items-center gap-1 px-2 py-1 bg-orange-500 text-white rounded text-xs"
                     >
                       <span className="text-xs font-medium">
                         {selectedSubject === 'all' ? 'All Subjects' : selectedSubject}
                       </span>
                                                                                                             <svg
                           className={`w-3 h-3 transition-transform duration-200 ${examMenuOpen ? 'rotate-180' : ''}`}
                           fill="none"
                           stroke="currentColor"
                           viewBox="0 0 24 24"
                         >
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                         </svg>
                  </button>
                  {/* Overlay Menu */}
                  {examMenuOpen && (
                    <div className="absolute top-full right-0 bg-white border border-gray-200 rounded shadow-lg z-10 mt-1 min-w-32 w-full sm:w-auto">
                      <div className="p-2">
                        <div className="space-y-1">
                          <button
                            onClick={() => {
                              setSelectedSubject('all');
                              setExamMenuOpen(false);
                            }}
                            className={`w-full px-2 py-1 rounded text-xs font-medium transition-all duration-200 text-left ${
                              selectedSubject === 'all'
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            All Subjects
                          </button>
                          {subjects.map((subject) => (
                            <button
                              key={subject.id}
                              onClick={() => {
                                setSelectedSubject(subject.name);
                                setExamMenuOpen(false);
                              }}
                              className={`w-full px-2 py-1 rounded text-xs font-medium transition-all duration-200 text-left ${
                                selectedSubject === subject.name
                                  ? 'bg-orange-500 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {subject.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="block sm:hidden p-2">
                {loadingExams ? (
                  <div className="p-6 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-gray-600">Loading exams...</span>
                    </div>
                  </div>
                ) : currentExams.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    No exams available
                  </div>
                ) : (
                  <div className="space-y-2">
                    {currentExams.map((exam, index) => {
                      if (!exam || !exam.id) {
                        // Invalid exam data, skip
                        return null;
                      }
                      return (
                        <div key={exam.id || `exam-${index}`} className={`bg-white border border-gray-200 rounded p-2 ${exam.importedData ? 'bg-green-50 border-green-200' : ''}`}>
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 text-xs mb-1">{exam.name || 'Untitled Exam'}</h4>
                              <p className="text-gray-600 text-xs mb-1">Subject: {exam.subject || 'N/A'}</p>
                              <p className="text-gray-600 text-xs mb-1">Department: {exam.department || 'N/A'}</p>
                              <div className="flex space-x-4 text-xs text-gray-500">
                                <span>Questions: {exam.questions || 0}</span>
                                <span>Time: {exam.time || 180} min</span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <button
                                onClick={() => startExam(exam)}
                                className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium"
                              >
                                Take Exam
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    }).filter(Boolean)}
                  </div>
                )}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-y-auto flex-1 w-full">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500">#</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500">اسم الامتحان</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500">المادة</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500">الكلية/القسم</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500">عدد الاسئلة</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500">الوقت بالدقائق</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500">ادوات</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loadingExams ? (
                      <tr>
                        <td colSpan={7} className="px-2 py-4 text-center">
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            <span className="ml-2 text-gray-600 text-xs">Loading exams...</span>
                          </div>
                        </td>
                      </tr>
                    ) : currentExams.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-2 py-4 text-center text-gray-500 text-xs">
                          No exams available
                        </td>
                      </tr>
                    ) : (
                      currentExams.map((exam, index) => {
                        if (!exam || !exam.id) {
                          // Invalid exam data, skip
                          return null;
                        }
                        return (
                          <tr key={exam.id || `exam-${index}`} className={`hover:bg-gray-50 ${exam.importedData ? 'bg-green-50' : ''}`}>
                            <td className="px-2 py-2 text-xs font-medium text-gray-900">{startIndex + index + 1}</td>
                            <td className="px-2 py-2 text-xs text-gray-900">
                              {exam.name || 'Untitled Exam'}
                            </td>
                            <td className="px-2 py-2 text-xs text-gray-900">{exam.subject || 'N/A'}</td>
                            <td className="px-2 py-2 text-xs text-gray-900">{exam.department || 'N/A'}</td>
                            <td className="px-2 py-2 text-xs text-gray-900">{exam.questions || 0}</td>
                            <td className="px-2 py-2 text-xs text-gray-900">{exam.time || 180} Minute</td>
                            <td className="px-2 py-2 text-xs text-gray-900">
                              <button
                                onClick={() => startExam(exam)}
                                className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
                              >
                                Take Exam
                              </button>
                            </td>
                          </tr>
                        );
                      }).filter(Boolean)
                    )}
                  </tbody>
                </table>
              </div>

                               {/* Pagination */}
               <div className="flex justify-center items-center space-x-2 mt-4 p-2 bg-gray-50 rounded w-full">
                 <button
                   onClick={() => handlePageChange(currentPage - 1)}
                   disabled={currentPage === 1}
                   className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium bg-white border border-gray-300 rounded hover:bg-gray-50"
                 >
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                   </svg>
                 </button>
                 <span className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium">{currentPage}</span>
                 <span className="px-3 py-2 text-gray-600 text-sm font-medium">of {totalPages}</span>
                 <button
                   onClick={() => handlePageChange(currentPage + 1)}
                   disabled={currentPage === totalPages}
                   className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium bg-white border border-gray-300 rounded hover:bg-gray-50"
                 >
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                   </svg>
                 </button>
               </div>
             </div>
        </main>
      </div>
    </div>
  );
}

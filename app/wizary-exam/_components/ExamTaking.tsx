'use client';

import { wizaryExamStyles } from '../_lib/exam-styles';
import { CurrentView } from '../_lib/exam-types';

interface ExamTakingProps {
  user: any;
  selectedExam: any;
  setCurrentView: (view: CurrentView) => void;
  startQuiz: () => void;
  secretCode: string;
  setSecretCode: (code: string) => void;
  codeVerified: boolean;
  codeError: string;
  verifySecretCode: () => void;
  showWarning: boolean;
  unansweredCount: number;
  cancelFinish: () => void;
  confirmFinish: () => void;
}

export default function ExamTaking({
  user,
  selectedExam,
  setCurrentView,
  startQuiz,
  secretCode,
  setSecretCode,
  codeVerified,
  codeError,
  verifySecretCode,
  showWarning,
  unansweredCount,
  cancelFinish,
  confirmFinish,
}: ExamTakingProps) {
  return (
    <div className="flex h-screen bg-gray-100 wizary-exam-page" style={{ minHeight: '100dvh' }}>
      <style dangerouslySetInnerHTML={{ __html: wizaryExamStyles }} />

      {/* Warning Overlay */}
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 transform transition-all">
            <div className="text-center">
              {/* Warning Icon */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 mb-4">
                <svg className="h-8 w-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>

              {/* Warning Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Unanswered Questions
              </h3>

              {/* Warning Message */}
              <p className="text-gray-600 mb-6">
                You have <span className="font-bold text-orange-600">{unansweredCount}</span> unanswered question(s).
                <br />
                Are you sure you want to finish the exam?
              </p>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={cancelFinish}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
                >
                  Continue Exam
                </button>
                <button
                  onClick={confirmFinish}
                  className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-200"
                >
                  Finish Anyway
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-blue-600 shadow-md p-3 flex justify-between items-center text-white">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-white">MBHA</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>رجوع</span>
            </button>
          </div>
        </header>

        {/* Exam Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center bg-gray-100 min-h-screen">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 w-full max-w-6xl">
            {/* Left Panel - Exam Start and Timer */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border-2 border-blue-600 flex flex-col items-center justify-center">
              <div className="space-y-4 w-full">
                <div className="bg-blue-600 text-white p-3 sm:p-4 rounded text-center">
                  <p className="text-sm sm:text-base">سوف يتم احتساب الوقت منذ لحظة الضغط على زر "أبدء الامتحان"</p>
                </div>

                <button
                  onClick={startQuiz}
                  className="w-full bg-green-600 text-white py-3 sm:py-4 rounded text-sm sm:text-base font-bold hover:bg-green-700 transition-colors duration-200"
                >
                  أبدء الامتحان
                </button>

                <div className="bg-red-500 text-white p-3 sm:p-4 rounded text-center">
                  <p className="text-sm sm:text-base">Day, 00 Hours 00 Minute, 00 Second</p>
                  <p className="text-sm sm:text-base">الوقت المتبقي لانتهاء تاريخ الامتحان</p>
                </div>
              </div>
            </div>

            {/* Right Panel - Exam Details Table with Blue Stroke */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border-2 border-blue-600 flex flex-col">


              <div className="space-y-4 flex-1">
                <div className="flex justify-between border-b border-gray-200 pb-2 sm:pb-3">
                  <span className="text-gray-800 text-sm sm:text-base">{user ? `${user.firstName} ${user.lastName}` : 'فلان فلان'}</span>
                  <span className="text-gray-600 font-medium text-sm sm:text-base">اسم الطالب</span>
                </div>
                                                                         <div className="flex justify-between border-b border-gray-200 pb-2 sm:pb-3">
                     <span className="text-gray-800 text-sm sm:text-base">{user?.university || 'كلية الطب'} - المرحلة السادسة</span>
                     <span className="text-gray-600 font-medium text-sm sm:text-base">القسم/الصف</span>
                   </div>
                                                                         <div className="flex justify-between border-b border-gray-200 pb-2 sm:pb-3">
                     <span className="text-gray-800 text-sm sm:text-base">{selectedExam?.name || 'الامتحان التقويمي'}</span>
                     <span className="text-gray-600 font-medium text-sm sm:text-base">اسم الامتحان</span>
                   </div>
                                                                         <div className="flex justify-between border-b border-gray-200 pb-2 sm:pb-3">
                     <span className="text-gray-800 text-sm sm:text-base">{selectedExam?.questions || 100}</span>
                     <span className="text-gray-600 font-medium text-sm sm:text-base">عدد الاسئلة</span>
                   </div>
                                                                         <div className="flex justify-between border-b border-gray-200 pb-2 sm:pb-3">
                     <span className="text-gray-800 text-sm sm:text-base">{selectedExam?.time || 180} دقيقة</span>
                     <span className="text-gray-600 font-medium text-sm sm:text-base">الوقت</span>
                   </div>
                                                                         <div className="flex justify-between border-b border-gray-200 pb-2 sm:pb-3">
                     <input
                       type="text"
                       placeholder="أدخل رمز الامتحان السري"
                       value={secretCode}
                       onChange={(e) => setSecretCode(e.target.value)}
                       onKeyPress={(e) => {
                         if (e.key === 'Enter') {
                           verifySecretCode();
                         }
                       }}
                       className="text-gray-800 bg-transparent border-none outline-none text-right text-sm sm:text-base w-full"
                     />
                     <span className="text-gray-600 font-medium text-sm sm:text-base whitespace-nowrap">رمز الامتحان السري</span>
                   </div>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 pt-2 mt-auto">
                  <button
                    onClick={verifySecretCode}
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors duration-200"
                  >
                    تحقق
                  </button>
                  {codeVerified && (
                    <span className="text-green-600 text-xs sm:text-sm font-medium text-center">✓ تم التحقق من رمز الامتحان السري</span>
                  )}
                  {codeError && (
                    <span className="text-red-600 text-xs sm:text-sm font-medium text-center">{codeError}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

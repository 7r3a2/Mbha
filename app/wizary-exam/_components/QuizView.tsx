'use client';

import { wizaryExamStyles } from '../_lib/exam-styles';
import { formatTime } from '../_hooks/useTimer';

interface QuizViewProps {
  questions: any[];
  currentQuestionIndex: number;
  answers: (number | null)[];
  flagged: boolean[];
  timeLeft: number;
  sidebarCollapsed: boolean;
  isMobile: boolean;
  showWarning: boolean;
  unansweredCount: number;
  goToQuestion: (index: number) => void;
  selectAnswer: (optionIndex: number) => void;
  toggleFlag: () => void;
  finishExam: () => void;
  cancelFinish: () => void;
  confirmFinish: () => void;
  handleSidebarToggle: () => void;
  getNavButtonState: (index: number) => string;
}

export default function QuizView({
  questions,
  currentQuestionIndex,
  answers,
  flagged,
  timeLeft,
  sidebarCollapsed,
  isMobile,
  showWarning,
  unansweredCount,
  goToQuestion,
  selectAnswer,
  toggleFlag,
  finishExam,
  cancelFinish,
  confirmFinish,
  handleSidebarToggle,
  getNavButtonState,
}: QuizViewProps) {
  const sidebarOpen = !sidebarCollapsed;

  return (
    <div className="flex min-h-screen bg-gray-100 wizary-exam-page">
      <style dangerouslySetInnerHTML={{ __html: wizaryExamStyles }} />

      {/* Warning Overlay */}
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 max-w-md w-full mx-4 transform transition-all">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-orange-100 mb-4">
                <svg className="h-7 w-7 sm:h-8 sm:w-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                Unanswered Questions
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                You have <span className="font-bold text-orange-600">{unansweredCount}</span> unanswered question(s).
                <br />
                Are you sure you want to finish the exam?
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={cancelFinish}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2.5 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200 text-sm sm:text-base"
                >
                  Continue Exam
                </button>
                <button
                  onClick={confirmFinish}
                  className="flex-1 bg-orange-500 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-200 text-sm sm:text-base"
                >
                  Finish Anyway
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile backdrop when sidebar is open */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30"
          onClick={handleSidebarToggle}
        />
      )}

      {/* Question Navigation Sidebar — same UI for desktop & mobile */}
      {/* Desktop: static in flow | Mobile: fixed overlay, not pushing content */}
      <aside
        className={`bg-white shadow-lg border-r border-gray-200 flex flex-col transition-all duration-300
          ${isMobile ? 'fixed top-0 left-0 h-full z-40' : ''}
          ${sidebarCollapsed
            ? (isMobile ? '-translate-x-full w-0' : 'w-16')
            : (isMobile ? 'translate-x-0 w-72' : 'w-64 lg:w-80')
          }
        `}
        style={{ minWidth: sidebarCollapsed && !isMobile ? 64 : undefined }}
      >
        {sidebarCollapsed && !isMobile ? (
          <div className="flex flex-col items-center w-full h-full">
            <div className="pt-4">
              <button
                className="p-2 rounded-full text-gray-600 hover:bg-gray-100"
                onClick={handleSidebarToggle}
                aria-label="Expand sidebar"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        ) : !sidebarCollapsed ? (
          <>
            <div className="flex items-center justify-between mb-4 px-4 sm:px-6 pt-4 sm:pt-6">
              <h3 className="text-base sm:text-lg font-bold text-gray-800">Question Navigation</h3>
              <button
                className="p-2 rounded-full text-gray-600 hover:bg-gray-100"
                onClick={handleSidebarToggle}
                aria-label="Collapse sidebar"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 sm:gap-2 flex-grow content-start overflow-y-auto px-3 sm:px-6 pb-6">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToQuestion(index)}
                  className={`p-1 sm:p-2 rounded border-2 text-xs sm:text-sm font-bold transition-colors duration-200 h-9 w-9 sm:h-12 sm:w-12 flex items-center justify-center ${getNavButtonState(index)}`}
                >
                  {answers[index] !== null ? String.fromCharCode(97 + answers[index]!).toUpperCase() : index + 1}
                </button>
              ))}
            </div>
          </>
        ) : null}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        {/* Header */}
        <header className="bg-blue-600 shadow-md p-2 sm:p-3 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            {/* Mobile: hamburger to open sidebar */}
            {isMobile && sidebarCollapsed && (
              <button
                onClick={handleSidebarToggle}
                className="p-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                aria-label="Open question navigation"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-white">MBHA</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-sm sm:text-lg font-bold">{formatTime(timeLeft)}</span>
          </div>
        </header>

        {/* Exam Content */}
        <div className="flex-1 p-2 sm:p-4 md:p-8">
          {/* Question Panel */}
          <div className="bg-white p-3 sm:p-4 md:p-8 rounded-lg shadow-sm border border-gray-200 min-h-[300px] sm:min-h-[400px] md:min-h-[500px] flex flex-col">
            <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8">
              <span className="bg-blue-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold">
                Question #{currentQuestionIndex + 1}
              </span>
            </div>

            <div className="mb-4 sm:mb-6 md:mb-8 flex-1">
              <p className="text-gray-800 text-base sm:text-lg md:text-xl leading-relaxed">
                {questions[currentQuestionIndex]?.text || 'Loading question...'}
              </p>
            </div>

            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              {questions[currentQuestionIndex]?.options?.map((option: string, index: number) => (
                <div
                  key={index}
                  className={`flex items-center p-2.5 sm:p-3 md:p-4 border-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                    answers[currentQuestionIndex] === index
                      ? 'bg-green-100 border-green-500'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => selectAnswer(index)}
                >
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded mr-2.5 sm:mr-4 flex-shrink-0 flex items-center justify-center ${
                    answers[currentQuestionIndex] === index
                      ? 'bg-green-600'
                      : 'bg-gray-300'
                  }`}>
                    <span className={`text-xs sm:text-base font-bold ${
                      answers[currentQuestionIndex] === index
                        ? 'text-white'
                        : 'text-gray-700'
                    }`}>{String.fromCharCode(97 + index)}</span>
                  </div>
                  <span className="text-gray-800 text-sm sm:text-base md:text-lg">{option}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-2 sm:gap-4 md:gap-6 mt-4 sm:mt-8 md:mt-10">
            <button
              onClick={() => goToQuestion(currentQuestionIndex - 1)}
              disabled={currentQuestionIndex === 0}
              className="bg-blue-600 text-white px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm sm:text-base"
            >
              Back
            </button>
            <button
              onClick={toggleFlag}
              className="bg-orange-500 text-white px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg hover:bg-orange-600 transition-colors duration-200 text-sm sm:text-base"
            >
              تأشير غير متأكد
            </button>
            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={() => finishExam()}
                className="bg-red-600 text-white px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm sm:text-base"
              >
                Finished
              </button>
            ) : (
              <button
                onClick={() => goToQuestion(currentQuestionIndex + 1)}
                className="bg-blue-600 text-white px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { wizaryExamStyles } from '../_lib/exam-styles';
import { CurrentView } from '../_lib/exam-types';

interface ExamResultsProps {
  questions: any[];
  answers: (number | null)[];
  finalScore: number;
  selectedResultQuestion: number | null;
  setSelectedResultQuestion: (index: number | null) => void;
  setCurrentView: (view: CurrentView) => void;
}

export default function ExamResults({
  questions,
  answers,
  finalScore,
  selectedResultQuestion,
  setSelectedResultQuestion,
  setCurrentView,
}: ExamResultsProps) {
  const correctAnswers = answers.filter((answer, index) => answer === questions[index].correct).length;
  const totalQuestions = questions.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 wizary-exam-page">
      <style dangerouslySetInnerHTML={{ __html: wizaryExamStyles }} />

      {/* Results Content */}
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="max-w-4xl w-full">
          {/* Hero Score Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-10 mb-8 transform hover:scale-[1.02] transition-all duration-300">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={finalScore >= 80 ? "#10b981" : finalScore >= 60 ? "#f59e0b" : "#ef4444"}
                      strokeWidth="2"
                      strokeDasharray={`${finalScore}, 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-gray-800">{finalScore}%</div>
                      <div className="text-lg text-gray-600 font-medium">Final Score</div>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-4xl font-bold text-gray-800 mb-8">Exam Results</h2>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">{totalQuestions}</div>
                    <div className="text-blue-100 font-medium">Total Questions</div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">{correctAnswers}</div>
                    <div className="text-green-100 font-medium">Correct Answers</div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">{totalQuestions - correctAnswers}</div>
                    <div className="text-red-100 font-medium">Incorrect Answers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Question Review Section */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-bold text-gray-800">Question Review</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Correct</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Incorrect</span>
                </div>
              </div>
            </div>

            {/* Interactive Question Grid */}
            <div className="grid grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-15 gap-3 mb-10">
              {questions.map((_, index) => {
                const answer = answers[index];
                const isCorrect = answer === questions[index].correct;
                const isAnswered = answer !== null;

                let bgGradient, textColor, borderColor;

                if (isAnswered) {
                  if (isCorrect) {
                    bgGradient = 'bg-gradient-to-br from-green-400 to-green-600';
                    textColor = 'text-white';
                    borderColor = 'border-green-500';
                  } else {
                    bgGradient = 'bg-gradient-to-br from-red-400 to-red-600';
                    textColor = 'text-white';
                    borderColor = 'border-red-500';
                  }
                } else {
                  bgGradient = 'bg-gradient-to-br from-red-400 to-red-600';
                  textColor = 'text-white';
                  borderColor = 'border-red-500';
                }

                return (
                  <button
                    key={index}
                    onClick={() => setSelectedResultQuestion(selectedResultQuestion === index ? null : index)}
                    className={`${bgGradient} ${textColor} ${borderColor} w-14 h-14 rounded-xl font-bold text-sm hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl border-2 transform hover:rotate-3`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>

            {/* Detailed Question View */}
            {selectedResultQuestion !== null && (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200 transform transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <h4 className="text-2xl font-bold text-gray-800">
                      Question #{selectedResultQuestion + 1}
                    </h4>
                    {answers[selectedResultQuestion] === questions[selectedResultQuestion].correct ? (
                      <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Correct Answer</span>
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>Incorrect Answer</span>
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedResultQuestion(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mb-8">
                  <p className="text-gray-800 text-xl leading-relaxed mb-6 font-medium">
                    {questions[selectedResultQuestion].text}
                  </p>

                  <div className="space-y-4">
                    {questions[selectedResultQuestion].options.map((option: string, index: number) => {
                      const isSelected = answers[selectedResultQuestion] === index;
                      const isCorrect = index === questions[selectedResultQuestion].correct;

                      let optionStyle = 'border-2 border-gray-200 bg-white hover:bg-gray-50';
                      let iconStyle = 'text-gray-400';

                      if (isCorrect) {
                        optionStyle = 'border-2 border-green-500 bg-green-50 shadow-lg';
                        iconStyle = 'text-green-500';
                      } else if (isSelected && !isCorrect) {
                        optionStyle = 'border-2 border-red-500 bg-red-50 shadow-lg';
                        iconStyle = 'text-red-500';
                      }

                      return (
                        <div
                          key={index}
                          className={`p-5 rounded-xl ${optionStyle} transition-all duration-300 transform hover:scale-[1.02]`}
                        >
                          <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full mr-4 flex items-center justify-center font-bold ${
                              isCorrect
                                ? 'bg-green-500 text-white shadow-lg'
                                : isSelected && !isCorrect
                                  ? 'bg-red-500 text-white shadow-lg'
                                  : 'bg-gray-300 text-gray-700'
                            }`}>
                              {String.fromCharCode(97 + index)}
                            </div>
                            <span className={`text-gray-800 text-lg ${
                              isCorrect ? 'font-semibold' : ''
                            }`}>
                              {option}
                            </span>
                            <div className="ml-auto">
                              {isCorrect && (
                                <svg className={`w-6 h-6 ${iconStyle}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                              {isSelected && !isCorrect && (
                                <svg className={`w-6 h-6 ${iconStyle}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-12 py-4 rounded-2xl font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

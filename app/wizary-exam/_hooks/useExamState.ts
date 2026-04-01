'use client';

import { useState, useEffect } from 'react';
import {
  CurrentView,
  ExamData,
  Question,
  BaghdadTime,
  sampleExams,
  subjectMapping,
  generateQuestions,
  subjects,
} from '../_lib/exam-types';

export function useExamState() {
  const [currentView, setCurrentView] = useState<CurrentView>('dashboard');
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [flagged, setFlagged] = useState<boolean[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [finalScore, setFinalScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const [selectedResultQuestion, setSelectedResultQuestion] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [showWarning, setShowWarning] = useState(false);
  const [unansweredCount, setUnansweredCount] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [examMenuOpen, setExamMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const examsPerPage = 5;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dashboardSidebarCollapsed, setDashboardSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [importedExams, setImportedExams] = useState<any[]>([]);
  const [loadingExams, setLoadingExams] = useState(true);

  const [secretCode, setSecretCode] = useState('');
  const [codeVerified, setCodeVerified] = useState(false);
  const [codeError, setCodeError] = useState('');

  // Load imported exams on component mount
  useEffect(() => {
    const loadImportedExams = async () => {
      try {
        const token = typeof window !== 'undefined' ? (localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')) : null;
        const response = await fetch(`/api/admin/exams?t=${Date.now()}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });

        if (response.ok) {
          const examsData = await response.json();

          const rawExams = Array.isArray(examsData) ? examsData : [];

          const transformedExams = rawExams.map((exam: any) => {
            try {
              let questionsArray: any[] = [];
              let questionCount = 0;

              if (exam.questions) {
                if (typeof exam.questions === 'string') {
                  questionsArray = JSON.parse(exam.questions);
                } else if (Array.isArray(exam.questions)) {
                  questionsArray = exam.questions;
                }
                questionCount = Array.isArray(questionsArray) ? questionsArray.length : 0;
              }

              return {
                id: exam.id,
                name: exam.title || 'Untitled Exam',
                department: 'المرحلة السادسة',
                questions: questionCount,
                time: exam.examTime || 180,
                faculty: 'كلية الطب',
                university: 'جامعة فلان',
                subject: subjectMapping[exam.subject] || exam.subject || 'Obstetric & Gynecology',
                order: exam.order || 999,
                secretCode: exam.secretCode || 'HaiderAlaa',
                importedData: {
                  ...exam,
                  questions: questionsArray
                }
              };
            } catch (parseError) {
              return {
                id: exam.id,
                name: exam.title || 'Untitled Exam',
                department: 'المرحلة السادسة',
                questions: 0,
                time: exam.examTime || 180,
                faculty: 'كلية الطب',
                university: 'جامعة فلان',
                subject: subjectMapping[exam.subject] || exam.subject || 'Obstetric & Gynecology',
                order: exam.order || 999,
                secretCode: exam.secretCode || 'HaiderAlaa',
                importedData: {
                  ...exam,
                  questions: []
                }
              };
            }
          });

          transformedExams.sort((a: any, b: any) => {
            if (a.subject !== b.subject) {
              return a.subject.localeCompare(b.subject);
            }
            return (a.order || 999) - (b.order || 999);
          });

          setImportedExams(transformedExams);
        } else {
          setImportedExams([]);
        }
      } catch (error) {
        setImportedExams([]);
      } finally {
        setLoadingExams(false);
      }
    };

    loadImportedExams();
  }, []);

  const refreshExams = async () => {
    setLoadingExams(true);
    try {
      const response = await fetch(`/api/admin/exams?t=${Date.now()}`);

      if (response.ok) {
        const examsData = await response.json();
        const rawExams = Array.isArray(examsData) ? examsData : [];

        const transformedExams = rawExams.map((exam: any) => {
          try {
            let questionsArray: any[] = [];
            let questionCount = 0;

            if (exam.questions) {
              if (typeof exam.questions === 'string') {
                questionsArray = JSON.parse(exam.questions);
              } else if (Array.isArray(exam.questions)) {
                questionsArray = exam.questions;
              }
              questionCount = Array.isArray(questionsArray) ? questionsArray.length : 0;
            }

            return {
              id: exam.id,
              name: exam.title || 'Untitled Exam',
              department: 'المرحلة السادسة',
              questions: questionCount,
              time: exam.examTime || 180,
              faculty: 'كلية الطب',
              university: 'جامعة فلان',
              subject: subjectMapping[exam.subject] || exam.subject || 'Obstetric & Gynecology',
              order: exam.order || 999,
              secretCode: exam.secretCode || 'HaiderAlaa',
              importedData: {
                ...exam,
                questions: questionsArray
              }
            };
          } catch (parseError) {
            // Error parsing exam
            return {
              id: exam.id,
              name: exam.title || 'Untitled Exam',
              department: 'المرحلة السادسة',
              questions: 0,
              time: exam.examTime || 180,
              faculty: 'كلية الطب',
              university: 'جامعة فلان',
              subject: subjectMapping[exam.subject] || exam.subject || 'Obstetric & Gynecology',
              order: exam.order || 999,
              secretCode: exam.secretCode || 'HaiderAlaa',
              importedData: {
                ...exam,
                questions: []
              }
            };
          }
        });

        transformedExams.sort((a: any, b: any) => {
          if (a.subject !== b.subject) {
            return a.subject.localeCompare(b.subject);
          }
          return (a.order || 999) - (b.order || 999);
        });

        setImportedExams(transformedExams);
      }
    } catch (error) {
      // Error refreshing exams
    } finally {
      setLoadingExams(false);
    }
  };

  const handleLogout = () => {
    window.location.href = '/';
  };

  const handleBackToDashboard = () => {
    window.location.href = '/dashboard';
  };

  const startExam = (exam: any) => {
    setSelectedExam(exam);
    setCodeVerified(false);
    setSecretCode('');
    setCodeError('');

    if (exam.importedData && exam.importedData.questions) {
      const importedQuestions = exam.importedData.questions.map((q: any) => ({
          text: q.question || q.text,
          options: Array.isArray(q.options) ? q.options : q.options?.map((opt: any) => opt.text) || [],
          correct: (q.correct_option || q.correctOption || 1) - 1
        }));
      setQuestions(importedQuestions);
      setAnswers(new Array(importedQuestions.length).fill(null));
      setFlagged(new Array(importedQuestions.length).fill(false));
      setTimeLeft(exam.time * 60);
    } else {
      const questionCount = exam.questions || 10;
      const generatedQuestions = generateQuestions(questionCount);
      setQuestions(generatedQuestions);
      setAnswers(new Array(questionCount).fill(null));
      setFlagged(new Array(questionCount).fill(false));
      setTimeLeft(exam.time * 60);
    }

    setCurrentQuestionIndex(0);
    setCurrentView('exam-taking');
  };

  const startQuiz = () => {
    if (!codeVerified) {
      setCodeError('يجب إدخال رمز الامتحان السري أولاً');
      return;
    }

    setCurrentView('quiz');
    setExamStarted(true);
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const selectAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const toggleFlag = () => {
    const newFlagged = [...flagged];
    newFlagged[currentQuestionIndex] = !newFlagged[currentQuestionIndex];
    setFlagged(newFlagged);

    if (newFlagged[currentQuestionIndex]) {
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = null;
      setAnswers(newAnswers);
    }
  };

  const finishExam = () => {
    if (!questions || questions.length === 0) {
      return;
    }

    const currentExamQuestions = questions.length;
    const answeredQuestions = answers.filter(answer => answer !== null).length;
    const unansweredQuestions = currentExamQuestions - answeredQuestions;

    if (unansweredQuestions > 0) {
      setUnansweredCount(unansweredQuestions);
      setShowWarning(true);
      return;
    }

    const correctAnswers = answers.filter((answer, index) =>
      answer !== null && questions[index] && answer === questions[index].correct
    ).length;
    const score = Math.round((correctAnswers / questions.length) * 100);
    setFinalScore(score);
    setShowResults(true);
    setCurrentView('results');
  };

  const confirmFinish = () => {
    setShowWarning(false);

    if (!questions || questions.length === 0) {
      return;
    }

    const correctAnswers = answers.filter((answer, index) =>
      answer !== null && questions[index] && answer === questions[index].correct
    ).length;
    const score = Math.round((correctAnswers / questions.length) * 100);
    setFinalScore(score);
    setShowResults(true);
    setCurrentView('results');
  };

  const cancelFinish = () => {
    setShowWarning(false);
  };

  // Update Baghdad time every second
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  // Reset page to 1 when subject changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSubject]);

  // Detect mobile/iPad and force collapse sidebar
  useEffect(() => {
    const checkIsMobile = () => {
      const width = window.innerWidth;

      const shouldCollapse = width <= 1024;
      setIsMobile(shouldCollapse);

      if (shouldCollapse) {
        setSidebarCollapsed(true);
        setDashboardSidebarCollapsed(true);
      }
    };

    checkIsMobile();

    window.addEventListener('resize', checkIsMobile);
    window.addEventListener('orientationchange', () => {
      setTimeout(checkIsMobile, 100);
    });

    return () => {
      window.removeEventListener('resize', checkIsMobile);
      window.removeEventListener('orientationchange', checkIsMobile);
    };
  }, []);

  const getBaghdadTime = (): BaghdadTime => {
    const baghdadTime = new Date(currentTime.toLocaleString("en-US", {timeZone: "Asia/Baghdad"}));
    return {
      date: baghdadTime.toLocaleDateString('en-GB'),
      time: baghdadTime.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      day: baghdadTime.toLocaleDateString('en-US', { weekday: 'long' }),
      month: baghdadTime.toLocaleDateString('en-US', { month: 'long' }),
      year: baghdadTime.getFullYear()
    };
  };

  const allExams = [...sampleExams, ...importedExams];

  const filteredExams = selectedSubject === 'Internal Medicine' || selectedSubject === 'Surgery' || selectedSubject === 'Obstetric & Gynecology' || selectedSubject === 'Pediatric'
    ? allExams.filter(exam => exam.subject === selectedSubject)
    : allExams;

  const totalPages = Math.ceil(filteredExams.length / examsPerPage);
  const startIndex = (currentPage - 1) * examsPerPage;
  const endIndex = startIndex + examsPerPage;
  const currentExams = filteredExams.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSidebarToggle = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const handleDashboardSidebarToggle = () => {
    if (isMobile && dashboardSidebarCollapsed) {
      return;
    }
    setDashboardSidebarCollapsed((prev) => !prev);
  };

  const verifySecretCode = () => {
    if (selectedExam && secretCode.trim() === selectedExam.secretCode) {
      setCodeVerified(true);
      setCodeError('');
    } else {
      setCodeError('رمز الامتحان السري غير صحيح');
      setCodeVerified(false);
    }
  };

  const getNavButtonState = (index: number) => {
    if (answers[index] !== null) {
      return "bg-green-500 border-green-600 text-white";
    }
    if (flagged[index]) {
      return "bg-orange-100 border-orange-500 text-orange-700";
    }
    if (index === currentQuestionIndex) {
      return "bg-gray-600 border-gray-700 text-white current-question";
    }
    return "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200";
  };

  return {
    currentView,
    setCurrentView,
    selectedExam,
    questions,
    currentQuestionIndex,
    answers,
    flagged,
    timeLeft,
    setTimeLeft,
    examStarted,
    showSidebar,
    finalScore,
    setFinalScore,
    showResults,
    setShowResults,
    selectedResultQuestion,
    setSelectedResultQuestion,
    selectedSubject,
    setSelectedSubject,
    showWarning,
    setShowWarning,
    unansweredCount,
    examMenuOpen,
    setExamMenuOpen,
    currentPage,
    examsPerPage,
    sidebarCollapsed,
    dashboardSidebarCollapsed,
    isMobile,
    importedExams,
    loadingExams,
    secretCode,
    setSecretCode,
    codeVerified,
    codeError,
    startExam,
    startQuiz,
    goToQuestion,
    selectAnswer,
    toggleFlag,
    finishExam,
    confirmFinish,
    cancelFinish,
    refreshExams,
    handleLogout,
    handleBackToDashboard,
    getBaghdadTime,
    filteredExams,
    totalPages,
    startIndex,
    currentExams,
    handlePageChange,
    handleSidebarToggle,
    handleDashboardSidebarToggle,
    verifySecretCode,
    getNavButtonState,
  };
}

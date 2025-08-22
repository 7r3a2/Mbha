'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';

// WizaryExam-specific CSS overrides to ensure unique design
const wizaryExamStyles = `
  /* Safe area insets support like approach page */
  .wizary-exam-page {
    background: #1f2937 !important; /* Dark background for safe areas */
    min-height: 100vh;
    min-height: 100dvh;
    padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
  }
  
  /* Main content containers with white backgrounds */
  .wizary-exam-page .main-container {
    background: white;
    min-height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom));
    min-height: calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom));
  }
  
  /* Ensure content doesn't overflow containers */
  .wizary-exam-page .content-container {
    overflow: hidden;
    max-width: 100%;
  }
  
  .wizary-exam-page .grid,
  .wizary-exam-page table,
  .wizary-exam-page .bg-green-700,
  .wizary-exam-page .bg-blue-700,
  .wizary-exam-page .bg-orange-500,
  .wizary-exam-page .bg-red-500 {
    max-width: 100% !important;
    overflow: hidden !important;
  }
  
  /* WizaryExam-specific overrides */
  .wizary-exam-page * {
    --wizary-primary: #ff6b35;
    --wizary-secondary: #f7931e;
    --wizary-hover: #e55a2b;
  }
  
  .wizary-exam-page button:focus,
  .wizary-exam-page input:focus,
  .wizary-exam-page select:focus {
    outline: none !important;
    border-color: #ff6b35 !important;
    box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.2) !important;
  }
  
  .wizary-exam-page button:hover,
  .wizary-exam-page input:hover,
  .wizary-exam-page select:hover {
    border-color: #ff6b35 !important;
  }

  /* Override any global orange styles for question navigation */
  .wizary-exam-page .bg-gray-200 {
    background-color: #e5e7eb !important;
    border-color: #9ca3af !important;
    color: #1f2937 !important;
  }

  .wizary-exam-page .bg-gray-200:hover {
    background-color: #d1d5db !important;
    border-color: #6b7280 !important;
  }

  .wizary-exam-page .bg-gray-100 {
    background-color: #f3f4f6 !important;
    border-color: #d1d5db !important;
    color: #374151 !important;
  }

  .wizary-exam-page .bg-gray-100:hover {
    background-color: #e5e7eb !important;
    border-color: #9ca3af !important;
  }

  /* Ensure current question stays dark gray */
  .wizary-exam-page .current-question {
    background-color: #6b7280 !important;
    border-color: #4b5563 !important;
    color: #ffffff !important;
  }

  .wizary-exam-page .current-question:hover {
    background-color: #4b5563 !important;
    border-color: #374151 !important;
  }

  /* Override any orange styles for current question */
  .wizary-exam-page .bg-gray-200.current-question {
    background-color: #6b7280 !important;
    border-color: #4b5563 !important;
    color: #ffffff !important;
  }

  .wizary-exam-page .bg-gray-200.current-question:hover {
    background-color: #4b5563 !important;
    border-color: #374151 !important;
  }

  /* Additional specificity to override orange styles */
  .wizary-exam-page button.bg-gray-200.current-question {
    background-color: #6b7280 !important;
    border-color: #4b5563 !important;
    color: #ffffff !important;
  }

  .wizary-exam-page button.bg-gray-200.current-question:hover {
    background-color: #4b5563 !important;
    border-color: #374151 !important;
  }

  /* Maximum specificity to override any orange styles */
  .wizary-exam-page .bg-gray-200.current-question,
  .wizary-exam-page button.bg-gray-200.current-question,
  .wizary-exam-page .current-question.bg-gray-200 {
    background-color: #6b7280 !important;
    border-color: #4b5563 !important;
    color: #ffffff !important;
  }

  .wizary-exam-page .bg-gray-200.current-question:hover,
  .wizary-exam-page button.bg-gray-200.current-question:hover,
  .wizary-exam-page .current-question.bg-gray-200:hover {
    background-color: #4b5563 !important;
    border-color: #374151 !important;
  }

             /* Override any potential orange background */
           .wizary-exam-page .current-question[class*="bg-orange"],
           .wizary-exam-page .current-question[class*="orange"] {
             background-color: #6b7280 !important;
             border-color: #4b5563 !important;
             color: #ffffff !important;
           }
           
           /* Prevent orange hover on answered questions */
           .wizary-exam-page .bg-green-500:hover {
             background-color: #10b981 !important;
             border-color: #059669 !important;
             color: #ffffff !important;
           }
           
           /* Ensure answered questions stay green on hover */
           .wizary-exam-page button.bg-green-500:hover {
             background-color: #10b981 !important;
             border-color: #059669 !important;
             color: #ffffff !important;
           }
           
           /* Override any orange hover effects on green buttons */
           .wizary-exam-page .bg-green-500[class*="hover"] {
             background-color: #10b981 !important;
             border-color: #059669 !important;
             color: #ffffff !important;
           }
           
           /* Prevent orange stroke on answered questions when clicked */
           .wizary-exam-page .bg-green-500:active,
           .wizary-exam-page .bg-green-500:focus,
           .wizary-exam-page .bg-green-500:focus-visible {
             background-color: #10b981 !important;
             border-color: #059669 !important;
             color: #ffffff !important;
             outline: none !important;
             box-shadow: none !important;
           }
           
           /* Ensure answered questions never show orange */
           .wizary-exam-page .bg-green-500,
           .wizary-exam-page button.bg-green-500 {
             background-color: #10b981 !important;
             border-color: #059669 !important;
             color: #ffffff !important;
           }

  /* Ensure dark gray for current question with any class combination */
  .wizary-exam-page .current-question,
  .wizary-exam-page .bg-gray-600.current-question,
  .wizary-exam-page button.current-question {
    background-color: #6b7280 !important;
    border-color: #4b5563 !important;
    color: #ffffff !important;
  }

  .wizary-exam-page .current-question:hover,
  .wizary-exam-page .bg-gray-600.current-question:hover,
  .wizary-exam-page button.current-question:hover {
    background-color: #4b5563 !important;
    border-color: #374151 !important;
  }
`;

// Subject data
const subjects = [
  { id: 1, name: 'Internal Medicine', arabicName: 'الطب الباطني' },
  { id: 2, name: 'Surgery', arabicName: 'الجراحة' },
  { id: 3, name: 'Obstetric & Gynecology', arabicName: 'التوليد وأمراض النساء' },
  { id: 4, name: 'Pediatric', arabicName: 'طب الأطفال' }
];

// Sample exam data (empty - only imported exams will be shown)
const sampleExams: any[] = [];

// Sample question templates for the exam
const questionTemplates = [
  {
    text: "A 65-year-old man with a history of hypertension and type 2 diabetes presents with sudden onset of left-sided weakness and facial droop. A non-contrast CT scan of the head is performed. Which of the following findings would be most indicative of an acute ischemic stroke?",
    options: [
      "Cerebral edema and mass effect",
      "Hyperdense MCA sign",
      "Intraparenchymal hemorrhage",
      "Subarachnoid blood",
      "Normal findings",
    ],
    correct: 1,
  },
  {
    text: "A 28-year-old woman in her third trimester of pregnancy complains of persistent heartburn. She has tried dietary modifications without relief. Which of the following medications is considered safest for her condition?",
    options: [
      "Omeprazole",
      "Misoprostol",
      "Sodium bicarbonate",
      "Aluminum hydroxide",
      "Ranitidine",
    ],
    correct: 3,
  },
  {
    text: "A 5-year-old child is brought to the emergency department with a 2-day history of fever, sore throat, and a 'sandpaper' like rash. On examination, he has circumoral pallor and a strawberry tongue. What is the most likely diagnosis?",
    options: [
      "Measles (Rubeola)",
      "Kawasaki disease",
      "Scarlet fever",
      "Rubella (German Measles)",
      "Roseola infantum",
    ],
    correct: 2,
  },
  {
    text: "A 45-year-old woman presents with a 3-month history of fatigue, weight gain, and cold intolerance. Physical examination reveals dry skin and a goiter. Laboratory studies show an elevated TSH and low free T4. What is the most likely diagnosis?",
    options: [
      "Graves' disease",
      "Hashimoto's thyroiditis",
      "Subacute thyroiditis",
      "Toxic multinodular goiter",
      "Thyroid cancer",
    ],
    correct: 1,
  },
  {
    text: "A 60-year-old man with a history of smoking presents with chest pain that radiates to his left arm and jaw. The pain is relieved with rest and nitroglycerin. What is the most likely diagnosis?",
    options: [
      "Myocardial infarction",
      "Stable angina",
      "Unstable angina",
      "Aortic dissection",
      "Pulmonary embolism",
    ],
    correct: 1,
  },
  {
    text: "A 35-year-old woman presents with a 2-week history of fatigue, joint pain, and a malar rash. Laboratory studies show a positive ANA and anti-dsDNA antibodies. What is the most likely diagnosis?",
    options: [
      "Rheumatoid arthritis",
      "Systemic lupus erythematosus",
      "Sjögren's syndrome",
      "Scleroderma",
      "Mixed connective tissue disease",
    ],
    correct: 1,
  },
  {
    text: "A 25-year-old man presents with acute onset of severe headache, photophobia, and neck stiffness. Lumbar puncture reveals cloudy cerebrospinal fluid with elevated white blood cells. What is the most likely diagnosis?",
    options: [
      "Migraine",
      "Bacterial meningitis",
      "Viral meningitis",
      "Subarachnoid hemorrhage",
      "Cluster headache",
    ],
    correct: 1,
  },
  {
    text: "A 50-year-old woman presents with a 6-month history of progressive dyspnea and dry cough. Chest X-ray shows bilateral interstitial infiltrates. What is the most likely diagnosis?",
    options: [
      "Pneumonia",
      "Pulmonary fibrosis",
      "Congestive heart failure",
      "Pulmonary embolism",
      "Bronchitis",
    ],
    correct: 1,
  },
  {
    text: "A 30-year-old man presents with a 1-week history of jaundice, dark urine, and right upper quadrant pain. Laboratory studies show elevated bilirubin and transaminases. What is the most likely diagnosis?",
    options: [
      "Hepatitis A",
      "Hepatitis B",
      "Hepatitis C",
      "Alcoholic hepatitis",
      "Gallbladder disease",
    ],
    correct: 0,
  },
  {
    text: "A 40-year-old woman presents with a 3-month history of polyuria, polydipsia, and weight loss. Laboratory studies show elevated blood glucose and ketones in the urine. What is the most likely diagnosis?",
    options: [
      "Type 1 diabetes mellitus",
      "Type 2 diabetes mellitus",
      "Gestational diabetes",
      "Diabetes insipidus",
      "Metabolic syndrome",
    ],
    correct: 0,
  }
];

// Function to generate questions based on count
const generateQuestions = (count: number) => {
  const questions = [];
  const maxQuestions = Math.min(count, 100); // Maximum 100 questions
  for (let i = 0; i < maxQuestions; i++) {
    const template = questionTemplates[i % questionTemplates.length];
    questions.push({
      id: i + 1,
      text: template.text,
      options: template.options,
      correct: template.correct,
    });
  }
  return questions;
};

export default function WizaryExam() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  // Check if user is authenticated (Wizary Exam is always available)
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isLoading, isAuthenticated, router]);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'exam-list', 'exam-taking', 'results'
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
  const [selectedSubject, setSelectedSubject] = useState('all'); // For subject filtering
  const [showWarning, setShowWarning] = useState(false);
  const [unansweredCount, setUnansweredCount] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date()); // For Baghdad time
  const [examMenuOpen, setExamMenuOpen] = useState(false); // For exam menu collapse/expand
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const examsPerPage = 5; // Number of exams per page
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // For question navigation sidebar
  const [dashboardSidebarCollapsed, setDashboardSidebarCollapsed] = useState(false); // For dashboard sidebar
  
  // State for imported exams
  const [importedExams, setImportedExams] = useState<any[]>([]);
  const [loadingExams, setLoadingExams] = useState(true);

  // State for secret code verification
  const [secretCode, setSecretCode] = useState('');
  const [codeVerified, setCodeVerified] = useState(false);
  const [codeError, setCodeError] = useState('');

  // Load imported exams on component mount
  useEffect(() => {
    const loadImportedExams = async () => {
      try {
        console.log('🔄 Loading exams from database...');
        
        // Get auth token
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (!token) {
          console.error('❌ No auth token found');
          setImportedExams([]);
          setLoadingExams(false);
          return;
        }

        const response = await fetch(`/api/load-exams-db?t=${Date.now()}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Loaded exams:', data.exams?.length || 0, 'exams');
          setImportedExams(data.exams || []);
        } else {
          console.error('❌ Failed to load exams:', response.status, response.statusText);
          // Fallback to empty array
          setImportedExams([]);
        }
      } catch (error) {
        console.error('💥 Error loading imported exams:', error);
        // Fallback to empty array
        setImportedExams([]);
      } finally {
        setLoadingExams(false);
      }
    };

    loadImportedExams();
  }, []);

  // Function to refresh exams (can be called from parent or when needed)
  const refreshExams = async () => {
    setLoadingExams(true);
    try {
      console.log('🔄 Manually refreshing exams...');
      
      // Get auth token
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      if (!token) {
        console.error('❌ No auth token found for refresh');
        setLoadingExams(false);
        return;
      }

      const response = await fetch(`/api/load-exams-db?t=${Date.now()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Refreshed exams:', data.exams?.length || 0, 'exams');
        setImportedExams(data.exams || []);
      } else {
        console.error('❌ Failed to refresh exams:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('💥 Error refreshing exams:', error);
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
    // Reset secret code verification when selecting a new exam
    setCodeVerified(false);
    setSecretCode('');
    setCodeError('');
    
    // Check if this is an imported exam with real questions
    if (exam.importedData && exam.importedData.questions) {
      console.log('📝 Processing imported exam questions:', exam.importedData.questions.length);
      console.log('🔍 Sample question structure:', exam.importedData.questions[0]);
      
      // Use the imported questions
      const importedQuestions = exam.importedData.questions.map((q: any) => {
        const mappedQuestion = {
          text: q.question || q.text, // Handle both CSV format (question) and existing format (text)
          options: Array.isArray(q.options) ? q.options : q.options?.map((opt: any) => opt.text) || [],
          correct: (q.correct_option || q.correctOption || 1) - 1 // Convert 1-based to 0-based for internal use
        };
        console.log('🔄 Mapped question:', mappedQuestion);
        return mappedQuestion;
      });
      
      console.log(`✅ Successfully mapped ${importedQuestions.length} questions`);
      setQuestions(importedQuestions);
      setAnswers(new Array(importedQuestions.length).fill(null));
      setFlagged(new Array(importedQuestions.length).fill(false));
      setTimeLeft(exam.time * 60); // Convert minutes to seconds
    } else {
      // Use generated questions for sample exams
      const questionCount = exam.questions || 10;
      const generatedQuestions = generateQuestions(questionCount);
      setQuestions(generatedQuestions);
      setAnswers(new Array(questionCount).fill(null));
      setFlagged(new Array(questionCount).fill(false));
      setTimeLeft(exam.time * 60); // Convert minutes to seconds
    }
    
    setCurrentQuestionIndex(0);
    setCurrentView('exam-taking');
  };

  const startQuiz = () => {
    // Check if secret code is verified
    if (!codeVerified) {
      setCodeError('يجب إدخال رمز الامتحان السري أولاً');
      return;
    }
    
    setCurrentView('quiz');
    setExamStarted(true);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
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
    
    // If flagging the question, remove the answer
    if (newFlagged[currentQuestionIndex]) {
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = null;
      setAnswers(newAnswers);
    }
  };

  const finishExam = () => {
    console.log('finishExam function called');
    
    // Safety check for questions array
    if (!questions || questions.length === 0) {
      console.log('No questions available, cannot finish exam');
      return;
    }
    
    // Only count questions that are actually in the current exam
    const currentExamQuestions = questions.length;
    const answeredQuestions = answers.filter(answer => answer !== null).length;
    const unansweredQuestions = currentExamQuestions - answeredQuestions;
    
    console.log('Current exam questions:', currentExamQuestions);
    console.log('Answered questions:', answeredQuestions);
    console.log('Unanswered questions:', unansweredQuestions);
    
    if (unansweredQuestions > 0) {
      console.log('Showing warning for unanswered questions');
      setUnansweredCount(unansweredQuestions);
      setShowWarning(true);
      return;
    }
    
    console.log('Finishing exam without warning');
    const correctAnswers = answers.filter((answer, index) => 
      answer !== null && questions[index] && answer === questions[index].correct
    ).length;
    const score = Math.round((correctAnswers / questions.length) * 100);
    console.log('Final score:', score);
    setFinalScore(score);
    setShowResults(true);
    setCurrentView('results');
  };

  const confirmFinish = () => {
    setShowWarning(false);
    
    // Safety check for questions array
    if (!questions || questions.length === 0) {
      console.log('No questions available, cannot finish exam');
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

  // Timer effect
  useEffect(() => {
    if (examStarted && timeLeft > 0 && currentView === 'quiz') {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // Auto-finish when timer ends
            if (questions && questions.length > 0) {
              const correctAnswers = answers.filter((answer, index) => 
                answer !== null && questions[index] && answer === questions[index].correct
              ).length;
              const score = Math.round((correctAnswers / questions.length) * 100);
              setFinalScore(score);
              setShowResults(true);
              setCurrentView('results');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [examStarted, timeLeft, currentView, answers, questions]);

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

  // Helper function to get Baghdad time
  const getBaghdadTime = () => {
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

  // Combine sample and imported exams
  const allExams = [...sampleExams, ...importedExams];
  
  // Filter exams by selected subject
  const filteredExams = selectedSubject === 'Internal Medicine' || selectedSubject === 'Surgery' || selectedSubject === 'Obstetric & Gynecology' || selectedSubject === 'Pediatric'
    ? allExams.filter(exam => exam.subject === selectedSubject)
    : allExams;

  // Pagination logic
  const totalPages = Math.ceil(filteredExams.length / examsPerPage);
  const startIndex = (currentPage - 1) * examsPerPage;
  const endIndex = startIndex + examsPerPage;
  const currentExams = filteredExams.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSidebarToggle = () => setSidebarCollapsed((prev) => !prev);
  const handleDashboardSidebarToggle = () => setDashboardSidebarCollapsed((prev) => !prev);

  // Secret code verification function
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
    // If flagged and answered, show green (answer takes priority)
    if (answers[index] !== null) {
      return "bg-green-500 border-green-600 text-white";
    }
    // If flagged but not answered, show orange
    if (flagged[index]) {
      return "bg-orange-100 border-orange-500 text-orange-700";
    }
    // If current question, show dark gray (always dark gray, never orange)
    if (index === currentQuestionIndex) {
      return "bg-gray-600 border-gray-700 text-white current-question";
    }
    // Default state
    return "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200";
  };

  if (currentView === 'dashboard') {
    return (
      <div className="wizary-exam-page">
        <div className="flex h-screen bg-gray-100 main-container">
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
                className="p-1 sm:p-2 mr-2 sm:mr-3 text-white hover:bg-orange-600 rounded-lg transition-colors duration-200"
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
      </div>
    );
  }

  if (currentView === 'exam-list') {
    return (
      <div className="wizary-exam-page">
        <div className="flex h-screen bg-gray-100 main-container">
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
                className="p-1 sm:p-2 mr-2 sm:mr-3 text-white hover:bg-orange-600 rounded-lg transition-colors duration-200"
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
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">

            
            {/* Exam Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8 content-container">
              <div className="bg-green-700 text-white p-3 sm:p-4 rounded-lg text-center">
                <div className="text-xs sm:text-sm font-medium">الكلية/القسم</div>
                <div className="text-sm sm:text-lg font-bold">كلية الطب</div>
              </div>
              <div className="bg-blue-700 text-white p-3 sm:p-4 rounded-lg text-center">
                <div className="text-xs sm:text-sm font-medium">الجامعة</div>
                <div className="text-sm sm:text-lg font-bold">{user?.university || 'جامعة فلان'}</div>
              </div>
              <div className="bg-orange-500 text-white p-3 sm:p-4 rounded-lg text-center">
                <div className="text-xs sm:text-sm font-medium">التاريخ</div>
                <div className="text-sm sm:text-lg font-bold">{getBaghdadTime().day}, {getBaghdadTime().month}, {getBaghdadTime().year}</div>
              </div>
              <div className="bg-red-500 text-white p-3 sm:p-4 rounded-lg text-center">
                <div className="text-xs sm:text-sm font-medium">الساعة</div>
                <div className="text-sm sm:text-lg font-bold">{getBaghdadTime().time}</div>
              </div>
            </div>

            {/* Exam List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 content-container">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 relative gap-4">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800">List Exam</h3>
                  <button
                    onClick={() => setExamMenuOpen(!examMenuOpen)}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 text-sm"
                  >
                    <span className="text-xs sm:text-sm font-medium">Choose Exam</span>
                    <svg 
                      className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 ${examMenuOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {/* Overlay Menu */}
                  {examMenuOpen && (
                    <div className="absolute top-full right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-2 min-w-48 w-full sm:w-auto">
                      <div className="p-4">
                        <div className="space-y-2">
                          {subjects.map((subject) => (
                            <button
                              key={subject.id}
                              onClick={() => {
                                setSelectedSubject(subject.name);
                                setExamMenuOpen(false);
                              }}
                              className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-left ${
                                selectedSubject === subject.name
                                  ? 'bg-orange-500 text-white shadow-lg'
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
              <div className="block sm:hidden">
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
                  <div className="space-y-4 p-4">
                    {currentExams.map((exam, index) => (
                      <div key={exam.id} className={`bg-white border border-gray-200 rounded-lg p-4 ${exam.importedData ? 'bg-green-50 border-green-200' : ''}`}>
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-sm mb-1">{exam.name}</h4>
                            <p className="text-gray-600 text-xs mb-1">Subject: {exam.subject}</p>
                            <p className="text-gray-600 text-xs mb-1">Department: {exam.department}</p>
                            <div className="flex space-x-4 text-xs text-gray-500">
                              <span>Questions: {exam.questions}</span>
                              <span>Time: {exam.time} min</span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <button
                              onClick={() => startExam(exam)}
                              className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-xs font-medium whitespace-nowrap"
                            >
                              Take Exam
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">اسم الامتحان</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">المادة</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">الكلية/القسم</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">عدد الاسئلة</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">الوقت بالدقائق</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ادوات</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loadingExams ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center">
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-2 text-gray-600">Loading exams...</span>
                          </div>
                        </td>
                      </tr>
                    ) : currentExams.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                          No exams available
                        </td>
                      </tr>
                    ) : (
                      currentExams.map((exam, index) => (
                        <tr key={exam.id} className={`hover:bg-gray-50 ${exam.importedData ? 'bg-green-50' : ''}`}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{startIndex + index + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {exam.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{exam.subject}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{exam.department}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{exam.questions}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{exam.time} Minute</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <button
                              onClick={() => startExam(exam)}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                            >
                              Take Exam
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center space-x-2 sm:space-x-4 mt-6">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2 sm:px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Previous
              </button>
              <span className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">{currentPage}</span>
              <span className="px-2 sm:px-4 py-2 text-gray-600 text-sm">of {totalPages}</span>
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-2 sm:px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Next
              </button>
            </div>
          </main>
        </div>
        </div>
      </div>
    );
  }

  if (currentView === 'quiz') {
    return (
      <div className="wizary-exam-page">
        <div className="flex min-h-screen bg-gray-100 main-container">
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
        
        {/* Question Navigation Sidebar */}
        <aside
          className={`bg-white shadow-lg border-r border-gray-200 flex flex-col transition-all duration-300
            ${sidebarCollapsed ? 'w-16' : 'w-64 lg:w-80'}
          `}
          style={{ minWidth: sidebarCollapsed ? 64 : 320 }}
        >
          {/* Collapsed: Only hamburger at top */}
          {sidebarCollapsed ? (
            <>
              <div className="flex flex-col items-center w-full h-full">
                <div className="pt-4">
                  <button
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
                    onClick={handleSidebarToggle}
                    aria-label="Expand sidebar"
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4 px-6 pt-6">
                <h3 className="text-lg font-bold text-gray-800">Question Navigation</h3>
                <button
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
                  onClick={handleSidebarToggle}
                  aria-label="Collapse sidebar"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1 sm:gap-2 flex-grow content-start px-3 sm:px-6 pb-6">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToQuestion(index)}
                    className={`p-1 sm:p-2 rounded border-2 text-xs sm:text-sm font-bold transition-colors duration-200 h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center ${getNavButtonState(index)}`}
                  >
                    {answers[index] !== null ? String.fromCharCode(97 + answers[index]).toUpperCase() : index + 1}
                  </button>
                ))}
              </div>

            </>
          )}
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-blue-600 shadow-md p-2 sm:p-3 flex justify-between items-center text-white">
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">MBHA</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
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
                <span className="text-sm sm:text-lg font-bold text-gray-800">{formatTime(timeLeft)}</span>
              </div>
              
              <div className="mb-4 sm:mb-6 md:mb-8 flex-1">
                <p className="text-gray-800 text-base sm:text-lg md:text-xl leading-relaxed">
                  {questions[currentQuestionIndex]?.text || 'Loading question...'}
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {questions[currentQuestionIndex]?.options?.map((option: string, index: number) => (
                  <div
                    key={index}
                    className={`flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                      answers[currentQuestionIndex] === index
                        ? 'bg-green-100 border-green-500'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => selectAnswer(index)}
                  >
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded mr-3 sm:mr-4 flex items-center justify-center ${
                      answers[currentQuestionIndex] === index
                        ? 'bg-green-600'
                        : 'bg-gray-300'
                    }`}>
                      <span className={`text-sm sm:text-base font-bold ${
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
            <div className="flex justify-center space-x-2 sm:space-x-4 md:space-x-6 mt-6 sm:mt-8 md:mt-10">
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
                  onClick={() => {
                    console.log('Finished button clicked');
                    finishExam();
                  }}
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
      </div>
    );
  }

  if (currentView === 'exam-taking') {
    return (
      <div className="wizary-exam-page">
        <div className="flex h-screen bg-gray-100 main-container">
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
          <div className="flex-1 p-8 flex items-center justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-8xl w-full">
              {/* Left Panel - Exam Start and Timer */}
              <div className="bg-white p-10 rounded-lg shadow-sm border-2 border-blue-600 flex flex-col items-center justify-center">
                <div className="space-y-8 w-full">
                  <div className="bg-blue-600 text-white p-6 rounded-lg text-center">
                    <p className="text-base">سوف يتم احتساب الوقت منذ لحظة الضغط على زر "أبدء الامتحان"</p>
                  </div>
                  
                  <button
                    onClick={startQuiz}
                    className="w-full bg-green-600 text-white py-8 rounded-lg text-2xl font-bold hover:bg-green-700 transition-colors duration-200"
                  >
                    أبدء الامتحان
                  </button>
                  
                  <div className="bg-red-500 text-white p-6 rounded-lg text-center">
                    <p className="text-base">Day, 00 Hours 00 Minute, 00 Second</p>
                    <p className="text-base">الوقت المتبقي لانتهاء تاريخ الامتحان</p>
                  </div>
                </div>
              </div>

              {/* Right Panel - Exam Details Table with Blue Stroke */}
              <div className="bg-white p-10 rounded-lg shadow-sm border-2 border-blue-600">

                
                <div className="space-y-6">
                  <div className="flex justify-between border-b border-gray-200 pb-4">
                    <span className="text-gray-800 text-xl">{user ? `${user.firstName} ${user.lastName}` : 'فلان فلان'}</span>
                    <span className="text-gray-600 font-medium text-xl">اسم الطالب</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-4">
                    <span className="text-gray-800 text-xl">{user?.university || 'كلية الطب'} - المرحلة السادسة</span>
                    <span className="text-gray-600 font-medium text-xl">القسم/الصف</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-4">
                    <span className="text-gray-800 text-xl">{selectedExam?.name || 'الامتحان التقويمي'}</span>
                    <span className="text-gray-600 font-medium text-xl">اسم الامتحان</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-4">
                    <span className="text-gray-800 text-xl">{selectedExam?.questions || 100}</span>
                    <span className="text-gray-600 font-medium text-xl">عدد الاسئلة</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-4">
                    <span className="text-gray-800 text-xl">{selectedExam?.time || 180} دقيقة</span>
                    <span className="text-gray-600 font-medium text-xl">الوقت</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-4">
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
                      className="text-gray-800 bg-transparent border-none outline-none text-right text-xl"
                    />
                    <span className="text-gray-600 font-medium text-xl">رمز الامتحان السري</span>
                  </div>
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={verifySecretCode}
                      className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors duration-200"
                    >
                      تحقق
                    </button>
                    {codeVerified && (
                      <span className="text-green-600 text-sm font-medium">✓ تم التحقق من رمز الامتحان السري</span>
                    )}
                    {codeError && (
                      <span className="text-red-600 text-sm font-medium">{codeError}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    );
  }

  if (currentView === 'results') {
    const correctAnswers = answers.filter((answer, index) => answer === questions[index].correct).length;
    const totalQuestions = questions.length;
    
    return (
      <div className="wizary-exam-page">
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 main-container">
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
      </div>
    );
  }

  return null;
} 
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useExamState } from './_hooks/useExamState';
import { useTimer } from './_hooks/useTimer';
import ExamDashboard from './_components/ExamDashboard';
import ExamTaking from './_components/ExamTaking';
import QuizView from './_components/QuizView';
import ExamResults from './_components/ExamResults';
import { GuestBanner } from '@/app/components/GuestBanner';

export default function WizaryExam() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const examState = useExamState();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isLoading, isAuthenticated, router]);

  useTimer({
    examStarted: examState.examStarted,
    timeLeft: examState.timeLeft,
    currentView: examState.currentView,
    answers: examState.answers,
    questions: examState.questions,
    setTimeLeft: examState.setTimeLeft,
    setFinalScore: examState.setFinalScore,
    setShowResults: examState.setShowResults,
    setCurrentView: examState.setCurrentView,
  });

  if (examState.currentView === 'dashboard' || examState.currentView === 'exam-list') {
    return (
      <>
      <GuestBanner />
      <ExamDashboard
        user={user}
        currentView={examState.currentView}
        setCurrentView={examState.setCurrentView}
        dashboardSidebarCollapsed={examState.dashboardSidebarCollapsed}
        handleDashboardSidebarToggle={examState.handleDashboardSidebarToggle}
        isMobile={examState.isMobile}
        handleBackToDashboard={examState.handleBackToDashboard}
        selectedSubject={examState.selectedSubject}
        setSelectedSubject={examState.setSelectedSubject}
        examMenuOpen={examState.examMenuOpen}
        setExamMenuOpen={examState.setExamMenuOpen}
        loadingExams={examState.loadingExams}
        currentExams={examState.currentExams}
        startExam={examState.startExam}
        startIndex={examState.startIndex}
        totalPages={examState.totalPages}
        currentPage={examState.currentPage}
        handlePageChange={examState.handlePageChange}
        getBaghdadTime={examState.getBaghdadTime}
      />
      </>
    );
  }

  if (examState.currentView === 'exam-taking') {
    return (
      <ExamTaking
        user={user}
        selectedExam={examState.selectedExam}
        setCurrentView={examState.setCurrentView}
        startQuiz={examState.startQuiz}
        secretCode={examState.secretCode}
        setSecretCode={examState.setSecretCode}
        codeVerified={examState.codeVerified}
        codeError={examState.codeError}
        verifySecretCode={examState.verifySecretCode}
        showWarning={examState.showWarning}
        unansweredCount={examState.unansweredCount}
        cancelFinish={examState.cancelFinish}
        confirmFinish={examState.confirmFinish}
      />
    );
  }

  if (examState.currentView === 'quiz') {
    return (
      <QuizView
        questions={examState.questions}
        currentQuestionIndex={examState.currentQuestionIndex}
        answers={examState.answers}
        flagged={examState.flagged}
        timeLeft={examState.timeLeft}
        sidebarCollapsed={examState.sidebarCollapsed}
        isMobile={examState.isMobile}
        showWarning={examState.showWarning}
        unansweredCount={examState.unansweredCount}
        goToQuestion={examState.goToQuestion}
        selectAnswer={examState.selectAnswer}
        toggleFlag={examState.toggleFlag}
        finishExam={examState.finishExam}
        cancelFinish={examState.cancelFinish}
        confirmFinish={examState.confirmFinish}
        handleSidebarToggle={examState.handleSidebarToggle}
        getNavButtonState={examState.getNavButtonState}
      />
    );
  }

  if (examState.currentView === 'results') {
    return (
      <ExamResults
        questions={examState.questions}
        answers={examState.answers}
        finalScore={examState.finalScore}
        selectedResultQuestion={examState.selectedResultQuestion}
        setSelectedResultQuestion={examState.setSelectedResultQuestion}
        setCurrentView={examState.setCurrentView}
      />
    );
  }

  return null;
}

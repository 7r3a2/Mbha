'use client';

import { useEffect } from 'react';
import { CurrentView } from '../_lib/exam-types';

interface UseTimerProps {
  examStarted: boolean;
  timeLeft: number;
  currentView: CurrentView;
  answers: (number | null)[];
  questions: any[];
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  setFinalScore: React.Dispatch<React.SetStateAction<number>>;
  setShowResults: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentView: React.Dispatch<React.SetStateAction<CurrentView>>;
}

export function useTimer({
  examStarted,
  timeLeft,
  currentView,
  answers,
  questions,
  setTimeLeft,
  setFinalScore,
  setShowResults,
  setCurrentView,
}: UseTimerProps) {
  useEffect(() => {
    if (examStarted && timeLeft > 0 && currentView === 'quiz') {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
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
}

export function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

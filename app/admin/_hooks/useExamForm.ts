'use client';

import { useState } from 'react';
import Papa from 'papaparse';

export function useExamForm(loadData: () => Promise<void>, setMessage: (msg: string) => void, setError: (err: string) => void) {
  const [examTitle, setExamTitle] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('obgyn');
  const [examTime, setExamTime] = useState(180);
  const [secretCode, setSecretCode] = useState('HaiderAlaa');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [examView, setExamView] = useState<'list' | 'create'>('list');
  const [showCreateExam, setShowCreateExam] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    setFile(uploadedFile || null);
    setPreview([]);

    if (uploadedFile) {
      const fileExtension = uploadedFile.name.split('.').pop()?.toLowerCase();

      if (fileExtension === 'json') {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const jsonContent = e.target?.result as string;
            const data = JSON.parse(jsonContent);

            let questions = [];
            if (Array.isArray(data)) {
              questions = data;
            } else if (data.questions && Array.isArray(data.questions)) {
              questions = data.questions;
            } else if (data.exam && data.exam.questions) {
              questions = data.exam.questions;
            }

            const normalizedQuestions = questions
              .filter((q: any) => q.question)
              .map((q: any) => {
                const options = Array.isArray(q.options) ? q.options :
                        [q.option1, q.option2, q.option3, q.option4].filter(opt => opt?.trim());
                let correctIndex: number;
                if (q.correct !== undefined && q.correct !== null) {
                  correctIndex = typeof q.correct === 'number' ? q.correct : parseInt(q.correct) || 0;
                } else {
                  correctIndex = ((q.correct_option || q.correct_answer || q.answer || 1) - 1);
                }
                return {
                  question: q.question || '',
                  options,
                  correct: correctIndex
                };
              });

            setPreview(normalizedQuestions);
          } catch (error: any) {
            alert('Error parsing JSON file: ' + error.message);
          }
        };
        reader.readAsText(uploadedFile);
      } else {
        Papa.parse(uploadedFile, {
          header: true,
          transformHeader: (header: string) => header.trim().toLowerCase(),
          complete: (results) => {
            const headers = Object.keys(results.data[0] || {});
            const isWizardFormat = headers.includes('a') && headers.includes('b') && headers.includes('answer');

            const questions = results.data
              .filter((row: any) => {
                if (isWizardFormat) return row.question && row.a;
                return row.question && (row.option1 || row.options);
              })
              .map((row: any) => {
                let options = [];
                let correctOption = 0;

                if (isWizardFormat) {
                  options = [row.a, row.b, row.c, row.d].filter(opt => opt?.trim());
                  const answerVal = (row.answer || '').toString().trim().toUpperCase();
                  if (['A','B','C','D','E'].includes(answerVal)) {
                    correctOption = answerVal.charCodeAt(0) - 65;
                  } else {
                    correctOption = (parseInt(answerVal) || 1) - 1;
                  }
                } else if (row.options) {
                  try {
                    options = JSON.parse(row.options);
                  } catch (e) {
                    options = [row.option1, row.option2, row.option3, row.option4].filter(opt => opt?.trim());
                  }
                  correctOption = (parseInt(row.correct_option) || 1) - 1;
                } else {
                  options = [row.option1, row.option2, row.option3, row.option4].filter(opt => opt?.trim());
                  correctOption = (parseInt(row.correct_option) || 1) - 1;
                }

                return {
                  question: row.question || '',
                  options: options,
                  correct: correctOption,
                  explanation: row.explanation || '',
                  objective: row.objective || row.educational_objective || ''
                };
              });
            setPreview(questions);
          },
          error: (error) => {
            alert('Error parsing CSV file: ' + error.message);
          }
        });
      }
    }
  };

  const createNewExam = async () => {
    if (!examTitle.trim()) {
      alert('Please enter an exam title');
      return;
    }
    if (preview.length === 0) {
      alert('Please upload a CSV or JSON file with questions');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/admin/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: examTitle,
          subject: selectedSubject,
          examTime: examTime,
          secretCode: secretCode,
          questions: JSON.stringify(preview)
        })
      });
      const result = await response.json();
      if (response.ok) {
        setExamView('list');
        setExamTitle('');
        setFile(null);
        setPreview([]);
        await loadData();
        setMessage(`✅ Exam "${examTitle}" created successfully with ${preview.length} questions!`);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError('❌ ' + (result.error || 'Failed to create exam'));
        setTimeout(() => setError(''), 5000);
      }
    } catch (error) {
      setError('❌ Error creating exam. Please try again.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setExamView('list');
    setExamTitle('');
    setFile(null);
    setPreview([]);
    setMessage('');
    setError('');
  };

  return {
    examTitle, setExamTitle,
    selectedSubject, setSelectedSubject,
    examTime, setExamTime,
    secretCode, setSecretCode,
    file, setFile,
    preview, setPreview,
    examView, setExamView,
    showCreateExam, setShowCreateExam,
    examFormLoading: loading,
    handleFileUpload,
    createNewExam,
    resetForm,
  };
}

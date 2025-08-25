'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Papa from 'papaparse';

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [subscriptions, setSubscriptions] = useState<Record<string, { expiresAt: string }>>({});
  const [grantDuration, setGrantDuration] = useState<Record<string, string>>({});
  const [exams, setExams] = useState([]);
  
  // Debug: Log when exams state changes
  useEffect(() => {
    console.log('🔄 Exams state updated:', exams.length, 'exams');
  }, [exams]);
  const [uniqueCodes, setUniqueCodes] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editingExam, setEditingExam] = useState<any>(null);
  const [showCreateExam, setShowCreateExam] = useState(false);
  const [newCodeCount, setNewCodeCount] = useState(10);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [codeFilter, setCodeFilter] = useState<'all' | 'used' | 'available'>('all');
  
  // Exam creation states
  const [examTitle, setExamTitle] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('obgyn');
  const [examTime, setExamTime] = useState(180);
  const [secretCode, setSecretCode] = useState('HaiderAlaa');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [examView, setExamView] = useState<'list' | 'create'>('list');
const [qbankStructure, setQbankStructure] = useState<any[]>([]);
const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
const [selectedLectureId, setSelectedLectureId] = useState<string | null>(null);
const [adding, setAdding] = useState<{ entity: 'subject'|'source'|'lecture'|'topic'|null, parentId?: string|null }>({ entity: null });
const [newName, setNewName] = useState<string>('');
const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
const [questionsList, setQuestionsList] = useState<any[]>([]);
const [editingQuestion, setEditingQuestion] = useState<any | null>(null);

// New Qbank state variables
const [newSubjectName, setNewSubjectName] = useState('');
const [newSourceName, setNewSourceName] = useState('');
const [newLectureName, setNewLectureName] = useState('');
const [newTopicName, setNewTopicName] = useState('');
const [selectedSubjectForSource, setSelectedSubjectForSource] = useState('');
const [selectedSubjectForLecture, setSelectedSubjectForLecture] = useState('');
const [selectedLectureForTopic, setSelectedLectureForTopic] = useState('');
const [importSubject, setImportSubject] = useState('');
const [importSource, setImportSource] = useState('');
const [importLecture, setImportLecture] = useState('');
const [importTopic, setImportTopic] = useState('');
const [importFile, setImportFile] = useState<File | null>(null);
const [manageSubject, setManageSubject] = useState('');
const [questionFilterSubject, setQuestionFilterSubject] = useState('');
const [questionFilterLecture, setQuestionFilterLecture] = useState('');
const [questionFilterTopic, setQuestionFilterTopic] = useState('');
const [questionFilterSource, setQuestionFilterSource] = useState('');
const [filteredQuestions, setFilteredQuestions] = useState<any[]>([]);
const [csvPreview, setCsvPreview] = useState<any[]>([]);
const [csvPreviewCount, setCsvPreviewCount] = useState(0);
const [csvPreviewQuestion, setCsvPreviewQuestion] = useState<any | null>(null);

// Approach Management State
const [approachStructure, setApproachStructure] = useState<any[]>([]);
const [newMainFolder, setNewMainFolder] = useState('');
const [newSubFolder, setNewSubFolder] = useState('');
const [newApproachFile, setNewApproachFile] = useState('');
const [selectedMainFolder, setSelectedMainFolder] = useState('');
const [selectedSubFolder, setSelectedSubFolder] = useState('');
const [editingApproachItem, setEditingApproachItem] = useState<any | null>(null);

const loadQbankStructure = async () => {
    try {
      const res = await fetch('/api/qbank/structure');
      if (res.ok) {
        const data = await res.json();
        setQbankStructure(data);
      }
    } catch {}
  };

  const loadApproachStructure = async () => {
    try {
      const res = await fetch('/api/approach/structure');
      if (res.ok) {
        const data = await res.json();
        setApproachStructure(data);
      }
    } catch {}
  };

  useEffect(() => {
    // Check if user is admin (any user with admin code)
    if (!isLoading && (!user || !user.uniqueCode || !user.uniqueCode.startsWith('ADMIN'))) {
      router.push('/');
      return;
    }
    
    if (user?.uniqueCode?.startsWith('ADMIN')) {
      loadData();
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (activeTab === 'qbank') {
      loadQbankStructure();
    }
    if (activeTab === 'approach') {
      loadApproachStructure();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'users') {
      fetch('/api/admin/subscriptions')
        .then((r) => (r.ok ? r.json() : {}))
        .then((data) => setSubscriptions(data || {}))
        .catch(() => {});
    }
  }, [activeTab]);

// Helpers for IDs and persistence
const generateId = () => Math.random().toString(36).slice(2);
const persistStructure = async (next: any[]) => {
  setQbankStructure(next);
  await fetch('/api/qbank/structure', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(next)
  });
};

// Actions
const moveToTop = async (type: 'subject'|'source'|'lecture'|'topic', ids: { subjectId?: string, lectureId?: string, id: string }) => {
  const next = qbankStructure.map((s: any) => ({ ...s }));
  if (type === 'subject') {
    const idx = next.findIndex((s: any) => s.id === ids.id);
    if (idx > -1) {
      const [item] = next.splice(idx, 1);
      next.unshift(item);
    }
  } else if (type === 'source') {
    const subj = next.find((s: any) => s.id === ids.subjectId);
    if (subj) {
      subj.sources = subj.sources || [];
      const idx = subj.sources.findIndex((x: any) => x.id === ids.id);
      if (idx > -1) {
        const [item] = subj.sources.splice(idx, 1);
        subj.sources.unshift(item);
      }
    }
  } else if (type === 'lecture') {
    const subj = next.find((s: any) => s.id === ids.subjectId);
    if (subj) {
      subj.lectures = subj.lectures || [];
      const idx = subj.lectures.findIndex((x: any) => x.id === ids.id);
      if (idx > -1) {
        const [item] = subj.lectures.splice(idx, 1);
        subj.lectures.unshift(item);
      }
    }
  } else if (type === 'topic') {
    const subj = next.find((s: any) => s.id === ids.subjectId);
    const lec = subj?.lectures?.find((l: any) => l.id === ids.lectureId);
    if (lec) {
      lec.topics = lec.topics || [];
      const idx = lec.topics.findIndex((x: any) => x.id === ids.id);
      if (idx > -1) {
        const [item] = lec.topics.splice(idx, 1);
        lec.topics.unshift(item);
      }
    }
  }
  await persistStructure(next);
};

const removeEntity = async (type: 'subject'|'source'|'lecture'|'topic', ids: { subjectId?: string, lectureId?: string, id: string }) => {
  let next = qbankStructure.map((s: any) => ({ ...s }));
  if (type === 'subject') {
    next = next.filter((s: any) => s.id !== ids.id);
  } else if (type === 'source') {
    const subj = next.find((s: any) => s.id === ids.subjectId);
    if (subj) subj.sources = (subj.sources || []).filter((x: any) => x.id !== ids.id);
  } else if (type === 'lecture') {
    const subj = next.find((s: any) => s.id === ids.subjectId);
    if (subj) subj.lectures = (subj.lectures || []).filter((x: any) => x.id !== ids.id);
  } else if (type === 'topic') {
    const subj = next.find((s: any) => s.id === ids.subjectId);
    const lec = subj?.lectures?.find((l: any) => l.id === ids.lectureId);
    if (lec) lec.topics = (lec.topics || []).filter((x: any) => x.id !== ids.id);
  }
  await persistStructure(next);
};

const renameEntity = async (type: 'subject'|'source'|'lecture'|'topic', ids: { subjectId?: string, lectureId?: string, id: string }, newLabel: string) => {
  const next = qbankStructure.map((s: any) => ({ ...s }));
  if (type === 'subject') {
    const subj = next.find((s: any) => s.id === ids.id);
    if (subj) subj.label = newLabel;
  } else if (type === 'source') {
    const subj = next.find((s: any) => s.id === ids.subjectId);
    const src = subj?.sources?.find((x: any) => x.id === ids.id);
    if (src) src.label = newLabel;
  } else if (type === 'lecture') {
    const subj = next.find((s: any) => s.id === ids.subjectId);
    const lec = subj?.lectures?.find((x: any) => x.id === ids.id);
    if (lec) lec.title = newLabel;
  } else if (type === 'topic') {
    const subj = next.find((s: any) => s.id === ids.subjectId);
    const lec = subj?.lectures?.find((x: any) => x.id === ids.lectureId);
    const top = lec?.topics?.find((x: any) => x.id === ids.id);
    if (top) top.title = newLabel;
  }
  await persistStructure(next);
};

const startAdd = (entity: 'subject'|'source'|'lecture'|'topic', parentId?: string|null) => {
  setAdding({ entity, parentId: parentId || null });
  setNewName('');
};

const saveAdd = async () => {
  if (!adding.entity || !newName.trim()) { setAdding({ entity: null }); return; }
  const next = qbankStructure.map((s: any) => ({ ...s }));
  if (adding.entity === 'subject') {
    next.push({ id: generateId(), key: newName.trim().toLowerCase().replace(/\s+/g,'-'), label: newName.trim(), color: '#0072b7', lectures: [], sources: [] });
  } else if (adding.entity === 'source') {
    const subj = next.find((s: any) => s.id === adding.parentId);
    if (subj) {
      subj.sources = subj.sources || [];
      subj.sources.push({ id: generateId(), key: newName.trim().toLowerCase().replace(/\s+/g,'-'), label: newName.trim() });
    }
  } else if (adding.entity === 'lecture') {
    const subj = next.find((s: any) => s.id === adding.parentId);
    if (subj) {
      subj.lectures = subj.lectures || [];
      subj.lectures.push({ id: generateId(), title: newName.trim(), topics: [] });
    }
  } else if (adding.entity === 'topic') {
    // parentId is lectureId; find it inside selectedSubjectId
    const subj = next.find((s: any) => s.id === selectedSubjectId);
    const lec = subj?.lectures?.find((l: any) => l.id === adding.parentId);
    if (lec) {
      lec.topics = lec.topics || [];
      lec.topics.push({ id: generateId(), title: newName.trim() });
    }
  }
  setAdding({ entity: null });
  setNewName('');
  await persistStructure(next);
};

  const loadData = async () => {
    setLoading(true);
    try {
      console.log('🔄 Loading admin data...');
      const timestamp = Date.now(); // Cache buster
      const [usersRes, examsRes, codesRes] = await Promise.all([
        fetch(`/api/admin/users?t=${timestamp}`),
        fetch(`/api/admin/exams?t=${timestamp}`),
        fetch(`/api/admin/codes?t=${timestamp}`)
      ]);

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
        console.log('📊 Users loaded:', usersData.length);
      }
      if (examsRes.ok) {
        const examsData = await examsRes.json();
        setExams(examsData);
        console.log('📊 Exams loaded:', examsData.length);
      }
      if (codesRes.ok) {
        const codesData = await codesRes.json();
        setUniqueCodes(codesData);
        console.log('📊 Codes loaded:', codesData.length);
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setUsers(users.filter((u: any) => u.id !== userId));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const deleteExam = async (examId: string, examTitle: string = '') => {
    console.log('🔍 Delete button clicked for exam:', { examId, examTitle });
    
    if (!confirm(`Are you sure you want to delete "${examTitle}"? This action cannot be undone.`)) {
      console.log('❌ User cancelled deletion');
      return;
    }
    
    setLoading(true);
    try {
      console.log('🗑️ Sending delete request for exam:', examId);
      const response = await fetch(`/api/admin/exams/${examId}`, {
        method: 'DELETE'
      });
      
      console.log('📊 Delete response status:', response.status);
      
      if (response.ok) {
        console.log('✅ Exam deleted successfully');
        await loadData(); // Refresh all data
        setMessage(`✅ Exam "${examTitle}" deleted successfully!`);
        setTimeout(() => setMessage(''), 3000);
      } else {
        const errorData = await response.json();
        console.error('❌ Delete failed:', errorData);
        setError(`❌ Failed to delete exam: ${errorData.error || 'Unknown error'}`);
        setTimeout(() => setError(''), 5000);
      }
    } catch (error) {
      console.error('💥 Error deleting exam:', error);
      setError('❌ Network error while deleting exam. Please try again.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const generateCodes = async () => {
    const count = prompt('How many codes to generate? (1-100)');
    if (!count || isNaN(Number(count)) || Number(count) < 1 || Number(count) > 100) {
      alert('Please enter a valid number between 1 and 100');
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('Sending request to generate codes:', { count: Number(count) });
      
      const response = await fetch('/api/admin/generate-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: Number(count) })
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Success result:', result);
        alert(`✅ Successfully generated ${result.codes?.length || result.count || count} new registration codes!`);
        await loadData(); // Refresh data
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        try {
          const errorJson = JSON.parse(errorText);
          alert(`❌ Error: ${errorJson.error}`);
        } catch {
          alert(`❌ Error: ${errorText || 'Failed to generate codes'}`);
        }
      }
    } catch (error) {
      console.error('Network error generating codes:', error);
      alert('❌ Network error. Please check if server is running and try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateUserInfo = async (userId: string, userData: any) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      if (response.ok) {
        loadData();
        setEditingUser(null);
        alert('User updated successfully!');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user');
    }
  };

  const updateExamInfo = async (examId: string, examData: any) => {
    try {
      console.log('🔄 Updating exam:', examId, examData);
      const response = await fetch(`/api/admin/exams/${examId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(examData)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Exam updated successfully:', result);
        await loadData(); // Wait for data reload
        setEditingExam(null);
        alert('Exam updated successfully!');
      } else {
        const errorData = await response.json();
        console.error('❌ Update failed:', errorData);
        alert('Error updating exam: ' + (errorData.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('💥 Error updating exam:', error);
      alert('Error updating exam');
    }
  };

  const resetUserPassword = async (userId: string, userName: string) => {
    const newPassword = prompt(`Enter new password for ${userName}:`);
    if (!newPassword) return;
    
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    
    if (!confirm(`Are you sure you want to reset password for ${userName}?`)) return;
    
    try {
      const response = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newPassword })
      });
      
      if (response.ok) {
        alert('✅ Password reset successfully!');
      } else {
        const error = await response.json();
        alert(`❌ Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('❌ Failed to reset password. Please try again.');
    }
  };

  const unlockUserAccount = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to unlock account for ${userName}?`)) return;
    
    try {
      const response = await fetch('/api/admin/users/unlock-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      
      if (response.ok) {
        alert('✅ Account unlocked successfully!');
        // Refresh users list to update the UI
        loadData();
      } else {
        const error = await response.json();
        alert(`❌ Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error unlocking account:', error);
      alert('❌ Failed to unlock account. Please try again.');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    setFile(uploadedFile || null);
    setPreview([]);
    
    if (uploadedFile) {
      const fileExtension = uploadedFile.name.split('.').pop()?.toLowerCase();
      
      if (fileExtension === 'json') {
        // Handle JSON files
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const jsonContent = e.target?.result as string;
            const data = JSON.parse(jsonContent);
            
            // Support different JSON structures
            let questions = [];
            
            if (Array.isArray(data)) {
              // If root is array of questions
              questions = data;
            } else if (data.questions && Array.isArray(data.questions)) {
              // If wrapped in questions object
              questions = data.questions;
            } else if (data.exam && data.exam.questions) {
              // If nested in exam object
              questions = data.exam.questions;
            }
            
            // Normalize the question format
            const normalizedQuestions = questions
              .filter((q: any) => q.question)
              .map((q: any) => ({
                question: q.question || '',
                options: Array.isArray(q.options) ? q.options : 
                        [q.option1, q.option2, q.option3, q.option4].filter(opt => opt?.trim()),
                correct_option: q.correct_option || q.correct_answer || q.answer || 1
              }));
            
            setPreview(normalizedQuestions);
            console.log('✅ JSON file loaded:', normalizedQuestions.length, 'questions');
          } catch (error: any) {
            alert('Error parsing JSON file: ' + error.message);
            console.error('JSON parse error:', error);
          }
        };
        reader.readAsText(uploadedFile);
      } else {
        // Handle CSV files (existing logic)
        Papa.parse(uploadedFile, {
          header: true,
          complete: (results) => {
            const questions = results.data
              .filter((row: any) => row.question && (row.option1 || row.options))
              .map((row: any) => {
                // Handle different CSV formats
                let options = [];
                if (row.options) {
                  try {
                    options = JSON.parse(row.options);
                  } catch (e) {
                    options = [row.option1, row.option2, row.option3, row.option4].filter(opt => opt?.trim());
                  }
                } else {
                  options = [row.option1, row.option2, row.option3, row.option4].filter(opt => opt?.trim());
                }
                
                return {
                  question: row.question || '',
                  options: options,
                  correct_option: parseInt(row.correct_option) || 1
                };
              });
            setPreview(questions);
            console.log('✅ CSV file loaded:', questions.length, 'questions');
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
      console.log('📤 Creating exam with data:', {
        title: examTitle,
        subject: selectedSubject,
        examTime: examTime,
        secretCode: secretCode,
        questionsCount: preview.length
      });

      const response = await fetch('/api/admin/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: examTitle,
          subject: selectedSubject,
          examTime: examTime,
          secretCode: secretCode,
          questions: JSON.stringify(preview) // Convert questions to JSON string for database
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log('✅ Exam created successfully, refreshing data...');
        setExamView('list');
        setExamTitle('');
        setFile(null);
        setPreview([]);
        await loadData(); // Refresh data
        setMessage(`✅ Exam "${examTitle}" created successfully with ${preview.length} questions!`);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError('❌ ' + (result.error || 'Failed to create exam'));
        setTimeout(() => setError(''), 5000);
      }
    } catch (error) {
      setError('❌ Error creating exam. Please try again.');
      setTimeout(() => setError(''), 5000);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeSubject = qbankStructure.find((s: any) => s.id === selectedSubjectId);
  const activeLecture = activeSubject?.lectures?.find((l: any) => l.id === selectedLectureId);
  const activeSource = activeSubject?.sources?.find((src: any) => src.id === selectedSourceId);

  const loadQuestionsByFilter = async () => {
  if (!activeSubject || !activeSource || !activeLecture) { setQuestionsList([]); return; }
  const topicTitles = (activeLecture.topics || []).map((t: any) => t.title.toLowerCase());
    // Load all for this trio and then filter client-side by topic list
  const params = new URLSearchParams({
    subject: activeSubject.label,
    source: activeSource.label,
    });
    const res = await fetch(`/api/admin/qbank/questions?${params}`);
    if (res.ok) {
      const data = await res.json();
      setQuestionsList(data.filter((q: any) => topicTitles.includes((q.topic || '').toLowerCase())));
    }
  };

  useEffect(() => { loadQuestionsByFilter(); }, [selectedSubjectId, selectedSourceId, selectedLectureId]);

  const startEditQuestion = (q?: any) => {
  setEditingQuestion(q || { subject: activeSubject?.label || '', source: activeSource?.label || '', topic: '', text: '', options: ['', ''], correct: 0, explanation: { correct: '', incorrect: ['', ''], objective: '' } });
  };

  const saveQuestion = async () => {
    if (!editingQuestion) return;
    const payload = editingQuestion;
    const url = editingQuestion.id ? `/api/admin/qbank/questions/${editingQuestion.id}` : '/api/admin/qbank/questions';
    const method = editingQuestion.id ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.ok) {
      setEditingQuestion(null);
      await loadQuestionsByFilter();
    }
  };

  const deleteQuestion = async (id: number) => {
    if (!confirm('Delete this question?')) return;
    await fetch(`/api/admin/qbank/questions/${id}`, { method: 'DELETE' });
    await loadQuestionsByFilter();
  };

  // New Qbank functions
  const addSubject = async () => {
    if (!newSubjectName.trim()) return;
    const updatedStructure = [...qbankStructure];
    const newSubject = {
      key: Date.now().toString(),
      label: newSubjectName.trim(),
      color: '#0072b7',
      sources: [],
      lectures: []
    };
    updatedStructure.push(newSubject);
    await updateQbankStructure(updatedStructure);
    setNewSubjectName('');
  };

  const addSource = async () => {
    if (!selectedSubjectForSource || !newSourceName.trim()) return;
    const updatedStructure = qbankStructure.map((subject: any) => {
      if (subject.key === selectedSubjectForSource || subject.id === selectedSubjectForSource) {
        return {
          ...subject,
          sources: [...(subject.sources || []), {
            key: Date.now().toString(),
            label: newSourceName.trim()
          }]
        };
      }
      return subject;
    });
    await updateQbankStructure(updatedStructure);
    setNewSourceName('');
    setSelectedSubjectForSource('');
  };

  const addLecture = async () => {
    if (!selectedSubjectForLecture || !newLectureName.trim()) return;
    const updatedStructure = qbankStructure.map((subject: any) => {
      if (subject.key === selectedSubjectForLecture || subject.id === selectedSubjectForLecture) {
        return {
          ...subject,
          lectures: [...(subject.lectures || []), {
            title: newLectureName.trim(),
            topics: []
          }]
        };
      }
      return subject;
    });
    await updateQbankStructure(updatedStructure);
    setNewLectureName('');
    setSelectedSubjectForLecture('');
  };

  const addTopic = async () => {
    if (!selectedLectureForTopic || !newTopicName.trim()) return;
    
    console.log('🔄 Adding topic:', { selectedLectureForTopic, newTopicName });
    console.log('📊 Current structure:', qbankStructure);
    
    const updatedStructure = qbankStructure.map((subject: any) => ({
      ...subject,
      lectures: (subject.lectures || []).map((lecture: any) => {
        if (lecture.title === selectedLectureForTopic) {
          console.log('✅ Found matching lecture:', lecture.title);
          return {
            ...lecture,
            topics: [...(lecture.topics || []), newTopicName.trim()]
          };
        }
        return lecture;
      })
    }));
    
    console.log('🔄 Updated structure:', updatedStructure);
    await updateQbankStructure(updatedStructure);
    setNewTopicName('');
    setSelectedLectureForTopic('');
  };

  const importQuestions = async () => {
    if (!importFile || !importSubject || !importSource || !importLecture || !importTopic) return;
    const formData = new FormData();
    formData.append('file', importFile);
    formData.append('subject', importSubject);
    // importSource holds the key now
    formData.append('sourceKey', importSource);
    // Derive source label for convenience
    const sourceLabel = qbankStructure.find((s: any) => s.label === importSubject)?.sources?.find((src: any) => (src.key || src.id) === importSource)?.label || '';
    formData.append('sourceLabel', sourceLabel);
    formData.append('lecture', importLecture);
    formData.append('topic', importTopic);
    try {
      const response = await fetch('/api/admin/qbank/questions/import', { method: 'POST', body: formData });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        alert(`Questions imported successfully! Imported: ${data.imported || ''}`);
        setImportFile(null);
        setImportSubject('');
        setImportSource('');
        setImportLecture('');
        setImportTopic('');
        setCsvPreview([]);
        setCsvPreviewCount(0);
        setCsvPreviewQuestion(null);
      } else {
        console.error('Import failed:', data);
        alert(`Failed to import questions\n${data.error || ''}${data.details ? `\nDetails: ${data.details}` : ''}${data.expectedFormat ? `\nExpected format: ${data.expectedFormat}` : ''}`);
      }
    } catch (error: any) {
      console.error('Error importing questions:', error);
      alert(`Error importing questions: ${String(error?.message || error)}`);
    }
  };

  const deleteSource = async (subjectId: string, sourceId: string) => {
    if (!confirm('Delete this source?')) return;
    const updatedStructure = qbankStructure.map((subject: any) => {
      if (subject.key === subjectId || subject.id === subjectId) {
        return {
          ...subject,
          sources: (subject.sources || []).filter((s: any) => s.key !== sourceId && s.id !== sourceId)
        };
      }
      return subject;
    });
    await updateQbankStructure(updatedStructure);
  };

  const moveLectureToTop = async (subjectId: string, lectureId: string) => {
    const updatedStructure = qbankStructure.map((subject: any) => {
      if (subject.key === subjectId || subject.id === subjectId) {
        const lectures = [...(subject.lectures || [])];
        const lectureIndex = lectures.findIndex((l: any) => l.title === lectureId);
        if (lectureIndex > 0) {
          const [lecture] = lectures.splice(lectureIndex, 1);
          lectures.unshift(lecture);
        }
        return { ...subject, lectures };
      }
      return subject;
    });
    await updateQbankStructure(updatedStructure);
  };

  const deleteLecture = async (subjectId: string, lectureId: string) => {
    if (!confirm('Delete this lecture?')) return;
    const updatedStructure = qbankStructure.map((subject: any) => {
      if (subject.key === subjectId || subject.id === subjectId) {
        return {
          ...subject,
          lectures: (subject.lectures || []).filter((l: any) => l.title !== lectureId)
        };
      }
      return subject;
    });
    await updateQbankStructure(updatedStructure);
  };

  const deleteSubject = async (subjectId: string) => {
    if (!confirm('Delete this subject? This will also delete all its sources, lectures, and topics.')) return;
    const updatedStructure = qbankStructure.filter((subject: any) => subject.key !== subjectId && subject.id !== subjectId);
    await updateQbankStructure(updatedStructure);
    setManageSubject('');
  };

  const deleteTopic = async (subjectId: string, lectureId: string, topicId: string) => {
    if (!confirm('Delete this topic?')) return;
    const updatedStructure = qbankStructure.map((subject: any) => {
      if (subject.key === subjectId || subject.id === subjectId) {
        return {
          ...subject,
          lectures: (subject.lectures || []).map((lecture: any) => {
            if (lecture.title === lectureId) {
              return {
                ...lecture,
                topics: (lecture.topics || []).filter((t: any) => t.id !== topicId && t !== topicId)
              };
            }
            return lecture;
          })
        };
      }
      return subject;
    });
    await updateQbankStructure(updatedStructure);
  };

  const loadFilteredQuestions = async () => {
    if (!questionFilterSubject || !questionFilterLecture || !questionFilterTopic) return;
    try {
      const params = new URLSearchParams({
        subject: questionFilterSubject,
        lecture: questionFilterLecture,
        topic: questionFilterTopic,
        ...(questionFilterSource ? { sourceKey: questionFilterSource } : {})
      });
      const response = await fetch(`/api/admin/qbank/questions?${params}`);
      if (response.ok) {
        const data = await response.json();
        setFilteredQuestions(data);
      }
    } catch (error) {
      console.error('Error loading filtered questions:', error);
    }
  };

  const deleteAllQuestions = async () => {
    if (!questionFilterSubject || !questionFilterLecture || !questionFilterTopic) return;
    if (!confirm(`Are you sure you want to delete ALL questions for ${questionFilterTopic}? This action cannot be undone.`)) return;
    
    try {
      const params = new URLSearchParams({
        subject: questionFilterSubject,
        lecture: questionFilterLecture,
        topic: questionFilterTopic,
        ...(questionFilterSource ? { sourceKey: questionFilterSource } : {})
      });
      const response = await fetch(`/api/admin/qbank/questions/delete-all?${params}`, { method: 'DELETE' });
      if (response.ok) {
        setFilteredQuestions([]);
        alert(`Successfully deleted all questions for ${questionFilterTopic}`);
      } else {
        alert('Failed to delete questions');
      }
    } catch (error) {
      console.error('Error deleting questions:', error);
      alert('Error deleting questions');
    }
  };

  const updateQbankStructure = async (newStructure: any[]) => {
    try {
      const response = await fetch('/api/qbank/structure', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStructure)
      });
      if (response.ok) {
        setQbankStructure(newStructure);
      }
    } catch (error) {
      console.error('Error updating structure:', error);
    }
  };

  // Approach Management Functions
  const updateApproachStructure = async (newStructure: any[]) => {
    try {
      const response = await fetch('/api/approach/structure', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStructure)
      });
      if (response.ok) {
        setApproachStructure(newStructure);
      }
    } catch (error) {
      console.error('Error updating approach structure:', error);
    }
  };

  const addMainFolder = async () => {
    if (!newMainFolder.trim()) return;
    
    const newItem = {
      id: generateId(),
      title: newMainFolder.trim(),
      type: 'folder',
      path: newMainFolder.trim().toLowerCase().replace(/\s+/g, '-'),
      children: []
    };

    const updatedStructure = [...approachStructure, newItem];
    await updateApproachStructure(updatedStructure);
    setNewMainFolder('');
  };

  const addSubFolder = async () => {
    if (!newSubFolder.trim() || !selectedMainFolder) return;
    
    const newItem = {
      id: generateId(),
      title: newSubFolder.trim(),
      type: 'folder',
      path: `${selectedMainFolder}/${newSubFolder.trim().toLowerCase().replace(/\s+/g, '-')}`,
      children: []
    };

    const updatedStructure = approachStructure.map(item => {
      if (item.id === selectedMainFolder) {
        return {
          ...item,
          children: [...(item.children || []), newItem]
        };
      }
      return item;
    });

    await updateApproachStructure(updatedStructure);
    setNewSubFolder('');
    setSelectedMainFolder('');
  };

  const addApproachFile = async () => {
    if (!newApproachFile.trim() || !selectedSubFolder) return;
    
    const newItem = {
      id: generateId(),
      title: newApproachFile.trim(),
      type: 'file',
      path: `${selectedSubFolder}/${newApproachFile.trim().toLowerCase().replace(/\s+/g, '-')}`
    };

    const updatedStructure = approachStructure.map(mainFolder => {
      if (mainFolder.children) {
        const updatedChildren = mainFolder.children.map((subFolder: any) => {
          if (subFolder.id === selectedSubFolder) {
            return {
              ...subFolder,
              children: [...(subFolder.children || []), newItem]
            };
          }
          return subFolder;
        });
        return { ...mainFolder, children: updatedChildren };
      }
      return mainFolder;
    });

    await updateApproachStructure(updatedStructure);
    setNewApproachFile('');
    setSelectedSubFolder('');
  };

  const deleteApproachItem = async (itemId: string, parentId?: string, grandParentId?: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    let updatedStructure;
    
    if (grandParentId) {
      // Delete file from sub-folder (third level)
      updatedStructure = approachStructure.map(mainFolder => {
        if (mainFolder.id === grandParentId) {
          return {
            ...mainFolder,
            children: mainFolder.children?.map((subFolder: any) => {
              if (subFolder.id === parentId) {
                return {
                  ...subFolder,
                  children: (subFolder.children || []).filter((file: any) => file.id !== itemId)
                };
              }
              return subFolder;
            })
          };
        }
        return mainFolder;
      });
    } else if (parentId) {
      // Delete sub-folder from main folder (second level)
      updatedStructure = approachStructure.map(item => {
        if (item.id === parentId) {
          return {
            ...item,
            children: (item.children || []).filter((child: any) => child.id !== itemId)
          };
        }
        return item;
      });
    } else {
      // Delete main folder (first level)
      updatedStructure = approachStructure.filter(item => item.id !== itemId);
    }

    await updateApproachStructure(updatedStructure);
  };

  const moveApproachItem = async (itemId: string, direction: 'up' | 'down', parentId?: string, grandParentId?: string) => {
    let updatedStructure = [...approachStructure];
    
    if (grandParentId) {
      // Move files within sub-folder (third level)
      updatedStructure = updatedStructure.map(mainFolder => {
        if (mainFolder.id === grandParentId) {
          return {
            ...mainFolder,
            children: mainFolder.children.map((subFolder: any) => {
              if (subFolder.id === parentId) {
                const children = [...(subFolder.children || [])];
                const index = children.findIndex((child: any) => child.id === itemId);
                if (index > -1) {
                  if (direction === 'up' && index > 0) {
                    [children[index], children[index - 1]] = [children[index - 1], children[index]];
                  } else if (direction === 'down' && index < children.length - 1) {
                    [children[index], children[index + 1]] = [children[index + 1], children[index]];
                  }
                }
                return { ...subFolder, children };
              }
              return subFolder;
            })
          };
        }
        return mainFolder;
      });
    } else if (parentId) {
      // Move sub-folders within main folder (second level)
      updatedStructure = updatedStructure.map(item => {
        if (item.id === parentId) {
          const children = [...(item.children || [])];
          const index = children.findIndex((child: any) => child.id === itemId);
          if (index > -1) {
            if (direction === 'up' && index > 0) {
              [children[index], children[index - 1]] = [children[index - 1], children[index]];
            } else if (direction === 'down' && index < children.length - 1) {
              [children[index], children[index + 1]] = [children[index + 1], children[index]];
            }
          }
          return { ...item, children };
        }
        return item;
      });
    } else {
      // Move main folders at root level (first level)
      const index = updatedStructure.findIndex(item => item.id === itemId);
      if (index > -1) {
        if (direction === 'up' && index > 0) {
          [updatedStructure[index], updatedStructure[index - 1]] = [updatedStructure[index - 1], updatedStructure[index]];
        } else if (direction === 'down' && index < updatedStructure.length - 1) {
          [updatedStructure[index], updatedStructure[index + 1]] = [updatedStructure[index + 1], updatedStructure[index]];
        }
      }
    }

    await updateApproachStructure(updatedStructure);
  };

  // Robust CSV utilities for preview parsing
  function parseCSV(text: string): string[][] {
    const rows: string[][] = [];
    let currentField = '';
    let currentRow: string[] = [];
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (inQuotes) {
        if (char === '"') {
          if (i + 1 < text.length && text[i + 1] === '"') {
            currentField += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          currentField += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === ',') {
          currentRow.push(currentField);
          currentField = '';
        } else if (char === '\n' || char === '\r') {
          if (char === '\r' && i + 1 < text.length && text[i + 1] === '\n') i++;
          currentRow.push(currentField);
          if (currentRow.some((c) => (c ?? '').trim() !== '')) rows.push(currentRow);
          currentRow = [];
          currentField = '';
        } else {
          currentField += char;
        }
      }
    }
    if (currentField.length > 0 || currentRow.length > 0) {
      currentRow.push(currentField);
      if (currentRow.some((c) => (c ?? '').trim() !== '')) rows.push(currentRow);
    }
    return rows;
  }
  function cleanJsonString(jsonStr: string): string {
    let cleaned = (jsonStr || '').trim();
    if (cleaned.startsWith('"') && cleaned.endsWith('"')) cleaned = cleaned.slice(1, -1);
    cleaned = cleaned.replace(/\\\"/g, '"').replace(/""/g, '"');
    return cleaned;
  }

  const previewCsvFile = async (file: File) => {
    try {
      const text = await file.text();
      const rows = parseCSV(text);

      if (rows.length < 2) {
        setCsvPreview([]);
        setCsvPreviewCount(0);
        setCsvPreviewQuestion(null);
        return;
      }

      const headers = rows[0].map(h => (h || '').trim().toLowerCase());

      // Check format
      const isNewFormat = headers.includes('questions') && headers.includes('options') && headers.includes('correct_options');
      const isUserFormat = headers.includes('question') && headers.includes('options') && headers.includes('correct_option') && headers.includes('why the other options are incorrect:');
      const isSimpleFormat = headers.includes('question') && headers.includes('options') && headers.includes('correct_option') && headers.includes('incorrect_reasons');
      const isWizardFormat = headers.includes('a') && headers.includes('b') && headers.includes('answer');

      let requiredHeaders: string[] = [];
      let formatType = 'unknown';

      if (isNewFormat) {
        formatType = 'new';
        requiredHeaders = ['questions', 'options', 'correct_options', 'explanation', 'incorrect_options', 'educational_objective'];
      } else if (isUserFormat) {
        formatType = 'user';
        requiredHeaders = ['question', 'options', 'correct_option', 'explanation', 'why the other options are incorrect:', 'educational objective'];
      } else if (isSimpleFormat) {
        formatType = 'simple';
        requiredHeaders = ['question', 'options', 'correct_option', 'explanation', 'incorrect_reasons', 'educational_objective'];
      } else if (isWizardFormat) {
        formatType = 'wizard';
        requiredHeaders = ['question', 'a', 'b', 'c', 'd', 'answer', 'explanation', 'incorrect_a', 'incorrect_b', 'incorrect_c', 'incorrect_d', 'objective'];
      } else {
        formatType = 'old';
        requiredHeaders = ['question', 'option_a', 'option_b', 'option_c', 'option_d', 'correct', 'explanation', 'objective'];
      }

      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      if (missingHeaders.length > 0) {
        alert(`Missing required headers: ${missingHeaders.join(', ')}\n\nExpected format: ${formatType}`);
        setCsvPreview([]);
        setCsvPreviewCount(0);
        setCsvPreviewQuestion(null);
        return;
      }

      const preview: any[] = [];
      let validCount = 0;
      let firstPreviewQuestion: any | null = null;

      for (let i = 1; i < Math.min(rows.length, 6); i++) {
        const values = rows[i].map(v => (v ?? '').trim());
        if (values.length < headers.length) continue;

        const questionData: any = {};
        headers.forEach((header, index) => { questionData[header] = values[index] || ''; });

        let options: string[] = [];
        let correct: string = '';
        let explanation: string = '';
        let objective: string = '';

        if (formatType === 'new') {
          try {
            options = JSON.parse(questionData.options || '[]');
            correct = questionData.correct_options;
            explanation = questionData.explanation;
            objective = questionData.educational_objective;
          } catch { continue; }
        } else if (formatType === 'user') {
          try {
            options = JSON.parse(cleanJsonString(questionData.options || '[]'));
            correct = questionData.correct_option;
            explanation = questionData.explanation;
            objective = questionData['educational objective'];
          } catch { continue; }
        } else if (formatType === 'simple') {
          options = (questionData.options || '').split('|').filter((opt: string) => opt.trim());
          correct = questionData.correct_option;
          explanation = questionData.explanation;
          objective = questionData.educational_objective;
        } else if (formatType === 'wizard') {
          options = [questionData.a, questionData.b, questionData.c, questionData.d].filter((opt: string) => (opt || '').trim());
          correct = questionData.answer;
          explanation = questionData.explanation;
          objective = questionData.objective;
        } else {
          options = [questionData.option_a, questionData.option_b, questionData.option_c, questionData.option_d].filter((opt: string) => (opt || '').trim());
          correct = questionData.correct;
          explanation = questionData.explanation;
          objective = questionData.objective;
        }

        const questionText = formatType === 'new' ? questionData.questions : questionData.question;
        if (questionText && options.length >= 2) {
          if (i < 6) {
            preview.push({
              question: questionText.substring(0, 50) + '...',
              options: options,
              correct: correct,
              explanation: explanation ? 'Yes' : 'No',
              objective: objective ? 'Yes' : 'No',
              format: formatType
            });
          }
          if (!firstPreviewQuestion) {
            const correctIndex = (typeof correct === 'string' ? parseInt(correct) - 1 : Number(correct) - 1) || 0;
            firstPreviewQuestion = {
              id: 1,
              text: questionText,
              options,
              correct: Math.max(0, Math.min(correctIndex, options.length - 1)),
              explanation: { correct: explanation || '', incorrect: [], objective: objective || '' }
            };
          }
          validCount++;
        }
      }

      setCsvPreview(preview);
      setCsvPreviewCount(validCount);
      setCsvPreviewQuestion(firstPreviewQuestion);
    } catch (error) {
      console.error('Error previewing CSV:', error);
      setCsvPreview([]);
      setCsvPreviewCount(0);
      setCsvPreviewQuestion(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !user.uniqueCode || !user.uniqueCode.startsWith('ADMIN')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600">You don't have admin privileges</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {['users', 'exams', 'codes', 'qbank', 'approach'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-4 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab} {tab === 'users' ? `(${users.length})` : tab === 'exams' ? `(${exams.length})` : tab === 'codes' ? `(${uniqueCodes.length})` : ''}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">Registered Users</h3>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search by email..."
                          value={userSearchTerm}
                          onChange={(e) => setUserSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                      </div>
                      {userSearchTerm && (
                        <button
                          onClick={() => setUserSearchTerm('')}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">University</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code Used</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Access</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trial / Subscription</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users
                        .filter((user: any) => 
                          userSearchTerm === '' || 
                          user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
                        )
                                                .map((user: any) => (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {user.firstName} {user.lastName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.gender || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.university || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.uniqueCode}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                       <div className="flex flex-wrap gap-1">
                           {(() => {
                             const now = new Date();
                             const created = new Date(user.createdAt);
                             const trialEnds = new Date(created);
                             trialEnds.setDate(trialEnds.getDate() + 3);
                             const trialActive = now < trialEnds;
                             const sub = subscriptions[user.id];
                             const subActive = sub ? now < new Date(sub.expiresAt) : false;
                             const hasFullAccess = trialActive || subActive;
                             
                             if (hasFullAccess) {
                               return (
                                 <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                   Full Access
                                 </span>
                               );
                             } else {
                               return (
                                 <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                   Basic Access
                                 </span>
                               );
                             }
                           })()}
                         </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <button
                                onClick={() => setEditingUser(user)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => resetUserPassword(user.id, `${user.firstName} ${user.lastName}`)}
                                className="text-green-600 hover:text-green-900"
                              >
                                Reset Password
                              </button>
                              {/* Account Status */}
                              <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mr-2">
                                {user.isLocked ? (
                                  <span className="bg-red-100 text-red-800 flex items-center">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Locked
                                  </span>
                                ) : (
                                  <span className="bg-green-100 text-green-800 flex items-center">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Active
                                  </span>
                                )}
                              </div>
                              {/* Unlock Account Button */}
                              {user.isLocked && (
                                <button
                                  onClick={() => unlockUserAccount(user.id, `${user.firstName} ${user.lastName}`)}
                                  className="text-orange-600 hover:text-orange-900"
                                >
                                  Unlock Account
                                </button>
                              )}
                              <button
                                onClick={() => deleteUser(user.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {(() => {
                                const now = new Date();
                                const created = new Date(user.createdAt);
                                const trialEnds = new Date(created);
                                trialEnds.setDate(trialEnds.getDate() + 3);
                                const trialActive = now < trialEnds;
                                const sub = subscriptions[user.id];
                                const subActive = sub ? now < new Date(sub.expiresAt) : false;
                                if (trialActive && !subActive) {
                                  return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Trial until {trialEnds.toLocaleDateString()}</span>;
                                }
                                if (subActive) {
                                  return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Subscribed until {new Date(sub.expiresAt).toLocaleDateString()}</span>;
                                }
                                return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">No active plan</span>;
                              })()}
                              <div className="mt-2 flex items-center gap-2">
                                <select
                                  value={grantDuration[user.id] || ''}
                                  onChange={(e) => setGrantDuration({ ...grantDuration, [user.id]: e.target.value })}
                                  className="border border-gray-300 rounded px-2 py-1 text-xs text-black"
                                >
                                  <option value="">Grant duration…</option>
                                  <option value="1:day">1 day</option>
                                  <option value="1:week">1 week</option>
                                  <option value="1:month">1 month</option>
                                  <option value="6:month">6 months</option>
                                  <option value="1:year">1 year</option>
                                </select>
                                <button
                                  onClick={async () => {
                                    const sel = grantDuration[user.id];
                                    if (!sel) return;
                                    const [amountStr, unit] = sel.split(':');
                                    const amount = parseInt(amountStr, 10);
                                    const res = await fetch('/api/admin/subscriptions', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ userId: user.id, amount, unit })
                                    });
                                    if (res.ok) {
                                      const data = await res.json();
                                      setSubscriptions({ ...subscriptions, [user.id]: { expiresAt: data.expiresAt } });
                                      // force refresh verify on next navigation by removing cached user in storage so effective flags update immediately
                                      try {
                                        const stored = localStorage.getItem('auth_user');
                                        if (stored) {
                                          const parsed = JSON.parse(stored);
                                          if (parsed?.id === user.id) {
                                            localStorage.removeItem('auth_user');
                                          }
                                        }
                                      } catch {}
                                    }
                                  }}
                                  className="text-xs px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                                >Grant</button>
                                {(() => {
                                  const sub = subscriptions[user.id];
                                  const subActive = sub ? new Date() < new Date(sub.expiresAt) : false;
                                  if (subActive) {
                                    return (
                                      <button
                                        onClick={async () => {
                                          if (!confirm(`Remove subscription for ${user.firstName} ${user.lastName}?`)) return;
                                          const res = await fetch(`/api/admin/subscriptions?userId=${user.id}`, {
                                            method: 'DELETE'
                                          });
                                          if (res.ok) {
                                            const newSubs = { ...subscriptions };
                                            delete newSubs[user.id];
                                            setSubscriptions(newSubs);
                                            // force refresh verify on next navigation
                                            try {
                                              const stored = localStorage.getItem('auth_user');
                                              if (stored) {
                                                const parsed = JSON.parse(stored);
                                                if (parsed?.id === user.id) {
                                                  localStorage.removeItem('auth_user');
                                                }
                                              }
                                            } catch {}
                                          }
                                        }}
                                        className="text-xs px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700 ml-1"
                                      >Remove</button>
                                    );
                                  }
                                  return null;
                                })()}
                              </div>
                            </td>
                          </tr>
                        ))}
                      {users.filter((user: any) => 
                        userSearchTerm === '' || 
                        user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
                      ).length === 0 && (
                        <tr>
                          <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                            {userSearchTerm ? (
                              <div>
                                <p className="text-lg font-medium">No users found</p>
                                <p className="text-sm">No users match the search term "{userSearchTerm}"</p>
                              </div>
                            ) : (
                              <div>
                                <p className="text-lg font-medium">No users registered</p>
                                <p className="text-sm">No users have registered yet.</p>
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Exams Tab */}
            {activeTab === 'exams' && (
              <div className="space-y-6">
                {/* Messages */}
                {message && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    {message}
                  </div>
                )}
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                {/* Exam Management */}
                <div className="bg-white shadow rounded-lg">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-900">Exam Management</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setExamView('list')}
                          className={`px-4 py-2 rounded-lg font-medium ${
                            examView === 'list' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          View Exams ({exams.length})
                        </button>
                        <button
                          onClick={() => {
                            setExamView('create');
                            setMessage('');
                            setError('');
                          }}
                          className={`px-4 py-2 rounded-lg font-medium ${
                            examView === 'create' 
                              ? 'bg-green-600 text-white' 
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          Create New Exam
                        </button>
                        <button
                          onClick={loadData}
                          disabled={loading}
                          className="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                        >
                          {loading ? 'Refreshing...' : '🔄 Refresh'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Exams List View */}
                  {examView === 'list' && (
                    <div className="overflow-x-auto">
                      <table key={exams.length} className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time (min)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Secret Code</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Questions</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {exams.map((exam: any) => (
                            <tr key={exam.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{exam.title}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{exam.subject}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{exam.examTime}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">{exam.secretCode}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {JSON.parse(exam.questions).length} questions
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(exam.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => setEditingExam(exam)}
                                    className="text-blue-600 hover:text-blue-900 font-medium"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => deleteExam(exam.id, exam.title)}
                                    disabled={loading}
                                    className="text-red-600 hover:text-red-900 font-medium disabled:opacity-50"
                                  >
                                    {loading ? 'Deleting...' : 'Delete'}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {loading && (
                            <tr>
                              <td colSpan={7} className="p-6 text-center text-gray-500">
                                <div className="flex justify-center items-center">
                                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                                  Loading exams...
                                </div>
                              </td>
                            </tr>
                          )}
                          
                          {!loading && exams.length === 0 && (
                            <tr>
                              <td colSpan={7} className="p-6 text-center text-gray-500">
                                <p className="text-lg">No exams found.</p>
                                <p className="text-sm">Create your first exam using the "Create New Exam" tab.</p>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Create Exam View */}
                  {examView === 'create' && (
                    <div className="p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-6">Create New Exam - Upload Questions File</h4>
                      
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Exam Title</label>
                            <input
                              type="text"
                              value={examTitle}
                              onChange={(e) => setExamTitle(e.target.value)}
                              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                              placeholder="Enter exam title"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">Subject</label>
                            <select
                              value={selectedSubject}
                              onChange={(e) => setSelectedSubject(e.target.value)}
                              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                            >
                              <option value="obgyn">Obstetric & Gynecology</option>
                              <option value="im">Internal Medicine</option>
                              <option value="surgery">Surgery</option>
                              <option value="pediatrics">Pediatrics</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">Exam Time (minutes)</label>
                            <input
                              type="number"
                              value={examTime}
                              onChange={(e) => setExamTime(Number(e.target.value))}
                              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                              min="1"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">Secret Code</label>
                            <input
                              type="text"
                              value={secretCode}
                              onChange={(e) => setSecretCode(e.target.value)}
                              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Questions File</label>
                          <input
                            type="file"
                            accept=".json,.csv"
                            onChange={handleFileUpload}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                          <div className="mt-1 text-xs text-gray-500">
                            <p><strong>JSON format:</strong> {`[{"question": "...", "options": ["A", "B", "C", "D"], "correct_option": 1}]`}</p>
                            <p><strong>CSV format:</strong> question, option1, option2, option3, option4, correct_option</p>
                          </div>
                        </div>

                        {preview.length > 0 && (
                          <div>
                            <h5 className="text-md font-medium text-gray-900 mb-3">Preview Questions ({preview.length})</h5>
                            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                              {preview.slice(0, 3).map((question, index) => (
                                <div key={index} className="p-4 border-b border-gray-200">
                                  <p className="font-medium text-gray-900">{index + 1}. {question.question}</p>
                                  <ul className="mt-2 space-y-1">
                                    {question.options.map((option: string, optIndex: number) => (
                                      <li key={optIndex} className={`text-sm ${optIndex + 1 === question.correct_option ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                                        {optIndex + 1}. {option}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                              {preview.length > 3 && (
                                <div className="p-4 text-center text-gray-500">
                                  ... and {preview.length - 3} more questions
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              setExamView('list');
                              setExamTitle('');
                              setFile(null);
                              setPreview([]);
                              setMessage('');
                              setError('');
                            }}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={createNewExam}
                            disabled={loading || !examTitle.trim() || preview.length === 0}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                          >
                            {loading ? 'Creating...' : `Create Exam (${preview.length} questions)`}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Codes Tab */}
            {activeTab === 'codes' && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Registration Codes</h3>
                  <div className="flex items-center space-x-4">
                    {/* Filter Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCodeFilter('all')}
                        className={`px-3 py-1 text-sm rounded-md ${
                          codeFilter === 'all' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        All ({uniqueCodes.length})
                      </button>
                      <button
                        onClick={() => setCodeFilter('available')}
                        className={`px-3 py-1 text-sm rounded-md ${
                          codeFilter === 'available' 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Available ({uniqueCodes.filter((code: any) => !code.used).length})
                      </button>
                      <button
                        onClick={() => setCodeFilter('used')}
                        className={`px-3 py-1 text-sm rounded-md ${
                          codeFilter === 'used' 
                            ? 'bg-red-600 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Used ({uniqueCodes.filter((code: any) => code.used).length})
                      </button>
                    </div>
                    <button
                      onClick={generateCodes}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      Generate Codes
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Used By</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Used At</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {uniqueCodes
                        .filter((code: any) => {
                          if (codeFilter === 'all') return true;
                          if (codeFilter === 'used') return code.used;
                          if (codeFilter === 'available') return !code.used;
                          return true;
                        })
                        .map((code: any) => (
                        <tr key={code.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{code.code}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              code.used ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {code.used ? 'Used' : 'Available'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{code.usedBy || 'N/A'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {code.usedAt ? new Date(code.usedAt).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {code.createdAt ? new Date(code.createdAt).toLocaleDateString() : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Qbank Management */}
            {activeTab === 'qbank' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Qbank Management</h3>
                  
                  {/* Section 1: Add Structure */}
                  <div className="mb-8">
                    <h4 className="text-md font-medium text-gray-800 mb-3 border-b pb-2">1. Add Structure</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Add Subject */}
                      <div className="border rounded-lg p-4">
                        <h5 className="font-medium text-gray-700 mb-2">Add Subject</h5>
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Subject name"
                            value={newSubjectName}
                            onChange={(e) => setNewSubjectName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                          />
                          <button
                            onClick={addSubject}
                            disabled={!newSubjectName.trim()}
                            className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                          >
                            Add Subject
                          </button>
                        </div>
                      </div>

                      {/* Add Source */}
                      <div className="border rounded-lg p-4">
                        <h5 className="font-medium text-gray-700 mb-2">Add Source</h5>
                        <div className="space-y-2">
                          <select
                            value={selectedSubjectForSource || ''}
                            onChange={(e) => setSelectedSubjectForSource(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                          >
                            <option value="">Select Subject</option>
                            {qbankStructure.map((subject: any) => (
                              <option key={subject.key || subject.id} value={subject.key || subject.id}>{subject.label}</option>
                            ))}
                          </select>
                          <input
                            type="text"
                            placeholder="Source name"
                            value={newSourceName}
                            onChange={(e) => setNewSourceName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                          />
                          <button
                            onClick={addSource}
                            disabled={!selectedSubjectForSource || !newSourceName.trim()}
                            className="w-full px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                          >
                            Add Source
                          </button>
                        </div>
                      </div>

                      {/* Add Lecture */}
                      <div className="border rounded-lg p-4">
                        <h5 className="font-medium text-gray-700 mb-2">Add Lecture</h5>
                        <div className="space-y-2">
                          <select
                            value={selectedSubjectForLecture || ''}
                            onChange={(e) => setSelectedSubjectForLecture(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                          >
                            <option value="">Select Subject</option>
                            {qbankStructure.map((subject: any) => (
                              <option key={subject.key || subject.id} value={subject.key || subject.id}>{subject.label}</option>
                            ))}
                          </select>
                          <input
                            type="text"
                            placeholder="Lecture name"
                            value={newLectureName}
                            onChange={(e) => setNewLectureName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                          />
                          <button
                            onClick={addLecture}
                            disabled={!selectedSubjectForLecture || !newLectureName.trim()}
                            className="w-full px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                          >
                            Add Lecture
                          </button>
                        </div>
                      </div>

                      {/* Add Topic */}
                      <div className="border rounded-lg p-4">
                        <h5 className="font-medium text-gray-700 mb-2">Add Topic</h5>
                        <div className="space-y-2">
                          <select
                            value={selectedLectureForTopic || ''}
                            onChange={(e) => setSelectedLectureForTopic(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                          >
                            <option value="">Select Lecture</option>
                            {qbankStructure.map((subject: any) => 
                              (subject.lectures || []).map((lecture: any) => (
                                <option key={lecture.id || lecture.title} value={lecture.id || lecture.title}>{subject.label} - {lecture.title}</option>
                              ))
                            ).flat()}
                          </select>
                          <input
                            type="text"
                            placeholder="Topic name"
                            value={newTopicName}
                            onChange={(e) => setNewTopicName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                          />
                          <button
                            onClick={addTopic}
                            disabled={!selectedLectureForTopic || !newTopicName.trim()}
                            className="w-full px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
                          >
                            Add Topic
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Import Questions */}
                  <div className="mb-8">
                    <h4 className="text-md font-medium text-gray-800 mb-3 border-b pb-2">2. Import Questions</h4>
                    <div className="border rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <select
                          value={importSubject || ''}
                          onChange={(e) => setImportSubject(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                        >
                          <option value="">Select Subject</option>
                          {qbankStructure.map((subject: any) => (
                            <option key={subject.key || subject.id} value={subject.label}>{subject.label}</option>
                          ))}
                        </select>
                        <select
                          value={importSource || ''}
                          onChange={(e) => setImportSource(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                        >
                          <option value="">Select Source</option>
                          {qbankStructure.find((s: any) => s.label === importSubject)?.sources?.map((source: any) => (
                            <option key={source.key || source.id} value={source.key || source.id}>{source.label}</option>
                          )) || []}
                        </select>
                        <select
                          value={importLecture || ''}
                          onChange={(e) => setImportLecture(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                        >
                          <option value="">Select Lecture</option>
                          {qbankStructure.find((s: any) => s.label === importSubject)?.lectures?.map((lecture: any) => (
                            <option key={lecture.id || lecture.title} value={lecture.title}>{lecture.title}</option>
                          )) || []}
                        </select>
                        <select
                          value={importTopic || ''}
                          onChange={(e) => setImportTopic(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                        >
                          <option value="">Select Topic</option>
                          {qbankStructure.find((s: any) => s.label === importSubject)?.lectures?.find((l: any) => l.title === importLecture)?.topics?.map((topic: any) => (
                            <option key={topic.id || topic} value={typeof topic === 'string' ? topic : topic.title}>{typeof topic === 'string' ? topic : topic.title}</option>
                          )) || []}
                        </select>
                      </div>
                      <div className="flex items-center gap-4">
                        <input
                          type="file"
                          accept=".csv"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setImportFile(file);
                            if (file) {
                              previewCsvFile(file);
                            } else {
                              setCsvPreview([]);
                              setCsvPreviewCount(0);
                            }
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                        />
                        <button
                          onClick={importQuestions}
                          disabled={!importSubject || !importSource || !importLecture || !importTopic || !importFile}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                          Import Questions
                        </button>
                      </div>
                      {csvPreviewCount > 0 && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <div className="text-sm font-medium text-blue-900 mb-2">
                            CSV Preview: {csvPreviewCount} questions will be imported ({csvPreview[0]?.format || 'Unknown'} format)
                          </div>
                          {csvPreviewQuestion && (
                            <div className="mb-3 bg-white rounded-lg border p-3">
                              <div className="text-gray-900 font-semibold mb-2">How it will appear</div>
                              <div className="text-black mb-3">{csvPreviewQuestion.text}</div>
                              <div className="space-y-2">
                                {csvPreviewQuestion.options.map((opt: string, idx: number) => (
                                  <div key={idx} className={`p-2 border rounded ${idx === csvPreviewQuestion.correct ? 'bg-green-50 border-green-400' : 'border-gray-300'}`}>
                                    {String.fromCharCode(65 + idx)}. {opt}
                                  </div>
                                ))}
                              </div>
                              {(csvPreviewQuestion.explanation?.correct || csvPreviewQuestion.explanation?.objective) && (
                                <div className="mt-3 text-sm text-gray-600">
                                  {csvPreviewQuestion.explanation.correct && (
                                    <div className="mb-1"><span className="font-medium text-gray-800">Explanation:</span> {csvPreviewQuestion.explanation.correct}</div>
                                  )}
                                  {csvPreviewQuestion.explanation.objective && (
                                    <div><span className="font-medium text-gray-800">Educational Objective:</span> {csvPreviewQuestion.explanation.objective}</div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {csvPreview.map((item, index) => (
                              <div key={index} className="text-xs bg-white p-2 rounded border">
                                <div className="font-medium text-gray-900">{item.question}</div>
                                <div className="text-gray-600 text-xs">
                                  Options: {item.options.length} | Correct: {item.correct} | 
                                  Explanation: {item.explanation} | Objective: {item.objective}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section 3: Control & Manage */}
                  <div>
                    <h4 className="text-md font-medium text-gray-800 mb-3 border-b pb-2">3. Control & Manage</h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Structure Management */}
                      <div className="border rounded-lg p-4">
                        <h5 className="font-medium text-gray-700 mb-3">Structure Management</h5>
                        <select
                          value={manageSubject || ''}
                          onChange={(e) => setManageSubject(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white mb-3"
                        >
                          <option value="">Select Subject to Manage</option>
                          {qbankStructure.map((subject: any) => (
                            <option key={subject.key || subject.id} value={subject.key || subject.id}>{subject.label}</option>
                          ))}
                        </select>
                        {manageSubject && (
                          <div className="space-y-3">
                            <div>
                              <h6 className="font-medium text-gray-600 mb-2">Subject</h6>
                              <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                                <span className="text-gray-900 font-medium">
                                  {qbankStructure.find((s: any) => s.key === manageSubject || s.id === manageSubject)?.label}
                                </span>
                                <button
                                  onClick={() => deleteSubject(manageSubject)}
                                  className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200"
                                >
                                  Delete Subject
                                </button>
                              </div>
                            </div>
                            <div>
                              <h6 className="font-medium text-gray-600 mb-2">Sources</h6>
                              <div className="space-y-1">
                                {qbankStructure.find((s: any) => s.key === manageSubject || s.id === manageSubject)?.sources?.map((source: any, idx: number) => (
                                  <div key={source.key || source.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                    <span className="text-gray-900">{source.label}</span>
                                    <div className="flex gap-1">
                                      <button
                                        onClick={async () => {
                                          const updated = qbankStructure.map((subject: any) => {
                                            if (subject.key === manageSubject || subject.id === manageSubject) {
                                              const arr = [...(subject.sources || [])];
                                              if (idx > 0) {
                                                const [item] = arr.splice(idx, 1);
                                                arr.splice(idx - 1, 0, item);
                                              }
                                              return { ...subject, sources: arr };
                                            }
                                            return subject;
                                          });
                                          await updateQbankStructure(updated);
                                        }}
                                        className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                                      >↑</button>
                                      <button
                                        onClick={async () => {
                                          const updated = qbankStructure.map((subject: any) => {
                                            if (subject.key === manageSubject || subject.id === manageSubject) {
                                              const arr = [...(subject.sources || [])];
                                              if (idx < arr.length - 1) {
                                                const [item] = arr.splice(idx, 1);
                                                arr.splice(idx + 1, 0, item);
                                              }
                                              return { ...subject, sources: arr };
                                            }
                                            return subject;
                                          });
                                          await updateQbankStructure(updated);
                                        }}
                                        className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                                      >↓</button>
                                      <button
                                        onClick={() => deleteSource(manageSubject, source.key || source.id)}
                                        className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200"
                                      >Delete</button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h6 className="font-medium text-gray-600 mb-2">Lectures</h6>
                              <div className="space-y-1">
                                {qbankStructure.find((s: any) => s.key === manageSubject || s.id === manageSubject)?.lectures?.map((lecture: any, lidx: number) => (
                                  <div key={lecture.id || lecture.title} className="space-y-2">
                                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                      <span className="text-gray-900">{lecture.title}</span>
                                      <div className="flex gap-1">
                                        <button
                                          onClick={async () => {
                                            const updated = qbankStructure.map((subject: any) => {
                                              if (subject.key === manageSubject || subject.id === manageSubject) {
                                                const arr = [...(subject.lectures || [])];
                                                if (lidx > 0) {
                                                  const [item] = arr.splice(lidx, 1);
                                                  arr.splice(lidx - 1, 0, item);
                                                }
                                                return { ...subject, lectures: arr };
                                              }
                                              return subject;
                                            });
                                            await updateQbankStructure(updated);
                                          }}
                                          className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                                        >↑</button>
                                        <button
                                          onClick={async () => {
                                            const updated = qbankStructure.map((subject: any) => {
                                              if (subject.key === manageSubject || subject.id === manageSubject) {
                                                const arr = [...(subject.lectures || [])];
                                                if (lidx < arr.length - 1) {
                                                  const [item] = arr.splice(lidx, 1);
                                                  arr.splice(lidx + 1, 0, item);
                                                }
                                                return { ...subject, lectures: arr };
                                              }
                                              return subject;
                                            });
                                            await updateQbankStructure(updated);
                                          }}
                                          className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                                        >↓</button>
                                        <button
                                          onClick={() => moveLectureToTop(manageSubject, lecture.id || lecture.title)}
                                          className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                                        >
                                          Top
                                        </button>
                                        <button
                                          onClick={() => deleteLecture(manageSubject, lecture.id || lecture.title)}
                                          className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200"
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    </div>
                                    {/* Topics for this lecture */}
                                    <div className="ml-4 space-y-1">
                                      <div className="text-xs font-medium text-gray-500">Topics:</div>
                                      {(lecture.topics || []).map((topic: any, tidx: number) => (
                                        <div key={topic.id || topic} className="flex items-center justify-between p-1 bg-gray-25 rounded text-sm">
                                          <span className="text-gray-700">{typeof topic === 'string' ? topic : topic.title}</span>
                                          <div className="flex gap-1">
                                            <button
                                              onClick={async () => {
                                                const updated = qbankStructure.map((subject: any) => {
                                                  if (subject.key === manageSubject || subject.id === manageSubject) {
                                                    return {
                                                      ...subject,
                                                      lectures: (subject.lectures || []).map((lec: any) => {
                                                        if (lec.title === (lecture.id || lecture.title)) {
                                                          const arr = [...(lec.topics || [])];
                                                          if (tidx > 0) {
                                                            const [item] = arr.splice(tidx, 1);
                                                            arr.splice(tidx - 1, 0, item);
                                                          }
                                                          return { ...lec, topics: arr };
                                                        }
                                                        return lec;
                                                      })
                                                    };
                                                  }
                                                  return subject;
                                                });
                                                await updateQbankStructure(updated);
                                              }}
                                              className="px-1 py-0.5 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                                            >↑</button>
                                            <button
                                              onClick={async () => {
                                                const updated = qbankStructure.map((subject: any) => {
                                                  if (subject.key === manageSubject || subject.id === manageSubject) {
                                                    return {
                                                      ...subject,
                                                      lectures: (subject.lectures || []).map((lec: any) => {
                                                        if (lec.title === (lecture.id || lecture.title)) {
                                                          const arr = [...(lec.topics || [])];
                                                          if (tidx < arr.length - 1) {
                                                            const [item] = arr.splice(tidx, 1);
                                                            arr.splice(tidx + 1, 0, item);
                                                          }
                                                          return { ...lec, topics: arr };
                                                        }
                                                        return lec;
                                                      })
                                                    };
                                                  }
                                                  return subject;
                                                });
                                                await updateQbankStructure(updated);
                                              }}
                                              className="px-1 py-0.5 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                                            >↓</button>
                                            <button
                                              onClick={() => deleteTopic(manageSubject, lecture.id || lecture.title, topic.id || topic)}
                                              className="px-1 py-0.5 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200"
                                            >
                                              Delete
                                            </button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Questions Management */}
                      <div className="border rounded-lg p-4">
                        <h5 className="font-medium text-gray-700 mb-3">Questions Management</h5>
                        <div className="space-y-3">
                          <select
                            value={questionFilterSubject || ''}
                            onChange={(e) => {
                              setQuestionFilterSubject(e.target.value);
                              setQuestionFilterLecture('');
                              setQuestionFilterTopic('');
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                          >
                            <option value="">Select Subject</option>
                            {qbankStructure.map((subject: any) => (
                              <option key={subject.key || subject.id} value={subject.label}>{subject.label}</option>
                            ))}
                          </select>
                          <select
                            value={questionFilterLecture || ''}
                            onChange={(e) => {
                              setQuestionFilterLecture(e.target.value);
                              setQuestionFilterTopic('');
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                            disabled={!questionFilterSubject}
                          >
                            <option value="">Select Lecture</option>
                            {qbankStructure.find((s: any) => s.label === questionFilterSubject)?.lectures?.map((lecture: any) => (
                              <option key={lecture.key || lecture.id} value={lecture.label || lecture.title}>{lecture.label || lecture.title}</option>
                            )) || []}
                          </select>
                          <select
                            value={questionFilterTopic || ''}
                            onChange={(e) => setQuestionFilterTopic(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                            disabled={!questionFilterLecture}
                          >
                            <option value="">Select Topic</option>
                            {qbankStructure.find((s: any) => s.label === questionFilterSubject)?.lectures?.find((l: any) => (l.label || l.title) === questionFilterLecture)?.topics?.map((topic: any) => (
                              <option key={topic.id || topic} value={typeof topic === 'string' ? topic : topic.title}>{typeof topic === 'string' ? topic : topic.title}</option>
                            )) || []}
                          </select>
                          <select
                            value={questionFilterSource || ''}
                            onChange={(e) => setQuestionFilterSource(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                          >
                            <option value="">Select Source (optional)</option>
                            {qbankStructure.find((s: any) => s.label === questionFilterSubject)?.sources?.map((source: any) => (
                              <option key={source.key || source.id} value={source.key || source.id}>{source.label}</option>
                            )) || []}
                          </select>
                          <button
                            onClick={loadFilteredQuestions}
                            disabled={!questionFilterSubject || !questionFilterLecture || !questionFilterTopic || !questionFilterSource}
                            className="w-full px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                          >
                            Load Questions
                          </button>
                        </div>
                        {filteredQuestions.length > 0 && (
                          <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                              <h6 className="font-medium text-gray-600">Questions ({filteredQuestions.length})</h6>
                              <button
                                onClick={deleteAllQuestions}
                                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                              >
                                Delete All
                              </button>
                            </div>
                            <div className="max-h-60 overflow-y-auto space-y-2">
                              {filteredQuestions.map((q: any) => (
                                <div key={q.id} className="p-2 bg-gray-50 rounded text-sm flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-900 truncate">Q{q.id}: {q.text}</div>
                                    <div className="text-gray-600">Source: {q.source} | Topic: {q.topic}</div>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <button
                                      onClick={async () => {
                                        if (!confirm('Delete this question?')) return;
                                        const res = await fetch(`/api/admin/qbank/questions/${q.id}`, { method: 'DELETE' });
                                        if (res.ok) {
                                          setFilteredQuestions((prev) => prev.filter((x: any) => x.id !== q.id));
                                        }
                                      }}
                                      className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Approach Management */}
            {activeTab === 'approach' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Approach Management</h3>
                  
                  {/* Section 1: Add Structure */}
                  <div className="mb-8">
                    <h4 className="text-md font-medium text-gray-800 mb-3 border-b pb-2">1. Add Structure</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Add Main Folder */}
                      <div className="border rounded-lg p-4">
                        <h5 className="font-medium text-gray-700 mb-2">Add Main Folder</h5>
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="e.g., Internal Medicine"
                            value={newMainFolder}
                            onChange={(e) => setNewMainFolder(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                          />
                          <button
                            onClick={addMainFolder}
                            disabled={!newMainFolder.trim()}
                            className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                          >
                            Add Main Folder
                          </button>
                        </div>
                      </div>

                      {/* Add Sub Folder */}
                      <div className="border rounded-lg p-4">
                        <h5 className="font-medium text-gray-700 mb-2">Add Sub Folder</h5>
                        <div className="space-y-2">
                          <select
                            value={selectedMainFolder || ''}
                            onChange={(e) => setSelectedMainFolder(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                          >
                            <option value="">Select Main Folder</option>
                            {approachStructure.map((folder: any) => (
                              <option key={folder.id} value={folder.id}>{folder.title}</option>
                            ))}
                          </select>
                          <input
                            type="text"
                            placeholder="e.g., Cardiology"
                            value={newSubFolder}
                            onChange={(e) => setNewSubFolder(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                          />
                          <button
                            onClick={addSubFolder}
                            disabled={!selectedMainFolder || !newSubFolder.trim()}
                            className="w-full px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                          >
                            Add Sub Folder
                          </button>
                        </div>
                      </div>

                      {/* Add File */}
                      <div className="border rounded-lg p-4">
                        <h5 className="font-medium text-gray-700 mb-2">Add File</h5>
                        <div className="space-y-2">
                          <select
                            value={selectedSubFolder || ''}
                            onChange={(e) => setSelectedSubFolder(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                          >
                            <option value="">Select Sub Folder</option>
                            {approachStructure.map((mainFolder: any) => 
                              mainFolder.children?.map((subFolder: any) => (
                                <option key={subFolder.id} value={subFolder.id}>{mainFolder.title} → {subFolder.title}</option>
                              ))
                            ).flat() || []}
                          </select>
                          <input
                            type="text"
                            placeholder="e.g., Chest Pain"
                            value={newApproachFile}
                            onChange={(e) => setNewApproachFile(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                          />
                          <button
                            onClick={addApproachFile}
                            disabled={!selectedSubFolder || !newApproachFile.trim()}
                            className="w-full px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                          >
                            Add File
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Manage Structure */}
                  <div>
                    <h4 className="text-md font-medium text-gray-800 mb-3 border-b pb-2">2. Manage Structure</h4>
                    <div className="space-y-4">
                      {approachStructure.map((mainFolder: any, mainIndex: number) => (
                        <div key={mainFolder.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">📁</span>
                              <h5 className="font-medium text-gray-800">{mainFolder.title}</h5>
                              <span className="text-sm text-gray-500">({mainFolder.children?.length || 0} sub-folders)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => moveApproachItem(mainFolder.id, 'up')}
                                disabled={mainIndex === 0}
                                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
                              >
                                ↑
                              </button>
                              <button
                                onClick={() => moveApproachItem(mainFolder.id, 'down')}
                                disabled={mainIndex === approachStructure.length - 1}
                                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
                              >
                                ↓
                              </button>
                              <button
                                onClick={() => deleteApproachItem(mainFolder.id)}
                                className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          
                          {mainFolder.children && mainFolder.children.length > 0 && (
                            <div className="ml-6 space-y-3">
                              {mainFolder.children.map((subFolder: any, subIndex: number) => (
                                <div key={subFolder.id} className="border-l-2 border-gray-200 pl-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <span className="text-md">📂</span>
                                      <h6 className="font-medium text-gray-700">{subFolder.title}</h6>
                                      <span className="text-xs text-gray-500">({subFolder.children?.length || 0} files)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => moveApproachItem(subFolder.id, 'up', mainFolder.id)}
                                        disabled={subIndex === 0}
                                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
                                      >
                                        ↑
                                      </button>
                                      <button
                                        onClick={() => moveApproachItem(subFolder.id, 'down', mainFolder.id)}
                                        disabled={subIndex === mainFolder.children.length - 1}
                                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
                                      >
                                        ↓
                                      </button>
                                      <button
                                        onClick={() => deleteApproachItem(subFolder.id, mainFolder.id)}
                                        className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                  
                                  {subFolder.children && subFolder.children.length > 0 && (
                                    <div className="ml-6 space-y-1">
                                      {subFolder.children.map((file: any, fileIndex: number) => (
                                        <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                          <div className="flex items-center gap-2">
                                            <span className="text-sm">📄</span>
                                            <div className="font-medium text-gray-700">{file.title}</div>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <button
                                              onClick={() => moveApproachItem(file.id, 'up', subFolder.id, mainFolder.id)}
                                              disabled={fileIndex === 0}
                                              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
                                            >
                                              ↑
                                            </button>
                                            <button
                                              onClick={() => moveApproachItem(file.id, 'down', subFolder.id, mainFolder.id)}
                                              disabled={fileIndex === subFolder.children.length - 1}
                                              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
                                            >
                                              ↓
                                            </button>
                                            <button
                                              onClick={() => deleteApproachItem(file.id, subFolder.id, mainFolder.id)}
                                              className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                                            >
                                              Delete
                                            </button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit User</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              updateUserInfo(editingUser.id, {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                gender: formData.get('gender'),
                university: formData.get('university'),
                                 hasWizaryExamAccess: true, // Always enabled for all users
                 hasApproachAccess: formData.get('hasApproachAccess') === 'on',
                 hasQbankAccess: formData.get('hasQbankAccess') === 'on',
                 hasCoursesAccess: formData.get('hasCoursesAccess') === 'on',
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    name="firstName"
                    type="text"
                    defaultValue={editingUser.firstName}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    name="lastName"
                    type="text"
                    defaultValue={editingUser.lastName}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    name="email"
                    type="email"
                    defaultValue={editingUser.email}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <input
                    name="gender"
                    type="text"
                    defaultValue={editingUser.gender || ''}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">University</label>
                  <input
                    name="university"
                    type="text"
                    defaultValue={editingUser.university || ''}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black"
                  />
                </div>
                
                                   {/* Access Permissions Section */}
                   <div className="border-t pt-4">
                     <h4 className="text-sm font-semibold text-gray-700 mb-3">Access Permissions</h4>
                     <div className="space-y-3">
                       <div className="flex items-center">
                         <div className="h-4 w-4 bg-green-100 border border-green-400 rounded flex items-center justify-center">
                           <svg className="h-3 w-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                             <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                           </svg>
                         </div>
                         <label className="ml-2 text-sm text-gray-700 font-medium">Wizary Exam Access (Always Enabled)</label>
                       </div>
                       <div className="flex items-center">
                         <input
                           name="hasApproachAccess"
                           type="checkbox"
                           defaultChecked={editingUser.hasApproachAccess}
                           className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                         />
                         <label className="ml-2 text-sm text-gray-700">Approach Access</label>
                       </div>
                       <div className="flex items-center">
                         <input
                           name="hasQbankAccess"
                           type="checkbox"
                           defaultChecked={editingUser.hasQbankAccess}
                           className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                         />
                         <label className="ml-2 text-sm text-gray-700">Qbank Access</label>
                       </div>
                       <div className="flex items-center">
                         <input
                           name="hasCoursesAccess"
                           type="checkbox"
                           defaultChecked={editingUser.hasCoursesAccess}
                           className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                         />
                         <label className="ml-2 text-sm text-gray-700">Courses Access</label>
                       </div>
                     </div>
                   </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Exam Modal */}
      {editingExam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Exam</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              updateExamInfo(editingExam.id, {
                title: formData.get('title'),
                subject: formData.get('subject'),
                examTime: Number(formData.get('examTime')),
                secretCode: formData.get('secretCode'),
                order: Number(formData.get('order')),
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    name="title"
                    type="text"
                    defaultValue={editingExam.title}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject</label>
                  <select
                    name="subject"
                    defaultValue={editingExam.subject}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black"
                    required
                  >
                    <option value="obgyn">Obstetric & Gynecology</option>
                    <option value="im">Internal Medicine</option>
                    <option value="surgery">Surgery</option>
                    <option value="pediatrics">Pediatrics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Exam Time (minutes)</label>
                  <input
                    name="examTime"
                    type="number"
                    defaultValue={editingExam.examTime}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Secret Code</label>
                  <input
                    name="secretCode"
                    type="text"
                    defaultValue={editingExam.secretCode}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Order</label>
                  <input
                    name="order"
                    type="number"
                    defaultValue={editingExam.order}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingExam(null)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Exam Modal with CSV Import */}
      {showCreateExam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[600px] max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Create New Exam - Import CSV</h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Exam Title</label>
                  <input
                    type="text"
                    value={examTitle}
                    onChange={(e) => setExamTitle(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    placeholder="Enter exam title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  >
                    <option value="obgyn">Obstetric & Gynecology</option>
                    <option value="im">Internal Medicine</option>
                    <option value="surgery">Surgery</option>
                    <option value="pediatrics">Pediatrics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Exam Time (minutes)</label>
                  <input
                    type="number"
                    value={examTime}
                    onChange={(e) => setExamTime(Number(e.target.value))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Secret Code</label>
                  <input
                    type="text"
                    value={secretCode}
                    onChange={(e) => setSecretCode(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Questions File</label>
                <input
                  type="file"
                  accept=".json,.csv"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <div className="mt-1 text-xs text-gray-500">
                  <p><strong>JSON format:</strong> {`[{"question": "...", "options": ["A", "B", "C", "D"], "correct_option": 1}]`}</p>
                  <p><strong>CSV format:</strong> question, option1, option2, option3, option4, correct_option</p>
                </div>
              </div>

              {preview.length > 0 && (
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Preview Questions ({preview.length})</h4>
                  <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                    {preview.slice(0, 3).map((question, index) => (
                      <div key={index} className="p-4 border-b border-gray-200">
                        <p className="font-medium text-gray-900">{index + 1}. {question.question}</p>
                        <ul className="mt-2 space-y-1">
                          {question.options.map((option: string, optIndex: number) => (
                            <li key={optIndex} className={`text-sm ${optIndex + 1 === question.correct_option ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                              {optIndex + 1}. {option}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    {preview.length > 3 && (
                      <div className="p-4 text-center text-gray-500">
                        ... and {preview.length - 3} more questions
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateExam(false);
                    setExamTitle('');
                    setFile(null);
                    setPreview([]);
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={createNewExam}
                  disabled={loading || !examTitle.trim() || preview.length === 0}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : `Create Exam (${preview.length} questions)`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Exam Modal */}
      {editingExam && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Exam</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Exam Title</label>
                  <input
                    type="text"
                    value={editingExam.title}
                    onChange={(e) => setEditingExam({...editingExam, title: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject</label>
                  <select
                    value={editingExam.subject}
                    onChange={(e) => setEditingExam({...editingExam, subject: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  >
                    <option value="obgyn">Obstetric & Gynecology</option>
                    <option value="im">Internal Medicine</option>
                    <option value="surgery">Surgery</option>
                    <option value="pediatrics">Pediatrics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Exam Time (minutes)</label>
                  <input
                    type="number"
                    value={editingExam.examTime}
                    onChange={(e) => setEditingExam({...editingExam, examTime: Number(e.target.value)})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Secret Code</label>
                  <input
                    type="text"
                    value={editingExam.secretCode}
                    onChange={(e) => setEditingExam({...editingExam, secretCode: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Order</label>
                  <input
                    type="number"
                    value={editingExam.order || 1}
                    onChange={(e) => setEditingExam({...editingExam, order: Number(e.target.value)})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    min="1"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    onClick={() => setEditingExam(null)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => updateExamInfo(editingExam.id, editingExam)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Update Exam
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { previewCsvFile as previewCsvFileUtil } from '../_lib/csv-utils';

export function useQbank(activeTab: string) {
  const [qbankStructure, setQbankStructure] = useState<any[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedLectureId, setSelectedLectureId] = useState<string | null>(null);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [adding, setAdding] = useState<{ entity: 'subject'|'source'|'lecture'|'topic'|null, parentId?: string|null }>({ entity: null });
  const [newName, setNewName] = useState<string>('');
  const [questionsList, setQuestionsList] = useState<any[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<any | null>(null);

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

  const generateId = () => Math.random().toString(36).slice(2);

  const loadQbankStructure = async () => {
    try {
      const res = await fetch('/api/qbank/structure');
      if (res.ok) {
        const data = await res.json();
        setQbankStructure(data);
      }
    } catch {}
  };

  useEffect(() => {
    if (activeTab === 'qbank') {
      loadQbankStructure();
    }
  }, [activeTab]);

  const persistStructure = async (next: any[]) => {
    setQbankStructure(next);
    await fetch('/api/qbank/structure', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(next)
    });
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
      // Error updating structure
    }
  };

  const moveToTop = async (type: 'subject'|'source'|'lecture'|'topic', ids: { subjectId?: string, lectureId?: string, id: string }) => {
    const next = qbankStructure.map((s: any) => ({ ...s }));
    if (type === 'subject') {
      const idx = next.findIndex((s: any) => s.id === ids.id);
      if (idx > -1) { const [item] = next.splice(idx, 1); next.unshift(item); }
    } else if (type === 'source') {
      const subj = next.find((s: any) => s.id === ids.subjectId);
      if (subj) { subj.sources = subj.sources || []; const idx = subj.sources.findIndex((x: any) => x.id === ids.id); if (idx > -1) { const [item] = subj.sources.splice(idx, 1); subj.sources.unshift(item); } }
    } else if (type === 'lecture') {
      const subj = next.find((s: any) => s.id === ids.subjectId);
      if (subj) { subj.lectures = subj.lectures || []; const idx = subj.lectures.findIndex((x: any) => x.id === ids.id); if (idx > -1) { const [item] = subj.lectures.splice(idx, 1); subj.lectures.unshift(item); } }
    } else if (type === 'topic') {
      const subj = next.find((s: any) => s.id === ids.subjectId);
      const lec = subj?.lectures?.find((l: any) => l.id === ids.lectureId);
      if (lec) { lec.topics = lec.topics || []; const idx = lec.topics.findIndex((x: any) => x.id === ids.id); if (idx > -1) { const [item] = lec.topics.splice(idx, 1); lec.topics.unshift(item); } }
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
    if (type === 'subject') { const subj = next.find((s: any) => s.id === ids.id); if (subj) subj.label = newLabel; }
    else if (type === 'source') { const subj = next.find((s: any) => s.id === ids.subjectId); const src = subj?.sources?.find((x: any) => x.id === ids.id); if (src) src.label = newLabel; }
    else if (type === 'lecture') { const subj = next.find((s: any) => s.id === ids.subjectId); const lec = subj?.lectures?.find((x: any) => x.id === ids.id); if (lec) lec.title = newLabel; }
    else if (type === 'topic') { const subj = next.find((s: any) => s.id === ids.subjectId); const lec = subj?.lectures?.find((x: any) => x.id === ids.lectureId); const top = lec?.topics?.find((x: any) => x.id === ids.id); if (top) top.title = newLabel; }
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
      if (subj) { subj.sources = subj.sources || []; subj.sources.push({ id: generateId(), key: newName.trim().toLowerCase().replace(/\s+/g,'-'), label: newName.trim() }); }
    } else if (adding.entity === 'lecture') {
      const subj = next.find((s: any) => s.id === adding.parentId);
      if (subj) { subj.lectures = subj.lectures || []; subj.lectures.push({ id: generateId(), title: newName.trim(), topics: [] }); }
    } else if (adding.entity === 'topic') {
      const subj = next.find((s: any) => s.id === selectedSubjectId);
      const lec = subj?.lectures?.find((l: any) => l.id === adding.parentId);
      if (lec) { lec.topics = lec.topics || []; lec.topics.push({ id: generateId(), title: newName.trim() }); }
    }
    setAdding({ entity: null });
    setNewName('');
    await persistStructure(next);
  };

  const activeSubject = qbankStructure.find((s: any) => s.id === selectedSubjectId);
  const activeLecture = activeSubject?.lectures?.find((l: any) => l.id === selectedLectureId);
  const activeSource = activeSubject?.sources?.find((src: any) => src.id === selectedSourceId);

  const loadQuestionsByFilter = async () => {
    if (!activeSubject || !activeSource || !activeLecture) { setQuestionsList([]); return; }
    const topicTitles = (activeLecture.topics || []).map((t: any) => t.title.toLowerCase());
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

  const addSubject = async () => {
    if (!newSubjectName.trim()) return;
    const updatedStructure = [...qbankStructure];
    updatedStructure.push({ key: Date.now().toString(), label: newSubjectName.trim(), color: '#0072b7', sources: [], lectures: [] });
    await updateQbankStructure(updatedStructure);
    setNewSubjectName('');
  };

  const addSource = async () => {
    if (!selectedSubjectForSource || !newSourceName.trim()) return;
    const updatedStructure = qbankStructure.map((subject: any) => {
      if (subject.key === selectedSubjectForSource || subject.id === selectedSubjectForSource) {
        return { ...subject, sources: [...(subject.sources || []), { key: Date.now().toString(), label: newSourceName.trim() }] };
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
        return { ...subject, lectures: [...(subject.lectures || []), { title: newLectureName.trim(), topics: [] }] };
      }
      return subject;
    });
    await updateQbankStructure(updatedStructure);
    setNewLectureName('');
    setSelectedSubjectForLecture('');
  };

  const addTopic = async () => {
    if (!selectedLectureForTopic || !newTopicName.trim()) return;
    const updatedStructure = qbankStructure.map((subject: any) => ({
      ...subject,
      lectures: (subject.lectures || []).map((lecture: any) => {
        if (lecture.title === selectedLectureForTopic) {
          return { ...lecture, topics: [...(lecture.topics || []), newTopicName.trim()] };
        }
        return lecture;
      })
    }));
    await updateQbankStructure(updatedStructure);
    setNewTopicName('');
    setSelectedLectureForTopic('');
  };

  const importQuestions = async () => {
    if (!importFile || !importSubject || !importSource || !importLecture || !importTopic) return;
    const formData = new FormData();
    formData.append('file', importFile);
    formData.append('subject', importSubject);
    formData.append('sourceKey', importSource);
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
        alert(`Failed to import questions\n${data.error || ''}${data.details ? `\nDetails: ${data.details}` : ''}${data.expectedFormat ? `\nExpected format: ${data.expectedFormat}` : ''}`);
      }
    } catch (error: any) {
      alert(`Error importing questions: ${String(error?.message || error)}`);
    }
  };

  const deleteSource = async (subjectId: string, sourceId: string) => {
    if (!confirm('Delete this source?')) return;
    const updatedStructure = qbankStructure.map((subject: any) => {
      if (subject.key === subjectId || subject.id === subjectId) {
        return { ...subject, sources: (subject.sources || []).filter((s: any) => s.key !== sourceId && s.id !== sourceId) };
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
        if (lectureIndex > 0) { const [lecture] = lectures.splice(lectureIndex, 1); lectures.unshift(lecture); }
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
        return { ...subject, lectures: (subject.lectures || []).filter((l: any) => l.title !== lectureId) };
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
              return { ...lecture, topics: (lecture.topics || []).filter((t: any) => t.id !== topicId && t !== topicId) };
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
      // Error loading filtered questions
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
      alert('Error deleting questions');
    }
  };

  const handlePreviewCsvFile = async (file: File) => {
    try {
      const result = await previewCsvFileUtil(file);
      setCsvPreview(result.preview);
      setCsvPreviewCount(result.count);
      setCsvPreviewQuestion(result.firstQuestion);
    } catch {
      setCsvPreview([]);
      setCsvPreviewCount(0);
      setCsvPreviewQuestion(null);
    }
  };

  return {
    qbankStructure, setQbankStructure,
    selectedSubjectId, setSelectedSubjectId,
    selectedLectureId, setSelectedLectureId,
    selectedSourceId, setSelectedSourceId,
    adding, setAdding,
    newName, setNewName,
    questionsList, setQuestionsList,
    editingQuestion, setEditingQuestion,
    newSubjectName, setNewSubjectName,
    newSourceName, setNewSourceName,
    newLectureName, setNewLectureName,
    newTopicName, setNewTopicName,
    selectedSubjectForSource, setSelectedSubjectForSource,
    selectedSubjectForLecture, setSelectedSubjectForLecture,
    selectedLectureForTopic, setSelectedLectureForTopic,
    importSubject, setImportSubject,
    importSource, setImportSource,
    importLecture, setImportLecture,
    importTopic, setImportTopic,
    importFile, setImportFile,
    manageSubject, setManageSubject,
    questionFilterSubject, setQuestionFilterSubject,
    questionFilterLecture, setQuestionFilterLecture,
    questionFilterTopic, setQuestionFilterTopic,
    questionFilterSource, setQuestionFilterSource,
    filteredQuestions, setFilteredQuestions,
    csvPreview, setCsvPreview,
    csvPreviewCount, setCsvPreviewCount,
    csvPreviewQuestion, setCsvPreviewQuestion,
    generateId,
    loadQbankStructure,
    persistStructure,
    updateQbankStructure,
    moveToTop,
    removeEntity,
    renameEntity,
    startAdd,
    saveAdd,
    activeSubject,
    activeLecture,
    activeSource,
    loadQuestionsByFilter,
    startEditQuestion,
    saveQuestion,
    deleteQuestion,
    addSubject,
    addSource,
    addLecture,
    addTopic,
    importQuestions,
    deleteSource,
    moveLectureToTop,
    deleteLecture,
    deleteSubject,
    deleteTopic,
    loadFilteredQuestions,
    deleteAllQuestions,
    handlePreviewCsvFile,
  };
}

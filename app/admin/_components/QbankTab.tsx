'use client';

interface QbankTabProps {
  qbankStructure: any[];
  newSubjectName: string;
  setNewSubjectName: (s: string) => void;
  newSourceName: string;
  setNewSourceName: (s: string) => void;
  newLectureName: string;
  setNewLectureName: (s: string) => void;
  newTopicName: string;
  setNewTopicName: (s: string) => void;
  selectedSubjectForSource: string;
  setSelectedSubjectForSource: (s: string) => void;
  selectedSubjectForLecture: string;
  setSelectedSubjectForLecture: (s: string) => void;
  selectedLectureForTopic: string;
  setSelectedLectureForTopic: (s: string) => void;
  importSubject: string;
  setImportSubject: (s: string) => void;
  importSource: string;
  setImportSource: (s: string) => void;
  importLecture: string;
  setImportLecture: (s: string) => void;
  importTopic: string;
  setImportTopic: (s: string) => void;
  importFile: File | null;
  setImportFile: (f: File | null) => void;
  manageSubject: string;
  setManageSubject: (s: string) => void;
  questionFilterSubject: string;
  setQuestionFilterSubject: (s: string) => void;
  questionFilterLecture: string;
  setQuestionFilterLecture: (s: string) => void;
  questionFilterTopic: string;
  setQuestionFilterTopic: (s: string) => void;
  questionFilterSource: string;
  setQuestionFilterSource: (s: string) => void;
  filteredQuestions: any[];
  setFilteredQuestions: (q: any[]) => void;
  csvPreview: any[];
  csvPreviewCount: number;
  csvPreviewQuestion: any;
  setCsvPreview: (p: any[]) => void;
  setCsvPreviewCount: (c: number) => void;
  addSubject: () => void;
  addSource: () => void;
  addLecture: () => void;
  addTopic: () => void;
  importQuestions: () => void;
  deleteSource: (subjectId: string, sourceId: string) => void;
  moveLectureToTop: (subjectId: string, lectureId: string) => void;
  deleteLecture: (subjectId: string, lectureId: string) => void;
  deleteSubject: (subjectId: string) => void;
  deleteTopic: (subjectId: string, lectureId: string, topicId: string) => void;
  loadFilteredQuestions: () => void;
  deleteAllQuestions: () => void;
  updateQbankStructure: (s: any[]) => void;
  handlePreviewCsvFile: (f: File) => void;
}

export default function QbankTab(props: QbankTabProps) {
  const {
    qbankStructure, newSubjectName, setNewSubjectName, newSourceName, setNewSourceName,
    newLectureName, setNewLectureName, newTopicName, setNewTopicName,
    selectedSubjectForSource, setSelectedSubjectForSource,
    selectedSubjectForLecture, setSelectedSubjectForLecture,
    selectedLectureForTopic, setSelectedLectureForTopic,
    importSubject, setImportSubject, importSource, setImportSource,
    importLecture, setImportLecture, importTopic, setImportTopic,
    importFile, setImportFile, manageSubject, setManageSubject,
    questionFilterSubject, setQuestionFilterSubject,
    questionFilterLecture, setQuestionFilterLecture,
    questionFilterTopic, setQuestionFilterTopic,
    questionFilterSource, setQuestionFilterSource,
    filteredQuestions, setFilteredQuestions,
    csvPreview, csvPreviewCount, csvPreviewQuestion,
    setCsvPreview, setCsvPreviewCount,
    addSubject, addSource, addLecture, addTopic,
    importQuestions, deleteSource, moveLectureToTop, deleteLecture,
    deleteSubject, deleteTopic, loadFilteredQuestions, deleteAllQuestions,
    updateQbankStructure, handlePreviewCsvFile,
  } = props;

  return (
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
                <input type="text" placeholder="Subject name" value={newSubjectName} onChange={(e) => setNewSubjectName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white" />
                <button onClick={addSubject} disabled={!newSubjectName.trim()}
                  className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">Add Subject</button>
              </div>
            </div>

            {/* Add Source */}
            <div className="border rounded-lg p-4">
              <h5 className="font-medium text-gray-700 mb-2">Add Source</h5>
              <div className="space-y-2">
                <select value={selectedSubjectForSource || ''} onChange={(e) => setSelectedSubjectForSource(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white">
                  <option value="">Select Subject</option>
                  {qbankStructure.map((subject: any) => (
                    <option key={subject.key || subject.id} value={subject.key || subject.id}>{subject.label}</option>
                  ))}
                </select>
                <input type="text" placeholder="Source name" value={newSourceName} onChange={(e) => setNewSourceName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white" />
                <button onClick={addSource} disabled={!selectedSubjectForSource || !newSourceName.trim()}
                  className="w-full px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50">Add Source</button>
              </div>
            </div>

            {/* Add Lecture */}
            <div className="border rounded-lg p-4">
              <h5 className="font-medium text-gray-700 mb-2">Add Lecture</h5>
              <div className="space-y-2">
                <select value={selectedSubjectForLecture || ''} onChange={(e) => setSelectedSubjectForLecture(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white">
                  <option value="">Select Subject</option>
                  {qbankStructure.map((subject: any) => (
                    <option key={subject.key || subject.id} value={subject.key || subject.id}>{subject.label}</option>
                  ))}
                </select>
                <input type="text" placeholder="Lecture name" value={newLectureName} onChange={(e) => setNewLectureName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white" />
                <button onClick={addLecture} disabled={!selectedSubjectForLecture || !newLectureName.trim()}
                  className="w-full px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50">Add Lecture</button>
              </div>
            </div>

            {/* Add Topic */}
            <div className="border rounded-lg p-4">
              <h5 className="font-medium text-gray-700 mb-2">Add Topic</h5>
              <div className="space-y-2">
                <select value={selectedLectureForTopic || ''} onChange={(e) => setSelectedLectureForTopic(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white">
                  <option value="">Select Lecture</option>
                  {qbankStructure.map((subject: any) =>
                    (subject.lectures || []).map((lecture: any) => (
                      <option key={lecture.id || lecture.title} value={lecture.id || lecture.title}>{subject.label} - {lecture.title}</option>
                    ))
                  ).flat()}
                </select>
                <input type="text" placeholder="Topic name" value={newTopicName} onChange={(e) => setNewTopicName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white" />
                <button onClick={addTopic} disabled={!selectedLectureForTopic || !newTopicName.trim()}
                  className="w-full px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50">Add Topic</button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Import Questions */}
        <div className="mb-8">
          <h4 className="text-md font-medium text-gray-800 mb-3 border-b pb-2">2. Import Questions</h4>
          <div className="border rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <select value={importSubject || ''} onChange={(e) => setImportSubject(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white">
                <option value="">Select Subject</option>
                {qbankStructure.map((subject: any) => (
                  <option key={subject.key || subject.id} value={subject.label}>{subject.label}</option>
                ))}
              </select>
              <select value={importSource || ''} onChange={(e) => setImportSource(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white">
                <option value="">Select Source</option>
                {qbankStructure.find((s: any) => s.label === importSubject)?.sources?.map((source: any) => (
                  <option key={source.key || source.id} value={source.key || source.id}>{source.label}</option>
                )) || []}
              </select>
              <select value={importLecture || ''} onChange={(e) => setImportLecture(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white">
                <option value="">Select Lecture</option>
                {qbankStructure.find((s: any) => s.label === importSubject)?.lectures?.map((lecture: any) => (
                  <option key={lecture.id || lecture.title} value={lecture.title}>{lecture.title}</option>
                )) || []}
              </select>
              <select value={importTopic || ''} onChange={(e) => setImportTopic(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white">
                <option value="">Select Topic</option>
                {qbankStructure.find((s: any) => s.label === importSubject)?.lectures?.find((l: any) => l.title === importLecture)?.topics?.map((topic: any) => (
                  <option key={topic.id || topic} value={typeof topic === 'string' ? topic : topic.title}>{typeof topic === 'string' ? topic : topic.title}</option>
                )) || []}
              </select>
            </div>
            <div className="flex items-center gap-4">
              <input type="file" accept=".csv"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setImportFile(file);
                  if (file) { handlePreviewCsvFile(file); } else { setCsvPreview([]); setCsvPreviewCount(0); }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white" />
              <button onClick={importQuestions}
                disabled={!importSubject || !importSource || !importLecture || !importTopic || !importFile}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">Import Questions</button>
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
              <select value={manageSubject || ''} onChange={(e) => setManageSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white mb-3">
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
                      <button onClick={() => deleteSubject(manageSubject)}
                        className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200">Delete Subject</button>
                    </div>
                  </div>
                  <div>
                    <h6 className="font-medium text-gray-600 mb-2">Sources</h6>
                    <div className="space-y-1">
                      {qbankStructure.find((s: any) => s.key === manageSubject || s.id === manageSubject)?.sources?.map((source: any, idx: number) => (
                        <div key={source.key || source.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-gray-900">{source.label}</span>
                          <div className="flex gap-1">
                            <button onClick={async () => {
                              const updated = qbankStructure.map((subject: any) => {
                                if (subject.key === manageSubject || subject.id === manageSubject) {
                                  const arr = [...(subject.sources || [])];
                                  if (idx > 0) { const [item] = arr.splice(idx, 1); arr.splice(idx - 1, 0, item); }
                                  return { ...subject, sources: arr };
                                }
                                return subject;
                              });
                              await updateQbankStructure(updated);
                            }} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200">↑</button>
                            <button onClick={async () => {
                              const updated = qbankStructure.map((subject: any) => {
                                if (subject.key === manageSubject || subject.id === manageSubject) {
                                  const arr = [...(subject.sources || [])];
                                  if (idx < arr.length - 1) { const [item] = arr.splice(idx, 1); arr.splice(idx + 1, 0, item); }
                                  return { ...subject, sources: arr };
                                }
                                return subject;
                              });
                              await updateQbankStructure(updated);
                            }} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200">↓</button>
                            <button onClick={() => deleteSource(manageSubject, source.key || source.id)}
                              className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200">Delete</button>
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
                              <button onClick={async () => {
                                const updated = qbankStructure.map((subject: any) => {
                                  if (subject.key === manageSubject || subject.id === manageSubject) {
                                    const arr = [...(subject.lectures || [])];
                                    if (lidx > 0) { const [item] = arr.splice(lidx, 1); arr.splice(lidx - 1, 0, item); }
                                    return { ...subject, lectures: arr };
                                  }
                                  return subject;
                                });
                                await updateQbankStructure(updated);
                              }} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200">↑</button>
                              <button onClick={async () => {
                                const updated = qbankStructure.map((subject: any) => {
                                  if (subject.key === manageSubject || subject.id === manageSubject) {
                                    const arr = [...(subject.lectures || [])];
                                    if (lidx < arr.length - 1) { const [item] = arr.splice(lidx, 1); arr.splice(lidx + 1, 0, item); }
                                    return { ...subject, lectures: arr };
                                  }
                                  return subject;
                                });
                                await updateQbankStructure(updated);
                              }} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200">↓</button>
                              <button onClick={() => moveLectureToTop(manageSubject, lecture.id || lecture.title)}
                                className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200">Top</button>
                              <button onClick={() => deleteLecture(manageSubject, lecture.id || lecture.title)}
                                className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200">Delete</button>
                            </div>
                          </div>
                          <div className="ml-4 space-y-1">
                            <div className="text-xs font-medium text-gray-500">Topics:</div>
                            {(lecture.topics || []).map((topic: any, tidx: number) => (
                              <div key={topic.id || topic} className="flex items-center justify-between p-1 bg-gray-25 rounded text-sm">
                                <span className="text-gray-700">{typeof topic === 'string' ? topic : topic.title}</span>
                                <div className="flex gap-1">
                                  <button onClick={async () => {
                                    const updated = qbankStructure.map((subject: any) => {
                                      if (subject.key === manageSubject || subject.id === manageSubject) {
                                        return {
                                          ...subject,
                                          lectures: (subject.lectures || []).map((lec: any) => {
                                            if (lec.title === (lecture.id || lecture.title)) {
                                              const arr = [...(lec.topics || [])];
                                              if (tidx > 0) { const [item] = arr.splice(tidx, 1); arr.splice(tidx - 1, 0, item); }
                                              return { ...lec, topics: arr };
                                            }
                                            return lec;
                                          })
                                        };
                                      }
                                      return subject;
                                    });
                                    await updateQbankStructure(updated);
                                  }} className="px-1 py-0.5 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200">↑</button>
                                  <button onClick={async () => {
                                    const updated = qbankStructure.map((subject: any) => {
                                      if (subject.key === manageSubject || subject.id === manageSubject) {
                                        return {
                                          ...subject,
                                          lectures: (subject.lectures || []).map((lec: any) => {
                                            if (lec.title === (lecture.id || lecture.title)) {
                                              const arr = [...(lec.topics || [])];
                                              if (tidx < arr.length - 1) { const [item] = arr.splice(tidx, 1); arr.splice(tidx + 1, 0, item); }
                                              return { ...lec, topics: arr };
                                            }
                                            return lec;
                                          })
                                        };
                                      }
                                      return subject;
                                    });
                                    await updateQbankStructure(updated);
                                  }} className="px-1 py-0.5 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200">↓</button>
                                  <button onClick={() => deleteTopic(manageSubject, lecture.id || lecture.title, topic.id || topic)}
                                    className="px-1 py-0.5 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200">Delete</button>
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
                <select value={questionFilterSubject || ''} onChange={(e) => { setQuestionFilterSubject(e.target.value); setQuestionFilterLecture(''); setQuestionFilterTopic(''); }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white">
                  <option value="">Select Subject</option>
                  {qbankStructure.map((subject: any) => (
                    <option key={subject.key || subject.id} value={subject.label}>{subject.label}</option>
                  ))}
                </select>
                <select value={questionFilterLecture || ''} onChange={(e) => { setQuestionFilterLecture(e.target.value); setQuestionFilterTopic(''); }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white" disabled={!questionFilterSubject}>
                  <option value="">Select Lecture</option>
                  {qbankStructure.find((s: any) => s.label === questionFilterSubject)?.lectures?.map((lecture: any) => (
                    <option key={lecture.key || lecture.id} value={lecture.label || lecture.title}>{lecture.label || lecture.title}</option>
                  )) || []}
                </select>
                <select value={questionFilterTopic || ''} onChange={(e) => setQuestionFilterTopic(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white" disabled={!questionFilterLecture}>
                  <option value="">Select Topic</option>
                  {qbankStructure.find((s: any) => s.label === questionFilterSubject)?.lectures?.find((l: any) => (l.label || l.title) === questionFilterLecture)?.topics?.map((topic: any) => (
                    <option key={topic.id || topic} value={typeof topic === 'string' ? topic : topic.title}>{typeof topic === 'string' ? topic : topic.title}</option>
                  )) || []}
                </select>
                <select value={questionFilterSource || ''} onChange={(e) => setQuestionFilterSource(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white">
                  <option value="">Select Source (optional)</option>
                  {qbankStructure.find((s: any) => s.label === questionFilterSubject)?.sources?.map((source: any) => (
                    <option key={source.key || source.id} value={source.key || source.id}>{source.label}</option>
                  )) || []}
                </select>
                <button onClick={loadFilteredQuestions}
                  disabled={!questionFilterSubject || !questionFilterLecture || !questionFilterTopic || !questionFilterSource}
                  className="w-full px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50">Load Questions</button>
              </div>
              {filteredQuestions.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h6 className="font-medium text-gray-600">Questions ({filteredQuestions.length})</h6>
                    <button onClick={deleteAllQuestions} className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">Delete All</button>
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {filteredQuestions.map((q: any) => (
                      <div key={q.id} className="p-2 bg-gray-50 rounded text-sm flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">Q{q.id}: {q.text}</div>
                          <div className="text-gray-600">Source: {q.source} | Topic: {q.topic}</div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={async () => {
                            if (!confirm('Delete this question?')) return;
                            const res = await fetch(`/api/admin/qbank/questions/${q.id}`, { method: 'DELETE' });
                            if (res.ok) { setFilteredQuestions(filteredQuestions.filter((x: any) => x.id !== q.id)); }
                          }} className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200">Delete</button>
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
  );
}

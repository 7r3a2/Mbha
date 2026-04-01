'use client';

interface ExamsTabProps {
  exams: any[];
  loading: boolean;
  message: string;
  error: string;
  examView: 'list' | 'create';
  setExamView: (v: 'list' | 'create') => void;
  setEditingExam: (e: any) => void;
  deleteExam: (examId: string, examTitle: string) => void;
  loadData: () => Promise<void>;
  setMessage: (m: string) => void;
  setError: (e: string) => void;
  // Exam form props
  examTitle: string;
  setExamTitle: (t: string) => void;
  selectedSubject: string;
  setSelectedSubject: (s: string) => void;
  examTime: number;
  setExamTime: (t: number) => void;
  secretCode: string;
  setSecretCode: (c: string) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  preview: any[];
  setPreview: (p: any[]) => void;
  setFile: (f: File | null) => void;
  createNewExam: () => Promise<void>;
  examFormLoading: boolean;
  resetForm: () => void;
}

export default function ExamsTab({
  exams, loading, message, error, examView, setExamView,
  setEditingExam, deleteExam, loadData, setMessage, setError,
  examTitle, setExamTitle, selectedSubject, setSelectedSubject,
  examTime, setExamTime, secretCode, setSecretCode,
  handleFileUpload, preview, setPreview, setFile,
  createNewExam, examFormLoading, resetForm,
}: ExamsTabProps) {
  return (
    <div className="space-y-6">
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{message}</div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
      )}

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Exam Management</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setExamView('list')}
                className={`px-4 py-2 rounded-lg font-medium ${examView === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                View Exams ({exams.length})
              </button>
              <button
                onClick={() => { setExamView('create'); setMessage(''); setError(''); }}
                className={`px-4 py-2 rounded-lg font-medium ${examView === 'create' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(exam.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button onClick={() => setEditingExam(exam)} className="text-blue-600 hover:text-blue-900 font-medium">Edit</button>
                        <button onClick={() => deleteExam(exam.id, exam.title)} disabled={loading} className="text-red-600 hover:text-red-900 font-medium disabled:opacity-50">
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

        {examView === 'create' && (
          <div className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-6">Create New Exam - Upload Questions File</h4>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Exam Title</label>
                  <input type="text" value={examTitle} onChange={(e) => setExamTitle(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" placeholder="Enter exam title" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject</label>
                  <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black">
                    <option value="obgyn">Obstetric & Gynecology</option>
                    <option value="im">Internal Medicine</option>
                    <option value="surgery">Surgery</option>
                    <option value="pediatrics">Pediatrics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Exam Time (minutes)</label>
                  <input type="number" value={examTime} onChange={(e) => setExamTime(Number(e.target.value))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" min="1" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Secret Code</label>
                  <input type="text" value={secretCode} onChange={(e) => setSecretCode(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Questions File</label>
                <input type="file" accept=".json,.csv" onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
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
                            <li key={optIndex} className={`text-sm ${optIndex === (question.correct !== undefined ? question.correct : (question.correct_option || 1) - 1) ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                              {optIndex + 1}. {option}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    {preview.length > 3 && (
                      <div className="p-4 text-center text-gray-500">... and {preview.length - 3} more questions</div>
                    )}
                  </div>
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <button onClick={resetForm} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
                <button onClick={createNewExam} disabled={examFormLoading || !examTitle.trim() || preview.length === 0}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                  {examFormLoading ? 'Creating...' : `Create Exam (${preview.length} questions)`}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

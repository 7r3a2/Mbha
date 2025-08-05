'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Papa from 'papaparse';

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
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
            {['users', 'exams', 'codes'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-4 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab} ({tab === 'users' ? users.length : tab === 'exams' ? exams.length : uniqueCodes.length})
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
                              <button
                                onClick={() => deleteUser(user.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      {users.filter((user: any) => 
                        userSearchTerm === '' || 
                        user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
                      ).length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
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
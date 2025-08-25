'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

const DARK_BLUE = '#003a6d';

// Qbank-specific CSS overrides to ensure unique blue-only design
const qbankStyles = `
  /* Qbank-specific overrides - ensure no green anywhere */
  .qbank-page * {
    --qbank-primary: #0072b7;
    --qbank-secondary: #003a6d;
    --qbank-hover: #005a8f;
  }
  
  .qbank-page button:focus,
  .qbank-page input:focus,
  .qbank-page select:focus {
    outline: none !important;
    border-color: #0072b7 !important;
    box-shadow: 0 0 0 2px rgba(0, 114, 183, 0.2) !important;
  }
  
  .qbank-page button:hover,
  .qbank-page input:hover,
  .qbank-page select:hover {
    border-color: #0072b7 !important;
  }
  
  /* Override any global green styles */
  .qbank-page .text-green-500,
  .qbank-page .hover\\:text-green-700,
  .qbank-page .border-green-500,
  .qbank-page .hover\\:border-green-500,
  .qbank-page .bg-green-500,
  .qbank-page .hover\\:bg-green-500 {
    color: #0072b7 !important;
    border-color: #0072b7 !important;
    background-color: #0072b7 !important;
  }
  
  .qbank-page .hover\\:text-green-700:hover {
    color: #003a6d !important;
  }
  
  .qbank-page .hover\\:bg-green-500:hover {
    background-color: #003a6d !important;
  }
  
  .qbank-page .hover\\:border-green-500:hover {
    border-color: #003a6d !important;
  }
`;

const QUESTION_MODES = [
  { key: 'all', label: 'All' },
  { key: 'unused', label: 'Unused' },
  { key: 'incorrect', label: 'Incorrect' },
  { key: 'flagged', label: 'Flagged' },
];

export default function Qbank() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Dynamic subjects from database
  const [subjects, setSubjects] = useState<any[]>([]); // Start with empty array, load from API
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  // Check if user has qbank access
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user?.hasQbankAccess)) {
      router.push('/wizary-exam');
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Load subjects from database
  useEffect(() => {
    const loadSubjects = async () => {
      setLoadingSubjects(true);
      try {
        console.log('🔄 Loading subjects from API...');
        const response = await fetch('/api/qbank/structure');
        if (response.ok) {
          const dynamicSubjects = await response.json();
          console.log('📥 Raw subjects data:', dynamicSubjects);
          
          if (dynamicSubjects.length > 0) {
            // Transform the data to match the expected structure
            const transformedSubjects = dynamicSubjects.map((subject: any) => {
              // Handle both old (key-based) and new (id-based) structures
              const subjectKey = subject.key || subject.id || `subject_${Date.now()}`;
              
              return {
                key: subjectKey,
                label: subject.label || subject.name,
                color: subject.color || '#0072b7',
                lectures: (subject.lectures || []).map((lecture: any) => ({
                  title: lecture.title,
                  topics: (lecture.topics || []).map((topic: any) => 
                    typeof topic === 'string' ? topic : topic.title
                  )
                })),
                sources: (subject.sources || []).map((source: any) => ({
                  key: source.key || source.id || `source_${Date.now()}`,
                  label: source.label || source.name
                }))
              };
            });
            
            console.log('🔄 Transformed subjects:', transformedSubjects);
            setSubjects(transformedSubjects);
            
            // Update selected subjects to use the first dynamic subject
            if (transformedSubjects[0]?.key) {
              console.log('✅ Setting first subject as selected:', transformedSubjects[0].key);
              setSelectedSubjects([transformedSubjects[0].key]);
            }
            
            // Check which topics have questions
            checkAllTopicsForQuestions(transformedSubjects);
          } else {
            console.log('⚠️ No subjects found in API response');
          }
        } else {
          console.error('❌ Failed to load subjects:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('❌ Error loading subjects:', error);
      } finally {
        setLoadingSubjects(false);
      }
    };

    if (isAuthenticated && user?.hasQbankAccess) {
      loadSubjects();
    }
  }, [isAuthenticated, user?.hasQbankAccess]);

  const [isOpen, setIsOpen] = useState(true);
  const [activeView, setActiveView] = useState('create-test');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedModes, setSelectedModes] = useState<string[]>(['all']);
  const [expandedLectures, setExpandedLectures] = useState<{ [k: string]: number[] }>({});
  const [expandedSections, setExpandedSections] = useState<{ [k: string]: boolean }>({});
  const [topicChecks, setTopicChecks] = useState<{ [k: string]: number[][] }>({});
  const [lectureChecks, setLectureChecks] = useState<{ [k: string]: number[] }>({});
  const [testName, setTestName] = useState('');
  const [questionCount, setQuestionCount] = useState(10);
  const [topicsWithQuestions, setTopicsWithQuestions] = useState<{ [key: string]: boolean }>({});
  const [topicQuestionCounts, setTopicQuestionCounts] = useState<{ [key: string]: number }>({});
  const [loadingCounts, setLoadingCounts] = useState(false);

  // Fetch question counts for topics
  const fetchTopicQuestionCounts = async () => {
    const sourceLabels = getSelectedSourceLabels();
    
    setLoadingCounts(true);
    try {
      const params = new URLSearchParams();
      
      // Always use selected sources - if none selected, don't send any sources (will return 0)
      if (sourceLabels.length > 0) {
        params.set('sources', sourceLabels.join(','));
      }
      
      // Add question mode to the request
      const questionMode = selectedModes.length > 0 ? selectedModes[0] : 'all';
      params.set('questionMode', questionMode);
      
      // Add user ID if available
      if (user?.id) {
        params.set('userId', user.id);
      }
      
      // Get auth token from multiple sources
      let token = null;
      try {
        // Try to get token from localStorage/sessionStorage (auth_token is the correct key)
        if (typeof window !== 'undefined') {
          token = localStorage.getItem('auth_token') || 
                  sessionStorage.getItem('auth_token') || 
                  localStorage.getItem('token') || 
                  sessionStorage.getItem('token') || 
                  document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
        }
      } catch (error) {
        console.log('❌ Error accessing storage:', error);
      }
      
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        console.log('❌ No token found in any storage');
      }
      
      console.log(`🔍 Qbank fetching counts - Mode: ${questionMode}, Sources: ${sourceLabels.join(',')}, User: ${user?.id}, Token: ${token ? 'Present' : 'Missing'}`);
      
      const response = await fetch(`/api/qbank/question-counts?${params.toString()}`, {
        headers
      });
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Qbank received counts:`, data.topicCounts);
        setTopicQuestionCounts(data.topicCounts || {});
      } else {
        console.error('❌ Failed to fetch question counts:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        // Set all counts to 0 on error
        const allTopics = new Set();
        for (const subject of subjects) {
          for (const lecture of subject.lectures) {
            for (const topic of lecture.topics) {
              allTopics.add(topic);
            }
          }
        }
        const zeroCounts: { [key: string]: number } = {};
        for (const topic of allTopics) {
          zeroCounts[topic as string] = 0;
        }
        setTopicQuestionCounts(zeroCounts);
      }
    } catch (error) {
      console.error('❌ Error fetching topic question counts:', error);
      // If there's an error, set all counts to 0
      const allTopics = new Set();
      for (const subject of subjects) {
        for (const lecture of subject.lectures) {
          for (const topic of lecture.topics) {
            allTopics.add(topic);
          }
        }
      }
      const zeroCounts: { [key: string]: number } = {};
      for (const topic of allTopics) {
        zeroCounts[topic as string] = 0;
      }
      setTopicQuestionCounts(zeroCounts);
    } finally {
      setLoadingCounts(false);
    }
  };

  const handleGenerateTest = async () => {
    if (!testName.trim()) {
      alert('Please enter a test name');
      return;
    }
    
    if (questionCount <= 0) {
      alert('Please enter a number of questions greater than 0');
      return;
    }

    const selectedTopicNames = getSelectedTopicNames();
    if (selectedTopicNames.length === 0) {
      alert('Please select at least one topic');
      return;
    }

    const sourceLabels = getSelectedSourceLabels();
    if (sourceLabels.length === 0) {
      alert('Please select at least one source');
      return;
    }

    // Build URL with all parameters
    const params = new URLSearchParams({
      testName: testName.trim(),
      questionCount: questionCount.toString(),
      topics: selectedTopicNames.join(','),
      sources: sourceLabels.join(','),
      questionMode: selectedModes[0] || 'all'
    });

    router.push(`/quiz?${params.toString()}`);
  };

  const getSelectedTopicNames = () => {
    let selectedTopicNames: string[] = [];
    
    for (const subjectKey of selectedSubjects) {
      const subject = subjects.find(s => s.key === subjectKey);
      if (!subject) continue;
      
      for (let lectureIdx = 0; lectureIdx < subject.lectures.length; lectureIdx++) {
        const lecture = subject.lectures[lectureIdx];
        const checked = topicChecks[subjectKey]?.[lectureIdx] || [];
        
        for (const topicIdx of checked) {
          if (topicIdx < lecture.topics.length) {
            selectedTopicNames.push(lecture.topics[topicIdx]);
          }
        }
      }
    }
    
    return selectedTopicNames;
  };

  const getSelectedSourceLabels = () => {
    const allSelectedSources: string[] = [];
    const allSelectedTopics: string[] = [];
    
    for (const subjectKey of selectedSubjects) {
      const subject = subjects.find(s => s.key === subjectKey);
      if (!subject) continue;
      
      for (let lectureIdx = 0; lectureIdx < subject.lectures.length; lectureIdx++) {
        const lecture = subject.lectures[lectureIdx];
        const checked = topicChecks[subjectKey]?.[lectureIdx] || [];
        
        for (const topicIdx of checked) {
          if (topicIdx < lecture.topics.length) {
            allSelectedTopics.push(lecture.topics[topicIdx]);
          }
        }
      }
      
      // Add all sources for this subject
      allSelectedSources.push(...subject.sources.map((s: any) => s.label));
    }
    
    return allSelectedSources;
  };

  const checkTopicHasQuestions = (topicName: string): boolean => {
    const count = topicQuestionCounts[topicName];
    // If count is undefined, it means counts haven't loaded yet, so allow selection
    return count !== undefined ? count > 0 : true;
  };

  const checkAllTopicsForQuestions = async (subjectsToCheck: any[]) => {
    const topicsMap: { [key: string]: boolean } = {};
    
    for (const subject of subjectsToCheck) {
      for (const lecture of subject.lectures) {
        for (const topic of lecture.topics) {
          topicsMap[topic] = true; // Assume all topics have questions initially
        }
      }
    }
    
    setTopicsWithQuestions(topicsMap);
  };

  // Fetch question counts when subjects, sources, or modes change
  useEffect(() => {
    if (subjects.length > 0 && selectedSubjects.length > 0) {
      fetchTopicQuestionCounts();
    }
  }, [selectedSubjects, selectedSources, selectedModes, user?.id]);

  // Fetch question counts when sources change
  useEffect(() => {
    if (subjects.length > 0 && selectedSubjects.length > 0) {
      fetchTopicQuestionCounts();
    }
  }, [selectedSources]);

  // Add window focus listener to refresh counts
  useEffect(() => {
    const handleFocus = () => {
      if (subjects.length > 0 && selectedSubjects.length > 0) {
        fetchTopicQuestionCounts();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [subjects, selectedSubjects]);

  const toggleSubject = (subjectKey: string) => {
    setSelectedSubjects(prev => {
      const exists = prev.includes(subjectKey);
      if (exists) {
        return prev.filter(key => key !== subjectKey);
      } else {
        return [...prev, subjectKey];
      }
    });
  };

  const toggleSource = (subjectKey: string, sourceKey: string) => {
    setSelectedSources(prev => {
      const key = `${subjectKey}-${sourceKey}`;
      const exists = prev.includes(key);
      if (exists) {
        return prev.filter(k => k !== key);
      } else {
        return [...prev, key];
      }
    });
  };

  const toggleMode = (modeKey: string) => {
    setSelectedModes(prev => {
      const exists = prev.includes(modeKey);
      if (exists) {
        return prev.filter(mode => mode !== modeKey);
      } else {
        return [modeKey]; // Only allow one mode at a time
      }
    });
  };

  const toggleLectureExpansion = (subjectKey: string, lectureIdx: number) => {
    setExpandedLectures(prev => {
      const current = prev[subjectKey] || [];
      const exists = current.includes(lectureIdx);
      if (exists) {
        return {
          ...prev,
          [subjectKey]: current.filter(idx => idx !== lectureIdx)
        };
      } else {
        return {
          ...prev,
          [subjectKey]: [...current, lectureIdx]
        };
      }
    });
  };

  const toggleSectionExpansion = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const toggleLectureSelection = (subjectKey: string, lectureIdx: number) => {
    const subject = subjects.find(s => s.key === subjectKey);
    if (!subject) return;
    
    const lecture = subject.lectures[lectureIdx];
    const topicNames = lecture.topics || [];
    
         // Check if all topics in this lecture have questions
     const allTopicsHaveQuestions = topicNames.every((topicName: string) => {
       const preset = topicsWithQuestions[topicName];
       return preset !== false; // Allow if preset is true or undefined
     });
    
    if (!allTopicsHaveQuestions) {
      alert('Some topics in this lecture have no questions available');
      return;
    }
    
    setTopicChecks(prev => {
      const currentChecked = prev[subjectKey]?.[lectureIdx] || [];
             const newChecked = currentChecked.length > 0 ? [] : topicNames.map((_: string, idx: number) => idx);
      
      return {
        ...prev,
        [subjectKey]: {
          ...prev[subjectKey],
          [lectureIdx]: newChecked
        }
      };
    });
  };

  const toggleTopicSelection = (subjectKey: string, lectureIdx: number, topicIdx: number) => {
    const subject = subjects.find(s => s.key === subjectKey);
    if (!subject) return;
    
    const topicName = subject.lectures[lectureIdx].topics[topicIdx];
    
    // Check if this topic has questions
    if (!checkTopicHasQuestions(topicName)) {
      alert('This topic has no questions available');
      return;
    }
    
    setTopicChecks(prev => {
      const checked = prev[subjectKey]?.[lectureIdx] || [];
      const exists = checked.includes(topicIdx);
      const newChecked = exists ? checked.filter((i) => i !== topicIdx) : [...checked, topicIdx];
      
      return {
        ...prev,
        [subjectKey]: {
          ...prev[subjectKey],
          [lectureIdx]: newChecked
        }
      };
    });
  };

  // Removed problematic function

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user?.hasQbankAccess) {
    return null;
  }

  return (
    <div className="qbank-page min-h-screen bg-gray-50">
      <style jsx>{qbankStyles}</style>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Qbank</h1>
            <button
              onClick={() => fetchTopicQuestionCounts()}
              disabled={loadingCounts}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loadingCounts ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              Refresh Counts
            </button>
          </div>

          {loadingSubjects ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading subjects...</p>
            </div>
          ) : subjects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No subjects available. Please check your data configuration.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Panel - Subject Selection */}
              <div className="lg:col-span-2">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Subjects & Topics</h2>
                  
                  {subjects.map((subject) => (
                    <div key={subject.key} className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedSubjects.includes(subject.key)}
                            onChange={() => toggleSubject(subject.key)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="ml-2 font-medium text-gray-900">{subject.label}</span>
                        </label>
                      </div>
                      
                      {selectedSubjects.includes(subject.key) && (
                        <div className="ml-6 space-y-3">
                          {subject.lectures.map((lecture: any, lectureIdx: number) => (
                            <div key={lectureIdx} className="border-l-2 border-gray-200 pl-4">
                              <div className="flex items-center justify-between">
                                <button
                                  onClick={() => toggleLectureExpansion(subject.key, lectureIdx)}
                                  className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
                                >
                                  <svg
                                    className={`w-4 h-4 mr-1 transition-transform ${
                                      expandedLectures[subject.key]?.includes(lectureIdx) ? 'rotate-90' : ''
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                  {lecture.title}
                                </button>
                                <button
                                  onClick={() => toggleLectureSelection(subject.key, lectureIdx)}
                                  className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                >
                                  Select All
                                </button>
                              </div>
                              
                              {expandedLectures[subject.key]?.includes(lectureIdx) && (
                                <div className="mt-2 space-y-2">
                                  {lecture.topics.map((topic: string, topicIdx: number) => {
                                    const count = topicQuestionCounts[topic];
                                    const hasQuestions = checkTopicHasQuestions(topic);
                                    
                                    return (
                                      <div key={topicIdx} className="flex items-center justify-between">
                                        <label className="flex items-center">
                                          <input
                                            type="checkbox"
                                            checked={topicChecks[subject.key]?.[lectureIdx]?.includes(topicIdx) || false}
                                            onChange={() => toggleTopicSelection(subject.key, lectureIdx, topicIdx)}
                                            disabled={!hasQuestions}
                                            className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                                          />
                                          <span className={`ml-2 text-sm ${!hasQuestions ? 'text-gray-400' : 'text-gray-700'}`}>
                                            {topic} ({loadingCounts ? '...' : (count !== undefined ? count : '...')})
                                          </span>
                                        </label>
                                      </div>
                                    );
                                  })}
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

              {/* Right Panel - Test Configuration */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Configuration</h2>
                  
                  {/* Question Mode Selection */}
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Question Mode</h3>
                    <div className="space-y-2">
                      {QUESTION_MODES.map((mode) => (
                        <label key={mode.key} className="flex items-center">
                          <input
                            type="radio"
                            name="questionMode"
                            checked={selectedModes.includes(mode.key)}
                            onChange={() => toggleMode(mode.key)}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{mode.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Test Name */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Test Name
                    </label>
                    <input
                      type="text"
                      value={testName}
                      onChange={(e) => setTestName(e.target.value)}
                      placeholder="Enter test name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Question Count */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Questions
                    </label>
                    <input
                      type="number"
                      value={questionCount}
                      onChange={(e) => setQuestionCount(parseInt(e.target.value) || 0)}
                      min="1"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Generate Test Button */}
                  <button
                    onClick={handleGenerateTest}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Generate Test
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
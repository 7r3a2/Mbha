"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from 'next/navigation';

const sampleQuestions = [
  {
    id: 1,
    text: `A 65-year-old man with a history of hypertension and type 2 diabetes presents with sudden onset of left-sided weakness and facial droop. A non-contrast CT scan of the head is performed. Which of the following findings would be most indicative of an acute ischemic stroke?`,
    options: [
      "Cerebral edema and mass effect",
      "Hyperdense MCA sign",
      "Intraparenchymal hemorrhage",
      "Subarachnoid blood",
      "Normal findings",
    ],
    correct: 1,
    explanation: {
      correct:
        "The hyperdense MCA sign on a non-contrast CT scan represents a thrombus within the middle cerebral artery. It's an early and specific sign of ischemic stroke.",
      incorrect: [
        "Cerebral edema and mass effect are typically seen later in the course of a large ischemic stroke, not in the acute phase.",
        "This indicates a hemorrhagic stroke, not an ischemic one.",
        "This indicates a subarachnoid hemorrhage, a different type of stroke.",
        "A CT scan can be normal in the very early hours of an ischemic stroke, but the hyperdense MCA sign is a positive finding.",
      ],
      objective:
        "Recognize early signs of ischemic stroke on non-contrast CT.",
    },
  },
  {
    id: 2,
    text: `A 28-year-old woman in her third trimester of pregnancy complains of persistent heartburn. She has tried dietary modifications without relief. Which of the following medications is considered safest for her condition?`,
    options: [
      "Omeprazole",
      "Misoprostol",
      "Sodium bicarbonate",
      "Aluminum hydroxide",
      "Ranitidine",
    ],
    correct: 3,
    explanation: {
      correct:
        "Antacids like aluminum hydroxide are considered a first-line and safe option for heartburn during pregnancy as they are not systemically absorbed.",
      incorrect: [
        "Proton pump inhibitors like omeprazole are generally reserved for more severe cases and after other options have failed.",
        "Misoprostol is an abortifacient and is contraindicated in pregnancy.",
        "Sodium bicarbonate can cause metabolic alkalosis and fluid overload and should be avoided.",
        "H2 blockers like Ranitidine are considered second-line after antacids but are generally safe.",
      ],
      objective:
        "Identify safe pharmacological treatments for common ailments during pregnancy.",
    },
  },
  {
    id: 3,
    text: "A 5-year-old child is brought to the emergency department with a 2-day history of fever, sore throat, and a 'sandpaper' like rash. On examination, he has circumoral pallor and a strawberry tongue. What is the most likely diagnosis?",
    options: [
      "Measles (Rubeola)",
      "Kawasaki disease",
      "Scarlet fever",
      "Rubella (German Measles)",
      "Roseola infantum",
    ],
    correct: 2,
    explanation: {
      correct:
        "The combination of fever, pharyngitis, a sandpaper rash, circumoral pallor, and strawberry tongue are classic signs of Scarlet fever, which is caused by Group A Streptococcus.",
      incorrect: [
        "Measles presents with cough, coryza, conjunctivitis, and Koplik spots, followed by a maculopapular rash.",
        "Kawasaki disease involves fever, conjunctivitis, rash, extremity changes, and lymphadenopathy, but the rash is typically not sandpaper-like and a strawberry tongue is common but the constellation fits Scarlet fever better.",
        "Rubella presents with a milder rash and postauricular lymphadenopathy.",
        "Roseola is characterized by high fever that resolves, followed by the appearance of a rash.",
      ],
      objective:
        "Differentiate common childhood exanthems based on clinical presentation.",
    },
  },
  {
    id: 4,
    text: "A 45-year-old woman presents with a 3-month history of fatigue, weight gain, and cold intolerance. Physical examination reveals dry skin and a goiter. Laboratory studies show an elevated TSH and low free T4. What is the most likely diagnosis?",
    options: [
      "Graves' disease",
      "Hashimoto's thyroiditis",
      "Subacute thyroiditis",
      "Toxic multinodular goiter",
      "Thyroid cancer",
    ],
    correct: 1,
    explanation: {
      correct:
        "The clinical presentation of fatigue, weight gain, cold intolerance, dry skin, and goiter with elevated TSH and low free T4 is classic for hypothyroidism due to Hashimoto's thyroiditis.",
      incorrect: [
        "Graves' disease typically presents with hyperthyroidism (weight loss, heat intolerance, tachycardia) and elevated T4 with suppressed TSH.",
        "Subacute thyroiditis typically presents with neck pain and transient hyperthyroidism followed by hypothyroidism.",
        "Toxic multinodular goiter presents with hyperthyroidism, not hypothyroidism.",
        "Thyroid cancer typically presents as a painless nodule without systemic symptoms of hypothyroidism.",
      ],
      objective:
        "Recognize the clinical presentation and laboratory findings of Hashimoto's thyroiditis.",
    },
  },
  {
    id: 5,
    text: "A 60-year-old man with a history of smoking presents with acute onset of severe chest pain that radiates to his left arm and jaw. ECG shows ST-segment elevation in leads II, III, and aVF. Which coronary artery is most likely occluded?",
    options: [
      "Left anterior descending artery",
      "Left circumflex artery",
      "Right coronary artery",
      "Left main coronary artery",
      "Posterior descending artery",
    ],
    correct: 2,
    explanation: {
      correct:
        "ST-segment elevation in leads II, III, and aVF indicates an inferior wall myocardial infarction, which is typically caused by occlusion of the right coronary artery.",
      incorrect: [
        "Left anterior descending artery occlusion typically causes ST elevation in leads V1-V4 (anterior wall MI).",
        "Left circumflex artery occlusion typically causes ST elevation in leads I, aVL, V5, and V6 (lateral wall MI).",
        "Left main coronary artery occlusion would cause widespread ST elevation and is often fatal.",
        "Posterior descending artery is a branch of the right coronary artery and would cause similar findings.",
      ],
      objective:
        "Correlate ECG findings with coronary artery anatomy in acute myocardial infarction.",
    },
  },
  {
    id: 6,
    text: "A 25-year-old woman presents with acute onset of severe lower abdominal pain and vaginal bleeding. She has a positive pregnancy test. Transvaginal ultrasound shows no intrauterine pregnancy but a complex adnexal mass. What is the most likely diagnosis?",
    options: [
      "Normal intrauterine pregnancy",
      "Ectopic pregnancy",
      "Spontaneous abortion",
      "Ovarian cyst rupture",
      "Pelvic inflammatory disease",
    ],
    correct: 1,
    explanation: {
      correct:
        "The combination of positive pregnancy test, no intrauterine pregnancy on ultrasound, and complex adnexal mass is highly suggestive of ectopic pregnancy, which is a medical emergency.",
      incorrect: [
        "Normal intrauterine pregnancy would show a gestational sac in the uterus on ultrasound.",
        "Spontaneous abortion would typically show products of conception in the uterus or cervical os.",
        "Ovarian cyst rupture would not cause a positive pregnancy test.",
        "Pelvic inflammatory disease would not cause a positive pregnancy test.",
      ],
      objective:
        "Recognize the clinical presentation and diagnostic findings of ectopic pregnancy.",
    },
  },
  {
    id: 7,
    text: "A 70-year-old man presents with progressive dyspnea and a dry cough for 3 months. Chest X-ray shows bilateral interstitial infiltrates. High-resolution CT reveals honeycombing and traction bronchiectasis. What is the most likely diagnosis?",
    options: [
      "Pneumonia",
      "Pulmonary embolism",
      "Idiopathic pulmonary fibrosis",
      "Chronic obstructive pulmonary disease",
      "Congestive heart failure",
    ],
    correct: 2,
    explanation: {
      correct:
        "The clinical presentation of progressive dyspnea, dry cough, and radiographic findings of honeycombing and traction bronchiectasis is classic for idiopathic pulmonary fibrosis.",
      incorrect: [
        "Pneumonia typically presents with fever, productive cough, and focal infiltrates, not honeycombing.",
        "Pulmonary embolism typically presents with acute dyspnea and chest pain, not chronic symptoms.",
        "COPD typically presents with productive cough and airflow obstruction on spirometry.",
        "Congestive heart failure would show cardiomegaly and pulmonary edema, not honeycombing.",
      ],
      objective:
        "Recognize the clinical and radiographic features of idiopathic pulmonary fibrosis.",
    },
  },
  {
    id: 8,
    text: "A 35-year-old woman presents with a 2-week history of fatigue, polyuria, and polydipsia. Random blood glucose is 350 mg/dL. Which of the following is the most appropriate initial treatment?",
    options: [
      "Oral metformin",
      "Insulin therapy",
      "Lifestyle modification only",
      "Sulfonylurea",
      "DPP-4 inhibitor",
    ],
    correct: 1,
    explanation: {
      correct:
        "A blood glucose of 350 mg/dL with symptoms of polyuria and polydipsia indicates severe hyperglycemia requiring immediate insulin therapy to prevent diabetic ketoacidosis.",
      incorrect: [
        "Oral metformin is not appropriate for severe hyperglycemia and should not be used in patients with significant symptoms.",
        "Lifestyle modification alone is insufficient for blood glucose of 350 mg/dL.",
        "Sulfonylureas can cause hypoglycemia and are not first-line for severe hyperglycemia.",
        "DPP-4 inhibitors are not appropriate for severe hyperglycemia.",
      ],
      objective:
        "Recognize when insulin therapy is required for severe hyperglycemia.",
    },
  },
  {
    id: 9,
    text: "A 50-year-old man presents with acute onset of severe epigastric pain that radiates to his back. Serum amylase and lipase are elevated. CT scan shows pancreatic inflammation and peripancreatic fluid collections. What is the most likely diagnosis?",
    options: [
      "Peptic ulcer disease",
      "Acute pancreatitis",
      "Cholecystitis",
      "Gastroenteritis",
      "Mesenteric ischemia",
    ],
    correct: 1,
    explanation: {
      correct:
        "The combination of epigastric pain radiating to the back, elevated pancreatic enzymes, and CT findings of pancreatic inflammation is diagnostic of acute pancreatitis.",
      incorrect: [
        "Peptic ulcer disease typically presents with epigastric pain that is relieved by food, not radiating to the back.",
        "Cholecystitis typically presents with right upper quadrant pain and fever.",
        "Gastroenteritis typically presents with nausea, vomiting, and diarrhea.",
        "Mesenteric ischemia typically presents with severe abdominal pain out of proportion to physical examination.",
      ],
      objective:
        "Recognize the clinical presentation and diagnostic criteria for acute pancreatitis.",
    },
  },
  {
    id: 10,
    text: "A 65-year-old woman presents with a 6-month history of progressive memory loss and difficulty with daily activities. She frequently misplaces items and has trouble following conversations. What is the most likely diagnosis?",
    options: [
      "Major depressive disorder",
      "Alzheimer's disease",
      "Vascular dementia",
      "Lewy body dementia",
      "Frontotemporal dementia",
    ],
    correct: 1,
    explanation: {
      correct:
        "The gradual onset of memory loss, difficulty with daily activities, and problems with object location and conversation following are classic features of Alzheimer's disease.",
      incorrect: [
        "Major depressive disorder typically presents with mood symptoms, not progressive cognitive decline.",
        "Vascular dementia typically has a stepwise progression and focal neurological signs.",
        "Lewy body dementia typically presents with visual hallucinations and parkinsonism.",
        "Frontotemporal dementia typically presents with personality changes and language difficulties.",
      ],
      objective:
        "Recognize the clinical presentation of Alzheimer's disease.",
    },
  },
];

// Function to generate questions based on count
const generateQuestions = (count: number) => {
  const questions = [];
  for (let i = 0; i < count; i++) {
    const sample = sampleQuestions[i % sampleQuestions.length];
    questions.push({
      ...sample,
      id: i + 1,
      text: `Q${i + 1}: ${sample.text}`,
    });
  }
  return questions;
};

function QuizPageContent() {
  const searchParams = useSearchParams();
  const questionCount = parseInt(searchParams.get('count') || '20');
  const testMode = searchParams.get('mode') || 'study'; // 'exam' or 'study'
  const customTimeMinutes = parseInt(searchParams.get('time') || '60'); // Default 60 minutes if not provided
  const questions = generateQuestions(questionCount);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(null));
  const [flagged, setFlagged] = useState<boolean[]>(new Array(questions.length).fill(false));
  const [submitted, setSubmitted] = useState<boolean[]>(new Array(questions.length).fill(false));
  const [timeLeft, setTimeLeft] = useState(testMode === 'exam' ? customTimeMinutes * 60 : 0); // Custom time for exam mode, no timer for study mode
  const [startTime, setStartTime] = useState(Date.now()); // Track when exam started
  const [endTime, setEndTime] = useState<number | null>(null); // Track when exam ended
  const [showSidebar, setShowSidebar] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);
  const [calculatorVisible, setCalculatorVisible] = useState(false);
  const [showScoreOverlay, setShowScoreOverlay] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [showAnswerReview, setShowAnswerReview] = useState(false);

  const [fontSize, setFontSize] = useState(16);
  const [calculatorValue, setCalculatorValue] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const explanationRef = useRef<HTMLDivElement>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const userAnswer = answers[currentQuestionIndex];
  const isSubmitted = submitted[currentQuestionIndex];
  const isCorrect = userAnswer === currentQuestion.correct;

  useEffect(() => {
    // Only start timer for exam mode
    if (testMode !== 'exam') return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          // Auto-end quiz when time runs out - no warning, go directly to score
          // Calculate score directly here to avoid stale state issues
          const totalQuestions = questions.length;
          const correctAnswers = answers.filter((answer, index) => answer !== null && answer === questions[index].correct).length;
          const score = Math.round((correctAnswers / totalQuestions) * 100);
          setFinalScore(score);
          setEndTime(Date.now());
          setShowScoreOverlay(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [testMode, questions, answers]);

  // Reset state arrays when question count changes
  useEffect(() => {
    setAnswers(new Array(questions.length).fill(null));
    setFlagged(new Array(questions.length).fill(false));
    setSubmitted(new Array(questions.length).fill(false));
    setCurrentQuestionIndex(0);
    setShowExplanation(false);
    setTimeLeft(testMode === 'exam' ? customTimeMinutes * 60 : 0); // Custom time for exam mode, no timer for study mode
  }, [questions.length, testMode, customTimeMinutes]);

  // Highlighter functionality
  const [highlighterActive, setHighlighterActive] = useState(false);
  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const questionTextRef = useRef<HTMLDivElement>(null);
  const explanationTextRef = useRef<HTMLDivElement>(null);

  const highlighterColors = [
    { color: '#ffeb3b', name: 'Yellow' },
    { color: '#ff9800', name: 'Orange' },
    { color: '#4caf50', name: 'Green' },
    { color: '#2196f3', name: 'Blue' },
  ];

  const applyHighlight = (containerRef: React.RefObject<HTMLElement | null>) => {
    if (!containerRef.current || !highlighterActive) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const container = containerRef.current;

    // Check if selection is within our container
    if (!container.contains(range.commonAncestorContainer)) return;

    try {
      // Get the selected text
      const selectedText = selection.toString();
      if (!selectedText.trim()) return;

      // Create highlight span
      const highlightSpan = document.createElement('span');
      highlightSpan.className = 'highlighted-text';
      highlightSpan.style.cssText = `
        background-color: ${highlighterColors[selectedColor || 0].color} !important;
        color: black !important;
        display: inline !important;
        line-height: inherit !important;
        font-size: inherit !important;
        font-family: inherit !important;
        position: relative !important;
        z-index: 1 !important;
        padding: 0 !important;
        margin: 0 !important;
        border-radius: 2px !important;
        vertical-align: baseline !important;
        box-sizing: border-box !important;
        word-spacing: normal !important;
        letter-spacing: normal !important;
        white-space: pre-wrap !important;
        word-wrap: break-word !important;
        text-indent: 0 !important;
        text-transform: none !important;
        text-decoration: none !important;
        text-align: inherit !important;
        text-shadow: none !important;
        text-overflow: inherit !important;
        text-rendering: inherit !important;
        text-orientation: inherit !important;
        text-combine-upright: inherit !important;
        text-underline-position: inherit !important;
        text-underline-offset: inherit !important;
        text-decoration-skip-ink: inherit !important;
        text-decoration-thickness: inherit !important;
        text-decoration-style: inherit !important;
        text-decoration-color: inherit !important;
        text-decoration-line: inherit !important;
        cursor: pointer !important;
      `;

      // Add click event listener for removal
      highlightSpan.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        removeHighlight(highlightSpan);
      });

      // Add title for user guidance
      highlightSpan.title = 'Click to remove highlight';

      // Handle complex selections that might cross multiple nodes
      try {
        // Try to surround the range with the highlight span
        range.surroundContents(highlightSpan);
      } catch (e) {
        // If surroundContents fails, use extractContents approach
        const fragment = range.extractContents();
        highlightSpan.appendChild(fragment);
        range.insertNode(highlightSpan);
      }
      
      // Clear the selection
      selection.removeAllRanges();
    } catch (error) {
      console.log('Highlight applied successfully');
    }
  };

  const removeHighlight = (highlightSpan: HTMLElement) => {
    if (highlightSpan && highlightSpan.parentNode) {
      // Get the text content of the highlight
      const textContent = highlightSpan.textContent || '';
      
      // Create a text node with the content
      const textNode = document.createTextNode(textContent);
      
      // Replace the highlight span with the text node
      highlightSpan.parentNode.replaceChild(textNode, highlightSpan);
    }
  };

  const removeAllHighlights = () => {
    if (!questionTextRef.current) return;
    
    const highlightedElements = questionTextRef.current.querySelectorAll('.highlighted-text');
    highlightedElements.forEach((element) => {
      removeHighlight(element as HTMLElement);
    });
  };

  const handleTextSelection = () => {
    if (!highlighterActive) return;
    
    const selection = window.getSelection();
    if (!selection || !selection.anchorNode) return;
    
    // Apply highlight only to question text
    if (questionTextRef.current && questionTextRef.current.contains(selection.anchorNode)) {
      applyHighlight(questionTextRef);
    }
  };

  // Prevent double-click text selection removal
  const preventDoubleClickSelection = (e: React.MouseEvent) => {
    if (highlighterActive) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  useEffect(() => {
    if (highlighterActive) {
      document.addEventListener('mouseup', handleTextSelection);
      document.addEventListener('touchend', handleTextSelection);
    } else {
      document.removeEventListener('mouseup', handleTextSelection);
      document.removeEventListener('touchend', handleTextSelection);
    }

    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
      document.removeEventListener('touchend', handleTextSelection);
    };
  }, [highlighterActive, selectedColor]);

  const toggleHighlighter = () => {
    setHighlighterActive(!highlighterActive);
    if (!highlighterActive) {
      setShowColorMenu(true);
    } else {
      setShowColorMenu(false);
      setSelectedColor(null);
    }
  };

  const selectHighlighterColor = (index: number) => {
    setSelectedColor(index);
    setHighlighterActive(true);
    setShowColorMenu(false);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    setShowExplanation(false);
    if (!showSidebar && window.innerWidth < 768) setShowSidebar(false);
  };
  const goToNext = () => {
    if (currentQuestionIndex < questions.length - 1) goToQuestion(currentQuestionIndex + 1);
  };
  const goToPrevious = () => {
    if (currentQuestionIndex > 0) goToQuestion(currentQuestionIndex - 1);
  };
  const selectAnswer = (optionIndex: number) => {
    if (!isSubmitted) {
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = optionIndex;
      setAnswers(newAnswers);
      
      // Don't clear flag when answer is selected - keep orange color
      // Flag should only be cleared when explicitly toggled off
    }
  };
  const submitAnswer = () => {
    if (userAnswer !== null) {
      const newSubmitted = [...submitted];
      newSubmitted[currentQuestionIndex] = true;
      setSubmitted(newSubmitted);
      setShowExplanation(true);
      
      // In exam mode, check if all questions are submitted and auto-end quiz
      if (testMode === 'exam') {
        const allSubmitted = newSubmitted.every(submitted => submitted === true);
        if (allSubmitted) {
          // Auto-end the quiz after a short delay
          setTimeout(() => {
            calculateAndShowScore();
          }, 1000);
        }
      }
    }
  };
  const toggleFlag = () => {
    const newFlagged = [...flagged];
    newFlagged[currentQuestionIndex] = !newFlagged[currentQuestionIndex];
    setFlagged(newFlagged);
  };
  const handleCalculatorClick = (value: string | number) => {
    if (value === "C") setCalculatorValue("");
    else if (value === "=") {
      try { setCalculatorValue(eval(calculatorValue).toString()); } catch { setCalculatorValue("Error"); }
    } else setCalculatorValue(calculatorValue + value);
  };
  const increaseFontSize = () => setFontSize(Math.min(24, fontSize + 2));
  const decreaseFontSize = () => setFontSize(Math.max(12, fontSize - 2));

  const calculateAndShowScore = () => {
    const totalQuestions = questions.length;
    const correctAnswers = answers.filter((answer, index) => answer !== null && answer === questions[index].correct).length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    setFinalScore(score);
    setEndTime(Date.now()); // Set end time when calculating score
    setShowScoreOverlay(true);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return { bg: 'bg-gradient-to-br from-green-400 to-green-600', text: 'text-green-800', border: 'border-green-300' };
    if (score >= 80) return { bg: 'bg-gradient-to-br from-green-300 to-green-500', text: 'text-green-800', border: 'border-green-300' };
    if (score >= 70) return { bg: 'bg-gradient-to-br from-blue-400 to-blue-600', text: 'text-blue-800', border: 'border-blue-300' };
    if (score >= 60) return { bg: 'bg-gradient-to-br from-yellow-400 to-yellow-600', text: 'text-yellow-800', border: 'border-yellow-300' };
    if (score >= 50) return { bg: 'bg-gradient-to-br from-orange-400 to-orange-600', text: 'text-orange-800', border: 'border-orange-300' };
    return { bg: 'bg-gradient-to-br from-red-400 to-red-600', text: 'text-red-800', border: 'border-red-300' };
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return { title: 'Outstanding!', subtitle: 'Exceptional performance!' };
    if (score >= 80) return { title: 'Excellent!', subtitle: 'Great job!' };
    if (score >= 70) return { title: 'Very Good!', subtitle: 'Well done!' };
    if (score >= 60) return { title: 'Good!', subtitle: 'Keep improving!' };
    if (score >= 50) return { title: 'Fair', subtitle: 'More practice needed' };
    return { title: 'Needs Improvement', subtitle: 'Review the material' };
  };

  const endQuiz = () => { 
    if (confirm("Are you sure you want to end the quiz?")) { 
      if (testMode === 'exam') {
        calculateAndShowScore();
      } else {
        window.location.href = "/qbank";
      }
    } 
  };
  const handleSidebarToggle = () => setSidebarCollapsed((prev) => !prev);

  // Navigation button color logic
  const getNavButtonState = (index: number) => {
    // Only show colors after submitting answers
    if (!submitted[index]) {
      // Check if flagged (highest priority - overrides everything including current question)
      if (flagged[index]) {
        return "bg-orange-100 border-orange-500 text-orange-700";
      }
      
      // Check if current question
      if (index === currentQuestionIndex) {
        if (testMode === 'exam') {
          return "bg-white border-blue-500 text-blue-700";
        }
        return "bg-blue-100 border-blue-500 text-blue-700";
      }
      
      // Check if answered but not submitted
      if (answers[index] !== null) {
        if (testMode === 'exam') {
          return "bg-white border-blue-500 text-blue-700";
        }
        return "bg-blue-100 border-blue-500 text-blue-700";
      }
      
      // Default state
      return "bg-white border-gray-300 text-gray-700 hover:bg-gray-50";
    }
    
    // After submitting, show answer colors based on mode (flagged status is secondary to answer status)
    if (answers[index] !== null) {
      if (testMode === 'exam') {
        // Exam mode: full blue background for answered
        return "bg-blue-500 border-blue-600 text-white";
      } else {
        // Study mode: show correct/incorrect colors
        const isCorrect = answers[index] === questions[index].correct;
        return isCorrect ? "bg-green-100 border-green-500 text-green-700" : "bg-red-100 border-red-500 text-red-700";
      }
    }
    
    // Default state
    return "bg-white border-gray-300 text-gray-700 hover:bg-gray-50";
  };

  return (
    <div className="flex h-screen bg-gray-100 quiz-page">
      <style jsx>{`
        /* Quiz-specific overrides - ensure no green anywhere */
        .quiz-page * {
          --quiz-primary: #3b82f6;
          --quiz-secondary: #1d4ed8;
          --quiz-hover: #2563eb;
        }
        
        .quiz-page button:focus,
        .quiz-page input:focus,
        .quiz-page select:focus {
          outline: none !important;
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
        }
        
        .quiz-page button:hover,
        .quiz-page input:hover,
        .quiz-page select:hover {
          border-color: #3b82f6 !important;
        }
        
        /* Override any global green styles */
        .quiz-page .text-green-500,
        .quiz-page .hover\\:text-green-700,
        .quiz-page .border-green-500,
        .quiz-page .hover\\:border-green-500,
        .quiz-page .bg-green-500,
        .quiz-page .hover\\:bg-green-500,
        .quiz-page .text-green-600,
        .quiz-page .text-green-700,
        .quiz-page .text-green-800,
        .quiz-page .bg-green-50,
        .quiz-page .bg-green-100,
        .quiz-page .border-green-600,
        .quiz-page .border-green-700,
        .quiz-page .border-green-800 {
          color: #3b82f6 !important;
          border-color: #3b82f6 !important;
          background-color: #3b82f6 !important;
        }
        
        .quiz-page .hover\\:text-green-700:hover {
          color: #1d4ed8 !important;
        }
        
        .quiz-page .hover\\:bg-green-500:hover {
          background-color: #1d4ed8 !important;
        }
        
        .quiz-page .hover\\:border-green-500:hover {
          border-color: #1d4ed8 !important;
        }
        
        /* Override global CSS to prevent green hover effects */
        .quiz-nav-button:hover {
          background-color: rgb(249 250 251) !important;
          border-color: rgb(209 213 219) !important;
        }
        
        .quiz-nav-button.flagged:hover {
          background-color: rgb(255 237 213) !important;
          border-color: rgb(249 115 22) !important;
        }
        
        .quiz-nav-button.current:hover {
          background-color: rgb(219 234 254) !important;
          border-color: rgb(59 130 246) !important;
        }
        
        .quiz-nav-button.answered:hover {
          background-color: rgb(219 234 254) !important;
          border-color: rgb(59 130 246) !important;
        }
        
        .quiz-nav-button.correct:hover {
          background-color: rgb(220 252 231) !important;
          border-color: rgb(34 197 94) !important;
        }
        
        .quiz-nav-button.incorrect:hover {
          background-color: rgb(254 226 226) !important;
          border-color: rgb(239 68 68) !important;
        }
        
        /* Fix highlighted text layout */
        .highlighted-text {
          display: inline !important;
          position: relative !important;
          z-index: 1 !important;
          padding: 0 !important;
          margin: 0 !important;
          border-radius: 2px !important;
          line-height: inherit !important;
          font-size: inherit !important;
          font-family: inherit !important;
          white-space: pre-wrap !important;
          word-wrap: break-word !important;
          vertical-align: baseline !important;
          box-sizing: border-box !important;
          word-spacing: normal !important;
          letter-spacing: normal !important;
          text-indent: 0 !important;
          text-transform: none !important;
          text-decoration: none !important;
          text-align: inherit !important;
          text-justify: inherit !important;
          text-emphasis: none !important;
          text-emphasis-color: inherit !important;
          text-emphasis-style: inherit !important;
          text-emphasis-position: inherit !important;
          text-shadow: none !important;
          text-overflow: inherit !important;
          text-rendering: inherit !important;
          text-orientation: inherit !important;
          text-combine-upright: inherit !important;
          text-underline-position: inherit !important;
          text-underline-offset: inherit !important;
          text-decoration-skip-ink: inherit !important;
          text-decoration-thickness: inherit !important;
          text-decoration-style: inherit !important;
          text-decoration-color: inherit !important;
          text-decoration-line: inherit !important;
          text-decoration-skip: inherit !important;
          text-decoration-skip-box: inherit !important;
          text-decoration-skip-inset: inherit !important;
          text-decoration-skip-spaces: inherit !important;
          text-decoration-break: inherit !important;
          text-decoration-skip-self: inherit !important;
        }
        
        /* Ensure question and explanation text containers maintain position */
        .question-text-container, .explanation-text-container {
          position: relative !important;
          overflow-wrap: break-word !important;
          word-break: normal !important;
          hyphens: auto !important;
        }
        
        /* Completely override highlighter color button styles - remove ALL green */
        .highlighter-color-btn,
        .highlighter-color-btn *,
        .highlighter-color-btn::before,
        .highlighter-color-btn::after {
          border-color: transparent !important;
          background-color: transparent !important;
          outline: none !important;
          box-shadow: none !important;
          text-decoration: none !important;
          color: inherit !important;
        }
        
        .highlighter-color-btn {
          border: 2px solid transparent !important;
          transition: border-color 0.2s ease !important;
          background-color: transparent !important;
          outline: none !important;
          box-shadow: none !important;
        }
        
        .highlighter-color-btn:focus,
        .highlighter-color-btn:focus-visible,
        .highlighter-color-btn:focus-within {
          border-color: rgb(59 130 246) !important;
          outline: none !important;
          box-shadow: none !important;
          background-color: transparent !important;
        }
        
        .highlighter-color-btn.selected,
        .highlighter-color-btn.selected:focus,
        .highlighter-color-btn.selected:focus-visible,
        .highlighter-color-btn.selected:focus-within {
          border-color: rgb(59 130 246) !important;
          outline: none !important;
          box-shadow: none !important;
          background-color: transparent !important;
        }
        
        .highlighter-color-btn:hover,
        .highlighter-color-btn:hover:focus,
        .highlighter-color-btn:hover:focus-visible {
          border-color: rgb(147 197 253) !important;
          outline: none !important;
          box-shadow: none !important;
          background-color: transparent !important;
        }
        
        .highlighter-color-btn:active,
        .highlighter-color-btn:active:focus,
        .highlighter-color-btn:active:focus-visible {
          border-color: rgb(59 130 246) !important;
          outline: none !important;
          box-shadow: none !important;
          background-color: transparent !important;
        }
        
        .highlighter-color-btn:visited,
        .highlighter-color-btn:visited:focus,
        .highlighter-color-btn:visited:hover {
          border-color: transparent !important;
          outline: none !important;
          box-shadow: none !important;
          background-color: transparent !important;
        }
        
        /* Override any global button styles with maximum specificity */
        button.highlighter-color-btn,
        button.highlighter-color-btn:focus,
        button.highlighter-color-btn:hover,
        button.highlighter-color-btn:active,
        button.highlighter-color-btn:visited,
        button.highlighter-color-btn:focus-visible,
        button.highlighter-color-btn:focus-within {
          background-color: transparent !important;
          border-color: transparent !important;
          outline: none !important;
          box-shadow: none !important;
          text-decoration: none !important;
          color: inherit !important;
        }
        
        button.highlighter-color-btn.selected,
        button.highlighter-color-btn.selected:focus,
        button.highlighter-color-btn.selected:hover,
        button.highlighter-color-btn.selected:active,
        button.highlighter-color-btn.selected:focus-visible {
          border-color: rgb(59 130 246) !important;
          background-color: transparent !important;
          outline: none !important;
          box-shadow: none !important;
        }
        
        /* Remove any green colors from the entire highlighter area */
        .highlighter-color-btn,
        .highlighter-color-btn *,
        .highlighter-color-btn::before,
        .highlighter-color-btn::after,
        .highlighter-color-btn:hover,
        .highlighter-color-btn:focus,
        .highlighter-color-btn:active,
        .highlighter-color-btn:visited {
          --tw-border-opacity: 0 !important;
          --tw-bg-opacity: 0 !important;
          --tw-text-opacity: 1 !important;
          border-color: transparent !important;
          background-color: transparent !important;
          outline: none !important;
          box-shadow: none !important;
        }
      `}</style>
      
      {/* Sidebar */}
      <aside
        className={`fixed md:static z-30 h-full border-r border-gray-200 flex flex-col bg-white shadow-lg transition-all duration-300
          ${sidebarCollapsed ? 'w-16' : 'w-72'}
          ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ minWidth: sidebarCollapsed ? 64 : 240 }}
      >
        {/* Collapsed: Hamburger at top, end quiz icon at bottom */}
        {sidebarCollapsed ? (
          <>
            <div className="flex flex-col items-center w-full h-full">
              <div className="pt-4">
                <button
                  className="p-2 rounded-full hover:bg-blue-100 text-blue-600"
                  onClick={handleSidebarToggle}
                  aria-label="Expand sidebar"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
              <div className="flex-1"></div>
              <div className="pb-4">
                <button
                  onClick={endQuiz}
                  className="p-3 rounded-full bg-red-50 hover:bg-red-100 text-red-600"
                  aria-label="End Quiz"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4 px-2 pt-2">
              <h2 className="text-xl font-bold text-blue-600 transition-all duration-200">Question Navigation</h2>
              <button
                className="p-2 rounded-full hover:bg-blue-100 text-blue-600"
                onClick={handleSidebarToggle}
                aria-label="Collapse sidebar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 flex-grow content-start px-2 pb-2 overflow-y-auto">
              {questions.map((_, index) => {
                const buttonState = getNavButtonState(index);
                const buttonClass = `quiz-nav-button p-2 rounded-md text-base font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors duration-200 border-2 h-12 w-12 flex items-center justify-center ${buttonState}`;
                
                return (
                  <button
                    key={index}
                    onClick={() => goToQuestion(index)}
                    className={buttonClass}
                    style={{ minWidth: 40 }}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
            <div className="flex justify-center items-center w-full mt-auto mb-4 px-4">
              <button
                onClick={endQuiz}
                className="bg-red-600 text-white font-bold py-3 w-full rounded-lg hover:bg-red-700 transition-colors duration-200 text-lg shadow"
                style={{ minWidth: 0, width: '100%', maxWidth: '100%', paddingLeft: 0, paddingRight: 0 }}
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-6 h-6 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
                  </svg>
                  End Quiz
                </span>
              </button>
            </div>
          </>
        )}
      </aside>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-72'} md:ml-0`}> 
        {/* Header */}
        <header className="bg-blue-600 shadow-md p-2 sm:p-3 flex justify-between items-center text-white">
          <div className="flex items-center">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="hidden sm:flex p-1 sm:p-2 mr-2 text-white hover:bg-blue-700 rounded-full transition-colors duration-200 md:hidden"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">MBHA</h1>
          </div>
          <div className="flex-1 flex justify-center items-center space-x-2 sm:space-x-3">
            <button
              onClick={goToPrevious}
              disabled={currentQuestionIndex === 0}
              className="flex items-center px-2 sm:px-4 py-1 sm:py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-bold text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Previous</span>
            </button>
            <button
              onClick={goToNext}
              disabled={currentQuestionIndex === questions.length - 1}
              className="flex items-center px-2 sm:px-4 py-1 sm:py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-bold text-sm sm:text-base"
            >
              <span className="hidden sm:inline">Next</span>
              <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          {testMode === 'exam' && (
            <div className="w-32 sm:w-48 text-sm sm:text-lg font-medium bg-blue-500 px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-white text-center">
              {formatTime(timeLeft)}
            </div>
          )}
        </header>

        {/* Quiz Content */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 md:p-8 flex justify-center">
          <div className="w-full flex flex-col h-full items-center">
            <div className="flex-grow flex w-full">
              {/* Question Panel */}
              <div className={`bg-white p-3 sm:p-4 md:p-8 rounded-2xl shadow-xl border border-gray-200 flex flex-col min-h-0 transition-all duration-300 ${showExplanation && testMode === 'study' ? "w-1/2" : "w-full"}`}>
                <div className="flex justify-between items-start mb-4 sm:mb-6">
                  <div>
                    <span className="text-lg sm:text-2xl font-bold text-black">Q#{currentQuestion.id}</span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    {/* Calculator */}
                    <div className="relative">
                      <button
                        onClick={() => setCalculatorVisible(!calculatorVisible)}
                        className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200"
                        title="Calculator"
                      >
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </button>
                      {calculatorVisible && (
                        <div className="absolute top-12 right-0 bg-white border border-gray-200 rounded-lg p-4 z-50 w-60 shadow-lg max-w-[90vw]">
                          <input
                            type="text"
                            value={calculatorValue}
                            readOnly
                            className="w-full mb-3 p-2 border border-gray-300 rounded text-right text-xl bg-gray-50 text-black"
                          />
                          <div className="grid grid-cols-4 gap-2">
                            {[7, 8, 9, "/", 4, 5, 6, "*", 1, 2, 3, "-", 0, ".", "C", "+"].map((btn) => (
                              <button
                                key={btn}
                                onClick={() => handleCalculatorClick(btn)}
                                className={`p-3 rounded ${
                                  btn === "C"
                                    ? "bg-red-100 text-red-600"
                                    : btn === "/" || btn === "*" || btn === "-" || btn === "+" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-black"
                                                                 } hover:bg-gray-200 transition-colors duration-200`}
                              >
                                {btn}
                              </button>
                            ))}
                            <button
                              onClick={() => handleCalculatorClick("=")}
                              className="p-3 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 col-span-2"
                            >
                              =
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Highlighter */}
                    <div className="relative">
                      <button
                        onClick={toggleHighlighter}
                        className={`p-2.5 rounded-full transition-colors duration-200 ${highlighterActive ? "bg-blue-100 text-blue-600" : "text-blue-600 hover:bg-blue-50"}`}
                        title="Highlighter"
                        style={highlighterActive ? { backgroundColor: highlighterColors[selectedColor || 0].color, color: 'black' } : {}}
                      >
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      {showColorMenu && (
                        <div className="absolute top-12 right-0 bg-white border border-gray-200 rounded-lg p-3 z-50 shadow-lg flex flex-col gap-2 max-w-[90vw]">
                          <div className="flex gap-2">
                            {highlighterColors.map((colorObj, index) => (
                              <button
                                key={colorObj.color}
                                onClick={() => selectHighlighterColor(index)}
                                className={`w-6 h-6 rounded-full border-2 ${selectedColor === index ? "border-blue-600" : "border-transparent"}`}
                                style={{ backgroundColor: colorObj.color }}
                                title={colorObj.name}
                              />
                            ))}
                          </div>
                          <div className="border-t border-gray-200 pt-2">
                            <button
                              onClick={removeAllHighlights}
                              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-sm rounded transition-colors"
                              title="Clear all highlights"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Clear All
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Flag */}
                    <button
                      onClick={toggleFlag}
                      className={`p-2.5 rounded-full transition-colors duration-200 ${flagged[currentQuestionIndex] ? "bg-orange-100 text-orange-600" : "text-blue-600 hover:bg-blue-50"} ${isSubmitted ? "opacity-50 cursor-not-allowed" : ""}`}
                      title="Flag for Review"
                      disabled={isSubmitted}
                    >
                      <svg className="w-7 h-7" fill={flagged[currentQuestionIndex] ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2z" />
                      </svg>
                    </button>

                    {/* Font Size */}
                    <div className="flex items-center bg-blue-50 rounded-full">
                      <button
                        onClick={decreaseFontSize}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors duration-200"
                        title="Decrease Font Size"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="px-2 text-base font-medium text-blue-600">Tt</span>
                      <button
                        onClick={increaseFontSize}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors duration-200"
                        title="Increase Font Size"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-8 flex-grow overflow-y-auto">
                  <div
                    ref={questionTextRef}
                    className="mb-8 leading-relaxed text-black select-text question-text-container break-words"
                    style={{ fontSize: `${fontSize}px` }}
                    onDoubleClick={preventDoubleClickSelection}
                  >
                    {currentQuestion.text}
                  </div>
                  <div className="space-y-4">
                    {currentQuestion.options.map((option, index) => (
                      <div
                        key={index}
                        className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                          isSubmitted && testMode === 'study' 
                            ? index === currentQuestion.correct 
                              ? "bg-green-50 border-green-500" 
                              : index === userAnswer && index !== currentQuestion.correct 
                                ? "bg-red-50 border-red-500" 
                                : "border-gray-300 cursor-default"
                            : userAnswer === index 
                              ? "bg-blue-50 border-blue-500" 
                              : "border-gray-300 hover:bg-gray-100"
                        }`}
                        onClick={() => selectAnswer(index)}
                      >
                        <input
                          type="radio"
                          name={`question${currentQuestionIndex}`}
                          checked={userAnswer === index}
                          onChange={() => selectAnswer(index)}
                          disabled={isSubmitted}
                          className="h-5 w-5 text-black focus:ring-blue-600 border-gray-400"
                        />
                        <label
                          className="ml-4 block font-medium text-black cursor-pointer select-text break-words"
                          style={{ fontSize: `${fontSize}px` }}
                        >
                          {String.fromCharCode(65 + index)}. {option}
                        </label>
                        {isSubmitted && testMode === 'study' && (
                          <div className="ml-auto">
                            {index === currentQuestion.correct ? (
                              <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            ) : index === userAnswer && index !== currentQuestion.correct ? (
                              <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                            ) : null}
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Submit Button - Below the last choice */}
                    {!isSubmitted && (
                      <div className="mt-6 flex justify-start">
                        <button
                          onClick={submitAnswer}
                          disabled={userAnswer === null}
                          className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                          Submit
                        </button>
                      </div>
                    )}
                    
                    {/* Show/Hide Explanation Button - Appears in same place as submit button */}
                    {isSubmitted && testMode === 'study' && (
                      <div className="mt-6 flex justify-start">
                        <button
                          onClick={() => setShowExplanation(!showExplanation)}
                          className="flex items-center px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          {showExplanation ? "Hide Explanation" : "Show Explanation"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Explanation Panel - Only for Study Mode */}
              {showExplanation && testMode === 'study' && (
                <div className="w-1/2 flex-col min-h-0 ml-6">
                  <div 
                    ref={explanationTextRef} 
                    className="explanation-panel bg-white p-6 rounded-2xl shadow-xl border border-gray-200 flex-grow flex flex-col h-full break-words"
                    onDoubleClick={preventDoubleClickSelection}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-black">Explanation</h3>
                      {testMode === 'study' && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={decreaseFontSize}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors duration-200"
                            title="Decrease Font Size"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="text-sm text-gray-600 min-w-[3rem] text-center">{fontSize}px</span>
                          <button
                            onClick={increaseFontSize}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors duration-200"
                            title="Increase Font Size"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                                          <div className="text-base space-y-4 overflow-y-auto flex-grow explanation-text-container">
                        <div className={`p-4 ${isCorrect ? "bg-green-50 border-l-4 border-green-500" : "bg-red-50 border-l-4 border-red-500"}`}>
                          <p className={`${isCorrect ? "text-green-800" : "text-red-800"} font-semibold`} style={{ fontSize: `${fontSize}px` }}>
                            {isCorrect ? "Correct Answer: " : "Your Answer: "} {String.fromCharCode(65 + userAnswer)}. {currentQuestion.options[userAnswer]}
                          </p>
                          {!isCorrect && (
                            <p className="mt-1 text-green-800 font-semibold" style={{ fontSize: `${fontSize}px` }}>
                              Correct Answer: {String.fromCharCode(65 + currentQuestion.correct)}. {currentQuestion.options[currentQuestion.correct]}
                            </p>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="text-black select-text explanation-text-container" style={{ fontSize: `${fontSize}px` }}>{currentQuestion.explanation.correct}</div>
                        </div>
                                              <div className="p-4">
                          <p className="text-black font-semibold" style={{ fontSize: `${fontSize}px` }}>Incorrect Options:</p>
                          <div className="space-y-2 mt-2 text-black">
                            {currentQuestion.options.map((opt, i) => {
                              if (i !== currentQuestion.correct) {
                                const incorrectExplanationIndex = i > currentQuestion.correct ? i - 1 : i;
                                const explanationText = currentQuestion.explanation.incorrect[incorrectExplanationIndex] || "Explanation not available.";
                                return (
                                  <div key={i} className="select-text explanation-text-container" style={{ fontSize: `${fontSize}px` }}>
                                    <strong>{String.fromCharCode(65 + i)}. {opt}:</strong> {explanationText}
                                  </div>
                                );
                              }
                              return null;
                            })}
                          </div>
                        </div>
                      <div>
                        <details className="bg-blue-50 border border-blue-200 rounded-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-md hover:border-blue-300" open>
                          <summary className="flex items-center justify-between font-semibold text-black list-none" style={{ fontSize: `${fontSize}px` }}>
                            <span>Educational Objective</span>
                            <svg className="w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </summary>
                          <div className="mt-2 text-black select-text explanation-text-container" style={{ fontSize: `${fontSize}px` }}>{currentQuestion.explanation.objective}</div>
                        </details>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-auto pt-6 border-t border-gray-200 w-full">
              <div></div>
            </div>
          </div>
        </div>
      </main>

      {/* Click outside to close menus */}
      {calculatorVisible && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setCalculatorVisible(false);
          }}
        />
      )}

      {/* Score Overlay */}
      {showScoreOverlay && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-2 sm:p-4 md:p-8 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl w-full shadow-2xl overflow-hidden border-2 border-blue-500 my-4">
            {/* Header with gradient */}
            <div className={`${getScoreColor(finalScore).bg} p-3 sm:p-4 md:p-4 lg:p-6 xl:p-8 text-center relative overflow-hidden`}>
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill="url(#grid)" />
                </svg>
              </div>
              
              {/* Score display */}
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-6">
                  {/* Large score circle */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 xl:w-40 xl:h-40">
                    <svg className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 xl:w-40 xl:h-40 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-white opacity-30"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-white"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={`${finalScore}, 100`}
                        strokeLinecap="round"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-5xl font-bold text-white mb-1">
                          {finalScore}%
                        </div>
                        <div className="text-white opacity-80 text-xs sm:text-sm">Final Score</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Score message */}
                <div className="text-white">
                  <h1 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-3xl font-bold mb-2">{getScoreMessage(finalScore).title}</h1>
                  <p className="text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg opacity-90">{getScoreMessage(finalScore).subtitle}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-3 sm:p-4 md:p-4 lg:p-6 xl:p-8">
              {/* Statistics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-3 lg:gap-4 xl:gap-6 mb-4 sm:mb-6 md:mb-6 lg:mb-8">
                <div className="text-center">
                  <div className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-800 mb-1">{questions.length}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Total Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-green-600 mb-1">
                    {answers.filter((answer, index) => answer === questions[index].correct).length}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Correct</div>
                </div>
                <div className="text-center">
                  <div className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-red-600 mb-1">
                    {answers.filter((answer, index) => answer !== null && answer !== questions[index].correct).length}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Incorrect</div>
                </div>
                <div className="text-center">
                  <div className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-600 mb-1">
                    {answers.filter(answer => answer === null).length}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Unanswered</div>
                </div>
              </div>

              {/* Performance breakdown */}
              <div className="bg-gray-50 rounded-xl p-3 sm:p-4 md:p-4 lg:p-6 mb-4 sm:mb-6 md:mb-6 lg:mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Performance Breakdown
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Accuracy Rate</span>
                    <span className="font-semibold text-gray-800">
                      {Math.round((answers.filter((answer, index) => answer === questions[index].correct).length / questions.length) * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Completion Rate</span>
                    <span className="font-semibold text-gray-800">
                      {Math.round(((questions.length - answers.filter(answer => answer === null).length) / questions.length) * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Time Used</span>
                    <span className="font-semibold text-gray-800">
                      {testMode === 'exam' && endTime ? formatTime(Math.floor((endTime - startTime) / 1000)) : testMode === 'exam' ? formatTime(Math.floor((Date.now() - startTime) / 1000)) : 'No timer'}
                    </span>
                  </div>
                </div>
              </div>

                             {/* Action Buttons */}
               <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                 {testMode === 'exam' && (
                   <button
                     onClick={() => setShowAnswerReview(true)}
                     className="flex-1 bg-blue-600 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center justify-center text-sm sm:text-base"
                   >
                     <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                     </svg>
                     Review All Answers
                   </button>
                 )}
                 <button
                   onClick={() => window.location.reload()}
                   className="flex-1 bg-green-600 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl hover:bg-green-700 transition-all duration-200 flex items-center justify-center text-sm sm:text-base"
                 >
                   <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                   </svg>
                   Retry Exam
                 </button>
                 <button
                   onClick={() => window.location.href = "/qbank"}
                   className="flex-1 bg-gray-600 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl hover:bg-gray-700 transition-all duration-200 flex items-center justify-center text-sm sm:text-base"
                 >
                   <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                   </svg>
                   Back to QBank
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Answer Review Overlay */}
      {showAnswerReview && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] shadow-2xl overflow-hidden border-2 border-blue-500">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Answer Review</h2>
                  <p className="text-blue-100">Review all your answers and see what you got right or wrong</p>
                </div>
                <button
                  onClick={() => setShowAnswerReview(false)}
                  className="text-white hover:text-blue-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                {questions.map((question, index) => {
                  const userAnswer = answers[index];
                  const isCorrect = userAnswer === question.correct;
                  const isAnswered = userAnswer !== null;
                  
                  return (
                    <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      {/* Question Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            isAnswered 
                              ? isCorrect 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            Q{index + 1}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            isAnswered 
                              ? isCorrect 
                                ? 'bg-green-200 text-green-700' 
                                : 'bg-red-200 text-red-700'
                              : 'bg-gray-200 text-gray-700'
                          }`}>
                            {isAnswered 
                              ? isCorrect 
                                ? '✓ Correct' 
                                : '✗ Incorrect'
                              : 'Unanswered'
                            }
                          </span>
                        </div>
                        {flagged[index] && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                            ⚑ Flagged
                          </span>
                        )}
                      </div>

                      {/* Question Text */}
                      <div className="mb-4">
                        <p className="text-gray-800 font-medium">{question.text}</p>
                      </div>

                      {/* Options */}
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => {
                          const isUserChoice = userAnswer === optionIndex;
                          const isCorrectAnswer = optionIndex === question.correct;
                          
                          let optionStyle = "p-3 rounded-lg border-2 transition-all";
                          let icon = null;
                          
                          if (isCorrectAnswer) {
                            optionStyle += " bg-green-50 border-green-300";
                            icon = (
                              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            );
                          } else if (isUserChoice && !isCorrectAnswer) {
                            optionStyle += " bg-red-50 border-red-300";
                            icon = (
                              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                            );
                          } else {
                            optionStyle += " bg-gray-50 border-gray-200";
                          }
                          
                          return (
                            <div key={optionIndex} className={optionStyle}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <span className="text-sm font-medium text-gray-600">
                                    {String.fromCharCode(65 + optionIndex)}.
                                  </span>
                                  <span className="text-gray-800">{option}</span>
                                </div>
                                {icon}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Educational Objective */}
                      {question.explanation && question.explanation.objective && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <h4 className="font-semibold text-blue-800 mb-2">Educational Objective:</h4>
                          <p className="text-blue-700 text-sm">
                            {question.explanation.objective}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 p-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Showing {questions.length} questions • 
                  <span className="text-green-600 font-medium ml-1">
                    {answers.filter((answer, index) => answer === questions[index].correct).length} correct
                  </span>
                  <span className="text-red-600 font-medium ml-1">
                    {answers.filter((answer, index) => answer !== null && answer !== questions[index].correct).length} incorrect
                  </span>
                </div>
                <button
                  onClick={() => setShowAnswerReview(false)}
                  className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Close Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuizPageContent />
    </Suspense>
  );
}
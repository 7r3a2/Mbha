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

const SUBJECTS = [
  {
    key: 'obgyn',
    label: 'Obstetrics & Gynecology',
    color: '#0072b7',
    lectures: [
      {
        title: 'Basic sign and normal pregnancy',
        topics: ['Physiological changes in pregnancy', 'Anatomy and embryology'],
      },
      {
        title: 'Maternal Medicine',
        topics: [
          'D.M. in pregnancy',
          'Hypertensive disorder in pregnancy',
          'Kidney disease and UTI in pregnancy',
          'Heart disease in pregnancy',
          'GIT problem in pregnancy',
          'Bleeding disorder in pregnancy',
          'Coagulation disorder in pregnancy',
          'Anemia in pregnancy'
        ],
      },
      {
        title: 'Foetal Medicine',
        topics: [
          'Rh isoimmunisation',
          'Congenital & Chromosomal abnormality',
          'Intrauterine infection',
          'IUGR & IUFD'
        ],
      },
      {
        title: 'Birth & labour',
        topics: [
          'Labour',
          'Abnormal labor',
          'APH',
          'PPH',
          'Malpresentation',
          'Breech',
          'Fetal heart monitoring',
          'Multiple pregnancy',
          'Induction of labour'
        ],
      },
      {
        title: 'Postnatal care',
        topics: ['Puerperium', 'Neonatal care'],
      },
      {
        title: 'Basic science',
        topics: [
          'Physiology of female reproductive tract & menstrual cycle',
          'Anatomy'
        ],
      },
      {
        title: 'Intersix and primary Amenorrhea',
        topics: [
          'Intersix',
          'Genital tract congenital abnormalities',
          'Primary amenorrhea'
        ],
      },
      {
        title: 'Early pregnancy problem',
        topics: [
          'Ectopic pregnancy',
          'Miscarriage',
          'Gestational trophoblastic disease'
        ],
      },
      {
        title: 'Menstruation',
        topics: [
          'Puberty',
          'Abnormal uterine bleeding',
          'Secondary amenorrhea',
          'Endometriosis & adenomyosis',
          'Contraception',
          'PCOS, hirsutism & virilization'
        ],
      },
      {
        title: 'Urogynecology',
        topics: ['Urinary incontinence', 'Pelvic organ prolapse'],
      },
      {
        title: 'Benign condition of genital tract',
        topics: [
          'Infection in gynecology: genital tract infection',
          'Fibroid',
          'Vulval & Vaginal Benign condition & premalignant condition of vulva & vagina',
          'Precancerous cervical lesion',
          'Benign ovarian lesion',
          'Endometrial hyperplasia'
        ],
      },
      {
        title: 'Malignant condition of Genital tract',
        topics: [
          'Ovarian malignancy',
          'Uterine malignancy',
          'Cervical malignancy',
          'VULVAL & VAGINAL MALIGNANCY'
        ],
      },
      {
        title: 'Infertility',
        topics: [],
      },
    ],
    sources: [
      { key: 'ten_teachers', label: 'Ten teachers' },
      { key: 'lang', label: 'Lang' },
      { key: 'mrcog_part2', label: 'MRCOG part 2' },
      { key: 'mrcog', label: 'MRCOG' },
      { key: 'pretest', label: 'Pretest' },
    ],
  },
  {
    key: 'im',
    label: 'Internal Medicine',
    color: '#0072b7',
    lectures: [
      {
        title: 'Cardiovascular',
        topics: [
          'Cardiac arrest & cardiopulmonary resuscitation',
          'Hypertensive & HT Emergency, Aortic dissection',
          'Acute coronary syndrome (STEMI, NSTEMI & unstable angina)',
          'Heart failure (systolic & diastolic) acute pulmonary edema',
          'Cardiac tamponade & pericardial diseases',
          'Atrial fibrillation',
          'Supraventricular tachycardia',
          'Rheumatic fever, Valvular heart disease Infective endocarditis',
          'Congenital Heart Diseases; VSD, ASD, TOF, PDA',
          'Cardiomyopathy',
          'Primary & secondary Prevention of cardiovascular diseases'
        ],
      },
      {
        title: 'Respiratory',
        topics: [
          'Asthma & allergic bronchitis',
          'Acute upper respiratory tract infection',
          'The Pneumonias (lower resp. tract infections)',
          'Suppurative lung disease & Bronchiectasis',
          'Pulmonary Tuberculosis',
          'Respiratory failure',
          'Pleural disease (effusion + Pneumothorax)',
          'Lung cancer',
          'Acute pulmonary embolism',
          'Chronic bronchitis and emphysema',
          'Interstitial lung diseases, fibrosing alveolitis, Extrinsic allergic alveolitis',
          'Adult respiratory distress syndrome'
        ],
      },
      {
        title: 'GIT & Hepatology',
        topics: [
          'Oesophagitis & GERD',
          'Gastritis and Peptic ulcer',
          'GIT bleeding',
          'Malabsorption',
          'Chronic inflammatory bowel diseases',
          'Irritable bowel syndrome',
          'Viral hepatitis, Acute fulminant hepatic failure',
          'Fatty liver, Non-alcoholic fatty liver disease (NAFLD)',
          'Chronic liver disease Cirrhosis and portal hypertension',
          'Drug induced liver disease',
          'Acute pancreatitis & chronic Pancreatitis',
          'Autoimmune Hepatitis',
          'Wilson dis., Alfa1 antitrypsin deficiency, Hemochromatosis'
        ],
      },
      {
        title: 'Haematology & Oncology',
        topics: [
          'Aplastic anemia',
          'Anemia of chronic disease',
          'Iron deficiency anemia',
          'Autoimmune hemolytic anemia',
          'Thalassemia, sickle cell disease, G6PD deficiency',
          'Acute leukemia',
          'Hemophilia & Von Willebrand dis, ITP',
          'Chronic Leukaemia',
          'Megaloplastic anemia',
          'Myelodysplastic syndrome',
          'Non-Hodgkins lymphoma, Hodgkin Lymphoma',
          'Bone marrow transplantation',
          'Tumor Lysis syndrome, Hypercalcemia',
          'Multiple myeloma',
          'Blood Transfusion & Complications',
          'Polycythaemias, Essential thrombocythemia'
        ],
      },
      {
        title: 'Endocrinology & Diabetes Mellitus',
        topics: [
          'Hyperthyroidism',
          'Hypothyroidism and thyroiditis',
          'Pituitary gland disorders',
          'Adrenal insufficiency, Hyperfunction',
          'Hyperparathyroidism, Hypoparathyroidism and tetany',
          'Hyperlipidaemia',
          'Diabetes Mellitus',
          'Osteoporosis, Osteomalacia and Vitamin',
          'Hypogonadism, Hirsutism & Male infertility',
          'Malnutrition, Obesity, minerals'
        ],
      },
      {
        title: 'Neurology',
        topics: [
          'Disease of cranial nerves',
          'Seizures, status Epilepticus',
          'Demyelinating diseases; multiple sclerosis',
          'Cerebrovascular accident, Ischemic & Haemorrhagic',
          'Spinal cord diseases, Transverse myelitis',
          'Migraine & Headache, Idiopathic intracranial hypertension',
          'Infections of nervous system (Meningitis & encephalitis)',
          'Peripheral neuropathy',
          'Extrapyramidal disorders as parkinsonism',
          'Degenerative diseases of nervous system as motor neuron disease'
        ],
      },
      {
        title: 'Nephrology',
        topics: [
          'Nephrotic syndrome',
          'Acute Renal Failure',
          'Renal Dialysis - CAPD',
          'Kidney Transplantation',
          'Glomerulonephritis',
          'Chronic Renal failure',
          'Electrolyte disturbance, water balance and Blood gas analysis',
          'Systemic disease and the kidney',
          'Urinary Tract Infection',
          'Drug induced Nephropathy'
        ],
      },
      {
        title: 'Infectious',
        topics: [
          'Infectious Mononucleosis',
          'Malaria, Leishmaniasis, Toxoplasmosis, Hydatid cyst',
          'Exanthemata\'s febrile illness as Measles, Mumps, Herpes simplex',
          'HIV infection',
          'Brucellosis & Salmonellosis',
          'Food poisoning & Acute Diarrheal disease',
          'Amoebiasis, Giardiasis and Helminthic infection',
          'Viral Haemorrhagic fever',
          'Tetanus, Rabies, Staphylococcus & streptococcal infection',
          'Systemic inflammatory response syndrome (SIRS) and septic shock',
          'Fever of unknown origin'
        ],
      },
      {
        title: 'Rheumatology',
        topics: [
          'Rheumatology Degenerative arthritis',
          'Crystal arthropathy',
          'Metabolic bone diseases',
          'Rheumatoid arthritis',
          'Systemic lupus erythematosus',
          'Scleroderma',
          'Vasculitis',
          'Dermatomyositis and polymyositis, Behcets syndrome',
          'Sjogrens syndrome'
        ],
      },
      {
        title: 'Dermatology',
        topics: [
          'Psoriasis',
          'Urticaria and Erythema',
          'Sexually Transmitted diseases'
        ],
      },
      {
        title: 'Psychiatry',
        topics: [
          'Mood disorders',
          'Schizophrenia',
          'Psychosomatic disorders'
        ],
      },
    ],
    sources: [
      { key: 'lang', label: 'Lang' },
      { key: 'davidson', label: 'Davidson' },
      { key: 'pretest', label: 'Pretest' },
      { key: 'sba_500', label: '500 SBAs in internal medicine' },
    ],
  },
  {
    key: 'surgery',
    label: 'Surgery',
    color: '#0072b7',
    lectures: [
      {
        title: 'General Surgery',
        topics: [
          'Basic surgical principles',
          'General pediatrics',
          'Peri-operative care',
          'Abdominal wall, Hernia And Umbilicus',
          'Diabetic foot, ulcer, sinus, fistula and cyst',
          'ATLS principles',
          'Breast',
          'Thyroid/Endocrine diseases',
          'Head and neck',
          'Abdominal trauma'
        ],
      },
      {
        title: 'General Surgery - GIT',
        topics: [
          'History and examination of the abdomen',
          'Gastrointestinal endoscopy',
          'The peritoneum, Mesentery, Retroperitoneum',
          'The esophagus',
          'The stomach and duodenum',
          'Bariatric and metabolic surgery',
          'The liver',
          'The spleen',
          'The gall bladder and bile ducts',
          'The pancreas',
          'Functional disorders of the intestine',
          'The small intestine',
          'Inflammatory bowel disease',
          'The appendix',
          'The large intestine',
          'Intestinal obstruction',
          'The rectum',
          'The anus and anal canal'
        ],
      },
      {
        title: 'Orthopedics',
        topics: [
          'Approach to patients with multiple traumas',
          'Classification of fractures',
          'Local and systemic complications of fractures',
          'Shoulder fractures/dislocations',
          'Humerus fractures',
          'Radius and ulna fractures',
          'Wrist and hand fractures',
          'Spine fractures',
          'Pelvic fractures',
          'Hip and acetabulum fractures/dislocations',
          'Femoral fractures',
          'Knee joint dislocation',
          'Tibia and fibula fractures',
          'Ankle injuries',
          'Foot fractures',
          'Nerve injuries',
          'Bone and joint infections (acute and chronic)',
          'Genetic and metabolic disorders of bones/Neuromuscular disorders',
          'Bone and joint tumors (benign, malignant)',
          'Non-traumatic disorders of the shoulder',
          'Non-traumatic disorders of the elbow, wrist and hand',
          'Non-traumatic disorders of the hip',
          'Non-traumatic disorders of the knee',
          'Non-traumatic disorders of the ankle and foot',
          'Non-traumatic disorders of the neck and spine'
        ],
      },
      {
        title: 'Cardiothoracic/Vascular Surgery',
        topics: [
          'Arterial disorders',
          'Venous disorders',
          'Lymphatic disorders',
          'Cardiothoracic anatomy/disorders/instruments',
          'Thoracic and vascular trauma/emergencies',
          'Cardio-thoracic and vascular tumors'
        ],
      },
      {
        title: 'Radiology',
        topics: [
          'Head and neck imaging',
          'Chest imaging',
          'Abdomino-pelvic imaging',
          'Urinary tract imaging',
          'Bones/joints imaging',
          'Vascular imaging/Basic principles and safety/Interventional radiology'
        ],
      },
      {
        title: 'Neurosurgery',
        topics: [
          'CNS trauma/intracranial bleeding/GCS calculation',
          'Hydrocephalus/Spina bifida',
          'CNS infections',
          'CNS tumors'
        ],
      },
      {
        title: 'Anesthesia',
        topics: [
          'Types and indications of anesthesia',
          'Complications of anesthesia',
          'Principles of critical care in surgical patients'
        ],
      },
      {
        title: 'Plastic and Reconstructive Surgery',
        topics: [
          'Burns and skin grafts',
          'Benign and malignant skin lesions/Bed sores/Cleft lip and palate'
        ],
      },
      {
        title: 'ENT',
        topics: [
          'ENT infections (or) ENT emergencies and traumas',
          'Audiology'
        ],
      },
      {
        title: 'Ophthalmology',
        topics: [
          'Painful/Red eye disorders',
          'Deterioration of visual acuity/Blurred vision'
        ],
      },
    ],
    sources: [
      { key: 'lang', label: 'Lang' },
      { key: 'pretest', label: 'Pretest' },
      { key: 'sba_surgery', label: 'Single best answers in surgery' },
      { key: 'bailey', label: 'Bailey' },
    ],
  },
  {
    key: 'pediatrics',
    label: 'Pediatrics',
    color: '#0072b7',
    lectures: [
      {
        title: 'Hematology',
        topics: [
          'Anemias (IDA, G6PD enzyme deficiency, Thalassemia, Hereditary Spherocytosis, Sickle cell anemia)',
          'Bleeding tendencies (ITP, Hemophilia and Von Willebrand disease)',
          'Leukemias and bone marrow failure (aplastic anemia)'
        ],
      },
      {
        title: 'Neonatology',
        topics: [
          'Neonatal care and APGAR score assessment',
          'Neonatal jaundice',
          'Prematurity and RDS',
          'Neonatal sepsis',
          'Birth injury',
          'Neonatal convulsion',
          'TORCH infection'
        ],
      },
      {
        title: 'GIT',
        topics: [
          'Infant feeding',
          'Acute diarrhea (bloody and non-bloody GE)',
          'Dehydration and ORS',
          'Persistent and chronic diarrhea (Celiac, postinfectious GE, toddlers\' diarrhea)',
          'Malnutrition/Failure to thrive',
          'Acute hepatitis and fulminant hepatic failure',
          'Chronic liver disease'
        ],
      },
      {
        title: 'CVS',
        topics: [
          'Cyanotic Congenital heart disease (TOF, TGA)',
          'Acyanotic Congenital heart disease CHD (VSD, ASD, PDA)',
          'Acquired heart diseases (Rheumatic heart disease, Infective endocarditis)',
          'Heart failure'
        ],
      },
      {
        title: 'Respiratory system',
        topics: [
          'Asthma',
          'Bronchiolitis',
          'Pneumonia',
          'URTI (croups and epiglottitis)',
          'Recurrent RTI (including cystic fibrosis and bronchiectasis)'
        ],
      },
      {
        title: 'Infectious disease',
        topics: [
          'Tuberculosis',
          'Exanthema (scarlet fever, measles, mumps, rubella, erythema infectiosum, roseola infantum)',
          'Diphtheria',
          'Pertussis',
          'Tetanus',
          'Kala azar',
          'Varicella',
          'Infectious Mononucleosis',
          'Pyrexia of Unknown Origin'
        ],
      },
      {
        title: 'Nephrology',
        topics: [
          'Urinary tract infection',
          'Acute Renal failure',
          'Nephrotic syndrome',
          'Glomerulonephritis and hypertension in children',
          'Hematuria and Hemolytic Uremic syndrome'
        ],
      },
      {
        title: 'CNS',
        topics: [
          'CNS infections (meningitis, encephalitis)',
          'Acute paralysis',
          'Epilepsy/ seizures and seizure mimics',
          'Cerebral palsy'
        ],
      },
      {
        title: 'Endocrine',
        topics: [
          'Rickets and parathyroid disease',
          'Diabetes Mellitus',
          'Thyroid disease (hypothyroidism, hyperthyroidism)',
          'Short stature'
        ],
      },
      {
        title: 'Genetics',
        topics: [
          'Down and Turner syndromes',
          'Types of inheritance'
        ],
      },
      {
        title: 'Rheumatology',
        topics: [
          'Vasculitis (Henoch-Schoenlein purpura and Kawasaki)',
          'Connective tissue disease (Juvenile Rheumatoid arthritis and SLE)'
        ],
      },
      {
        title: 'Immunization',
        topics: [
          'Vaccination Schedule',
          'Side effect of vaccine'
        ],
      },
      {
        title: 'Growth and Development',
        topics: [],
      },
      {
        title: 'Others',
        topics: [
          'Pediatric emergencies: (cardio-pulmonary arrest, Anaphylaxis, Status epilepticus, foreign body inhalation, shock, hyper cyanotic spells, sepsis)',
          'Poisoning (Kerosine, corrosives, button batteries, aspirin, iron, paracetamol and organophosphorus)',
          'Child abuse',
          'Autism',
          'Immunodeficiency'
        ],
      },
    ],
    sources: [
      { key: 'nelson', label: 'Nelson' },
      { key: 'lange', label: 'Lange' },
      { key: 'pretest', label: 'Pretest' },
    ],
  },
];

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
  
  // Debug: Log subjects state changes
  useEffect(() => {
    console.log('🔄 Subjects state changed:', subjects.length, 'subjects');
    console.log('🔄 First subject:', subjects[0]?.label);
  }, [subjects]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  // Check if user has qbank access
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user?.hasQbankAccess)) {
      router.push('/wizary-exam');
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Load subjects from database
  useEffect(() => {
    console.log('🔄 useEffect triggered - loading subjects');
    const loadSubjects = async () => {
      setLoadingSubjects(true);
      try {
        console.log('🔄 Loading subjects from API...');
        const response = await fetch('/api/qbank/structure');
        console.log('📡 API Response status:', response.status);
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
            console.log('🔄 Setting subjects state with API data');
            setSubjects(transformedSubjects);
            
            // Force a re-render to ensure API data is used
            setTimeout(() => {
              console.log('🔄 Forcing re-render with API data');
              setSubjects([...transformedSubjects]);
            }, 100);
            
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
        console.log('🔄 No subjects loaded from API');
      } finally {
        setLoadingSubjects(false);
      }
    };

    // Always try to load subjects, regardless of authentication status
    loadSubjects();
  }, [isLoading]); // Add isLoading as dependency to ensure it runs when auth is ready

  const [isOpen, setIsOpen] = useState(true);
  const [activeView, setActiveView] = useState('create-test');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['obgyn']);
  const [selectedSources, setSelectedSources] = useState<string[]>(['apgo', 'acog']);
  const [selectedModes, setSelectedModes] = useState<string[]>(['unused']);
  const [expandedLectures, setExpandedLectures] = useState<{ [k: string]: number[] }>({});
  const [expandedSections, setExpandedSections] = useState<{ [k: string]: boolean }>({});
  const [questionCount, setQuestionCount] = useState(1);
  const [availableQuestions, setAvailableQuestions] = useState<number | null>(null);
  const [checkingQuestions, setCheckingQuestions] = useState(false);
  const [testName, setTestName] = useState('');
  const [examMode, setExamMode] = useState(false); // false = Study mode, true = Exam mode
  const [customTime, setCustomTime] = useState(60); // Default 60 minutes
  
  // Previous Tests State
  const [previousTests, setPreviousTests] = useState<Array<{
    name: string;
    subject: string;
    questions: number;
    mode: 'Study' | 'Exam';
    date: string;
    id: string;
    time?: number; // Add timer value
  }>>([]);

  // Load test history from localStorage on component mount
  useEffect(() => {
    const savedTests = localStorage.getItem('mbha_test_history');
    if (savedTests) {
      try {
        const parsedTests = JSON.parse(savedTests);
        // Ensure only latest 10 tests are loaded
        const limitedTests = parsedTests.slice(0, 10);
        setPreviousTests(limitedTests);
        
        // If we had more than 10 tests, update localStorage to reflect the limit
        if (parsedTests.length > 10) {
          localStorage.setItem('mbha_test_history', JSON.stringify(limitedTests));
        }
      } catch (error) {
        console.error('Error loading test history:', error);
      }
    }
  }, []);

  // Add new test to history (max 10 tests) and save to localStorage
  const addTestToHistory = (testData: {
    name: string;
    subject: string;
    questions: number;
    mode: 'Study' | 'Exam';
    sources?: string;
    topics?: string;
    questionMode?: string;
    testId?: string;
    time?: number; // Add timer value
  }) => {
    const newTest = {
      ...testData,
      date: new Date().toLocaleDateString('en-GB'),
      id: testData.testId || Date.now().toString()
    };

    setPreviousTests(prev => {
      const updated = [newTest, ...prev];
      // Keep only the latest 10 tests
      const limitedTests = updated.slice(0, 10);
      // Save to localStorage
      localStorage.setItem('mbha_test_history', JSON.stringify(limitedTests));
      return limitedTests;
    });
  };

  // Previous Tests Functions
  const handleViewTest = (test: any) => {
    console.log('Viewing test:', test);
    // Navigate to quiz with the original test parameters to load the same questions
    const params = new URLSearchParams();
    params.set('count', String(test.questions));
    params.set('testName', test.name);
    params.set('mode', test.mode.toLowerCase());
    params.set('sources', test.sources || '');
    params.set('topics', test.topics || '');
    params.set('questionMode', test.questionMode || 'all');
    params.set('testId', test.id);
    params.set('review', 'true');
    
    // Add timer value if it exists
    if (test.time && test.mode === 'Exam') {
      params.set('time', String(test.time));
    }
    
    router.push(`/quiz?${params.toString()}`);
  };

  const handleDeleteTest = (testId: string) => {
    setPreviousTests(prev => {
      const updated = prev.filter(test => test.id !== testId);
      // Save to localStorage
      localStorage.setItem('mbha_test_history', JSON.stringify(updated));
      return updated;
    });
  };

  // Dropdown states
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [sidebarHover, setSidebarHover] = useState('');

  // Modal states
  const [showResetWarning, setShowResetWarning] = useState(false);

  // New states for search functionality
  const [showSearch, setShowSearch] = useState<Record<string, boolean>>({});
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
  const [topicsWithQuestions, setTopicsWithQuestions] = useState<{ [key: string]: boolean }>({});
  const [topicQuestionCounts, setTopicQuestionCounts] = useState<{ [key: string]: number }>({});
  const [loadingCounts, setLoadingCounts] = useState(false);

  // Only check topics once when subjects are loaded
  useEffect(() => {
    const selectedSubs = subjects.filter((s) => selectedSubjects.includes(s.key));
    if (selectedSubs.length > 0 && Object.keys(topicsWithQuestions).length === 0) {
      checkAllTopicsForQuestions(selectedSubs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjects]); // Only depend on subjects, not sources

  // Fetch question counts when sources, question mode, user changes, or when subjects are selected
  useEffect(() => {
    if (selectedSubjects.length > 0 && user?.id) {
      fetchTopicQuestionCounts();
    }
  }, [selectedSubjects, selectedSources, selectedModes, user?.id]); // eslint-disable-next-line react-hooks/exhaustive-deps

  // Update question count when available questions change
  useEffect(() => {
    // Don't automatically adjust question count - respect user's input
    // The API will handle returning the requested number of questions
  }, [availableQuestions, questionCount]);

  // Also fetch counts when sources change (even if no user ID yet)
  useEffect(() => {
    if (selectedSubjects.length > 0) {
      fetchTopicQuestionCounts();
    }
  }, [selectedSources]); // eslint-disable-next-line react-hooks/exhaustive-deps

  // Refresh counts when user returns to the page (e.g., from quiz)
  useEffect(() => {
    const handleFocus = () => {
      if (selectedSubjects.length > 0 && user?.id) {
        fetchTopicQuestionCounts();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [selectedSubjects, user?.id]); // eslint-disable-next-line react-hooks/exhaustive-deps

  // Helper: map selected source keys to their labels for current subject selection
  const getSelectedSourceLabels = (): string[] => {
    const allAvailSources = subjects
      .filter((s) => selectedSubjects.includes(s.key))
      .flatMap((s) => s.sources);
    return allAvailSources
      .filter((src: any) => selectedSources.includes(src.key))
      .map((src: any) => src.label)
      .filter(Boolean);
  };


  const handleLogout = () => {
    window.location.href = '/';
  };
  const handleBackToDashboard = () => {
    window.location.href = '/dashboard';
  };

  // Previous tests actions removed per request



  // Mobile detection and sidebar management
  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsOpen(false); // Force collapse on mobile
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    window.addEventListener('orientationchange', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
      window.removeEventListener('orientationchange', checkIsMobile);
    };
  }, []);

  // Check if a topic has questions based on question counts
  const checkTopicHasQuestions = (topicName: string): boolean => {
    const count = topicQuestionCounts[topicName];
    // If we have counts, use them; otherwise assume the topic has questions (allow checking)
    return count !== undefined ? count > 0 : true;
  };

  // Check all topics for questions when subjects are loaded
  const checkAllTopicsForQuestions = async (subjectsData: any[]) => {
    // Only run this check once when subjects are first loaded, not on every source change
    if (Object.keys(topicsWithQuestions).length > 0) {
      return; // Already checked, don't re-check
    }
    
    const topicsMap: { [key: string]: boolean } = {};
    
    for (const subject of subjectsData) {
      for (const lecture of subject.lectures) {
        for (const topic of lecture.topics) {
          const hasQuestions = checkTopicHasQuestions(topic);
          topicsMap[topic] = hasQuestions;
        }
      }
    }
    
    setTopicsWithQuestions(topicsMap);
  };

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
          // Try all possible token storage locations
          const possibleTokens = [
            localStorage.getItem('auth_token'),
            sessionStorage.getItem('auth_token'),
            localStorage.getItem('token'),
            sessionStorage.getItem('token'),
            document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1],
            document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1]
          ];
          
          token = possibleTokens.find(t => t && t.length > 0);
          console.log('🔍 Token search results:', {
            auth_token_local: localStorage.getItem('auth_token'),
            auth_token_session: sessionStorage.getItem('auth_token'),
            token_local: localStorage.getItem('token'),
            token_session: sessionStorage.getItem('token'),
            found_token: token ? 'Found' : 'Not found'
          });
        }
      } catch (error) {
        console.log('❌ Error accessing storage:', error);
      }
      
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('✅ Token found and added to headers');
      } else {
        console.log('❌ No token found in any storage');
        // Try to get token from the auth context if available
        if (user && typeof user === 'object' && 'token' in user) {
          headers['Authorization'] = `Bearer ${(user as any).token}`;
          console.log('✅ Using token from user object');
        }
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

  // Reset all user responses (answers, flags, etc.)
  const resetUserResponses = async () => {
    try {
      console.log('🔄 Starting reset user responses...');
      
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token') || localStorage.getItem('token');
      
      if (!token) {
        console.log('❌ No auth token found');
        alert('You must be logged in to reset your responses');
        return;
      }

      console.log('🔍 Making DELETE request to /api/qbank/user-responses...');
      
      const response = await fetch('/api/qbank/user-responses', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Reset successful:', result);
        alert('✅ All your question responses have been reset successfully!');
        // Refresh the question counts to reflect the reset
        fetchTopicQuestionCounts();
      } else {
        const errorData = await response.json();
        console.error('❌ Reset failed:', errorData);
        alert(`❌ Failed to reset responses: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('❌ Error resetting user responses:', error);
      alert('❌ Failed to reset responses. Please try again.');
    }
  };

  // Generate quiz function
  const generateQuiz = async () => {
    if (!testName.trim()) {
      alert('Please enter a test name');
      return;
    }

    if (selectedSubjects.length === 0) {
      alert('Please select at least one subject');
      return;
    }

    if (selectedSources.length === 0) {
      alert('Please select at least one source');
      return;
    }

    // Validate question count is required and greater than 0
    if (!questionCount || questionCount <= 0) {
      alert('Please enter a valid number of questions (1-100)');
      return;
    }

    // Check if any topics or lectures are selected
    let hasSelectedTopics = false;
    let hasSelectedLecturesWithNoTopics = false;
    let selectedTopicNames: string[] = [];

    for (const s of subjects) {
      if (!selectedSubjects.includes(s.key)) continue;
      const lectureChecks = topicChecks[s.key] || {};
      for (const [lectureIdxStr, checkedIdxs] of Object.entries(lectureChecks)) {
        const lectureIdx = Number(lectureIdxStr);
        if (!Array.isArray(checkedIdxs) || checkedIdxs.length === 0) continue;
        const lecture = s.lectures[lectureIdx];
        
        if (lecture && lecture.topics && lecture.topics.length > 0) {
          // This lecture has topics
          for (const topicIdx of checkedIdxs) {
            if (lecture.topics[topicIdx] !== undefined) {
              hasSelectedTopics = true;
              selectedTopicNames.push(lecture.topics[topicIdx]);
            }
          }
        } else if (lecture && (!lecture.topics || lecture.topics.length === 0)) {
          // This lecture has no topics, but is selected (checkedIdxs contains [0])
          hasSelectedLecturesWithNoTopics = true;
        }
      }
    }

    if (!hasSelectedTopics && !hasSelectedLecturesWithNoTopics) {
      alert('Please select at least one topic or lecture');
      return;
    }

    // Check if selected topics have questions
    const sourceLabels = getSelectedSourceLabels();
    const topicsWithQuestions = await Promise.all(
      selectedTopicNames.map(async (topicName) => {
        const hasQuestions = checkTopicHasQuestions(topicName);
        return { topicName, hasQuestions };
      })
    );
    {
      // Keep only topics that actually have questions (no alerts)
      selectedTopicNames = topicsWithQuestions.filter(c => c.hasQuestions).map(c => c.topicName);
    }

    // Collect all selected sources and topics
    const allSelectedSources: string[] = [];
    const allSelectedTopics: string[] = [];
    
    // Get all selected sources
    for (const sourceKey of selectedSources) {
      const allAvailSources = subjects.filter((s) => selectedSubjects.includes(s.key))
        .flatMap((s) => s.sources);
      const sourceObj = allAvailSources.find((s) => s.key === sourceKey);
      if (sourceObj?.label) {
        allSelectedSources.push(sourceObj.label);
      }
    }
    
    // Get all selected topics
    for (const s of subjects) {
      if (!selectedSubjects.includes(s.key)) continue;
      const lectureChecks = topicChecks[s.key] || {};
      for (const [lectureIdxStr, checkedIdxs] of Object.entries(lectureChecks)) {
        const lectureIdx = Number(lectureIdxStr);
        if (!Array.isArray(checkedIdxs) || checkedIdxs.length === 0) continue;
        const lecture = s.lectures[lectureIdx];
        if (lecture && lecture.topics && lecture.topics.length > 0) {
          for (const topicIdx of checkedIdxs) {
            if (lecture.topics[topicIdx] !== undefined) {
              allSelectedTopics.push(lecture.topics[topicIdx]);
            }
          }
        }
        // Note: Lectures with no topics are handled by not adding any topic names,
        // which means the API will return questions from all topics in that lecture's subject
        // The filtering will be done by source, which is linked to the subject
      }
    }

    // Check if any questions are available (but don't limit the count)
    try {
      const params = new URLSearchParams();
      if (allSelectedSources.length > 0) {
        params.set('sources', allSelectedSources.join(','));
      }
      if (allSelectedTopics.length > 0) {
        params.set('topics', allSelectedTopics.join(','));
      }
      // Just check if there are any questions at all
      params.set('count', '1'); // Just get 1 question to check if any exist
      
      const questionMode = selectedModes.length > 0 ? selectedModes[0] : 'all';
      params.set('questionMode', questionMode);
      
      const response = await fetch(`/api/qbank/questions?${params}`);
      if (response.ok) {
        const data = await response.json();
        const availableQuestions = data.questions?.length || 0;
        
        if (availableQuestions === 0) {
          alert('No questions found for the selected criteria. Please try different sources, topics, or question mode.');
          return;
        }
        
        // If we have at least 1 question, proceed with the user's requested count
        // The API will handle returning the exact number requested (or all available if less)
      }
    } catch (error) {
      console.error('Error checking available questions:', error);
      // Continue anyway if we can't check
    }

    // Add test to history with actual question count (will be updated after quiz loads)
    const subjectName = subjects.find(s => selectedSubjects.includes(s.key))?.label || 'Unknown Subject';
    const questionMode = selectedModes.length > 0 ? selectedModes[0] : 'all';
    const testId = Date.now().toString();
    addTestToHistory({
      name: testName.trim(),
      subject: subjectName,
      questions: 0, // Will be updated to actual count after quiz loads
      mode: examMode ? 'Exam' : 'Study',
      sources: allSelectedSources.join(','),
      topics: allSelectedTopics.join(','),
      questionMode: questionMode,
      testId: testId, // Add testId to track this specific test
      time: examMode ? customTime : undefined // Add timer value for exam mode
    });

    // Get the final question count (may have been adjusted above)
    const finalQuestionCount = questionCount;
    
    // Navigate to quiz with test data, mode, and all selected sources/topics for DB fetch
    const params = new URLSearchParams();
    params.set('count', String(finalQuestionCount));
    params.set('testName', testName.trim());
    params.set('mode', examMode ? 'exam' : 'study');
    if (examMode) params.set('time', String(customTime));
    params.set('testId', testId); // Add testId to track this test
    
    // Add question mode (default to 'all' if none selected)
    params.set('questionMode', questionMode);
    
    // Add all selected sources and topics as comma-separated values
    if (allSelectedSources.length > 0) {
      params.set('sources', allSelectedSources.join(','));
    }
    if (allSelectedTopics.length > 0) {
      params.set('topics', allSelectedTopics.join(','));
    }
    
    router.push(`/quiz?${params.toString()}`);
  };

  // Subject selection
  const toggleSubject = (key: string) => {
    setSelectedSubjects((prev) => {
      // If clicking the already-selected subject, allow unselect (becomes none selected)
      if (prev.includes(key)) {
        // Clear dependent selections (sources, topics) when no subject selected
        setSelectedSources([]);
        setExpandedLectures({});
        setExpandedSections({});
        setTopicChecks({});
        return [];
      }
      // Selecting a new subject: enforce single selection
      // Clear dependent selections for previous subject
      setSelectedSources([]);
      setExpandedLectures({});
      setExpandedSections({});
      setTopicChecks({});
      return [key];
    });
  };

  // Source selection
  const toggleSource = (key: string) => {
    setSelectedSources((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    );
  };

  // Mode selection
  const toggleMode = (key: string) => {
    setSelectedModes((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    );
  };

  // Expand/collapse lectures
  const toggleLecture = (subjectKey: string, idx: number) => {
    setExpandedLectures((prev) => {
      const arr = prev[subjectKey] || [];
      return {
        ...prev,
        [subjectKey]: arr.includes(idx)
          ? arr.filter((i) => i !== idx)
          : [...arr, idx],
      };
    });
  };

  // Expand/collapse sections
  const toggleSection = (subjectKey: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [subjectKey]: !prev[subjectKey],
    }));
  };



  const handleQuestionChange = (val: number) => {
    if (isNaN(val)) return;
    if (val < 1) setQuestionCount(1);
    else if (val > 100) setQuestionCount(100);
    else setQuestionCount(val);
  };

  // Filter sources by selected subjects
  const availableSources = subjects.filter((s) => selectedSubjects.includes(s.key))
    .flatMap((s) => s.sources)
    .filter((v, i, arr) => arr.findIndex((x) => x.key === v.key) === i);

  // Bulk select for sources
  const allSourcesSelected = selectedSources.length === availableSources.length && availableSources.length > 0;
  const toggleAllSources = () => {
    setSelectedSources(allSourcesSelected ? [] : availableSources.map((s) => s.key));
  };
  // Bulk select for lectures in a subject
  const allLecturesExpanded = (subjectKey: string, count: number) =>
    expandedLectures[subjectKey]?.length === count;
  const toggleAllLectures = (subjectKey: string, count: number) => {
    setExpandedLectures((prev) => ({
      ...prev,
      [subjectKey]: allLecturesExpanded(subjectKey, count)
        ? []
        : Array.from({ length: count }, (_, i) => i),
    }));
  };
  // Bulk select for topics in a lecture
  const allTopicsChecked = (subjectKey: string, lectureIdx: number, topicCount: number) => {
    // For lectures with no topics, check if it's marked as selected
    if (topicCount === 0) {
      const checked = topicChecks[subjectKey]?.[lectureIdx] || [];
      return checked.length > 0; // If any item in array, consider it checked
    }
    const checked = topicChecks[subjectKey]?.[lectureIdx] || [];
    return checked.length === topicCount;
  };
  const toggleAllTopics = async (subjectKey: string, lectureIdx: number, topicCount: number) => {
    const subject = subjects.find(s => s.key === subjectKey);
    if (!subject || !subject.lectures[lectureIdx]) {
      return;
    }
    
    const lecture = subject.lectures[lectureIdx];
    const checked = topicChecks[subjectKey]?.[lectureIdx] || [];
      
      if (topicCount === 0) {
        // For lectures with no topics, toggle between selected and not selected
      const newChecked = checked.length > 0 ? [] : [0]; // Use [0] to mark as selected
      setTopicChecks((prev) => ({
        ...prev,
        [subjectKey]: {
          ...prev[subjectKey],
          [lectureIdx]: newChecked,
        },
      }));
      } else {
      // For lectures with topics, if already all selected then deselect all; otherwise select only those with questions
      if (checked.length === topicCount) {
        setTopicChecks((prev) => ({
          ...prev,
          [subjectKey]: {
            ...prev[subjectKey],
            [lectureIdx]: [],
          },
        }));
      } else {
        const topicNames = lecture.topics || [];
        const checks = await Promise.all(
          topicNames.map(async (topicName: string) => {
            // Use precomputed map when available; otherwise check live
            const preset = topicsWithQuestions[topicName];
            if (preset === false) return false;
            if (preset === true) return true;
            return checkTopicHasQuestions(topicName);
          })
        );
        const allowedIdxs = checks
          .map((ok, i) => (ok ? i : -1))
          .filter((i) => i !== -1);
        setTopicChecks((prev) => ({
          ...prev,
          [subjectKey]: {
            ...prev[subjectKey],
            [lectureIdx]: allowedIdxs,
          },
        }));
      }
    }
  };
  // Track checked topics
  const [topicChecks, setTopicChecks] = useState<Record<string, Record<number, number[]>>>({});
  const [isMobile, setIsMobile] = useState(false);


  const toggleTopic = async (subjectKey: string, lectureIdx: number, topicIdx: number, topicCount: number) => {
    // Get the topic name
    const subject = subjects.find(s => s.key === subjectKey);
    if (!subject || !subject.lectures[lectureIdx] || !subject.lectures[lectureIdx].topics) {
      return;
    }
    
    const topicName = subject.lectures[lectureIdx].topics[topicIdx];
    if (!topicName) {
      return;
    }

    // Check if we're trying to select this topic
    const checked = topicChecks[subjectKey]?.[lectureIdx] || [];
    const exists = checked.includes(topicIdx);
    
    if (!exists) {
      // We're trying to select this topic, check if it has questions
      const hasQuestions = checkTopicHasQuestions(topicName);
      if (!hasQuestions) {
        return;
      }
    }

    setTopicChecks((prev) => {
      const checked = prev[subjectKey]?.[lectureIdx] || [];
      const exists = checked.includes(topicIdx);
      const newChecked = exists ? checked.filter((i) => i !== topicIdx) : [...checked, topicIdx];
      return {
        ...prev,
        [subjectKey]: {
          ...prev[subjectKey],
          [lectureIdx]: newChecked,
        },
      };
    });
  };

  // Helper functions for allTopicsCheckedForSubject and toggleAllTopicsForSubject
  const allTopicsCheckedForSubject = (subject: any) => {
    return subject.lectures.every((lecture: any, idx: number) => {
      return allTopicsChecked(subject.key, idx, lecture.topics.length);
    });
  };

  const toggleAllTopicsForSubject = (subject: any) => {
    setTopicChecks(prev => {
      const newTopicChecks: Record<string, Record<number, number[]>> = { ...prev };
      const lectureChecks: Record<number, number[]> = {};
      subject.lectures.forEach((lecture: any, idx: number) => {
        const topicCount = lecture.topics.length;
        const currentChecked = prev[subject.key]?.[idx] || [];
        
        if (topicCount === 0) {
          // For lectures with no topics, toggle between selected and not selected
          lectureChecks[idx] = currentChecked.length > 0 ? [] : [0];
        } else {
          // For lectures with topics, toggle all topics
          lectureChecks[idx] = currentChecked.length === topicCount ? [] : Array.from({ length: topicCount }, (_, i) => i);
        }
      });
      newTopicChecks[subject.key] = lectureChecks;
      return newTopicChecks;
    });
  };

  return (
    <div className="flex h-screen bg-gray-100 qbank-page" style={{ minHeight: '100dvh' }}>
      {/* Inject Qbank-specific styles */}
      <style dangerouslySetInnerHTML={{ __html: qbankStyles }} />
      
      {/* Sidebar */}
      <div
        className={`bg-[#0072b7] text-white flex flex-col transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'}`}
      >
        {/* Hamburger menu icon */}
        <div className="h-16 flex items-center border-b border-blue-600 px-2">
                  <button
          onClick={() => {
            // Prevent expanding sidebar on mobile/iPad portrait
            if (isMobile && !isOpen) {
              return;
            }
            setIsOpen((prev) => !prev);
          }}
          className={`focus:outline-none flex items-center justify-center w-10 h-10 ${
            isMobile && !isOpen ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label="Toggle sidebar"
        >
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {isOpen && (
            <span className="text-xl font-bold ml-3 text-white">MBHA</span>
          )}
        </div>
        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-hidden">
          <ul className="space-y-2 px-2">
            {/* Create Test */}
            <li>
              <button
                onClick={() => setActiveView('create-test')}
                onMouseEnter={() => setSidebarHover('create-test')}
                onMouseLeave={() => setSidebarHover('')}
                className={`flex items-center w-full transition-all duration-200 rounded-lg ${
                  isOpen ? 'px-4 py-3' : 'justify-center p-3'
                } ${
                  activeView === 'create-test'
                    ? 'bg-white text-[#0072b7] shadow-lg border border-[#0072b7]'
                    : sidebarHover === 'create-test'
                    ? 'bg-[#003a6d] text-white shadow-md'
                    : 'text-white hover:bg-[#003a6d] hover:shadow-md'
                }`}
              >
                <svg className={`${isOpen ? 'w-5 h-5' : 'w-6 h-6'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {isOpen && <span className="ml-3 font-medium text-sm">Create Test</span>}
              </button>
            </li>
                         {/* Previous Tests */}
             <li>
               <button
                 onClick={() => setActiveView('previous-tests')}
                 onMouseEnter={() => setSidebarHover('previous-tests')}
                 onMouseLeave={() => setSidebarHover('')}
                 className={`flex items-center w-full transition-all duration-200 rounded-lg ${
                   isOpen ? 'px-4 py-3' : 'justify-center p-3'
                 } ${
                   activeView === 'previous-tests'
                     ? 'bg-white text-[#0072b7] shadow-lg border border-[#0072b7]'
                     : sidebarHover === 'previous-tests'
                     ? 'bg-[#003a6d] text-white shadow-md'
                     : 'text-white hover:bg-[#003a6d] hover:shadow-md'
                 }`}
               >
                 <svg className={`${isOpen ? 'w-5 h-5' : 'w-6 h-6'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                 </svg>
                 {isOpen && <span className="ml-3 font-medium text-sm">Previous Tests</span>}
               </button>
             </li>

          </ul>
        </nav>
        {/* User Profile & Logout */}
        <div className="border-t border-blue-600">
          <div className={`p-4 ${isOpen ? '' : 'pb-2'}`}>
            <div className={`flex items-center ${isOpen ? 'mb-3' : 'justify-center'}`}>
              <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-[#0072b7]">
                  {user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : 'U'}
                </span>
              </div>
              {isOpen && (
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">
                    {user ? `${user.firstName} ${user.lastName}` : 'User'}
                  </p>
                  <p className="text-xs font-medium text-blue-200">
                    {user ? user.email : 'user@example.com'}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className={`${isOpen ? 'px-4 pb-4' : 'px-2 pb-4'}`}>
            <button
              onClick={handleBackToDashboard}
              className={`w-full bg-red-600 text-white font-bold py-2 px-3 rounded-lg hover:bg-red-700 transition-all duration-300 text-sm flex items-center justify-center`}
            >
              {isOpen ? (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Exit
                </>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {activeView === 'create-test' && (
            <div className="flex-grow">
              {/* Test Name */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-[#0072b7] focus-within:border-[#0072b7] focus-within:ring-2 focus-within:ring-[#0072b7] transition-all duration-300">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Name <span className="text-red-500">*</span>
                </label>
                <input
                  className="mt-1 block w-full px-3 py-2 bg-white border-0 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0072b7] focus:border-[#0072b7] hover:border-[#0072b7] sm:text-sm text-black"
                  id="test-name"
                  placeholder="Enter test name (required)"
                  type="text"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  required
                />
              </div>
              {/* Filters Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {/* Question Mode */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-[#0072b7] focus-within:border-[#0072b7] focus-within:ring-1 focus-within:ring-[#0072b7] transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Question mode</label>
                    <button
                      onClick={() => setShowResetWarning(true)}
                      className="focus:outline-none p-1 rounded hover:bg-red-100 transition-colors"
                      title="Reset all question responses"
                    >
                      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setOpenDropdown(openDropdown === 'mode' ? null : 'mode')}
                      className="w-full text-left bg-white rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-[#003a6d]/10 hover:border-[#0072b7] focus:outline-none focus:ring-2 focus:ring-[#0072b7] focus:border-[#0072b7] flex justify-between items-center cursor-pointer border border-gray-200 transition-all duration-200"
                    >
                      <span>Select</span>
                      <svg className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openDropdown === 'mode' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openDropdown === 'mode' && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg border border-gray-200 rounded-md p-2 space-y-2">
                        {QUESTION_MODES.map((mode) => (
                          <div key={mode.key} className="flex items-center">
                            <input
                              checked={selectedModes.includes(mode.key)}
                              onChange={() => setSelectedModes([mode.key])} // Only allow one selection
                              className="h-4 w-4 border-2 border-[#0072b7] text-[#0072b7] focus:ring-[#0072b7]"
                              type="radio"
                              name="questionMode"
                            />
                            <label className="ml-2 text-sm text-gray-600">{mode.label}</label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {/* Subjects */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-[#0072b7] focus-within:border-[#0072b7] focus-within:ring-1 focus-within:ring-[#0072b7] transition-all duration-300">
                  <div className="relative">
                    <div className="flex items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700">Subjects</span>
                    </div>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === 'subjects' ? null : 'subjects')}
                      className="w-full text-left bg-white rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-[#003a6d]/10 hover:border-[#0072b7] focus:outline-none focus:ring-2 focus:ring-[#0072b7] focus:border-[#0072b7] flex justify-between items-center cursor-pointer border border-gray-200 transition-all duration-200"
                    >
                      <span>Select</span>
                      <svg className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openDropdown === 'subjects' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openDropdown === 'subjects' && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg border border-gray-200 rounded-md p-2 space-y-2">
                        {subjects.map((subject) => (
                          <div key={subject.key} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedSubjects.includes(subject.key)}
                              onChange={() => toggleSubject(subject.key)}
                              disabled={selectedSubjects.length > 0 && !selectedSubjects.includes(subject.key)}
                              className="h-4 w-4 border-2 border-[#0072b7] text-[#0072b7] focus:ring-[#0072b7] rounded mr-2"
                            />
                            <label className="ml-2 text-sm text-gray-600">{subject.label}</label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {/* Sources */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-[#0072b7] focus-within:border-[#0072b7] focus-within:ring-1 focus-within:ring-[#0072b7] transition-all duration-300">
                  <div className="relative">
                    <div className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={allSourcesSelected}
                        onChange={toggleAllSources}
                        className="h-4 w-4 border-2 border-[#0072b7] text-[#0072b7] focus:ring-[#0072b7] rounded mr-2"
                      />
                      <span className="text-sm font-semibold text-gray-700">Sources</span>
                    </div>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === 'sources' ? null : 'sources')}
                      className="w-full text-left bg-white rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-[#003a6d]/10 hover:border-[#0072b7] focus:outline-none focus:ring-2 focus:ring-[#0072b7] focus:border-[#0072b7] flex justify-between items-center cursor-pointer border border-gray-200 transition-all duration-200"
                    >
                      <span>Select</span>
                      <svg className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openDropdown === 'sources' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openDropdown === 'sources' && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg border border-gray-200 rounded-md p-2 space-y-2">
                        {availableSources.length === 0 && (
                          <div className="text-gray-400 text-sm">Select a subject to see sources</div>
                        )}
                        {availableSources.map((source) => (
                          <div key={source.key} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedSources.includes(source.key)}
                              onChange={() => toggleSource(source.key)}
                              className="h-4 w-4 border-2 border-[#0072b7] text-[#0072b7] focus:ring-[#0072b7] rounded mr-2"
                            />
                            <label className="ml-2 text-sm text-gray-600">{source.label}</label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* Lectures Container */}
              <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-[#0072b7] focus-within:border-[#0072b7] focus-within:ring-1 focus-within:ring-[#0072b7] transition-all duration-300">
                {subjects.filter((s) => selectedSubjects.includes(s.key)).map((subject) => (
                  <div key={subject.key} className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-[#0072b7] focus-within:border-[#0072b7] focus-within:ring-1 focus-within:ring-[#0072b7] transition-all duration-300">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <input
                          className="h-4 w-4 border-2 border-[#0072b7] text-[#0072b7] focus:ring-[#0072b7] mr-3 rounded"
                          type="checkbox"
                          checked={allTopicsCheckedForSubject(subject)}
                          onChange={() => toggleAllTopicsForSubject(subject)}
                        />
                        <h3 className="text-lg font-medium text-[#0072b7]">Lectures - {subject.label}</h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        {/* Search icon and bar */}
                        <div className="relative flex items-center">
                          {showSearch[subject.key] && (
                            <input
                              type="text"
                              placeholder="Search..."
                              value={searchTerms[subject.key] || ''}
                              onChange={e => setSearchTerms((prev) => ({ ...prev, [subject.key]: e.target.value }))}
                              className="w-40 px-2 py-1 border-2 border-[#0072b7] rounded focus:outline-none focus:ring-2 focus:ring-[#0072b7] text-black text-sm shadow mr-2"
                              style={{ minWidth: '120px', maxWidth: '180px' }}
                              autoFocus
                            />
                          )}
                          <button
                            onClick={() => setShowSearch((prev) => ({ ...prev, [subject.key]: !prev[subject.key] }))}
                            className="focus:outline-none"
                          >
                            <svg className="w-5 h-5 text-[#0072b7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <circle cx="11" cy="11" r="8" strokeWidth="2" />
                              <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" />
                            </svg>
                          </button>
                        </div>
                        <svg onClick={() => toggleSection(subject.key)} className={`w-5 h-5 text-gray-600 transition-transform duration-300 cursor-pointer ${expandedSections[subject.key] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {/* Filter lectures and topics by search */}
                    {expandedSections[subject.key] && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {subject.lectures
                          .map((lecture: any, idx: number) => {
                            const search = (searchTerms[subject.key] || '').toLowerCase();
                            let showLecture = false;
                            let filteredTopics = lecture.topics;
                            if (search) {
                              if (lecture.title.toLowerCase().includes(search)) {
                                showLecture = true;
                              } else {
                                filteredTopics = lecture.topics.filter((topic: string) => topic.toLowerCase().includes(search));
                                showLecture = filteredTopics.length > 0;
                              }
                            } else {
                              showLecture = true;
                            }
                            if (!showLecture) return null;
                            return (
                              <div key={lecture.title} className="border border-gray-200 rounded-lg">
                                <div className={`flex justify-between items-center p-3 text-sm font-medium text-left text-gray-700 transition-all duration-200 ${expandedLectures[subject.key]?.includes(idx) ? 'bg-blue-50 border-l-4 border-[#0072b7] text-[#0072b7]' : 'hover:bg-[#003a6d]/10 hover:border-l-4 hover:border-[#0072b7] hover:text-[#0072b7]'}`}> 
                                  <div className="flex items-center">
                                    <input
                                      className="h-4 w-4 border-2 border-[#0072b7] text-[#0072b7] focus:ring-[#0072b7] rounded mr-2"
                                      type="checkbox"
                                      checked={allTopicsChecked(subject.key, idx, lecture.topics.length)}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        toggleAllTopics(subject.key, idx, lecture.topics.length);
                                      }}
                                    />
                                    <span>{lecture.title}</span>
                                  </div>
                                  <svg
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleLecture(subject.key, idx);
                                    }}
                                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 cursor-pointer ${expandedLectures[subject.key]?.includes(idx) ? 'rotate-180' : ''}`}
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </div>
                                {expandedLectures[subject.key]?.includes(idx) && filteredTopics && (
                                  <div className="p-3 space-y-2 border-t border-gray-100">
                                    {filteredTopics.map((topic: string, topicIdx: number) => {
                                      const hasQuestions = topicsWithQuestions[topic] !== false; // Default to true if not checked yet
                                      return (
                                        <div key={topic} className={`flex items-center ${!hasQuestions ? 'opacity-50' : ''}`}>
                                        <input
                                          type="checkbox"
                                          checked={topicChecks[subject.key]?.[idx]?.includes(topicIdx) || false}
                                          onChange={() => toggleTopic(subject.key, idx, topicIdx, lecture.topics.length)}
                                            disabled={!hasQuestions}
                                            className={`h-4 w-4 border-2 border-[#0072b7] text-[#0072b7] focus:ring-[#0072b7] rounded mr-2 ${!hasQuestions ? 'cursor-not-allowed opacity-50' : ''}`}
                                        />
                                          <label className={`ml-2 text-sm ${!hasQuestions ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600'}`}>
                                            {topic}
                                            <span className="ml-1 text-xs text-[#0072b7] font-medium">
                                              ({loadingCounts ? '...' : (topicQuestionCounts[topic] !== undefined ? topicQuestionCounts[topic] : 0)})
                                            </span>
                                          </label>
                                      </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {/* Footer */}
              <footer className="mt-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-[#0072b7] focus-within:border-[#0072b7] focus-within:ring-1 focus-within:ring-[#0072b7] transition-all duration-300">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      No. of Questions <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center mt-1">
                      <input
                        className={`w-16 px-3 py-2 text-center bg-gray-100 border-0 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0072b7] focus:border-[#0072b7] hover:border-[#0072b7] sm:text-sm text-black ${
                          !questionCount || questionCount <= 0 ? 'border-red-500 focus:ring-red-500' : ''
                        }`}
                        type="number"
                        min={1}
                        max={100}
                        required
                        value={questionCount}
                        onChange={(e) => handleQuestionChange(Number(e.target.value))}
                        placeholder="1"
                      />
                                             <span className="ml-2 text-sm text-gray-500">Max Allowed 100</span>
                      <svg className="ml-1 text-gray-400 text-sm w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    {/* Available questions info */}
                    {availableQuestions !== null && (
                      <div className="mt-1 text-xs text-gray-600">
                        {checkingQuestions ? (
                          <span className="text-blue-600">Checking available questions...</span>
                        ) : (
                          <span className={availableQuestions > 0 ? 'text-green-600' : 'text-red-600'}>
                            {availableQuestions > 0 
                              ? `${availableQuestions} questions available` 
                              : 'No questions found for selected criteria'
                            }
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Exam/Study Mode Toggle */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Test Mode</label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center bg-gray-100 rounded-lg p-1 space-y-2 sm:space-y-0">
                      <button
                        onClick={() => setExamMode(false)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                          !examMode
                            ? 'bg-white text-[#0072b7] shadow-sm border border-[#0072b7]'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          <span>Study</span>
                        </div>
                      </button>
                      <button
                        onClick={() => setExamMode(true)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                          examMode
                            ? 'bg-white text-[#0072b7] shadow-sm border border-[#0072b7]'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Exam</span>
                        </div>
                      </button>
                      
                      {/* Timer Setting - Inline with Test Mode */}
                      {examMode && (
                        <div className="flex items-center ml-0 sm:ml-4 space-x-2">
                          <svg className="w-4 h-4 text-[#0072b7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <input
                            type="number"
                            min="1"
                            max="180"
                            value={customTime}
                            onChange={(e) => setCustomTime(Number(e.target.value))}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-black"
                            placeholder="60"
                          />
                          <span className="text-sm text-black">min</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {examMode ? 'Timer enabled • Score tracking' : 'No timer • Free practice'}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 w-full lg:w-auto">
                    <button 
                      onClick={generateQuiz}
                      className="bg-[#0072b7] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#005a8f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0072b7] flex items-center w-full lg:w-auto justify-center"
                    >
                      <span>Generate Test</span>
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </footer>
            </div>
          )}

          {/* Previous Tests View */}
          {activeView === 'previous-tests' && (
            <div className="flex-grow">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Previous Tests</h2>
                  
                  {previousTests.length === 0 ? (
                    <div className="text-center py-8">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No previous tests</h3>
                      <p className="mt-1 text-sm text-gray-500">Your completed tests will appear here.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Questions</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {previousTests.map((test, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{test.name}</div>
                                  <div className="text-sm text-gray-500">{test.subject}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm text-[#0072b7] font-medium cursor-pointer hover:underline">
                                  {test.questions} questions
                                </span>
                              </td>
                                                             <td className="px-6 py-4 whitespace-nowrap">
                                 <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                   test.mode === 'Exam' 
                                     ? 'bg-orange-100 text-orange-800' 
                                     : 'bg-green-100 text-green-800'
                                 }`}>
                                   {test.mode}
                                 </span>
                               </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handleViewTest(test)}
                                    className="text-[#0072b7] hover:text-[#005a8f] transition-colors duration-200"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5v14l11-7z" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTest(test.id)}
                                    className="text-red-600 hover:text-red-800 transition-colors duration-200"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {test.date}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Reset Warning Modal */}
      {showResetWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all duration-200 scale-100">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-10 w-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-xl font-semibold text-gray-900">Reset All Responses</h3>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3">
                This action will permanently delete all your question responses including:
              </p>
              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1 mb-4">
                <li>All answered questions</li>
                <li>All flagged questions</li>
                <li>All correct/incorrect records</li>
                <li>All progress data</li>
              </ul>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm font-semibold text-red-700 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  This action cannot be undone!
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowResetWarning(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowResetWarning(false);
                  resetUserResponses();
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              >
                Reset All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
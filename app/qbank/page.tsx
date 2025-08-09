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
          'Cerebrovascular accident Ischemic & Haemorrhagic',
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
];

export default function Qbank() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Dynamic subjects from database
  const [subjects, setSubjects] = useState<any[]>(SUBJECTS); // Fallback to hardcoded
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  // Check if user has qbank access
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user?.hasQbankAccess)) {
      router.push('/dashboard');
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
                label: subject.label,
                color: subject.color || '#0072b7',
                lectures: (subject.lectures || []).map((lecture: any) => ({
                  title: lecture.title,
                  topics: (lecture.topics || []).map((topic: any) => 
                    typeof topic === 'string' ? topic : topic.title
                  )
                })),
                sources: (subject.sources || []).map((source: any) => ({
                  key: source.key || source.id || `source_${Date.now()}`,
                  label: source.label
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
        // Keep using hardcoded subjects as fallback
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
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['obgyn']);
  const [selectedSources, setSelectedSources] = useState<string[]>(['apgo', 'acog']);
  const [selectedModes, setSelectedModes] = useState<string[]>(['unused']);
  const [expandedLectures, setExpandedLectures] = useState<{ [k: string]: number[] }>({});
  const [expandedSections, setExpandedSections] = useState<{ [k: string]: boolean }>({});
  const [questionCount, setQuestionCount] = useState(0);
  const [testName, setTestName] = useState('');
  const [examMode, setExamMode] = useState(false); // false = Study mode, true = Exam mode
  const [customTime, setCustomTime] = useState(60); // Default 60 minutes
  // Previous tests section removed per request

  // Dropdown states
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [sidebarHover, setSidebarHover] = useState('');

  // New states for search functionality
  const [showSearch, setShowSearch] = useState<Record<string, boolean>>({});
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
  const [topicsWithQuestions, setTopicsWithQuestions] = useState<{ [key: string]: boolean }>({});



  const handleLogout = () => {
    window.location.href = '/';
  };
  const handleBackToDashboard = () => {
    window.location.href = '/dashboard';
  };

  // Previous tests actions removed per request



  // Check if a topic has questions
  const checkTopicHasQuestions = async (topicName: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/qbank/questions?topic=${encodeURIComponent(topicName)}&limit=1`);
      if (response.ok) {
        const data = await response.json();
        const arr = Array.isArray(data) ? data : data?.questions;
        return Array.isArray(arr) && arr.length > 0;
      }
    } catch (error) {
      console.error('Error checking topic questions:', error);
    }
    return false;
  };

  // Check all topics for questions when subjects are loaded
  const checkAllTopicsForQuestions = async (subjectsData: any[]) => {
    const topicsMap: { [key: string]: boolean } = {};
    
    for (const subject of subjectsData) {
      for (const lecture of subject.lectures) {
        for (const topic of lecture.topics) {
          const hasQuestions = await checkTopicHasQuestions(topic);
          topicsMap[topic] = hasQuestions;
        }
      }
    }
    
    setTopicsWithQuestions(topicsMap);
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

    // Check if at least one source is selected
    if (selectedSources.length === 0) {
      alert('Please select at least one source');
      return;
    }

    // Check if at least one topic or lecture with no topics is selected
    let hasSelectedTopics = false;
    let selectedTopicNames: string[] = [];
    let hasSelectedLecturesWithNoTopics = false;
    
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
    const topicsWithQuestions = await Promise.all(
      selectedTopicNames.map(async (topicName) => {
        const hasQuestions = await checkTopicHasQuestions(topicName);
        return { topicName, hasQuestions };
      })
    );

    const topicsWithoutQuestions = topicsWithQuestions.filter(t => !t.hasQuestions);
    if (topicsWithoutQuestions.length > 0) {
      const topicList = topicsWithoutQuestions.map(t => t.topicName).join(', ');
      alert(`The following topics have no questions and cannot be selected: ${topicList}`);
      return;
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

    // Navigate to quiz with test data, mode, and all selected sources/topics for DB fetch
    const params = new URLSearchParams();
    params.set('count', String(questionCount));
    params.set('testName', testName.trim());
    params.set('mode', examMode ? 'exam' : 'study');
    if (examMode) params.set('time', String(customTime));
    
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
    setSelectedSubjects((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    );
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

  // Number of questions
  const handleQuestionChange = (val: number) => {
    if (isNaN(val)) return;
    if (val < 0) setQuestionCount(0);
    else if (val > 100) setQuestionCount(100);
    else setQuestionCount(val);
  };

  // Filter sources by selected subjects
  const availableSources = subjects.filter((s) => selectedSubjects.includes(s.key))
    .flatMap((s) => s.sources)
    .filter((v, i, arr) => arr.findIndex((x) => x.key === v.key) === i);

  // Bulk select for subjects
  const allSubjectsSelected = selectedSubjects.length === subjects.length;
  const toggleAllSubjects = () => {
    setSelectedSubjects(allSubjectsSelected ? [] : subjects.map((s) => s.key));
  };
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
      // For lectures with topics, check if we're trying to select all
      if (checked.length === topicCount) {
        // We're deselecting all, which is always allowed
        setTopicChecks((prev) => ({
          ...prev,
          [subjectKey]: {
            ...prev[subjectKey],
            [lectureIdx]: [],
          },
        }));
      } else {
        // We're trying to select all, check if all topics have questions
        const topicNames = lecture.topics || [];
        const topicsWithQuestions = await Promise.all(
          topicNames.map(async (topicName: string) => {
            const hasQuestions = await checkTopicHasQuestions(topicName);
            return { topicName, hasQuestions };
          })
        );
        
        const topicsWithoutQuestions = topicsWithQuestions.filter(t => !t.hasQuestions);
        if (topicsWithoutQuestions.length > 0) {
          const topicList = topicsWithoutQuestions.map(t => t.topicName).join(', ');
          alert(`The following topics have no questions and cannot be selected: ${topicList}`);
          return;
        }
        
        // All topics have questions, select all
        setTopicChecks((prev) => ({
          ...prev,
          [subjectKey]: {
            ...prev[subjectKey],
            [lectureIdx]: Array.from({ length: topicCount }, (_, i) => i),
          },
        }));
      }
    }
  };
  // Track checked topics
  const [topicChecks, setTopicChecks] = useState<Record<string, Record<number, number[]>>>({});
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
      const hasQuestions = await checkTopicHasQuestions(topicName);
      if (!hasQuestions) {
        alert(`Topic "${topicName}" has no questions and cannot be selected.`);
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
    <div className="flex h-screen bg-gray-100 qbank-page">
      {/* Inject Qbank-specific styles */}
      <style dangerouslySetInnerHTML={{ __html: qbankStyles }} />
      
      {/* Sidebar */}
      <div
        className={`bg-[#0072b7] text-white flex flex-col transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'}`}
      >
        {/* Hamburger menu icon */}
        <div className="h-16 flex items-center border-b border-blue-600 px-2">
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="focus:outline-none flex items-center justify-center w-10 h-10"
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
            {/* Previous Tests removed per request */}

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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Question mode</label>
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
                              onChange={() => toggleMode(mode.key)}
                              className="h-4 w-4 border-2 border-[#0072b7] text-[#0072b7] focus:ring-[#0072b7] rounded mr-2"
                              type="checkbox"
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
                      <input
                        type="checkbox"
                        checked={allSubjectsSelected}
                        onChange={toggleAllSubjects}
                        className="h-4 w-4 border-2 border-[#0072b7] text-[#0072b7] focus:ring-[#0072b7] rounded mr-2"
                      />
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
                                            {!hasQuestions && <span className="ml-1 text-xs text-red-500">(No questions)</span>}
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
                    <label className="block text-sm font-medium text-gray-700">No. of Questions</label>
                    <div className="flex items-center mt-1">
                      <input
                        className="w-16 px-3 py-2 text-center bg-gray-100 border-0 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0072b7] focus:border-[#0072b7] hover:border-[#0072b7] sm:text-sm text-black"
                        type="number"
                        min={0}
                        max={100}
                        value={questionCount}
                        onChange={(e) => handleQuestionChange(Number(e.target.value))}
                      />
                      <span className="ml-2 text-sm text-gray-500">Max Allowed 100</span>
                      <svg className="ml-1 text-gray-400 text-sm w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
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
                      onClick={handleGenerateTest}
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
          {/* Previous tests view removed per request */}

        </main>
      </div>
    </div>
  );
} 
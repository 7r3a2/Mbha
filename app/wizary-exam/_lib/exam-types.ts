export interface Subject {
  id: number;
  name: string;
  arabicName: string;
}

export interface QuestionTemplate {
  text: string;
  options: string[];
  correct: number;
}

export interface Question {
  text: string;
  options: string[];
  correct: number;
  id?: number;
}

export interface ExamData {
  id: any;
  name: string;
  department: string;
  questions: number;
  time: number;
  faculty: string;
  university: string;
  subject: string;
  order: number;
  secretCode: string;
  importedData?: {
    questions: any[];
    [key: string]: any;
  };
}

export type CurrentView = 'dashboard' | 'exam-list' | 'exam-taking' | 'quiz' | 'results';

export interface BaghdadTime {
  date: string;
  time: string;
  day: string;
  month: string;
  year: number;
}

export const subjects: Subject[] = [
  { id: 1, name: 'Internal Medicine', arabicName: 'الطب الباطني' },
  { id: 2, name: 'Surgery', arabicName: 'الجراحة' },
  { id: 3, name: 'Obstetric & Gynecology', arabicName: 'التوليد وأمراض النساء' },
  { id: 4, name: 'Pediatric', arabicName: 'طب الأطفال' }
];

export const sampleExams: any[] = [];

export const questionTemplates: QuestionTemplate[] = [
  {
    text: "A 65-year-old man with a history of hypertension and type 2 diabetes presents with sudden onset of left-sided weakness and facial droop. A non-contrast CT scan of the head is performed. Which of the following findings would be most indicative of an acute ischemic stroke?",
    options: [
      "Cerebral edema and mass effect",
      "Hyperdense MCA sign",
      "Intraparenchymal hemorrhage",
      "Subarachnoid blood",
      "Normal findings",
    ],
    correct: 1,
  },
  {
    text: "A 28-year-old woman in her third trimester of pregnancy complains of persistent heartburn. She has tried dietary modifications without relief. Which of the following medications is considered safest for her condition?",
    options: [
      "Omeprazole",
      "Misoprostol",
      "Sodium bicarbonate",
      "Aluminum hydroxide",
      "Ranitidine",
    ],
    correct: 3,
  },
  {
    text: "A 5-year-old child is brought to the emergency department with a 2-day history of fever, sore throat, and a 'sandpaper' like rash. On examination, he has circumoral pallor and a strawberry tongue. What is the most likely diagnosis?",
    options: [
      "Measles (Rubeola)",
      "Kawasaki disease",
      "Scarlet fever",
      "Rubella (German Measles)",
      "Roseola infantum",
    ],
    correct: 2,
  },
  {
    text: "A 45-year-old woman presents with a 3-month history of fatigue, weight gain, and cold intolerance. Physical examination reveals dry skin and a goiter. Laboratory studies show an elevated TSH and low free T4. What is the most likely diagnosis?",
    options: [
      "Graves' disease",
      "Hashimoto's thyroiditis",
      "Subacute thyroiditis",
      "Toxic multinodular goiter",
      "Thyroid cancer",
    ],
    correct: 1,
  },
  {
    text: "A 60-year-old man with a history of smoking presents with chest pain that radiates to his left arm and jaw. The pain is relieved with rest and nitroglycerin. What is the most likely diagnosis?",
    options: [
      "Myocardial infarction",
      "Stable angina",
      "Unstable angina",
      "Aortic dissection",
      "Pulmonary embolism",
    ],
    correct: 1,
  },
  {
    text: "A 35-year-old woman presents with a 2-week history of fatigue, joint pain, and a malar rash. Laboratory studies show a positive ANA and anti-dsDNA antibodies. What is the most likely diagnosis?",
    options: [
      "Rheumatoid arthritis",
      "Systemic lupus erythematosus",
      "Sjögren's syndrome",
      "Scleroderma",
      "Mixed connective tissue disease",
    ],
    correct: 1,
  },
  {
    text: "A 25-year-old man presents with acute onset of severe headache, photophobia, and neck stiffness. Lumbar puncture reveals cloudy cerebrospinal fluid with elevated white blood cells. What is the most likely diagnosis?",
    options: [
      "Migraine",
      "Bacterial meningitis",
      "Viral meningitis",
      "Subarachnoid hemorrhage",
      "Cluster headache",
    ],
    correct: 1,
  },
  {
    text: "A 50-year-old woman presents with a 6-month history of progressive dyspnea and dry cough. Chest X-ray shows bilateral interstitial infiltrates. What is the most likely diagnosis?",
    options: [
      "Pneumonia",
      "Pulmonary fibrosis",
      "Congestive heart failure",
      "Pulmonary embolism",
      "Bronchitis",
    ],
    correct: 1,
  },
  {
    text: "A 30-year-old man presents with a 1-week history of jaundice, dark urine, and right upper quadrant pain. Laboratory studies show elevated bilirubin and transaminases. What is the most likely diagnosis?",
    options: [
      "Hepatitis A",
      "Hepatitis B",
      "Hepatitis C",
      "Alcoholic hepatitis",
      "Gallbladder disease",
    ],
    correct: 0,
  },
  {
    text: "A 40-year-old woman presents with a 3-month history of polyuria, polydipsia, and weight loss. Laboratory studies show elevated blood glucose and ketones in the urine. What is the most likely diagnosis?",
    options: [
      "Type 1 diabetes mellitus",
      "Type 2 diabetes mellitus",
      "Gestational diabetes",
      "Diabetes insipidus",
      "Metabolic syndrome",
    ],
    correct: 0,
  }
];

export const subjectMapping: { [key: string]: string } = {
  'obgyn': 'Obstetric & Gynecology',
  'im': 'Internal Medicine',
  'surgery': 'Surgery',
  'pediatrics': 'Pediatric'
};

export const generateQuestions = (count: number) => {
  const questions = [];
  const maxQuestions = Math.min(count, 100);
  for (let i = 0; i < maxQuestions; i++) {
    const template = questionTemplates[i % questionTemplates.length];
    questions.push({
      id: i + 1,
      text: template.text,
      options: template.options,
      correct: template.correct,
    });
  }
  return questions;
};

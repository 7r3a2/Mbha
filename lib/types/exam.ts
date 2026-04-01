export interface Question {
  id?: string;
  text: string;
  options: string[];
  correct: number;
  explanation?: string;
  subject?: string;
  topic?: string;
  source?: string;
}

export interface ExamMeta {
  id: string;
  title: string;
  subject: string;
  examTime: number;
  order: number;
  secretCode: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExamWithQuestions extends ExamMeta {
  questions: string; // JSON string of Question[]
}

export interface ExamResult {
  score: number;
  correctCount: number;
  totalQuestions: number;
  answers: Record<number, number>;
  flagged: Set<number>;
}

export interface CreateExamInput {
  title: string;
  subject: string;
  examTime: number;
  secretCode: string;
  questions: string;
}

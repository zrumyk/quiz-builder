export type QuestionType = 'BOOLEAN' | 'INPUT' | 'CHECKBOX';
export interface QuizSummary {
  id: string;
  title: string;
  questionCount: number;
}
export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  position: number;
}
export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  position: number;
  booleanAnswer: boolean | null;
  textAnswer: string | null;
  options: QuestionOption[];
}
export interface Quiz {
  id: string;
  title: string;
  createdAt: string;
  questions: Question[];
}
export type CreateQuestion =
  | { type: 'BOOLEAN'; text: string; booleanAnswer: boolean }
  | { type: 'INPUT'; text: string; textAnswer: string }
  | {
      type: 'CHECKBOX';
      text: string;
      options: { text: string; isCorrect: boolean }[];
    };
export interface CreateQuizPayload {
  title: string;
  questions: CreateQuestion[];
}

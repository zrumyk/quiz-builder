import { z } from 'zod';
import type { CreateQuizPayload, CreateQuestion } from '../types/quiz';

const questionSchema = z
  .object({
    type: z.enum(['BOOLEAN', 'INPUT', 'CHECKBOX']),
    text: z.string().trim().min(1, 'Enter a question.'),
    booleanAnswer: z.boolean().nullable(),
    textAnswer: z.string(),
    options: z.array(z.object({ text: z.string(), isCorrect: z.boolean() })),
  })
  .superRefine((question, ctx) => {
    if (question.type === 'BOOLEAN' && question.booleanAnswer === null) {
      ctx.addIssue({
        code: 'custom',
        path: ['booleanAnswer'],
        message: 'Select an answer.',
      });
    }
    if (question.type === 'INPUT' && !question.textAnswer.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['textAnswer'],
        message: 'Enter an answer.',
      });
    }
    if (question.type === 'CHECKBOX') {
      if (question.options.length < 2)
        ctx.addIssue({
          code: 'custom',
          path: ['options', 'root'],
          message: 'Add at least two options.',
        });
      question.options.forEach((option, index) => {
        if (!option.text.trim())
          ctx.addIssue({
            code: 'custom',
            path: ['options', index, 'text'],
            message: 'Enter an option.',
          });
      });
      if (!question.options.some((option) => option.isCorrect)) {
        ctx.addIssue({
          code: 'custom',
          path: ['options', 'root'],
          message: 'Select at least one correct option.',
        });
      }
    }
  });

export const quizFormSchema = z.object({
  title: z.string().trim().min(1, 'Enter a title.'),
  questions: z.array(questionSchema).min(1, 'Add at least one question.'),
});
export type QuizFormValues = z.infer<typeof quizFormSchema>;

export function newQuestion(): QuizFormValues['questions'][number] {
  return {
    type: 'BOOLEAN',
    text: '',
    booleanAnswer: null,
    textAnswer: '',
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
    ],
  };
}

export function toQuizPayload(values: QuizFormValues): CreateQuizPayload {
  return {
    title: values.title.trim(),
    questions: values.questions.map((question): CreateQuestion => {
      const text = question.text.trim();
      switch (question.type) {
        case 'BOOLEAN':
          if (question.booleanAnswer === null)
            throw new Error('Select an answer.');
          return {
            type: question.type,
            text,
            booleanAnswer: question.booleanAnswer,
          };
        case 'INPUT':
          return {
            type: question.type,
            text,
            textAnswer: question.textAnswer.trim(),
          };
        case 'CHECKBOX':
          return {
            type: question.type,
            text,
            options: question.options.map((option) => ({
              text: option.text.trim(),
              isCorrect: option.isCorrect,
            })),
          };
      }
    }),
  };
}

import { z } from 'zod';

const text = z.string().trim().min(1, 'Text cannot be empty');

const optionSchema = z.strictObject({
  text,
  isCorrect: z.boolean(),
});

const questionSchema = z.discriminatedUnion('type', [
  z.strictObject({
    type: z.literal('BOOLEAN'),
    text,
    booleanAnswer: z.boolean(),
  }),

  z.strictObject({
    type: z.literal('INPUT'),
    text,
    textAnswer: text,
  }),

  z.strictObject({
    type: z.literal('CHECKBOX'),
    text,
    options: z
      .array(optionSchema)
      .min(2, 'Provide at least two options')
      .refine(
        (options) => options.some((option) => option.isCorrect),
        'Select at least one correct option',
      ),
  }),
]);

export const createQuizSchema = z.strictObject({
  title: text,
  questions: z.array(questionSchema).min(1, 'Add at least one question'),
});

export type CreateQuizInput = z.infer<typeof createQuizSchema>;
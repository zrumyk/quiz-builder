import { z } from 'zod';

export const quizParamsSchema = z.object({
  id: z.uuid(),
});

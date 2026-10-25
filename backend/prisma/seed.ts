import { prisma } from '../src/lib/prisma.ts';

// A stable ID makes this seed safe to run multiple times.
const SAMPLE_QUIZ_ID = '7fe07f76-3623-4d6f-a598-8889a7906efa';

async function seed() {
  try {
    const quiz = await prisma.quiz.upsert({
      where: { id: SAMPLE_QUIZ_ID },
      update: {},
      create: {
        id: SAMPLE_QUIZ_ID,
        title: 'JavaScript Basics',
        questions: {
          create: [
            {
              type: 'BOOLEAN',
              position: 0,
              text: 'JavaScript runs only in browsers.',
              booleanAnswer: false,
            },
            {
              type: 'INPUT',
              position: 1,
              text: 'Which keyword declares a constant?',
              textAnswer: 'const',
            },
            {
              type: 'CHECKBOX',
              position: 2,
              text: 'Select the primitive types.',
              options: {
                create: [
                  { position: 0, text: 'string', isCorrect: true },
                  { position: 1, text: 'boolean', isCorrect: true },
                  { position: 2, text: 'Array', isCorrect: false },
                ],
              },
            },
          ],
        },
      },
    });

    console.log(`Sample quiz is ready: ${quiz.title} (${quiz.id})`);
  } finally {
    await prisma.$disconnect();
  }
}

seed().catch((error: unknown) => {
  console.error('Failed to seed the database:', error);
  process.exitCode = 1;
});

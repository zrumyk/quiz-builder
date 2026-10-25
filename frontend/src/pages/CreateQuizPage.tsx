import { useRef, useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import QuestionEditor from '../components/QuestionEditor';
import { newQuestion, quizFormSchema, toQuizPayload } from '../schemas/quiz';
import type { QuizFormValues } from '../schemas/quiz';
import { createQuiz, getErrorMessage } from '../services/api';

export default function CreateQuizPage() {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState('');
  const submitting = useRef(false);
  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: { title: '', questions: [newQuestion()] },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'questions',
  });
  const { errors, isSubmitting } = form.formState;
  const questionsError =
    errors.questions?.root?.message ?? errors.questions?.message;

  async function onSubmit(values: QuizFormValues) {
    if (submitting.current) return;
    submitting.current = true;
    setSubmitError('');
    try {
      await createQuiz(toQuizPayload(values));
      navigate('/quizzes');
    } catch (error: unknown) {
      setSubmitError(getErrorMessage(error));
    } finally {
      submitting.current = false;
    }
  }

  return (
    <>
      <p className="mono eyebrow">NEW QUIZ</p>
      <h1 className="h1">Create</h1>
      <FormProvider {...form}>
        <form
          noValidate
          onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}
          aria-busy={isSubmitting}
        >
          <div className="field field--title">
            <label className="mono" htmlFor="quiz-title">
              TITLE
            </label>
            <input
              className="input input--title"
              id="quiz-title"
              disabled={isSubmitting}
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? 'title-error' : undefined}
              {...form.register('title')}
            />
            {errors.title && (
              <p className="err" id="title-error">
                {errors.title.message}
              </p>
            )}
          </div>
          {fields.map((field, index) => (
            <QuestionEditor
              key={field.id}
              index={index}
              onRemove={() => remove(index)}
            />
          ))}
          {questionsError && (
            <p className="err" role="alert">
              {questionsError}
            </p>
          )}
          {submitError && (
            <p className="err" role="alert">
              {submitError}
            </p>
          )}
          <div className="form-actions">
            <button
              className="btn btn--ghost"
              type="button"
              disabled={isSubmitting}
              onClick={() => append(newQuestion())}
            >
              + Add question
            </button>
            <button className="btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating.' : 'Create quiz'}
            </button>
          </div>
        </form>
      </FormProvider>
    </>
  );
}

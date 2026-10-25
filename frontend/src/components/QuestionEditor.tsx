import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import type { QuizFormValues } from '../schemas/quiz';
import type { QuestionType } from '../types/quiz';

const types: { value: QuestionType; label: string }[] = [
  { value: 'BOOLEAN', label: 'Boolean' },
  { value: 'INPUT', label: 'Input' },
  { value: 'CHECKBOX', label: 'Checkbox' },
];

export default function QuestionEditor({
  index,
  onRemove,
}: {
  index: number;
  onRemove: () => void;
}) {
  const {
    register,
    control,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useFormContext<QuizFormValues>();
  const type = useWatch({ control, name: `questions.${index}.type` });
  const { fields, append } = useFieldArray({
    control,
    name: `questions.${index}.options`,
  });
  const error = errors.questions?.[index];
  const prefix = `question-${index}`;
  const optionsError = error?.options?.root?.message;

  return (
    <section className="question" aria-label={`Question ${index + 1}`}>
      <div className="question__head">
        <span className="mono">Q{index + 1}</span>
        <div
          className="segmented"
          role="group"
          aria-label={`Question ${index + 1} type`}
        >
          {types.map((item) => (
            <button
              key={item.value}
              type="button"
              className="btn btn--ghost btn--sm"
              aria-pressed={type === item.value}
              disabled={isSubmitting}
              onClick={() => {
                setValue(`questions.${index}.type`, item.value, {
                  shouldDirty: true,
                });
                clearErrors(`questions.${index}`);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="btn btn--ghost btn--sm ml-auto"
          disabled={isSubmitting}
          onClick={onRemove}
        >
          Remove
        </button>
      </div>
      <div className="field">
        <label className="mono" htmlFor={prefix + '-text'}>
          QUESTION
        </label>
        <input
          id={prefix + '-text'}
          className="input"
          disabled={isSubmitting}
          aria-invalid={!!error?.text}
          aria-describedby={error?.text ? prefix + '-text-error' : undefined}
          {...register(`questions.${index}.text`)}
        />
        {error?.text && (
          <p className="err" id={prefix + '-text-error'}>
            {error.text.message}
          </p>
        )}
      </div>

      {type === 'BOOLEAN' && (
        <fieldset className="group" disabled={isSubmitting}>
          <legend className="mono">CORRECT ANSWER</legend>
          <Controller
            control={control}
            name={`questions.${index}.booleanAnswer`}
            render={({ field }) => (
              <div className="choices">
                {[true, false].map((value) => (
                  <label className="choice" key={String(value)}>
                    <input
                      type="radio"
                      name={field.name}
                      ref={value ? field.ref : undefined}
                      checked={field.value === value}
                      onChange={() => field.onChange(value)}
                      onBlur={field.onBlur}
                      aria-invalid={!!error?.booleanAnswer}
                      aria-describedby={
                        error?.booleanAnswer
                          ? prefix + '-boolean-error'
                          : undefined
                      }
                    />
                    {value ? 'True' : 'False'}
                  </label>
                ))}
              </div>
            )}
          />
          {error?.booleanAnswer && (
            <p className="err" id={prefix + '-boolean-error'}>
              {error.booleanAnswer.message}
            </p>
          )}
        </fieldset>
      )}

      {type === 'INPUT' && (
        <div className="field">
          <label className="mono" htmlFor={prefix + '-answer'}>
            EXPECTED ANSWER
          </label>
          <input
            className="input"
            id={prefix + '-answer'}
            disabled={isSubmitting}
            aria-invalid={!!error?.textAnswer}
            aria-describedby={
              error?.textAnswer ? prefix + '-answer-error' : undefined
            }
            {...register(`questions.${index}.textAnswer`)}
          />
          {error?.textAnswer && (
            <p className="err" id={prefix + '-answer-error'}>
              {error.textAnswer.message}
            </p>
          )}
        </div>
      )}

      {type === 'CHECKBOX' && (
        <fieldset className="group" disabled={isSubmitting}>
          <legend className="mono">OPTIONS, TICK THE CORRECT ONES</legend>
          {fields.map((option, optionIndex) => {
            const optionError = error?.options?.[optionIndex]?.text;
            const errorId = prefix + '-option-' + optionIndex + '-error';
            return (
              <div key={option.id}>
                <div className="option">
                  <input
                    type="checkbox"
                    aria-label={`Option ${optionIndex + 1} is correct`}
                    aria-describedby={
                      optionsError ? prefix + '-options-error' : undefined
                    }
                    {...register(
                      `questions.${index}.options.${optionIndex}.isCorrect`,
                    )}
                  />
                  <input
                    className="input"
                    aria-label={`Option ${optionIndex + 1}`}
                    aria-invalid={!!optionError}
                    aria-describedby={optionError ? errorId : undefined}
                    {...register(
                      `questions.${index}.options.${optionIndex}.text`,
                    )}
                  />
                </div>
                {optionError && (
                  <p className="err" id={errorId}>
                    {optionError.message}
                  </p>
                )}
              </div>
            );
          })}
          {optionsError && (
            <p className="err" id={prefix + '-options-error'}>
              {optionsError}
            </p>
          )}
          <button
            type="button"
            className="link-btn"
            disabled={isSubmitting}
            onClick={() => append({ text: '', isCorrect: false })}
          >
            + Add option
          </button>
        </fieldset>
      )}
    </section>
  );
}

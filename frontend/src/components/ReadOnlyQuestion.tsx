import type { Question } from '../types/quiz';
export default function ReadOnlyQuestion({
  question,
  index,
}: {
  question: Question;
  index: number;
}) {
  const titleId = 'question-' + question.id;
  return (
    <li className="qitem">
      <span className="mono">{String(index + 1).padStart(2, '0')}</span>
      <div>
        <span className="tag">{question.type}</span>
        <p className="qtext" id={titleId}>
          {question.text}
        </p>
        {question.type === 'BOOLEAN' && (
          <div role="group" aria-labelledby={titleId}>
            {[true, false].map((value) => (
              <label className="choice" key={String(value)}>
                <input
                  type="radio"
                  name={question.id}
                  checked={question.booleanAnswer === value}
                  disabled
                />
                {value ? 'True' : 'False'}
              </label>
            ))}
          </div>
        )}
        {question.type === 'INPUT' && (
          <input
            className="input"
            value={question.textAnswer ?? ''}
            aria-labelledby={titleId}
            disabled
          />
        )}
        {question.type === 'CHECKBOX' && (
          <div role="group" aria-labelledby={titleId}>
            {[...question.options]
              .sort((a, b) => a.position - b.position)
              .map((option) => (
                <label className="choice" key={option.id}>
                  <input type="checkbox" checked={option.isCorrect} disabled />
                  {option.text}
                </label>
              ))}
          </div>
        )}
      </div>
    </li>
  );
}

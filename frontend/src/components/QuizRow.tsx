import { Link } from 'react-router-dom';
import type { QuizSummary } from '../types/quiz';
interface Props {
  quiz: QuizSummary;
  index: number;
  isDeleting: boolean;
  onDelete: (id: string) => void;
}
export default function QuizRow({ quiz, index, isDeleting, onDelete }: Props) {
  return (
    <li className="row">
      <span className="mono">{String(index + 1).padStart(2, '0')}</span>
      <Link className="row__title" to={'/quizzes/' + quiz.id}>
        {quiz.title}
      </Link>
      <span className="mono row__meta">
        {quiz.questionCount}{' '}
        {quiz.questionCount === 1 ? 'QUESTION' : 'QUESTIONS'}
      </span>
      <button
        type="button"
        className="icon-btn"
        aria-label={'Delete ' + quiz.title}
        disabled={isDeleting}
        onClick={() => onDelete(quiz.id)}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15" />
        </svg>
      </button>
    </li>
  );
}

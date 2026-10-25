import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import QuizRow from '../components/QuizRow';
import {
  deleteQuiz,
  getErrorMessage,
  getQuizzes,
  isNotFound,
} from '../services/api';
import type { QuizSummary } from '../types/quiz';
export default function QuizListPage() {
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const pendingDeletes = useRef(new Set<string>());
  useEffect(() => {
    const controller = new AbortController();
    getQuizzes(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setQuizzes(data);
      })
      .catch((err: unknown) => {
        if (!controller.signal.aborted) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, []);
  async function handleDelete(id: string) {
    if (pendingDeletes.current.has(id)) return;
    pendingDeletes.current.add(id);
    setDeletingIds((ids) => [...ids, id]);
    setDeleteError('');
    try {
      await deleteQuiz(id);
      setQuizzes((items) => items.filter((item) => item.id !== id));
    } catch (err: unknown) {
      if (isNotFound(err))
        setQuizzes((items) => items.filter((item) => item.id !== id));
      else setDeleteError(getErrorMessage(err));
    } finally {
      pendingDeletes.current.delete(id);
      setDeletingIds((ids) => ids.filter((item) => item !== id));
    }
  }
  return (
    <>
      <div className="page-head">
        <div>
          {!isLoading && !error && (
            <p className="mono eyebrow">
              {String(quizzes.length).padStart(2, '0')}{' '}
              {quizzes.length === 1 ? 'QUIZ' : 'QUIZZES'}
            </p>
          )}
          <h1 className="h1">Quizzes</h1>
        </div>
        <Link className="btn" to="/create">
          New quiz
        </Link>
      </div>
      {deleteError && (
        <p className="state" role="alert">
          {deleteError}
        </p>
      )}
      {isLoading ? (
        <p className="state" role="status">
          Loading.
        </p>
      ) : error ? (
        <p className="state" role="alert">
          {error}
        </p>
      ) : quizzes.length === 0 ? (
        <p className="state">No quizzes yet.</p>
      ) : (
        <ul className="list">
          {quizzes.map((quiz, index) => (
            <QuizRow
              key={quiz.id}
              quiz={quiz}
              index={index}
              isDeleting={deletingIds.includes(quiz.id)}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </>
  );
}

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReadOnlyQuestion from '../components/ReadOnlyQuestion';
import { getErrorMessage, getQuiz, isNotFound } from '../services/api';
import type { Quiz } from '../types/quiz';
type Result = { id: string; quiz?: Quiz; error?: string };
export default function QuizDetailPage() {
  const { id = '' } = useParams<{ id: string }>();
  const [result, setResult] = useState<Result | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    getQuiz(id, controller.signal)
      .then((quiz) => {
        if (!controller.signal.aborted) setResult({ id, quiz });
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted)
          setResult({
            id,
            error: isNotFound(error)
              ? 'Quiz not found.'
              : getErrorMessage(error),
          });
      });
    return () => controller.abort();
  }, [id]);
  const current = result?.id === id ? result : null;
  const quiz = current?.quiz;
  return (
    <>
      <Link className="mono back" to="/quizzes">
        ← QUIZZES
      </Link>
      {!current ? (
        <p className="state" role="status">
          Loading.
        </p>
      ) : current.error ? (
        <p className="state" role="alert">
          {current.error}
        </p>
      ) : (
        quiz && (
          <>
            <h1 className="h1 page-title">{quiz.title}</h1>
            <p className="mono">
              {quiz.questions.length}{' '}
              {quiz.questions.length === 1 ? 'QUESTION' : 'QUESTIONS'}
            </p>
            <ol className="qlist">
              {[...quiz.questions]
                .sort((a, b) => a.position - b.position)
                .map((question, index) => (
                  <ReadOnlyQuestion
                    key={question.id}
                    question={question}
                    index={index}
                  />
                ))}
            </ol>
          </>
        )
      )}
    </>
  );
}

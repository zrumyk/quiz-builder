import { Link } from 'react-router-dom';
export default function NotFoundPage() {
  return (
    <>
      <Link className="mono back" to="/quizzes">
        ← QUIZZES
      </Link>
      <p className="state">Page not found.</p>
    </>
  );
}

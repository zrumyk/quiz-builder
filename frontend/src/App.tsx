import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import QuizListPage from './pages/QuizListPage';
import CreateQuizPage from './pages/CreateQuizPage';
import QuizDetailPage from './pages/QuizDetailPage';
import NotFoundPage from './pages/NotFoundPage';
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/quizzes" replace />} />
          <Route path="quizzes" element={<QuizListPage />} />
          <Route path="create" element={<CreateQuizPage />} />
          <Route path="quizzes/:id" element={<QuizDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

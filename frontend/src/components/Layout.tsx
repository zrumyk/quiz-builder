import { Link, NavLink, Outlet } from 'react-router-dom';
export default function Layout() {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    'nav__link' + (isActive ? ' nav__link--active' : '');
  return (
    <>
      <header className="header">
        <div className="container header__inner">
          <Link to="/quizzes" className="brand">
            Quiz Builder
          </Link>
          <nav className="nav" aria-label="Main navigation">
            <NavLink to="/quizzes" className={navClass}>
              Quizzes
            </NavLink>
            <NavLink to="/create" className={navClass}>
              Create
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="container page">
        <Outlet />
      </main>
    </>
  );
}

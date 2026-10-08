import { Link } from "react-router";
export function NotFoundPage() {
  return (
    <main id="main-content" className="loading">
      <h1>Страница не найдена</h1>
      <Link to="/login">На страницу входа</Link>
    </main>
  );
}

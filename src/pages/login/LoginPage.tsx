import { Navigate } from "react-router";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { useCurrentUser } from "@/features/auth/queries";
export function LoginPage() {
  const q = useCurrentUser();
  if (q.isPending) return <p role="status">Проверяем сессию…</p>;
  if (q.data) return <Navigate to="/admin/dashboard" replace />;
  if (q.isError)
    return (
      <div>
        <p role="alert">Не удалось проверить сессию.</p>
        <button onClick={() => q.refetch()}>Повторить</button>
      </div>
    );
  return (
    <>
      <span className="eyebrow">ВАШ ЛИЧНЫЙ КАБИНЕТ</span>
      <h1>С возвращением</h1>
      <p className="intro">Войдите, чтобы продолжить работу с проектом.</p>
      <LoginForm />
      <div className="demo-note">
        <strong>Попробуйте демо</strong>
        <p>
          Email: admin@example.com
          <br />
          Пароль: Demo12345!
        </p>
      </div>
    </>
  );
}

import { Outlet } from "react-router";
import { ShieldCheck, ArrowUpRight } from "lucide-react";
export function AuthLayout() {
  return (
    <div className="auth-shell">
      <aside className="auth-story">
        <div className="brand">
          <ShieldCheck aria-hidden="true" /> access
          <span className="brand-dot">.</span>
        </div>
        <div className="story-copy">
          <span className="eyebrow">ДОСТУПНОСТЬ НАЧИНАЕТСЯ ЗДЕСЬ</span>
          <h2>
            Хороший интерфейс.
            <br />
            Для каждого.
          </h2>
          <p>
            Пространство для управления вашим проектом — понятное, удобное и
            доступное.
          </p>
          <div className="story-mark" aria-hidden="true">
            <ArrowUpRight />
          </div>
        </div>
        <p className="story-footer">Создаём цифровую среду без барьеров.</p>
      </aside>
      <main id="main-content" className="auth-main">
        <div className="auth-card">
          <Outlet />
        </div>
        <p className="auth-footer">
          Демо-кабинет · React / WCAG 2.2 AA — цель проекта
        </p>
      </main>
    </div>
  );
}

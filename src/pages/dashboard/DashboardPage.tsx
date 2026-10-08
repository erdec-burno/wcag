import { ShieldCheck, KeyRound, CheckCircle2 } from "lucide-react";
import { useCurrentUser } from "@/features/auth/queries";
export function DashboardPage() {
  const { data: user } = useCurrentUser();
  return (
    <>
      <header className="dashboard-header">
        <span className="eyebrow">ОБЗОР КАБИНЕТА</span>
        <span className="badge">Демо</span>
      </header>
      <h1>Dashboard</h1>
      <p className="intro">
        Добро пожаловать, {user?.name}. Ваше рабочее пространство готово.
      </p>
      <section className="welcome-panel">
        <ShieldCheck aria-hidden="true" />
        <div>
          <span className="eyebrow">ВСЁ НАЧИНАЕТСЯ С ДОСТУПА</span>
          <h2>Вы успешно вошли в кабинет</h2>
          <p>
            Здесь появятся инструменты вашего проекта. Сейчас можно проверить
            авторизацию, смену темы и восстановление доступа.
          </p>
        </div>
      </section>
      <div className="dashboard-grid">
        <section className="info-card">
          <KeyRound aria-hidden="true" />
          <h2>Ваш аккаунт</h2>
          <dl>
            <dt>Имя</dt>
            <dd>{user?.name}</dd>
            <dt>Email</dt>
            <dd>{user?.email}</dd>
          </dl>
        </section>
        <section className="info-card">
          <CheckCircle2 aria-hidden="true" />
          <h2>Сессия активна</h2>
          <p className="muted">
            Вход сохраняется после обновления страницы. Демо-сессия действует
            один час.
          </p>
          <span className="badge">Авторизован</span>
        </section>
      </div>
    </>
  );
}

import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";
export function ForgotPasswordPage() {
  return (
    <>
      <span className="eyebrow">ВОССТАНОВЛЕНИЕ ДОСТУПА</span>
      <h1>Забыли пароль?</h1>
      <p className="intro">
        Укажите email вашего аккаунта. Мы поможем восстановить доступ.
      </p>
      <ForgotPasswordForm />
    </>
  );
}

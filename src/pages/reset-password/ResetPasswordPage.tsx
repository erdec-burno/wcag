import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";
export function ResetPasswordPage() {
  return (
    <>
      <span className="eyebrow">НОВОЕ НАЧАЛО</span>
      <h1>Новый пароль</h1>
      <p className="intro">Придумайте новый пароль для вашего аккаунта.</p>
      <ResetPasswordForm />
    </>
  );
}

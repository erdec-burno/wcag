import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { useResetPassword } from "../mutations";
import { passwordError } from "../validation";
import { errorMessage } from "@/api/errors";
import { FormField } from "@/shared/components/FormField";
import { Button } from "@/shared/ui/button";
export function ResetPasswordForm() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const m = useResetPassword();
  if (!token)
    return (
      <div>
        <p role="alert" className="error-text">
          В ссылке отсутствует токен сброса.
        </p>
        <Link to="/forgot-password">Запросить новую ссылку</Link>
      </div>
    );
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
        if (!passwordError(password) && password === confirm && !m.isPending)
          m.mutate({ token, password });
      }}
    >
      <FormField
        id="password"
        label="Новый пароль"
        type="password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        hint="Минимум 8 символов, включая букву и цифру."
        error={submitted ? passwordError(password) : ""}
      />
      <FormField
        id="confirm"
        label="Повторите пароль"
        type="password"
        autoComplete="new-password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        error={submitted && password !== confirm ? "Пароли не совпадают." : ""}
      />
      <div role="alert">
        {m.error && <p className="error-text">{errorMessage(m.error)}</p>}
        {submitted && (passwordError(password) || password !== confirm) && (
          <span className="sr-only">Проверьте поля пароля.</span>
        )}
      </div>
      <Button className="full" disabled={m.isPending}>
        {m.isPending ? "Сохраняем…" : "Сохранить пароль"}
      </Button>
      <Link className="form-link" to="/forgot-password">
        Запросить новую ссылку
      </Link>
    </form>
  );
}

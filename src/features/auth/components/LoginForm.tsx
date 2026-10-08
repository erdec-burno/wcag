import { useState } from "react";
import { Link, useLocation } from "react-router";
import { useLogin } from "../mutations";
import { emailError } from "../validation";
import { errorMessage } from "@/api/errors";
import { FormField } from "@/shared/components/FormField";
import { Button } from "@/shared/ui/button";
export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const mutation = useLogin();
  const location = useLocation();
  const emailIssue = submitted ? emailError(email) : "";
  const passwordIssue = submitted && !password ? "Введите пароль." : "";
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
        if (!emailError(email) && password && !mutation.isPending)
          mutation.mutate({ email, password });
      }}
    >
      {location.state?.passwordReset && (
        <p role="status" className="notice">
          Пароль изменён. Войдите с новым паролем.
        </p>
      )}
      <FormField
        id="email"
        label="Email"
        type="email"
        autoComplete="username"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={emailIssue}
      />
      <FormField
        id="password"
        label="Пароль"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={passwordIssue}
      />
      <Link className="form-link" to="/forgot-password">
        Забыли пароль?
      </Link>
      <div role="alert">
        {mutation.error && (
          <p className="error-text">{errorMessage(mutation.error)}</p>
        )}
        {(emailIssue || passwordIssue) && (
          <span className="sr-only">Проверьте поля формы.</span>
        )}
      </div>
      <Button disabled={mutation.isPending} className="full">
        {mutation.isPending ? "Входим…" : "Войти в кабинет"}
      </Button>
    </form>
  );
}

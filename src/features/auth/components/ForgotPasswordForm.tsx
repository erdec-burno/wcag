import { useState } from "react";
import { Link } from "react-router";
import { useForgotPassword } from "../mutations";
import { emailError } from "../validation";
import { errorMessage } from "@/api/errors";
import { FormField } from "@/shared/components/FormField";
import { Button } from "@/shared/ui/button";
export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const m = useForgotPassword();
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
        if (!emailError(email) && !m.isPending) m.mutate(email);
      }}
    >
      <FormField
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          m.reset();
        }}
        error={submitted ? emailError(email) : ""}
      />
      <div role="alert">
        {m.error && <p className="error-text">{errorMessage(m.error)}</p>}
        {submitted && emailError(email) && (
          <span className="sr-only">Введите корректный email.</span>
        )}
      </div>
      {m.data && (
        <div className="notice">
          <p role="status">{m.data.message}</p>
          <p>
            Демо: письмо не отправляется. Ссылка работает для тестового аккаунта
            в этой вкладке в течение 15 минут.
          </p>
          <Link to={m.data.demoLink}>Открыть демо-ссылку сброса</Link>
        </div>
      )}
      <Button className="full" disabled={m.isPending}>
        {m.isPending ? "Отправляем…" : "Отправить инструкцию"}
      </Button>
      <Link className="form-link" to="/login">
        Вернуться ко входу
      </Link>
    </form>
  );
}

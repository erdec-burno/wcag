import { demoUser, demoPassword } from "./fixtures";
import { startSession, endSession, hasSession } from "./session";
let password = demoPassword;
const tokens = new Map<string, { expiresAt: number }>();
export function handleAuth(
  method: string,
  path: string,
  body: Record<string, string>,
) {
  const response = (status: number, data: unknown) => ({ status, data });
  if (method === "get" && path === "/auth/me")
    return hasSession()
      ? response(200, demoUser)
      : response(401, { message: "Сессия завершена. Войдите снова." });
  if (method === "post" && path === "/auth/login") {
    if (
      body.email?.trim().toLowerCase() !== demoUser.email ||
      body.password !== password
    )
      return response(401, { message: "Неверный email или пароль." });
    startSession();
    return response(200, demoUser);
  }
  if (method === "post" && path === "/auth/logout") {
    endSession();
    return response(200, {});
  }
  if (method === "post" && path === "/auth/forgot-password") {
    const token = crypto.randomUUID();
    if (body.email?.trim().toLowerCase() === demoUser.email)
      tokens.set(token, { expiresAt: Date.now() + 15 * 60 * 1000 });
    return response(200, {
      message: "Если аккаунт существует, инструкция для сброса отправлена.",
      demoLink: "/reset-password?token=" + token,
    });
  }
  if (method === "post" && path === "/auth/reset-password") {
    const entry = tokens.get(body.token);
    if (!entry || entry.expiresAt <= Date.now())
      return response(400, {
        message: "Ссылка недействительна или срок её действия истёк.",
      });
    if (
      !body.password ||
      body.password.length < 8 ||
      !/[a-zа-я]/i.test(body.password) ||
      !/\d/.test(body.password)
    )
      return response(422, {
        message: "Пароль должен содержать минимум 8 символов, букву и цифру.",
      });
    password = body.password;
    tokens.clear();
    endSession();
    return response(200, {});
  }
  return response(404, { message: "Ресурс не найден." });
}
export function resetDemo() {
  password = demoPassword;
  tokens.clear();
  endSession();
}

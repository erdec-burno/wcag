export function emailError(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ? ""
    : "Введите корректный email.";
}
export function passwordError(password: string) {
  return password.length >= 8 &&
    /[a-zа-я]/i.test(password) &&
    /\d/.test(password)
    ? ""
    : "Минимум 8 символов, включая букву и цифру.";
}

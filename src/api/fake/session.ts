const key = "access.demo-session";
export function startSession() {
  localStorage.setItem(
    key,
    JSON.stringify({ expiresAt: Date.now() + 60 * 60 * 1000 }),
  );
}
export function endSession() {
  localStorage.removeItem(key);
}
export function hasSession() {
  try {
    const s = JSON.parse(localStorage.getItem(key) ?? "null");
    if (s?.expiresAt > Date.now()) return true;
  } catch {
    /* corrupted demo storage */
  }
  endSession();
  return false;
}

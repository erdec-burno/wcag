import { Navigate, Outlet } from "react-router";
import { useCurrentUser } from "../queries";
import { Button } from "@/shared/ui/button";
export function RequireAuth() {
  const q = useCurrentUser();
  if (q.isPending)
    return (
      <p role="status" className="loading">
        Проверяем сессию…
      </p>
    );
  if (q.isError)
    return (
      <div className="loading">
        <p role="alert">Не удалось проверить сессию.</p>
        <Button onClick={() => q.refetch()}>Повторить</Button>
      </div>
    );
  return q.data ? <Outlet /> : <Navigate to="/login" replace />;
}

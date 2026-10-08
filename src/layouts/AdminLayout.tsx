import { NavLink, Outlet } from "react-router";
import { ShieldCheck, LayoutDashboard, LogOut } from "lucide-react";
import { useLogout } from "@/features/auth/mutations";
import { errorMessage } from "@/api/errors";
import { Button } from "@/shared/ui/button";
export function AdminLayout() {
  const logout = useLogout();
  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div className="brand">
          <ShieldCheck aria-hidden="true" /> access.
        </div>
        <p className="eyebrow">РАБОЧЕЕ ПРОСТРАНСТВО</p>
        <nav aria-label="Основная навигация">
          <NavLink to="/admin/dashboard">
            <LayoutDashboard aria-hidden="true" /> Dashboard
          </NavLink>
        </nav>
        <div className="sidebar-bottom">
          <p className="muted">Демонстрационный режим</p>
          <Button
            variant="outline"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
          >
            <LogOut aria-hidden="true" />
            {logout.isPending ? "Выходим…" : "Выйти"}
          </Button>
          {logout.error && (
            <p role="alert" className="error-text">
              {errorMessage(logout.error)}
            </p>
          )}
        </div>
      </aside>
      <main id="main-content" className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}

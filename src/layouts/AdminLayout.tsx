import { NavLink, Outlet } from "react-router";
import { ShieldCheck, LayoutDashboard, LogOut } from "lucide-react";
import { useLogout } from "@/features/auth/mutations";
import { errorMessage } from "@/api/errors";
import { Button } from "@/shared/ui/button";
import { useRef, type ReactNode } from "react";
import { AdminTopbar } from "@/features/auth/components/AdminTopbar";
import { MobileSidebar } from "@/shared/components/MobileSidebar";
function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const logout = useLogout();
  return (
    <>
      <div className="brand">
        <ShieldCheck aria-hidden="true" /> access.
      </div>
      <p className="eyebrow">РАБОЧЕЕ ПРОСТРАНСТВО</p>
      <nav aria-label="Основная навигация">
        <NavLink to="/admin/dashboard" onClick={onNavigate}>
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
    </>
  );
}

export function AdminLayout({ themeControl }: { themeControl: ReactNode }) {
  const desktopSidebar = useRef<HTMLElement>(null);

  return (
    <MobileSidebar
      content={(close) => <SidebarContent onNavigate={close} />}
      onDesktopClose={() =>
        desktopSidebar.current?.querySelector<HTMLAnchorElement>("a")?.focus()
      }
    >
      {(menuControl) => (
        <div className="admin-shell">
          <aside ref={desktopSidebar} className="sidebar desktop-sidebar">
            <SidebarContent />
          </aside>
          <div className="admin-workspace">
            <AdminTopbar
              themeControl={themeControl}
              menuControl={menuControl}
            />
            <main id="main-content" className="dashboard-main" tabIndex={-1}>
              <Outlet />
            </main>
          </div>
        </div>
      )}
    </MobileSidebar>
  );
}

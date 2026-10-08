import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router";
import { useEffect } from "react";
import { AuthLayout } from "@/layouts/AuthLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { RequireAuth } from "@/features/auth/components/RequireAuth";
import { LoginPage } from "@/pages/login/LoginPage";
import { ForgotPasswordPage } from "@/pages/forgot-password/ForgotPasswordPage";
import { ResetPasswordPage } from "@/pages/reset-password/ResetPasswordPage";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { NotFoundPage } from "@/pages/not-found/NotFoundPage";
function RouteFocus() {
  const { pathname } = useLocation();
  useEffect(() => {
    const focusHeading = () => {
      const h = document.querySelector<HTMLElement>("h1");
      if (!h) return false;
      h.tabIndex = -1;
      h.focus();
      document.title = h.textContent + " — Access";
      return true;
    };
    if (focusHeading()) return;
    const observer = new MutationObserver(() => {
      if (focusHeading()) observer.disconnect();
    });
    observer.observe(document.getElementById("root")!, {
      childList: true,
      subtree: true,
    });
    return () => observer.disconnect();
  }, [pathname]);
  return null;
}
export function Router() {
  return (
    <BrowserRouter>
      <RouteFocus />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>
        <Route element={<RequireAuth />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

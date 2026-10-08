import type { ReactNode } from "react";
import { AccountSecurityDialog } from "./AccountSecurityDialog";
import { UserProfilePopover } from "./UserProfilePopover";

export function AdminTopbar({
  themeControl,
  menuControl,
}: {
  themeControl: ReactNode;
  menuControl: ReactNode;
}) {
  return (
    <header className="admin-topbar">
      <div className="topbar-start">
        {menuControl}
        <div className="topbar-theme">{themeControl}</div>
      </div>
      <nav className="topbar-actions" aria-label="Настройки аккаунта">
        <AccountSecurityDialog />
        <UserProfilePopover />
      </nav>
    </header>
  );
}

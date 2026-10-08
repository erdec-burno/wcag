import { Shield, X } from "lucide-react";
import { Link } from "react-router";
import { useCurrentUser } from "../queries";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";

export function AccountSecurityDialog() {
  const { data: user } = useCurrentUser();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="topbar-action">
          <span className="topbar-icon">
            <Shield aria-hidden="true" />
          </span>
          <span className="topbar-label" lang="en">
            SECURITY
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <div className="account-dialog-header">
          <DialogTitle>Безопасность</DialogTitle>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="dialog-close"
              aria-label="Закрыть"
            >
              <X aria-hidden="true" />
            </Button>
          </DialogClose>
        </div>
        <DialogDescription className="sr-only">
          Управление паролем демо-аккаунта
        </DialogDescription>
        <div className="account-dialog-content">
          <p>
            Вы вошли как {user?.email}. Для смены пароля запросите ссылку
            восстановления доступа.
          </p>
          <Link className="form-link" to="/forgot-password">
            Сменить пароль
          </Link>
          <p className="muted">
            Демонстрационный режим: письмо не отправляется, ссылка доступна на
            странице восстановления.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

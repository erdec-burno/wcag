import { useEffect, useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";

// Keep this in sync with the sidebar breakpoint in globals.css.
const desktopMediaQuery = "(min-width: 801px)";

export function MobileSidebar({
  content,
  children,
  onDesktopClose,
}: {
  content: (close: () => void) => ReactNode;
  children: (menuControl: ReactNode) => ReactNode;
  onDesktopClose?: () => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia(desktopMediaQuery);
    const onResize = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", onResize);
    return () => desktop.removeEventListener("change", onResize);
  }, []);

  const menuControl = (
    <DialogTrigger asChild>
      <Button
        variant="outline"
        className="sidebar-menu-toggle"
        aria-label="Открыть меню"
      >
        <Menu aria-hidden="true" />
      </Button>
    </DialogTrigger>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children(menuControl)}
      <DialogContent
        className="sidebar mobile-sidebar"
        showCloseButton={false}
        aria-describedby={undefined}
        onCloseAutoFocus={(event) => {
          if (window.matchMedia(desktopMediaQuery).matches && onDesktopClose) {
            event.preventDefault();
            onDesktopClose();
          }
        }}
      >
        <div className="sidebar-drawer-header">
          <DialogTitle>Меню</DialogTitle>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="dialog-close"
              aria-label="Закрыть меню"
            >
              <X aria-hidden="true" />
            </Button>
          </DialogClose>
        </div>
        {content(() => setOpen(false))}
      </DialogContent>
    </Dialog>
  );
}

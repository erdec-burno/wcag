import { UserRound, X } from "lucide-react";
import { useId } from "react";
import { useCurrentUser } from "../queries";
import { Button } from "@/shared/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@/shared/ui/popover";

export function UserProfilePopover() {
  const { data: user } = useCurrentUser();
  const titleId = useId();
  const descriptionId = useId();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="topbar-action">
          <span className="topbar-icon">
            <UserRound aria-hidden="true" />
          </span>
          <span className="topbar-label" lang="en">
            PROFILE
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="end"
        collisionPadding={16}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <div className="account-dialog-header">
          <PopoverTitle id={titleId}>Профиль</PopoverTitle>
          <PopoverClose asChild>
            <Button
              variant="outline"
              className="dialog-close"
              aria-label="Закрыть"
            >
              <X aria-hidden="true" />
            </Button>
          </PopoverClose>
        </div>
        <PopoverDescription id={descriptionId} className="sr-only">
          Данные текущего пользователя
        </PopoverDescription>
        <dl>
          <dt>Имя</dt>
          <dd>{user?.name}</dd>
          <dt>Email</dt>
          <dd>{user?.email}</dd>
        </dl>
      </PopoverContent>
    </Popover>
  );
}

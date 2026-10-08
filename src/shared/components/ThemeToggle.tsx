import { Button } from "@/shared/ui/button";
export function ThemeToggle({
  dark,
  onToggle,
}: {
  dark: boolean;
  onToggle: () => void;
}) {
  return (
    <Button variant="outline" onClick={onToggle} aria-pressed={dark}>
      {dark ? "Светлая тема" : "Тёмная тема"}
    </Button>
  );
}

import { Providers, useTheme } from "./providers";
import { Router } from "./router";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
function Content() {
  const { dark, toggle } = useTheme();
  return (
    <>
      <a className="skip-link" href="#main-content">
        Перейти к содержимому
      </a>
      <div className="theme-control">
        <ThemeToggle dark={dark} onToggle={toggle} />
      </div>
      <Router />
    </>
  );
}
export function App() {
  return (
    <Providers>
      <Content />
    </Providers>
  );
}

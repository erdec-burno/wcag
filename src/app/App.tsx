import { Providers } from "./providers";
import { Router } from "./router";
function Content() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Перейти к содержимому
      </a>
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

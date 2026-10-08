import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./query-client";
const ThemeContext = createContext({ dark: false, toggle: () => {} });
export const useTheme = () => useContext(ThemeContext);
export function Providers({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(
    () => localStorage.getItem("access.theme") === "dark",
  );
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("access.theme", dark ? "dark" : "light");
  }, [dark]);
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContext.Provider value={{ dark, toggle: () => setDark((v) => !v) }}>
        {children}
      </ThemeContext.Provider>
    </QueryClientProvider>
  );
}

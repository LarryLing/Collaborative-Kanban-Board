import type { ThemeContextType } from "@/lib/types";
import { createContext } from "react";

export const ThemeContext = createContext<ThemeContextType>({
  theme: "system",
  setTheme: () => null,
});

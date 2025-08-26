import { createContext } from "react";

import type { ThemeContextType } from "@/lib/types";

export const ThemeContext = createContext<ThemeContextType>({
  setTheme: () => null,
  theme: "system",
});

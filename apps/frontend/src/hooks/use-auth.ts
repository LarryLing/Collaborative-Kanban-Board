import { useContext } from "react";

import { AuthContext } from "@/contexts/auth-context";
import type { AuthContextType } from "@/lib/types";

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return context;
}

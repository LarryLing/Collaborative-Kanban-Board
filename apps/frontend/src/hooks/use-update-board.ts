import { useContext } from "react";
import type { UpdateBoardContextType } from "@/lib/types";
import { UpdateBoardContext } from "@/contexts/update-board-context";

export function useUpdateBoard(): UpdateBoardContextType {
  const context = useContext(UpdateBoardContext);

  if (context === undefined) {
    throw new Error("useUpdateBoard must be used within a UpdateBoardProvider");
  }

  return context;
}

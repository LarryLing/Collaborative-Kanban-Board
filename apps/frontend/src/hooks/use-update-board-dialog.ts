import { useContext } from "react";
import type { UpdateBoardDialogContextType } from "@/lib/types";
import { UpdateBoardDialogContext } from "@/contexts/update-board-dialog-context";

export function useUpdateBoardDialog(): UpdateBoardDialogContextType {
  const context = useContext(UpdateBoardDialogContext);

  if (context === undefined) {
    throw new Error(
      "useUpdateBoardDialog must be used within a UpdateBoardDialogProvider",
    );
  }

  return context;
}

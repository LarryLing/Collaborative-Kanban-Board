import { useContext } from "react";
import type { CollaboratorDialogContextType } from "@/lib/types";
import { CollaboratorDialogContext } from "@/contexts/collaborator-dialog-context";

export function useCollaboratorDialog(): CollaboratorDialogContextType {
  const context = useContext(CollaboratorDialogContext);

  if (context === undefined) {
    throw new Error(
      "useCollaboratorDialog must be used within a CollaboratorDialogProvider",
    );
  }

  return context;
}

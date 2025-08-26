import type { Board, Collaborator, UseCollaboratorDialogReturnType } from "@/lib/types";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COLLABORATOR, OWNER } from "@/lib/constants";

type CollaboratorRoleSelectProps = {
  boardId: Board["id"];
  collaboratorId: Collaborator["id"];
  isDisabled: boolean;
  removeCollaboratorMutation: UseCollaboratorDialogReturnType["removeCollaboratorMutation"];
  role: Collaborator["role"];
};

export function CollaboratorRoleSelect({
  boardId,
  collaboratorId,
  isDisabled,
  removeCollaboratorMutation,
  role,
}: CollaboratorRoleSelectProps) {
  const handleValueChange = async (value: string) => {
    if (value === "Remove") {
      await removeCollaboratorMutation({ boardId, collaboratorId });
    }
  };

  return (
    <Select defaultValue={role} disabled={isDisabled} onValueChange={handleValueChange}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {role === OWNER ? (
          <SelectItem value={OWNER}>Owner</SelectItem>
        ) : (
          <SelectItem value={COLLABORATOR}>Collaborator</SelectItem>
        )}
        <SelectItem className="focus:text-destructive" value="Remove">
          Remove
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

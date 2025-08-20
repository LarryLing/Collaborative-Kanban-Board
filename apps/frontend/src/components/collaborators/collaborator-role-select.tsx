import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COLLABORATOR, OWNER } from "@/lib/constants";
import type { Board, Collaborator, UseCollaboratorDialogReturnType } from "@/lib/types";

type CollaboratorRoleSelectProps = {
  boardId: Board["id"];
  collaboratorId: Collaborator["id"];
  role: Collaborator["role"];
  removeCollaboratorMutation: UseCollaboratorDialogReturnType["removeCollaboratorMutation"];
  isDisabled: boolean;
};

export function CollaboratorRoleSelect({
  boardId,
  collaboratorId,
  role,
  removeCollaboratorMutation,
  isDisabled,
}: CollaboratorRoleSelectProps) {
  const handleValueChange = async (value: string) => {
    if (value === "Remove") {
      await removeCollaboratorMutation({ boardId, collaboratorId });
    }
  };

  return (
    <Select defaultValue={role} onValueChange={handleValueChange} disabled={isDisabled}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {role === OWNER ? (
          <SelectItem value={OWNER}>Owner</SelectItem>
        ) : (
          <SelectItem value={COLLABORATOR}>Collaborator</SelectItem>
        )}
        <SelectItem value="Remove" className="focus:text-destructive">
          Remove
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

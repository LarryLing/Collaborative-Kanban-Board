import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { useCollaboratorDialog } from "@/hooks/use-collaborator-dialog";
import { COLLABORATOR, OWNER } from "@/lib/constants";
import type { Board, Collaborator } from "@/lib/types";
import { useNavigate } from "@tanstack/react-router";

type CollaboratorRoleSelectProps = {
  boardId: Board["id"];
  collaboratorId: Collaborator["id"];
  role: Collaborator["role"];
  isDisabled: boolean;
};

export function CollaboratorRoleSelect({
  boardId,
  collaboratorId,
  role,
  isDisabled,
}: CollaboratorRoleSelectProps) {
  const { user } = useAuth();

  const navigate = useNavigate();

  const { removeCollaboratorMutation } = useCollaboratorDialog();

  const handleValueChange = async (value: string) => {
    if (value === "Remove") {
      await removeCollaboratorMutation({ boardId, collaboratorId });

      if (user!.id === collaboratorId) {
        navigate({ to: "/boards" });
      }
    }
  };

  return (
    <Select
      defaultValue={role}
      onValueChange={handleValueChange}
      disabled={isDisabled}
    >
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

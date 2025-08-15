import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "../ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { COLLABORATOR, OWNER } from "@/lib/constants";
import { CollaboratorRoleSelect } from "./collaborator-role-select";
import type { UseCollaboratorDialogReturnType } from "@/lib/types";
import { useMemo } from "react";
import ErrorAlert from "../misc/error-alert";

type CollaboratorDialogProps = Pick<
  UseCollaboratorDialogReturnType,
  | "open"
  | "setOpen"
  | "boardId"
  | "error"
  | "collaborators"
  | "isLoading"
  | "removeCollaboratorMutation"
  | "form"
  | "onSubmit"
>;

export function CollaboratorDialog({
  open,
  setOpen,
  boardId,
  error,
  collaborators,
  isLoading,
  removeCollaboratorMutation,
  form,
  onSubmit,
}: CollaboratorDialogProps) {
  const { user } = useAuth();

  const currentCollaborator = useMemo(
    () => collaborators?.find((collaborator) => collaborator.id === user!.id),
    [collaborators, user],
  );

  const collaboratorList = useMemo(() => {
    if (!collaborators || !currentCollaborator) return [];

    return collaborators.map((collaborator) => {
      const { id, given_name, family_name, email, role } = collaborator;
      const isDisabled =
        currentCollaborator!.role === OWNER
          ? id === user!.id && role === OWNER
          : id !== user!.id;

      return (
        <div key={id} className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage alt={`${given_name} ${family_name}`} />
              <AvatarFallback className="rounded-lg">{`${given_name.substring(0, 1)}${family_name.substring(0, 1)}`}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{`${given_name} ${family_name}`}</span>
              <span className="text-muted-foreground truncate text-xs">
                {email}
              </span>
            </div>
          </div>
          <CollaboratorRoleSelect
            boardId={boardId!}
            collaboratorId={id}
            role={role}
            removeCollaboratorMutation={removeCollaboratorMutation}
            isDisabled={isDisabled}
          />
        </div>
      );
    });
  }, [
    collaborators,
    currentCollaborator,
    user,
    boardId,
    removeCollaboratorMutation,
  ]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage collaborators</DialogTitle>
          <DialogDescription>
            Add and remove board collaborators here.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              disabled={
                currentCollaborator && currentCollaborator.role === COLLABORATOR
              }
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="m@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={
                currentCollaborator && currentCollaborator.role === COLLABORATOR
              }
            >
              {form.formState.isSubmitting ? "Inviting..." : "Invite"}
            </Button>
          </form>
        </Form>
        {isLoading ? (
          <div className="h-8 w-full flex justify-start items-center">
            Loading collaborators...
          </div>
        ) : (
          <div className="flex flex-col justify-start gap-y-2 ">
            {collaboratorList}
          </div>
        )}
        {error && (
          <ErrorAlert title="Failed to add collaborator" error={error} />
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Done
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

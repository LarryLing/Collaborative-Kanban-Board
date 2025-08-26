import { useMemo } from "react";

import type { UseCollaboratorDialogReturnType } from "@/lib/types";

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
import { useAuth } from "@/hooks/use-auth";
import { COLLABORATOR, OWNER } from "@/lib/constants";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { CollaboratorRoleSelect } from "./collaborator-role-select";

type CollaboratorDialogProps = Pick<
  UseCollaboratorDialogReturnType,
  "boardId" | "collaborators" | "form" | "isLoading" | "onSubmit" | "open" | "removeCollaboratorMutation" | "setOpen"
>;

export function CollaboratorDialog({
  boardId,
  collaborators,
  form,
  isLoading,
  onSubmit,
  open,
  removeCollaboratorMutation,
  setOpen,
}: CollaboratorDialogProps) {
  const { user } = useAuth();

  const currentCollaborator = useMemo(
    () => collaborators?.find((collaborator) => collaborator.id === user!.id),
    [collaborators, user],
  );

  const collaboratorsList = useMemo(() => {
    if (!collaborators || !currentCollaborator) return [];

    return collaborators.map((collaborator) => {
      const { email, family_name, given_name, id, role } = collaborator;
      const isDisabled = currentCollaborator!.role === OWNER ? id === user!.id && role === OWNER : id !== user!.id;

      return (
        <div className="flex justify-between items-center gap-2" key={id}>
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage alt={`${given_name} ${family_name}`} />
              <AvatarFallback className="rounded-lg">{`${given_name.substring(0, 1)}${family_name.substring(0, 1)}`}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{`${given_name} ${family_name}`}</span>
              <span className="text-muted-foreground truncate text-xs">{email}</span>
            </div>
          </div>
          <CollaboratorRoleSelect
            boardId={boardId!}
            collaboratorId={id}
            isDisabled={isDisabled || isLoading}
            removeCollaboratorMutation={removeCollaboratorMutation}
            role={role}
          />
        </div>
      );
    });
  }, [collaborators, currentCollaborator, user, boardId, removeCollaboratorMutation, isLoading]);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage collaborators</DialogTitle>
          <DialogDescription>Add and remove board collaborators here.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="flex flex-col gap-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              disabled={(currentCollaborator && currentCollaborator.role === COLLABORATOR) || isLoading}
              name="email"
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
              disabled={(currentCollaborator && currentCollaborator.role === COLLABORATOR) || isLoading}
              type="submit"
            >
              {form.formState.isSubmitting ? "Inviting..." : "Invite"}
            </Button>
          </form>
        </Form>
        <div className="flex flex-col justify-start gap-y-2 ">
          {isLoading ? (
            <div className="flex justify-between items-center gap-2">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="h-8">Loading collaborators...</span>
                </div>
              </div>
            </div>
          ) : (
            collaboratorsList
          )}
        </div>
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

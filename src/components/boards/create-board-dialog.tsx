import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import type { CreateBoardForm } from "@/lib/types";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useBoards } from "@/hooks/use-boards";
import { CreateBoardSchema } from "@/lib/schemas";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { SidebarMenuButton } from "../ui/sidebar";

export function CreateBoardDialog() {
  const [open, setOpen] = useState(false);

  const { createBoardMutation } = useBoards();

  const form = useForm<CreateBoardForm>({
    defaultValues: {
      boardTitle: "",
    },
    resolver: zodResolver(CreateBoardSchema),
  });

  const onSubmit = async (values: CreateBoardForm) => {
    const boardId = crypto.randomUUID();

    const now = new Date();
    const created_at = now.toISOString().slice(0, 19).replace("T", " ");

    await createBoardMutation({
      boardCreatedAt: created_at,
      boardId,
      boardTitle: values.boardTitle.length > 0 ? values.boardTitle : "Untitled Board",
    });

    setOpen(false);

    form.reset();
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <SidebarMenuButton
          className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
          onClick={() => form.reset()}
          tooltip="Quick Create"
        >
          <Plus />
          <span>Create Board</span>
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create board</DialogTitle>
          <DialogDescription>Enter the title of the new board here.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="flex flex-col gap-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="boardTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Untitled Board" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button disabled={form.formState.isSubmitting} type="submit">
                {form.formState.isSubmitting ? "Creating..." : "Continue"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

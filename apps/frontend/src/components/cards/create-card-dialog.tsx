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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "../ui/form";
import { Plus } from "lucide-react";
import { SidebarMenuButton } from "../ui/sidebar";
import { useState } from "react";
import type { CreateBoardForm } from "@/lib/types";
import { CreateBoardSchema } from "@/lib/schemas";

export function CreateBoardDialog() {
  const [open, setOpen] = useState(false);

  const { createBoardMutation } = useBoards();

  const form = useForm<CreateBoardForm>({
    resolver: zodResolver(CreateBoardSchema),
    defaultValues: {
      boardTitle: "",
    },
  });

  const onSubmit = async (values: CreateBoardForm) => {
    try {
      const boardId = crypto.randomUUID();

      const now = new Date();
      const created_at = now.toISOString().slice(0, 19).replace("T", " ");

      await createBoardMutation({
        boardId,
        boardTitle:
          values.boardTitle.length > 0 ? values.boardTitle : "Untitled Board",
        boardCreatedAt: created_at,
      });
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Failed to create board:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SidebarMenuButton
          tooltip="Quick Create"
          className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
          onClick={() => form.reset()}
        >
          <Plus />
          <span>Create Board</span>
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create board</DialogTitle>
          <DialogDescription>
            Enter the title of the new board here.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-4"
          >
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
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Creating..." : "Continue"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

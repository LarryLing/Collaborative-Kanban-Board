import type { UseUpdateBoardDialogReturnType } from "@/lib/types";

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

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

type UpdateBoardDialogProps = Pick<UseUpdateBoardDialogReturnType, "form" | "onSubmit" | "open" | "setOpen">;

export function UpdateBoardDialog({ form, onSubmit, open, setOpen }: UpdateBoardDialogProps) {
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rename board</DialogTitle>
          <DialogDescription>Enter the new title of the board here.</DialogDescription>
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
                {form.formState.isSubmitting ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

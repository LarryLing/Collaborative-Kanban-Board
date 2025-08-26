import type { UseCreateCardDialogReturnType } from "@/lib/types";

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
import { Textarea } from "../ui/textarea";

type CreateCardDialogProps = Pick<UseCreateCardDialogReturnType, "form" | "onSubmit" | "open" | "setOpen">;

export function CreateCardDialog({ form, onSubmit, open, setOpen }: CreateCardDialogProps) {
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create card</DialogTitle>
          <DialogDescription>Enter the title and description of the new card here.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="flex flex-col gap-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="cardTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Untitled Card" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cardDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea className="resize-none h-24" placeholder="Add a description..." {...field} />
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

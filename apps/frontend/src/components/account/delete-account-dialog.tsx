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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "../ui/form";
import type { DeleteAccountForm } from "@/lib/types";
import { DeleteAccountSchema } from "@/lib/schemas";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "@tanstack/react-router";

export function DeleteAccountDialog() {
  const { deleteAccount } = useAuth();

  const navigate = useNavigate();

  const form = useForm<DeleteAccountForm>({
    resolver: zodResolver(DeleteAccountSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const onSubmit = async () => {
    try {
      await deleteAccount();
      navigate({ to: "/login" });
    } catch (error) {
      console.error("Failed to delete account:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <span>Delete Account</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>This action is permanent and cannot be undone.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Please enter the prompt <b className="font-bold">i understand</b> to continue
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="i understand" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={() => form.reset()}>
                  Cancel
                </Button>
              </DialogClose>
              <Button variant="destructive" type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Deleting..." : "Delete Account"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

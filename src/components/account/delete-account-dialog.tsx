import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

import type { DeleteAccountForm } from "@/lib/types";

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
import { useAuth } from "@/hooks/use-auth";
import { DeleteAccountSchema } from "@/lib/schemas";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

export function DeleteAccountDialog() {
  const { deleteAccount } = useAuth();

  const navigate = useNavigate();

  const form = useForm<DeleteAccountForm>({
    defaultValues: {
      prompt: "",
    },
    resolver: zodResolver(DeleteAccountSchema),
  });

  const onSubmit = async () => {
    await deleteAccount();
    navigate({ to: "/login" });
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
          <form className="flex flex-col gap-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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
                <Button onClick={() => form.reset()} type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button disabled={form.formState.isSubmitting} type="submit" variant="destructive">
                {form.formState.isSubmitting ? "Deleting..." : "Delete Account"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

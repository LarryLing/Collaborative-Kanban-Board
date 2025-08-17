import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import type { Board, CreateListForm, UseListsReturnType } from "@/lib/types";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateListSchema } from "@/lib/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useState } from "react";

type NewListPopoverProps = {
  boardId: Board["id"];
  createListMutation: UseListsReturnType["createListMutation"];
};

export default function NewListPopover({
  boardId,
  createListMutation,
}: NewListPopoverProps) {
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<CreateListForm>({
    resolver: zodResolver(CreateListSchema),
    defaultValues: {
      listTitle: "",
    },
  });

  const onSubmit = async (values: CreateListForm) => {
    try {
      await createListMutation({
        boardId,
        listTitle: values.listTitle,
        listPosition: 0,
      });
      setOpen(false);
    } catch (error) {
      console.error(error instanceof Error ? error.message : "Unknown error");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost">
          <Plus />
          Create list
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-center gap-y-2"
          >
            <FormField
              control={form.control}
              name="listTitle"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="hidden">Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Untitled List" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" size="sm">
              Done
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}

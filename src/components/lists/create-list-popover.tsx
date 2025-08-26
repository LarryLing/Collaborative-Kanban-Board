import { zodResolver } from "@hookform/resolvers/zod";
import { generateKeyBetween } from "fractional-indexing";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import type { Board, CreateListForm, UseListsReturnType } from "@/lib/types";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CreateListSchema } from "@/lib/schemas";

import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

type CreateListPopoverProps = {
  boardId: Board["id"];
  createListMutation: UseListsReturnType["createListMutation"];
  lists: UseListsReturnType["lists"];
};

export default function CreateListPopover({ boardId, createListMutation, lists }: CreateListPopoverProps) {
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<CreateListForm>({
    defaultValues: {
      listTitle: "",
    },
    resolver: zodResolver(CreateListSchema),
  });

  const onSubmit = async (values: CreateListForm) => {
    if (!lists) return;

    const listId = crypto.randomUUID();

    const lastList = lists.at(-1);

    let listPosition;
    if (lastList) {
      listPosition = generateKeyBetween(lastList.position, null);
    } else {
      listPosition = generateKeyBetween(null, null);
    }

    await createListMutation({
      boardId,
      listId,
      listPosition,
      listTitle: values.listTitle.length > 0 ? values.listTitle : "Untitled List",
    });

    setOpen(false);

    form.reset();
  };

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost">
          <Plus />
          <p className="text-xs">Create List</p>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form className="flex flex-col items-center gap-y-2" onSubmit={form.handleSubmit(onSubmit)}>
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
            <Button className="w-full" size="sm" type="submit">
              Done
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import type { Board, List, UpdateListForm, UseListsReturnType } from "@/lib/types";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { UpdateListSchema } from "@/lib/schemas";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

type UpdateListPopoverProps = {
  boardId: Board["id"];
  listId: List["id"];
  listTitle: List["title"];
  open: boolean;
  setOpen: (open: boolean) => void;
  updateListMutation: UseListsReturnType["updateListMutation"];
};

export default function UpdateListPopover({
  boardId,
  listId,
  listTitle,
  open,
  setOpen,
  updateListMutation,
}: UpdateListPopoverProps) {
  const form = useForm<UpdateListForm>({
    defaultValues: {
      listTitle,
    },
    resolver: zodResolver(UpdateListSchema),
  });

  const onSubmit = async (values: UpdateListForm) => {
    await updateListMutation({
      boardId,
      listId,
      listTitle: values.listTitle.length > 0 ? values.listTitle : "Untitled List",
    });

    setOpen(false);
  };

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Badge className="max-w-[150px] hover:bg-secondary/70 cursor-pointer" variant="secondary">
          <p className="truncate">{listTitle}</p>
        </Badge>
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
                    <Input placeholder={listTitle} {...field} />
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

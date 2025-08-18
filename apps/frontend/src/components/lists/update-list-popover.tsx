import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import type {
  Board,
  UseListsReturnType,
  UpdateListForm,
  List,
} from "@/lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateListSchema } from "@/lib/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";

type UpdateListPopoverProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  boardId: Board["id"];
  listId: List["id"];
  listTitle: List["title"];
  updateListMutation: UseListsReturnType["updateListMutation"];
};

export default function UpdateListPopover({
  open,
  setOpen,
  boardId,
  listId,
  listTitle,
  updateListMutation,
}: UpdateListPopoverProps) {
  const form = useForm<UpdateListForm>({
    resolver: zodResolver(UpdateListSchema),
    defaultValues: {
      listTitle,
    },
  });

  const onSubmit = async (values: UpdateListForm) => {
    try {
      await updateListMutation({
        boardId,
        listId,
        listTitle: values.listTitle,
      });
      setOpen(false);
    } catch (error) {
      console.error(error instanceof Error ? error.message : "Unknown error");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Badge
          variant="secondary"
          className="max-w-[150px] hover:bg-secondary/70 cursor-pointer"
        >
          <p className="truncate">{listTitle}</p>
        </Badge>
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
                    <Input placeholder={listTitle} {...field} />
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

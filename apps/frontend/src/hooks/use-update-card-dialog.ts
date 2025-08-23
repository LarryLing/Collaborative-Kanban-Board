import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { Board, Card, List, UpdateCardForm, UseCardsReturnType, UseUpdateCardDialogReturnType } from "@/lib/types";
import { UpdateCardSchema } from "@/lib/schemas";

export function useUpdateCardDialog(
  updateCardMutation: UseCardsReturnType["updateCardMutation"],
): UseUpdateCardDialogReturnType {
  const [open, setOpen] = useState(false);
  const [boardId, setBoardId] = useState<Board["id"]>("");
  const [listId, setListId] = useState<List["id"]>("");
  const [cardId, setCardId] = useState<Card["id"]>("");

  const form = useForm<UpdateCardForm>({
    resolver: zodResolver(UpdateCardSchema),
    defaultValues: {
      cardTitle: "",
      cardDescription: "",
    },
  });

  const onSubmit = async (values: UpdateCardForm) => {
    await updateCardMutation({
      boardId,
      listId,
      cardId,
      cardTitle: values.cardTitle.length > 0 ? values.cardTitle : "Untitled Card",
      cardDescription: values.cardDescription,
    });

    setOpen(false);
  };

  const openUpdateCardDialog = useCallback(
    (
      boardId: Board["id"],
      listId: List["id"],
      cardId: Card["id"],
      cardTitle: Card["title"],
      cardDescription: Card["description"],
    ) => {
      form.reset({
        cardTitle,
        cardDescription,
      });
      setBoardId(boardId);
      setListId(listId);
      setCardId(cardId);
      setOpen(true);
    },
    [form],
  );

  return {
    open,
    setOpen,
    form,
    onSubmit,
    openUpdateCardDialog,
  };
}

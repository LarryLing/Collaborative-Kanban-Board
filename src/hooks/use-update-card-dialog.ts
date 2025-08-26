import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";

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
    defaultValues: {
      cardDescription: "",
      cardTitle: "",
    },
    resolver: zodResolver(UpdateCardSchema),
  });

  const onSubmit = async (values: UpdateCardForm) => {
    await updateCardMutation({
      boardId,
      cardDescription: values.cardDescription,
      cardId,
      cardTitle: values.cardTitle.length > 0 ? values.cardTitle : "Untitled Card",
      listId,
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
        cardDescription,
        cardTitle,
      });
      setBoardId(boardId);
      setListId(listId);
      setCardId(cardId);
      setOpen(true);
    },
    [form],
  );

  return {
    form,
    onSubmit,
    open,
    openUpdateCardDialog,
    setOpen,
  };
}

import { zodResolver } from "@hookform/resolvers/zod";
import { generateKeyBetween } from "fractional-indexing";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";

import type { Board, CreateCardForm, List, UseCardsReturnType, UseCreateCardDialogReturnType } from "@/lib/types";

import { CreateCardSchema } from "@/lib/schemas";

export function useCreateCardDialog(
  cards: UseCardsReturnType["cards"],
  createCardMutation: UseCardsReturnType["createCardMutation"],
): UseCreateCardDialogReturnType {
  const [open, setOpen] = useState(false);
  const [boardId, setBoardId] = useState<Board["id"]>("");
  const [listId, setListId] = useState<List["id"]>("");

  const form = useForm<CreateCardForm>({
    defaultValues: {
      cardDescription: "",
      cardTitle: "",
    },
    resolver: zodResolver(CreateCardSchema),
  });

  const onSubmit = async (values: CreateCardForm) => {
    if (!cards) return;

    const filteredCards = cards.filter((card) => card.list_id === listId);
    const lastCard = filteredCards.at(-1);

    let cardPosition;
    if (lastCard) {
      cardPosition = generateKeyBetween(lastCard.position, null);
    } else {
      cardPosition = generateKeyBetween(null, null);
    }

    const cardId = crypto.randomUUID();

    await createCardMutation({
      boardId,
      cardDescription: values.cardDescription,
      cardId,
      cardPosition,
      cardTitle: values.cardTitle.length > 0 ? values.cardTitle : "Untitled Card",
      listId,
    });

    setOpen(false);
  };

  const openCreateCardDialog = useCallback(
    (boardId: Board["id"], listId: List["id"]) => {
      form.reset();
      setBoardId(boardId);
      setListId(listId);
      setOpen(true);
    },
    [form],
  );

  return {
    form,
    onSubmit,
    open,
    openCreateCardDialog,
    setOpen,
  };
}

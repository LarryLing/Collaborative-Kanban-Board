import type {
  Board,
  CreateCardForm,
  List,
  UseCardsReturnType,
  UseCreateCardDialogReturnType,
} from "@/lib/types";
import { useCallback, useState } from "react";
import { CreateCardSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateKeyBetween } from "fractional-indexing";

export function useCreateCardDialog(
  cardsMap: UseCardsReturnType["cardsMap"],
  createCardMutation: UseCardsReturnType["createCardMutation"],
): UseCreateCardDialogReturnType {
  const [open, setOpen] = useState(false);
  const [boardId, setBoardId] = useState<Board["id"]>("");
  const [listId, setListId] = useState<List["id"]>("");

  const form = useForm<CreateCardForm>({
    resolver: zodResolver(CreateCardSchema),
    defaultValues: {
      cardTitle: "",
      cardDescription: "",
    },
  });

  const onSubmit = async (values: CreateCardForm) => {
    if (!cardsMap) return;

    const cards = cardsMap.get(listId);

    if (!cards) return;

    try {
      const cardId = crypto.randomUUID();

      const lastCard = cards.at(-1);

      let cardPosition;
      if (lastCard) {
        cardPosition = generateKeyBetween(lastCard.position, null);
      } else {
        cardPosition = generateKeyBetween(null, null);
      }

      await createCardMutation({
        boardId,
        listId,
        cardId,
        cardTitle:
          values.cardTitle.length > 0 ? values.cardTitle : "Untitled Card",
        cardDescription: values.cardDescription,
        cardPosition,
      });
      setOpen(false);
    } catch (error) {
      console.error("Failed to create card:", error);
    }
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
    open,
    setOpen,
    form,
    onSubmit,
    openCreateCardDialog,
  };
}

import { Plus } from "lucide-react";
import { Button } from "../ui/button";

export default function CreateCardIconButton() {
  return (
    <Button size="icon" variant="ghost" className="size-5">
      <Plus />
      <span className="sr-only">Create Card</span>
    </Button>
  );
}

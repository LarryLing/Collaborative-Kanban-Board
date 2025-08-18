import { Plus } from "lucide-react";
import { Button } from "../ui/button";

export default function CreateCardButton() {
  return (
    <Button variant="outline" className="w-full">
      <Plus />
      <p>Create Card</p>
    </Button>
  );
}

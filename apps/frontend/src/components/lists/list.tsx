import type { List } from "@/lib/types";
import { Card } from "../ui/card";

type ListProps = {
  title: List["title"];
};

export default function List({ title }: ListProps) {
  return (
    <Card className="flex-shrink-0 w-[250px] p-2 border font-medium">
      {title}
    </Card>
  );
}

import { Computer, Moon, Sun } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/hooks/use-theme";

export default function ThemeDropdown() {
  const { theme, setTheme } = useTheme();

  return (
    <Select defaultValue={theme} onValueChange={setTheme}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">
          <Sun />
          Light
        </SelectItem>
        <SelectItem value="dark">
          <Moon />
          Dark
        </SelectItem>
        <SelectItem value="system">
          <Computer />
          System
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

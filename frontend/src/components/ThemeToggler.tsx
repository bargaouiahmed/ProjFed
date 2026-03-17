import { IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "./theme-provider";
import { Button } from "./ui/button";
export default function ThemeToggler() {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      onClick={() => {
        setTheme(theme == "dark" ? "light" : "dark");
      }}
      variant={"ghost"}
      size={"icon-lg"}
      className="cursor-pointer"
    >
      {theme == "dark" ? <IconMoon /> : <IconSun />}
    </Button>
  );
}

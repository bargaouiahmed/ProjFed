import { Separator } from "../ui/separator";

export const OrSeparator = () => {
  return (
    <div className="flex items-center gap-4 my-2">
      <Separator className="flex-1" />
      <p className="text-xs text-muted-foreground uppercase">or</p>
      <Separator className="flex-1" />
    </div>
  );
};

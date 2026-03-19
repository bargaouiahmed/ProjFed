export function Heading({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="text-md text-muted-foreground">Make education easier</p>
    </div>
  );
}

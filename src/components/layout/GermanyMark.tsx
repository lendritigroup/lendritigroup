import { cn } from "@/lib/utils";

export function GermanyFlag({ className }: { className?: string }) {
  return (
    <span
      className={cn("inline-flex h-3 w-4 shrink-0 flex-col overflow-hidden border border-black/20", className)}
      aria-hidden
    >
      <span className="h-1/3 bg-black" />
      <span className="h-1/3 bg-[#dd0000]" />
      <span className="h-1/3 bg-[#ffce00]" />
    </span>
  );
}

export function GermanyMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <GermanyFlag />
      <span>DE</span>
    </span>
  );
}

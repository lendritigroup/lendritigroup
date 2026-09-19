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

export function KosovoFlag({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/flags/kosovo.png"
      alt=""
      className={cn("h-3 w-4 shrink-0 border border-black/20 object-cover", className)}
    />
  );
}

export function GermanyMark({ className }: { className?: string }) {
  return <GermanyFlag className={className} />;
}

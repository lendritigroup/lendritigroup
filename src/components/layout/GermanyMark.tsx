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
    <svg
      viewBox="0 0 36 24"
      className={cn("h-3 w-4 shrink-0 border border-black/20", className)}
      aria-hidden
    >
      <rect width="36" height="24" fill="#244aa5" />
      <g fill="#fff">
        <polygon points="8.2,5.2 8.7,6.7 10.3,6.7 9,7.6 9.5,9.1 8.2,8.2 6.9,9.1 7.4,7.6 6.1,6.7 7.7,6.7" />
        <polygon points="13.2,3.8 13.7,5.3 15.3,5.3 14,6.2 14.5,7.7 13.2,6.8 11.9,7.7 12.4,6.2 11.1,5.3 12.7,5.3" />
        <polygon points="18,3.4 18.5,4.9 20.1,4.9 18.8,5.8 19.3,7.3 18,6.4 16.7,7.3 17.2,5.8 15.9,4.9 17.5,4.9" />
        <polygon points="22.8,3.8 23.3,5.3 24.9,5.3 23.6,6.2 24.1,7.7 22.8,6.8 21.5,7.7 22,6.2 20.7,5.3 22.3,5.3" />
        <polygon points="27.8,5.2 28.3,6.7 29.9,6.7 28.6,7.6 29.1,9.1 27.8,8.2 26.5,9.1 27,7.6 25.7,6.7 27.3,6.7" />
        <polygon points="31.4,7.6 31.9,9.1 33.5,9.1 32.2,10 32.7,11.5 31.4,10.6 30.1,11.5 30.6,10 29.3,9.1 30.9,9.1" />
      </g>
      <path
        fill="#d0a650"
        d="M12.2 11.6c1.1-.4 2.4-.3 3.6.1 1 .3 1.8.2 2.6-.3.7-.4 1.6-.6 2.4-.3.9.3 1.6 1 1.8 1.9.3 1.2-.2 2.3-1.1 3.1-.8.7-1.9 1.2-3 1.4-1.4.3-2.9.1-4.2-.5-1-.5-1.8-1.3-2.1-2.4-.3-1.1.1-2.3 1-3z"
      />
    </svg>
  );
}

export function GermanyMark({ className }: { className?: string }) {
  return <GermanyFlag className={className} />;
}

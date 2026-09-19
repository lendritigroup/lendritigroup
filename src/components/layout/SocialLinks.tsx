import { COMPANY } from "@/lib/company";
import { cn } from "@/lib/utils";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M14.5 8.5V6.8c0-.7.5-1.3 1.5-1.3h1.3V3h-2.2C12.4 3 11 4.5 11 6.6v1.9H9v2.6h2V21h3.5v-9.9h2.3l.4-2.6h-2.7Z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M14.6 3c.4 2.4 1.8 4 4.2 4.2v2.4c-1.5 0-2.9-.5-4.1-1.3v6.6c0 3.3-2.6 6-5.9 6S3 18.2 3 14.9c0-3.2 2.4-5.8 5.6-6v2.5a3.4 3.4 0 0 0-3.1 3.4c0 1.9 1.5 3.4 3.4 3.4s3.4-1.5 3.4-3.4V3h2.3Z" />
    </svg>
  );
}

const LINKS = [
  { href: COMPANY.social.instagram, label: "Instagram", icon: InstagramIcon },
  { href: COMPANY.social.facebook, label: "Facebook", icon: FacebookIcon },
  { href: COMPANY.social.tiktok, label: "TikTok", icon: TikTokIcon },
] as const;

export function SocialLinks({
  className,
  iconClassName,
}: {
  className?: string;
  iconClassName?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {LINKS.map(({ href, label, icon: Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          className={cn(
            "inline-flex size-8 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-white hover:text-white",
            iconClassName
          )}
        >
          <Icon />
        </a>
      ))}
    </div>
  );
}

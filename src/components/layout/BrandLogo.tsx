import Image from "next/image";
import { COMPANY } from "@/lib/company";
import { cn } from "@/lib/utils";

export const LOGO_SRC = "/images/logo.png";

export function BrandLogo({
  className,
  imgClassName,
  width = 180,
  height = 56,
  priority = false,
}: {
  className?: string;
  imgClassName?: string;
  width?: number;
  height?: number;
  onDark?: boolean;
  priority?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center",
        className
      )}
    >
      <Image
        src={LOGO_SRC}
        alt={COMPANY.name}
        width={width}
        height={height}
        className={cn("w-auto object-contain", imgClassName)}
        priority={priority}
      />
    </span>
  );
}

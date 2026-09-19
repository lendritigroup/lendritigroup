"use client";

import Image from "next/image";

type ProductImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

/**
 * Renders product images. Uses native <img> for external URLs (e.g. Unsplash)
 * to avoid Next.js Image optimization issues with third-party domains.
 */
export function ProductImage({
  src,
  alt,
  fill = true,
  sizes,
  priority,
  className = "object-contain object-center",
}: ProductImageProps) {
  const isExternal = src.startsWith("http");

  if (isExternal) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={className}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        style={fill ? { position: "absolute", inset: 0, width: "100%", height: "100%" } : undefined}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}

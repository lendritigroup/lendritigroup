"use client";

import dynamic from "next/dynamic";

const Header = dynamic(() => import("./Header").then((m) => ({ default: m.Header })), {
  ssr: false,
});

export function HeaderClient() {
  return <Header />;
}

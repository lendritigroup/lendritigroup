"use client";

import { useEffect } from "react";

export function VisitTracker() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem("lg_visit_sent") === "1") return;
      sessionStorage.setItem("lg_visit_sent", "1");
    } catch {
      // Private mode can block storage; the request still records once per browser session via cookie.
    }
    fetch("/api/visits", { method: "POST", keepalive: true }).catch(() => {});
  }, []);

  return null;
}

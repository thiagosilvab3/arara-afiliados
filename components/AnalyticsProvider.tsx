"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackEvent } from "../lib/analytics";

export function AnalyticsProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTracked = useRef("");

  useEffect(() => {
    const query = searchParams.toString();
    const fullPath = query ? `${pathname}?${query}` : pathname;

    if (lastTracked.current !== fullPath) {
      trackEvent("page_view", { path: fullPath });
      lastTracked.current = fullPath;
    }
  }, [pathname, searchParams]);

  return null;
}
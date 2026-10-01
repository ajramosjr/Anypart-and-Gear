"use client";

import { useEffect } from "react";

export function LegacyMarketplaceHashRedirect() {
  useEffect(() => {
    if (window.location.hash === "#listings" || window.location.hash === "#categories") {
      window.location.replace("/marketplace#listings");
    }
  }, []);
  return null;
}

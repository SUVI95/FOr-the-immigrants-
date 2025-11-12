"use client";

import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    // Redirect to Journey hub
    window.location.href = "/journey";
  }, []);

  return null;
}

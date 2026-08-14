"use client";

import { useEffect } from "react";

export default function ConsoleLog() {
  useEffect(() => {
    console.log(
      "%cPatternDP%c\nDesigned and developed by our team\nhttps://patterndp.ir",
      "color: #00BFFF; font-size: 28px; font-weight: 900; font-family: monospace;",
      "color: #555; font-size: 14px; font-weight: 400; font-family: sans-serif;"
    );
  }, []);

  return null;
}

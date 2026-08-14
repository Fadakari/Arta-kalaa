"use client";

import React, { useEffect, useState } from "react";

function useReadingProgress() {
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    function updateScrollCompletion() {
      const currentProgress = window.scrollY;
      const scrollHeight = document.body.scrollHeight - window.innerHeight; // Total scrollable height

      if (scrollHeight > 0) {
        setCompletion((currentProgress / scrollHeight) * 100);
      } else {
        setCompletion(0);
      }
    }

    window.addEventListener("scroll", updateScrollCompletion);
    return () => window.removeEventListener("scroll", updateScrollCompletion);
  }, []);

  return completion;
}

function ReadingProgressBar() {
  const completion = useReadingProgress();

  return (
    <div
      className={`fixed top-0 left-0 h-2 z-50 bg-zinc-600 shadow-2xl `}
      style={{ width: `${completion}%` }}
    ></div>
  );
}

export default ReadingProgressBar;

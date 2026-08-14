"use client";

import { useState } from "react";
import parse, { domToReact } from "html-react-parser";

interface ProductDescriptionProps {
  description: string;
  maxHeight?: number;
}

export default function ProductDescription({
  description,
  maxHeight = 200,
}: ProductDescriptionProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);

  const options = {
    replace: (domNode: any) => {
      if (domNode) {
        switch (domNode.name) {
          case "h1":
            return (
              <h1 className="text-lg font-bold mb-2">
                {domToReact(domNode.children, options)}
              </h1>
            );
          case "h2":
            return (
              <h2 className="text-base font-semibold mb-2">
                {domToReact(domNode.children, options)}
              </h2>
            );
          case "h3":
            return (
              <h3 className="text-base mb-1">
                {domToReact(domNode.children, options)}
              </h3>
            );
          case "p":
            return (
              <p className="mb-2">{domToReact(domNode.children, options)}</p>
            );
          case "ul":
            return (
              <ul className="list-disc ml-5 mb-2">
                {domToReact(domNode.children, options)}
              </ul>
            );
          case "ol":
            return (
              <ol className="list-decimal ml-5 mb-2">
                {domToReact(domNode.children, options)}
              </ol>
            );
          case "a":
            return (
              <a
                className="text-cyan-500 underline"
                href={domNode.attribs.href}
              >
                {domToReact(domNode.children, options)}
              </a>
            );
        }
      }
    },
  };

  return (
    <div className="w-full relative">
      <div
        className={`${expanded ? "overflow-y-auto" : "overflow-y-hidden"} relative transition-all duration-300`}
        style={{
          maxHeight: expanded ? `${maxHeight * 2}px` : `${maxHeight}px`,
        }}
      >
        {parse(description || "", options)}

        {!expanded && description.length > 300 && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        )}
      </div>

      {description.length > 300 && (
        <button
          onClick={toggleExpanded}
          className="mt-2 text-cyan-500 font-medium text-sm"
        >
          {expanded ? "نمایش کمتر" : "نمایش بیشتر"}
        </button>
      )}

      <style jsx>{`
        .overflow-y-auto::-webkit-scrollbar {
          width: 3px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background-color: #4f9cff;
          border-radius: 10px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background-color: #f1f1f1;
          border-radius: 10px;
        }

        .overflow-y-auto::-webkit-scrollbar:hover {
          width: 12px;
        }
      `}</style>
    </div>
  );
}

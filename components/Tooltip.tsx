import React from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

interface TooltipProps {
  content: string;
  position?: "top" | "bottom" | "left" | "right";
}

const Tooltip: React.FC<TooltipProps> = ({ content, position = "top" }) => {
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div className="group relative inline-flex items-center ml-2 z-50">
      <InformationCircleIcon className="h-4 w-4 text-gray-500 hover:text-primary transition-colors cursor-help" />
      <div
        className={`absolute ${positionClasses[position]} w-48 md:w-56 p-3 bg-base/90 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl text-xs text-gray-200 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform scale-95 group-hover:scale-100 origin-center z-[100]`}
      >
        {content}
        {/* Little triangle arrow */}
        <div
          className={`absolute w-2 h-2 bg-base/90 border-r border-b border-white/10 rotate-45
          ${position === "top" ? "bottom-[-5px] left-1/2 -translate-x-1/2" : ""}
          ${
            position === "bottom"
              ? "top-[-5px] left-1/2 -translate-x-1/2 rotate-[225deg]"
              : ""
          }
          ${
            position === "left"
              ? "right-[-5px] top-1/2 -translate-y-1/2 rotate-[-45deg]"
              : ""
          }
          ${
            position === "right"
              ? "left-[-5px] top-1/2 -translate-y-1/2 rotate-[135deg]"
              : ""
          }
        `}
        ></div>
      </div>
    </div>
  );
};

export default Tooltip;

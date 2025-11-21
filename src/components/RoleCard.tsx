import React, { useState, useRef, useEffect } from "react";
import { UserRole } from "@/types";

import { ArrowLongRightIcon, FingerPrintIcon } from "@heroicons/react/24/outline";

const RoleCard: React.FC<{
  role: UserRole;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  description: string;
  theme: "emerald" | "blue" | "purple";
  onClick: () => void;
  delay: string;
}> = ({ role, icon: Icon, title, subtitle, description, theme, onClick, delay }) => {
  const themeStyles = {
    emerald: {
      bg: "hover:bg-emerald-900/20",
      border: "group-hover:border-emerald-500/50",
      iconBg: "bg-emerald-500/10 text-emerald-400",
      glow: "shadow-[0_0_50px_-12px_rgba(52,211,153,0.3)]",
      text: "text-emerald-400",
      btn: "bg-emerald-500 text-black hover:bg-emerald-400",
    },
    blue: {
      bg: "hover:bg-blue-900/20",
      border: "group-hover:border-blue-500/50",
      iconBg: "bg-blue-500/10 text-blue-400",
      glow: "shadow-[0_0_50px_-12px_rgba(96,165,250,0.3)]",
      text: "text-blue-400",
      btn: "bg-blue-500 text-white hover:bg-blue-400",
    },
    purple: {
      bg: "hover:bg-purple-900/20",
      border: "group-hover:border-purple-500/50",
      iconBg: "bg-purple-500/10 text-purple-400",
      glow: "shadow-[0_0_50px_-12px_rgba(192,132,252,0.3)]",
      text: "text-purple-400",
      btn: "bg-purple-500 text-white hover:bg-purple-400",
    },
  };

  const s = themeStyles[theme];

  return (
    <div
      onClick={onClick}
      className={`group relative w-full rounded-[2rem] min-h-[170px] lg:min-h-[255px] border border-white/10 bg-surface/40 backdrop-blur-sm cursor-pointer transition-all duration-500 hover:-translate-y-2 ${s.bg} overflow-hidden animate-fadeIn`}
      style={{ animationDelay: delay }}>

      <div className={`relative z-10 h-full flex flex-col p-6`}>
        {/* Icon Container */}
        <div className="flex flex-row justify-start items-center">
          <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl ${s.iconBg} border border-white/5 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${s.glow}`}>
            <Icon className="w-8 h-8 md:w-10 md:h-10" />
          </div>
          <div className="ms-4">
            <p className={`text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-2 ${s.text} opacity-80`}>{subtitle}</p>
            <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">{title}</h3>
          </div>
        </div>

        {/* Bottom Action */}
        <div className="mt-4 flex items-center justify-between pt-4 md:pt-6 border-t border-white/5">
          <p className="text-start max-w-[80%] text-xs md:text-sm text-gray-400 leading-relaxed pl-0 group-hover:border-white/30 transition-colors">{description}</p>
          <button className={`h-10 w-10 md:h-12 md:w-12 rounded-full ${s.btn} flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110`}>
            <ArrowLongRightIcon className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>

      {/* Decorative Noise */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>
    </div>
  );
};

export default RoleCard;

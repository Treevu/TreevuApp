import React, { useState, useRef, useEffect } from "react";


const TreevuLogo: React.FC<{ size?: string }> = ({ size = "text-xl" }) => (
  <span
    className={`font-sans font-bold tracking-tight flex items-baseline justify-center ${size}`}
  >
    <span className="text-emerald-500">tree</span>
    <span className="text-red-500">v</span>
    <span className="text-emerald-500">ü</span>
  </span>
);
export default TreevuLogo;
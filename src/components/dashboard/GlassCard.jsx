import React from 'react';
import Vector1 from "./Vector1";
import Vector2 from "./Vector2";
import Rectangle1 from "./Rectangle1";

export default function GlassCard({ 
  children, 
  className = "w-80 h-80", 
  vector1Class = "text-blue-200", 
  vector2Class = "text-blue-100" 
}) {
  return (
    <div className={`relative ${className} flex items-center justify-center`}>
      <div className="relative w-full h-full">
        
        {/* --- Background Vectors (UNCHANGED) --- */}
        <div className={`absolute inset-0 -rotate-90 scale-x-[-1] opacity-60 ${vector1Class}`}>
          <Vector1 />
        </div>
        <div className={`absolute inset-0 opacity-60 ${vector2Class}`}>
          <Vector2 />
        </div>

        {/* --- Glass Card & Content --- */}
        {/* Positioned exactly centered */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] h-[98%]">
          {/* SVG Shape */}
          <div className="w-full h-full absolute inset-0">
            <Rectangle1 />
          </div>

          {/* Content Overlay */}
          {/* Added p-6 to prevent text going outside. h-full to fill the glass area. */}
          <div className="relative z-10 h-full w-full p-6 flex flex-col justify-between">
            {children}
          </div>
        </div>

      </div>
    </div>
  );
}

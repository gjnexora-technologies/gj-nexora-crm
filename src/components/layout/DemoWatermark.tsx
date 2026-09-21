import React from 'react';

export const DemoWatermark: React.FC = () => {
  return (
    <div
      className="fixed bottom-2 right-2 sm:bottom-4 sm:right-4 z-40 select-none pointer-events-auto"
      title="GJ Nexora Technologies Interactive Client Demonstration"
    >
      <div className="flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-white/95 backdrop-blur-xs border border-[#E5E7EB] rounded-full shadow-2xs text-[10px] sm:text-[11px] font-medium text-[#667085] hover:text-[#111827] hover:border-[#D1D5DB] transition-all">
        <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse shrink-0" />
        <span className="tracking-wide font-sans">GJ NEXORA CRM • DEMO</span>
      </div>
    </div>
  );
};

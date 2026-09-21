import React, { useState } from 'react';
import { Compass, ChevronRight, X, Sparkles } from 'lucide-react';

interface DemoGuideBannerProps {
  onNavigate: (page: string) => void;
}

export const DemoGuideBanner: React.FC<DemoGuideBannerProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const steps = [
    { num: '1', title: 'Add a Lead', desc: 'Create lead & view instant auto-routing', page: 'leads' },
    { num: '2', title: 'Schedule Follow-up', desc: 'Set call/WhatsApp reminder', page: 'followups' },
    { num: '3', title: 'Complete Follow-up', desc: 'Log notes & watch KPIs update', page: 'followups' },
    { num: '4', title: 'Convert Lead', desc: 'Promote qualified lead to Customer', page: 'leads' },
    { num: '5', title: 'Customer 360', desc: 'Explore lifetime relationship view', page: 'customers' },
    { num: '6', title: 'Move Deal', desc: 'Drag or update pipeline stage', page: 'deals' },
    { num: '7', title: 'Check Reports', desc: 'View live SVG analytics & funnels', page: 'reports' },
  ];

  return (
    <div className="relative mb-4 sm:mb-5 bg-gradient-to-r from-blue-50/90 via-indigo-50/60 to-white border border-blue-100/90 rounded-xl p-3.5 sm:p-4 transition-all w-full max-w-full min-w-0 box-border">
      {/* Absolute Close Button inside container */}
      <button
        onClick={() => setIsDismissed(true)}
        className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 text-[#9CA3AF] hover:text-[#111827] p-1 rounded-lg hover:bg-black/5 transition-colors z-10"
        title="Dismiss Tour Banner"
        aria-label="Dismiss Tour"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="pr-6 sm:pr-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="text-[11px] sm:text-xs font-bold text-[#111827] tracking-tight uppercase">
                  Interactive Client Tour
                </h4>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#2563EB] text-white shrink-0">
                  Demo Lab
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#667085] mt-1 leading-relaxed">
                Experience the end-to-end custom CRM workflow built by GJ Nexora Technologies.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 sm:pt-0">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#2563EB] bg-white border border-blue-200 hover:bg-blue-50 transition-all shadow-2xs"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{isOpen ? 'Hide Tour' : 'Explore Workflow'}</span>
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="mt-3 pt-3 border-t border-blue-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 animate-fade-in">
            {steps.map((step) => (
              <button
                key={step.num}
                onClick={() => onNavigate(step.page)}
                className="group text-left p-2.5 rounded-lg bg-white/95 hover:bg-white border border-blue-100/70 hover:border-blue-300 hover:shadow-2xs transition-all flex flex-col justify-between min-w-0"
              >
                <div>
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-[#2563EB] text-[10px] font-bold mb-1 group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                    {step.num}
                  </span>
                  <p className="text-xs font-semibold text-[#111827] group-hover:text-[#2563EB] transition-colors leading-tight truncate">
                    {step.title}
                  </p>
                  <p className="text-[11px] text-[#667085] mt-0.5 leading-snug">
                    {step.desc}
                  </p>
                </div>
                <div className="mt-2 flex items-center text-[10px] font-semibold text-[#2563EB] opacity-90 group-hover:opacity-100 transition-opacity">
                  <span>Try now</span>
                  <ChevronRight className="w-3 h-3 ml-0.5" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

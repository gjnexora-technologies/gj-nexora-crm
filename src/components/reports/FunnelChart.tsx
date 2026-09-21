import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { Filter, ArrowDown } from 'lucide-react';

export const FunnelChart: React.FC = () => {
  const { leads } = useCRM();

  const total = leads.length || 1;
  const contacted = leads.filter(
    (l) => l.status === 'Contacted' || l.status === 'Qualified' || l.status === 'Proposal' || l.status === 'Converted'
  ).length;
  const qualified = leads.filter(
    (l) => l.status === 'Qualified' || l.status === 'Proposal' || l.status === 'Converted'
  ).length;
  const proposal = leads.filter(
    (l) => l.status === 'Proposal' || l.status === 'Converted'
  ).length;
  const converted = leads.filter((l) => l.status === 'Converted').length;

  const funnelSteps = [
    { label: 'Total Inquiries (New)', count: total, pct: 100, color: 'bg-blue-600', width: 'w-full' },
    { label: 'Contacted & Engaged', count: contacted, pct: Math.round((contacted / total) * 100), color: 'bg-blue-500', width: 'w-[85%]' },
    { label: 'Qualified Opportunities', count: qualified, pct: Math.round((qualified / total) * 100), color: 'bg-indigo-500', width: 'w-[70%]' },
    { label: 'Proposals Submitted', count: proposal, pct: Math.round((proposal / total) * 100), color: 'bg-amber-500', width: 'w-[55%]' },
    { label: 'Converted to Customers', count: converted, pct: Math.round((converted / total) * 100), color: 'bg-emerald-500', width: 'w-[40%]' },
  ];

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-[#111827] tracking-tight">Lead Conversion Funnel</h3>
          <p className="text-xs text-[#667085] mt-0.5">End-to-end stage progression efficiency</p>
        </div>
        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
          <Filter className="w-4 h-4" />
        </div>
      </div>

      <div className="space-y-2.5">
        {funnelSteps.map((step, idx) => (
          <div key={step.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#374151]">{step.label}</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#111827]">{step.count}</span>
                <span className="text-xs font-semibold text-[#667085] bg-gray-100 px-1.5 py-0.2 rounded">
                  {step.pct}%
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-100 h-6 rounded-lg overflow-hidden flex items-center p-1">
              <div
                style={{ width: `${Math.max(8, step.pct)}%` }}
                className={`h-full ${step.color} rounded-md transition-all duration-300 flex items-center px-2`}
              >
                <span className="text-[10px] text-white font-bold tracking-tight">
                  {step.count}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { LeadSource } from '../../types/crm';
import { Share2 } from 'lucide-react';

export const LeadSourceChart: React.FC = () => {
  const { leads } = useCRM();

  const sources: { source: LeadSource; color: string; fillHex: string }[] = [
    { source: 'Website', color: 'bg-blue-600', fillHex: '#2563EB' },
    { source: 'WhatsApp', color: 'bg-emerald-500', fillHex: '#10B981' },
    { source: 'Google', color: 'bg-amber-500', fillHex: '#F59E0B' },
    { source: 'Referral', color: 'bg-purple-500', fillHex: '#8B5CF6' },
    { source: 'Instagram', color: 'bg-rose-500', fillHex: '#F43F5E' },
    { source: 'Other', color: 'bg-gray-400', fillHex: '#9CA3AF' },
  ];

  const total = leads.length || 1;

  const data = sources.map((s) => {
    const count = leads.filter((l) => l.source === s.source).length;
    const pct = Math.round((count / total) * 100);
    return { ...s, count, pct };
  });

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-[#111827] tracking-tight">Lead Acquisition Channels</h3>
          <p className="text-xs text-[#667085] mt-0.5">Distribution of {leads.length} recorded leads</p>
        </div>
        <div className="p-2 rounded-lg bg-blue-50 text-[#2563EB]">
          <Share2 className="w-4 h-4" />
        </div>
      </div>

      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.source} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#374151] flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${item.color}`} />
                {item.source}
              </span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#111827]">{item.count} leads</span>
                <span className="text-[#667085] w-8 text-right font-medium">{item.pct}%</span>
              </div>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                style={{ width: `${item.pct}%` }}
                className={`h-full rounded-full ${item.color} transition-all duration-300`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

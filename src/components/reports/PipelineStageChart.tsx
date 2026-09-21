import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { formatINR } from '../../data/initialData';
import { DealStage } from '../../types/crm';
import { BarChart3 } from 'lucide-react';

export const PipelineStageChart: React.FC = () => {
  const { deals } = useCRM();

  const stages: { stage: DealStage; label: string; color: string }[] = [
    { stage: 'New', label: 'New', color: '#2563EB' },
    { stage: 'Contacted', label: 'Contacted', color: '#0EA5E9' },
    { stage: 'Qualified', label: 'Qualified', color: '#6366F1' },
    { stage: 'Proposal', label: 'Proposal', color: '#F59E0B' },
    { stage: 'Won', label: 'Won', color: '#10B981' },
  ];

  const data = stages.map((s) => {
    const stageDeals = deals.filter((d) => d.stage === s.stage);
    const value = stageDeals.reduce((sum, d) => sum + d.value, 0);
    return { ...s, count: stageDeals.length, value };
  });

  const maxValue = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-[#111827] tracking-tight">Pipeline Value by Stage</h3>
          <p className="text-xs text-[#667085] mt-0.5">Commercial value in each negotiation stage</p>
        </div>
        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
          <BarChart3 className="w-4 h-4" />
        </div>
      </div>

      <div className="h-52 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-[#E5E7EB]">
        {data.map((item) => {
          const heightPct = Math.max(10, Math.round((item.value / maxValue) * 100));

          return (
            <div key={item.stage} className="flex-1 flex flex-col items-center h-full justify-end group">
              <span className="text-[10px] font-bold text-[#111827] mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {formatINR(item.value, true)}
              </span>

              <div className="w-full max-w-[48px] bg-gray-100 rounded-t-lg overflow-hidden flex items-end h-full">
                <div
                  style={{
                    height: `${heightPct}%`,
                    backgroundColor: item.color,
                  }}
                  className="w-full rounded-t-lg transition-all duration-300 group-hover:brightness-95"
                  title={`${item.label}: ${formatINR(item.value)} (${item.count} deals)`}
                />
              </div>

              <span className="text-[11px] font-semibold text-[#4B5563] mt-2 truncate max-w-full">
                {item.label}
              </span>
              <span className="text-[10px] text-[#9CA3AF]">{item.count} deals</span>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-[#667085]">
        <span>Total pipeline: {formatINR(deals.filter(d => d.stage !== 'Lost').reduce((s, d) => s + d.value, 0))}</span>
        <span className="font-semibold text-emerald-700">Updated dynamically</span>
      </div>
    </div>
  );
};

import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { formatINR } from '../../data/initialData';
import { DealStage } from '../../types/crm';
import { ArrowRight } from 'lucide-react';

interface PipelineSummaryBarProps {
  onNavigateToDeals: () => void;
}

export const PipelineSummaryBar: React.FC<PipelineSummaryBarProps> = ({ onNavigateToDeals }) => {
  const { deals } = useCRM();

  const stages: { stage: DealStage; label: string; color: string; bg: string }[] = [
    { stage: 'New', label: 'New', color: 'bg-blue-500', bg: 'bg-blue-50' },
    { stage: 'Contacted', label: 'Contacted', color: 'bg-sky-500', bg: 'bg-sky-50' },
    { stage: 'Qualified', label: 'Qualified', color: 'bg-indigo-500', bg: 'bg-indigo-50' },
    { stage: 'Proposal', label: 'Proposal', color: 'bg-amber-500', bg: 'bg-amber-50' },
    { stage: 'Won', label: 'Won', color: 'bg-emerald-500', bg: 'bg-emerald-50' },
  ];

  const totalValue = deals
    .filter((d) => d.stage !== 'Lost')
    .reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 sm:p-5 shadow-2xs w-full max-w-full min-w-0 box-border">
      <div className="flex items-center justify-between mb-3 gap-2">
        <div className="min-w-0">
          <h3 className="text-xs sm:text-sm font-bold text-[#111827] tracking-tight truncate">
            Pipeline Overview
          </h3>
          <p className="text-[11px] sm:text-xs text-[#667085] mt-0.5 truncate">
            Active stages • Total {formatINR(totalValue, true)}
          </p>
        </div>
        <button
          onClick={onNavigateToDeals}
          className="flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors shrink-0"
        >
          <span>View Pipeline</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Segmented Visual Bar */}
      <div className="w-full h-2.5 sm:h-3 bg-gray-100 rounded-full overflow-hidden flex gap-0.5 p-0.5">
        {stages.map((s) => {
          const stageDeals = deals.filter((d) => d.stage === s.stage);
          const stageVal = stageDeals.reduce((sum, d) => sum + d.value, 0);
          const pct = totalValue > 0 ? (stageVal / totalValue) * 100 : 0;
          if (pct === 0) return null;

          return (
            <div
              key={s.stage}
              style={{ width: `${pct}%` }}
              className={`h-full ${s.color} rounded-sm transition-all duration-300`}
              title={`${s.label}: ${stageDeals.length} deals (${formatINR(stageVal, true)})`}
            />
          );
        })}
      </div>

      {/* Stage KPI Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mt-3 pt-3 border-t border-[#F3F4F6] min-w-0 w-full">
        {stages.map((s) => {
          const stageDeals = deals.filter((d) => d.stage === s.stage);
          const stageVal = stageDeals.reduce((sum, d) => sum + d.value, 0);

          return (
            <div key={s.stage} className="p-2 sm:p-2.5 rounded-lg bg-[#F9FAFB] border border-[#F3F4F6] min-w-0">
              <div className="flex items-center justify-between gap-1 mb-0.5 min-w-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${s.color}`} />
                  <span className="text-[11px] font-semibold text-[#4B5563] truncate">{s.label}</span>
                </div>
                <span className="text-[10px] font-bold text-[#667085] shrink-0">
                  {stageDeals.length} {stageDeals.length === 1 ? 'deal' : 'deals'}
                </span>
              </div>
              <p className="text-xs font-bold text-[#111827] truncate font-sans">
                {formatINR(stageVal, true)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { DealStage } from '../../types/crm';
import { DealCard } from './DealCard';
import { formatINR } from '../../data/initialData';
import { Plus } from 'lucide-react';
import { SearchInput } from '../common/SearchInput';

interface PipelineBoardProps {
  onOpenAddModal: (stage?: DealStage) => void;
}

export const PipelineBoard: React.FC<PipelineBoardProps> = ({ onOpenAddModal }) => {
  const { deals, metrics } = useCRM();

  const [search, setSearch] = useState('');
  const [activeMobileStage, setActiveMobileStage] = useState<DealStage | 'ALL'>('ALL');

  const stages: { stage: DealStage; label: string; dotColor: string }[] = [
    { stage: 'New', label: 'New Lead', dotColor: 'bg-blue-500' },
    { stage: 'Contacted', label: 'Contacted', dotColor: 'bg-sky-500' },
    { stage: 'Qualified', label: 'Qualified', dotColor: 'bg-indigo-500' },
    { stage: 'Proposal', label: 'Proposal Sent', dotColor: 'bg-amber-500' },
    { stage: 'Won', label: 'Closed Won', dotColor: 'bg-emerald-500' },
    { stage: 'Lost', label: 'Closed Lost', dotColor: 'bg-rose-500' },
  ];

  const filteredDeals = deals.filter((d) => {
    const q = search.toLowerCase();
    return !q || d.title.toLowerCase().includes(q) || d.company.toLowerCase().includes(q);
  });

  const displayedStages =
    activeMobileStage === 'ALL'
      ? stages
      : stages.filter((s) => s.stage === activeMobileStage);

  return (
    <div className="space-y-4 w-full max-w-full">
      {/* Top Header Summary & Search */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 sm:p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search deals by title, company..."
            className="w-full sm:w-64"
          />

          <div className="flex items-center gap-1.5 text-xs text-[#667085] sm:pl-2 sm:border-l sm:border-[#E5E7EB]">
            <span>Active Pipeline:</span>
            <strong className="text-[#111827]">{formatINR(metrics.pipelineValue)}</strong>
          </div>
        </div>

        <button
          onClick={() => onOpenAddModal()}
          className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Deal</span>
        </button>
      </div>

      {/* Mobile Stage Selector Tabs */}
      <div className="sm:hidden flex items-center gap-1.5 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveMobileStage('ALL')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            activeMobileStage === 'ALL'
              ? 'bg-[#2563EB] text-white shadow-2xs'
              : 'bg-white border border-[#E5E7EB] text-[#4B5563]'
          }`}
        >
          All Stages ({filteredDeals.length})
        </button>
        {stages.map((st) => {
          const count = filteredDeals.filter((d) => d.stage === st.stage).length;
          return (
            <button
              key={st.stage}
              onClick={() => setActiveMobileStage(st.stage)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeMobileStage === st.stage
                  ? 'bg-[#2563EB] text-white shadow-2xs'
                  : 'bg-white border border-[#E5E7EB] text-[#4B5563]'
              }`}
            >
              {st.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Kanban Columns (Responsive Grid on Mobile / Scrollable on Desktop) */}
      <div className="grid grid-cols-1 sm:flex sm:overflow-x-auto gap-3.5 sm:gap-4 pb-4 items-start">
        {displayedStages.map((st) => {
          const columnDeals = filteredDeals.filter((d) => d.stage === st.stage);
          const columnTotal = columnDeals.reduce((sum, d) => sum + d.value, 0);

          return (
            <div
              key={st.stage}
              className="w-full sm:w-72 shrink-0 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl flex flex-col"
            >
              {/* Column Header */}
              <div className="p-3 border-b border-[#E5E7EB] bg-white rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${st.dotColor}`} />
                    <h3 className="text-xs font-bold text-[#111827]">{st.label}</h3>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-gray-100 text-[#4B5563]">
                      {columnDeals.length}
                    </span>
                  </div>

                  <button
                    onClick={() => onOpenAddModal(st.stage)}
                    className="text-[#9CA3AF] hover:text-[#111827] p-1 rounded hover:bg-gray-100"
                    title={`Add deal in ${st.label}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="mt-1 flex items-center justify-between text-[11px]">
                  <span className="text-[#667085]">Stage Total:</span>
                  <span className="font-bold text-[#111827] font-sans">
                    {formatINR(columnTotal, true)}
                  </span>
                </div>
              </div>

              {/* Cards Container */}
              <div className="p-2.5 space-y-2.5">
                {columnDeals.length === 0 ? (
                  <div className="p-5 text-center text-[11px] text-[#9CA3AF] border border-dashed border-[#E5E7EB] rounded-lg bg-white/60">
                    No deals in {st.label}
                  </div>
                ) : (
                  columnDeals.map((deal) => <DealCard key={deal.id} deal={deal} />)
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

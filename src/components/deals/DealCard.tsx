import React from 'react';
import { Deal, DealStage } from '../../types/crm';
import { PriorityBadge } from '../common/PriorityBadge';
import { formatINR } from '../../data/initialData';
import { useCRM } from '../../context/CRMContext';
import { Building, Calendar, ArrowRight, MoreHorizontal } from 'lucide-react';

interface DealCardProps {
  deal: Deal;
}

export const DealCard: React.FC<DealCardProps> = ({ deal }) => {
  const { updateDealStage, openLeadDrawer, openCustomerDrawer } = useCRM();

  const stages: DealStage[] = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];

  return (
    <div className="bg-white border border-[#E5E7EB] hover:border-blue-300 rounded-xl p-3.5 shadow-2xs hover:shadow-sm transition-all duration-150 space-y-2.5 group">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <span className="text-[11px] font-bold text-[#667085] uppercase tracking-wider block truncate">
            {deal.company}
          </span>
          <h4 className="text-xs font-bold text-[#111827] mt-0.5 leading-snug group-hover:text-[#2563EB] transition-colors">
            {deal.title}
          </h4>
        </div>
        <PriorityBadge priority={deal.priority} showIcon={false} />
      </div>

      {/* Value */}
      <div className="flex items-baseline justify-between pt-1">
        <span className="text-sm font-extrabold text-[#111827] font-sans">
          {formatINR(deal.value)}
        </span>
        <span className="text-[11px] font-semibold text-[#667085]">
          {deal.probability}% prob.
        </span>
      </div>

      {/* Probability bar */}
      <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
        <div
          style={{ width: `${deal.probability}%` }}
          className={`h-full rounded-full ${
            deal.stage === 'Won'
              ? 'bg-emerald-500'
              : deal.stage === 'Lost'
              ? 'bg-rose-500'
              : 'bg-[#2563EB]'
          }`}
        />
      </div>

      {/* Footer & Stage Shift */}
      <div className="pt-2 border-t border-[#F3F4F6] flex items-center justify-between text-xs gap-2">
        <div className="flex items-center gap-1 text-[11px] text-[#667085]">
          <Calendar className="w-3 h-3" />
          <span>{deal.expectedCloseDate}</span>
        </div>

        {/* Quick Stage Select */}
        <select
          value={deal.stage}
          onChange={(e) => updateDealStage(deal.id, e.target.value as DealStage)}
          className="text-[11px] font-semibold text-[#4B5563] bg-[#F9FAFB] hover:bg-gray-100 border border-[#E5E7EB] rounded-md px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
        >
          {stages.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

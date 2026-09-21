import React from 'react';
import { LeadStatus, CustomerStatus, DealStage } from '../../types/crm';

interface StatusBadgeProps {
  status: LeadStatus | CustomerStatus | DealStage | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  let colorClasses = 'bg-gray-100 text-[#4B5563] border-gray-200';

  switch (status) {
    case 'New':
      colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
      break;
    case 'Contacted':
      colorClasses = 'bg-sky-50 text-sky-700 border-sky-200';
      break;
    case 'Qualified':
      colorClasses = 'bg-indigo-50 text-indigo-700 border-indigo-200';
      break;
    case 'Proposal':
      colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
      break;
    case 'Converted':
    case 'Won':
    case 'Active':
    case 'Completed':
      colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      break;
    case 'VIP':
      colorClasses = 'bg-purple-50 text-purple-700 border-purple-200';
      break;
    case 'Onboarding':
      colorClasses = 'bg-cyan-50 text-cyan-700 border-cyan-200';
      break;
    case 'Lost':
    case 'Inactive':
    case 'Overdue':
      colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
      break;
    case 'Scheduled':
      colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${sizeClasses} ${colorClasses} tracking-tight select-none`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
};

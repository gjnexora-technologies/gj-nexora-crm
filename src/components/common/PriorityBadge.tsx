import React from 'react';
import { Priority } from '../../types/crm';
import { Flame, AlertCircle, ArrowUp, ArrowDown } from 'lucide-react';

interface PriorityBadgeProps {
  priority: Priority;
  showIcon?: boolean;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, showIcon = true }) => {
  let color = 'bg-gray-50 text-gray-700 border-gray-200';
  let Icon = ArrowDown;

  switch (priority) {
    case 'Urgent':
      color = 'bg-rose-50 text-rose-700 border-rose-200';
      Icon = Flame;
      break;
    case 'High':
      color = 'bg-amber-50 text-amber-800 border-amber-200';
      Icon = ArrowUp;
      break;
    case 'Medium':
      color = 'bg-blue-50 text-blue-700 border-blue-200';
      Icon = AlertCircle;
      break;
    case 'Low':
      color = 'bg-slate-50 text-slate-600 border-slate-200';
      Icon = ArrowDown;
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${color} tracking-tight select-none`}
    >
      {showIcon && <Icon className="w-3 h-3" />}
      {priority}
    </span>
  );
};

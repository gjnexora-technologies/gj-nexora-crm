import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral' | 'urgent';
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconBg = 'bg-blue-50',
  iconColor = 'text-[#2563EB]',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-[#E5E7EB] rounded-xl p-3.5 sm:p-5 shadow-2xs hover:shadow-sm hover:border-[#D1D5DB] transition-all duration-150 flex flex-col justify-between w-full min-w-0 box-border ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2 min-w-0">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] sm:text-xs font-semibold text-[#667085] uppercase tracking-wider truncate">
            {title}
          </p>
          <h3 className="text-lg sm:text-2xl font-extrabold text-[#111827] mt-1 tracking-tight font-sans truncate">
            {value}
          </h3>
        </div>
        <div className={`p-2 sm:p-2.5 rounded-lg ${iconBg} ${iconColor} shrink-0`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>

      {(subtitle || change) && (
        <div className="mt-3 pt-2.5 border-t border-[#F3F4F6] flex items-center justify-between text-[11px] gap-1 min-w-0">
          {change && (
            <span
              className={`inline-flex items-center font-semibold px-2 py-0.5 rounded text-[10px] sm:text-[11px] shrink-0 truncate max-w-full ${
                changeType === 'positive'
                  ? 'text-emerald-700 bg-emerald-50'
                  : changeType === 'negative'
                  ? 'text-rose-700 bg-rose-50'
                  : changeType === 'urgent'
                  ? 'text-amber-800 bg-amber-50 font-bold'
                  : 'text-[#667085] bg-gray-50'
              }`}
            >
              {change}
            </span>
          )}
          {subtitle && (
            <span className="text-[#667085] text-[10px] sm:text-[11px] ml-auto truncate hidden sm:inline">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

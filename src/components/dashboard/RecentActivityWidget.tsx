import React from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  UserCheck,
  CheckCircle2,
  Calendar,
  Briefcase,
  FileText,
  Users,
  Clock,
  Sparkles,
} from 'lucide-react';

export const RecentActivityWidget: React.FC = () => {
  const { activities, openLeadDrawer, openCustomerDrawer } = useCRM();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lead_created':
        return <UserCheck className="w-3.5 h-3.5 text-blue-600" />;
      case 'lead_converted':
        return <Sparkles className="w-3.5 h-3.5 text-purple-600" />;
      case 'followup_completed':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
      case 'followup_scheduled':
      case 'followup_rescheduled':
        return <Calendar className="w-3.5 h-3.5 text-amber-600" />;
      case 'deal_created':
      case 'deal_stage_changed':
        return <Briefcase className="w-3.5 h-3.5 text-indigo-600" />;
      case 'note_added':
        return <FileText className="w-3.5 h-3.5 text-cyan-600" />;
      case 'customer_created':
        return <Users className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-gray-500" />;
    }
  };

  const getActivityBg = (type: string) => {
    switch (type) {
      case 'lead_created':
        return 'bg-blue-50 border-blue-100';
      case 'lead_converted':
        return 'bg-purple-50 border-purple-100';
      case 'followup_completed':
        return 'bg-emerald-50 border-emerald-100';
      case 'followup_scheduled':
      case 'followup_rescheduled':
        return 'bg-amber-50 border-amber-100';
      case 'deal_created':
      case 'deal_stage_changed':
        return 'bg-indigo-50 border-indigo-100';
      case 'note_added':
        return 'bg-cyan-50 border-cyan-100';
      default:
        return 'bg-gray-50 border-gray-100';
    }
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between w-full max-w-full min-w-0 box-border">
      <div>
        <div className="flex items-center justify-between mb-3.5 gap-2">
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-bold text-[#111827] tracking-tight truncate">
              Recent Activity Stream
            </h3>
            <p className="text-[11px] sm:text-xs text-[#667085] mt-0.5 truncate">
              Real-time audit log of CRM actions
            </p>
          </div>
          <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        </div>

        <div className="relative pl-6 space-y-3.5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E5E7EB]">
          {activities.slice(0, 5).map((act) => (
            <div key={act.id} className="relative group min-w-0">
              {/* Node Icon */}
              <div
                className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border flex items-center justify-center bg-white ${getActivityBg(
                  act.type
                )} shadow-2xs`}
              >
                {getActivityIcon(act.type)}
              </div>

              <div className="text-xs min-w-0">
                <div className="flex items-start justify-between gap-1.5">
                  <p className="font-bold text-[#111827] leading-tight min-w-0 flex-1">
                    {act.title}
                    {act.entityName && (
                      <button
                        onClick={() => {
                          if (act.entityType === 'lead') openLeadDrawer(act.entityId);
                          if (act.entityType === 'customer') openCustomerDrawer(act.entityId);
                        }}
                        className="text-[#2563EB] hover:underline font-semibold ml-1 inline"
                      >
                        • {act.entityName}
                      </button>
                    )}
                  </p>
                  <span className="text-[10px] text-[#9CA3AF] shrink-0 font-medium">
                    {act.timestamp}
                  </span>
                </div>
                <p className="text-[#667085] mt-0.5 text-[11px] sm:text-xs leading-relaxed break-words">
                  {act.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#F3F4F6] flex items-center justify-between text-[11px] text-[#667085]">
        <span>Automatically preserved across sessions</span>
        <span className="font-medium text-[#111827]">Demo User</span>
      </div>
    </div>
  );
};

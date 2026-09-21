import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { FollowupTypeBadge } from '../common/FollowupTypeBadge';
import { CheckCircle2, Clock, Calendar, ArrowRight } from 'lucide-react';

interface TodayFollowupsWidgetProps {
  onNavigateToFollowups: () => void;
  onOpenReschedule: (id: string) => void;
}

export const TodayFollowupsWidget: React.FC<TodayFollowupsWidgetProps> = ({
  onNavigateToFollowups,
  onOpenReschedule,
}) => {
  const { followUps, completeFollowUp, openLeadDrawer, openCustomerDrawer } = useCRM();
  const todayStr = new Date().toISOString().split('T')[0];

  const todayItems = followUps.filter((f) => f.date === todayStr && f.status === 'Scheduled');

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between w-full max-w-full">
      <div>
        <div className="flex items-center justify-between mb-3.5 gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-xs sm:text-sm font-bold text-[#111827] tracking-tight truncate">
              Today's Follow-ups
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-blue-50 text-[#2563EB] border border-blue-200/60 shrink-0">
              {todayItems.length} Due
            </span>
          </div>
          <button
            onClick={onNavigateToFollowups}
            className="flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors shrink-0"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {todayItems.length === 0 ? (
          <div className="p-6 text-center bg-[#F9FAFB] rounded-lg border border-dashed border-[#E5E7EB]">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1.5" />
            <p className="text-xs font-semibold text-[#111827]">All clear for today!</p>
            <p className="text-[11px] text-[#667085] mt-0.5">No remaining follow-ups due today.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {todayItems.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg border border-[#E5E7EB] hover:border-blue-200 hover:bg-blue-50/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group min-w-0"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => {
                        if (item.relatedEntityType === 'lead') openLeadDrawer(item.relatedEntityId);
                        if (item.relatedEntityType === 'customer') openCustomerDrawer(item.relatedEntityId);
                      }}
                      className="text-xs font-bold text-[#111827] hover:text-[#2563EB] text-left transition-colors truncate"
                    >
                      {item.company}
                    </button>
                    <span className="text-[11px] text-[#667085] truncate">• {item.contactName}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-1.5 text-xs text-[#667085] flex-wrap">
                    <div className="flex items-center gap-1 font-semibold text-[#111827]">
                      <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span className="text-[11px]">{item.time}</span>
                    </div>
                    <FollowupTypeBadge type={item.type} size="sm" />
                    {item.notes && (
                      <span className="text-[11px] text-[#667085] truncate max-w-xs hidden md:inline">
                        "{item.notes}"
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F3F4F6] w-full sm:w-auto justify-end">
                  <button
                    onClick={() => onOpenReschedule(item.id)}
                    className="px-2.5 py-1 text-xs font-medium text-[#4B5563] bg-white border border-[#D1D5DB] rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => completeFollowUp(item.id)}
                    className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-2xs transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Done</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-[#F3F4F6] flex items-center justify-between text-[11px] text-[#667085]">
        <span>Automated client routing</span>
        <button
          onClick={onNavigateToFollowups}
          className="text-[#2563EB] hover:underline font-medium"
        >
          Manage Agenda
        </button>
      </div>
    </div>
  );
};

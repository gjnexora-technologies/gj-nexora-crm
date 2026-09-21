import React, { useState, useMemo } from 'react';
import { useCRM } from '../../context/CRMContext';
import { FollowUp, FollowupType } from '../../types/crm';
import { FollowupTypeBadge } from '../common/FollowupTypeBadge';
import { StatusBadge } from '../common/StatusBadge';
import { EmptyState } from '../common/EmptyState';
import {
  Calendar,
  Clock,
  CheckCircle2,
  RotateCcw,
  Plus,
  Building,
  UserCheck,
  Phone,
  Mail,
  AlertTriangle,
} from 'lucide-react';

interface FollowupListProps {
  onOpenScheduleModal: () => void;
  onOpenRescheduleModal: (id: string) => void;
}

export const FollowupList: React.FC<FollowupListProps> = ({
  onOpenScheduleModal,
  onOpenRescheduleModal,
}) => {
  const { followUps, completeFollowUp, openLeadDrawer, openCustomerDrawer } = useCRM();

  const [activeTab, setActiveTab] = useState<'today' | 'overdue' | 'upcoming' | 'completed'>('today');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const todayStr = new Date().toISOString().split('T')[0];

  const categorized = useMemo(() => {
    const list = followUps.filter(
      (f) => typeFilter === 'ALL' || f.type === typeFilter
    );

    const today = list.filter((f) => f.date === todayStr && f.status === 'Scheduled');
    const overdue = list.filter(
      (f) => f.status === 'Overdue' || (f.date < todayStr && f.status === 'Scheduled')
    );
    const upcoming = list.filter((f) => f.date > todayStr && f.status === 'Scheduled');
    const completed = list.filter((f) => f.status === 'Completed');

    return { today, overdue, upcoming, completed };
  }, [followUps, typeFilter, todayStr]);

  const currentList = categorized[activeTab];

  return (
    <div className="space-y-4">
      {/* Category Tabs & Channel Filter */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-3 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Main Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'today'
                ? 'bg-[#2563EB] text-white shadow-2xs'
                : 'text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827]'
            }`}
          >
            <span>Today's</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === 'today' ? 'bg-white/20 text-white' : 'bg-gray-100 text-[#667085]'
              }`}
            >
              {categorized.today.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('overdue')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'overdue'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827]'
            }`}
          >
            <span>Overdue</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === 'overdue'
                  ? 'bg-white/20 text-white'
                  : categorized.overdue.length > 0
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-gray-100 text-[#667085]'
              }`}
            >
              {categorized.overdue.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'upcoming'
                ? 'bg-[#2563EB] text-white shadow-2xs'
                : 'text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827]'
            }`}
          >
            <span>Upcoming</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === 'upcoming' ? 'bg-white/20 text-white' : 'bg-gray-100 text-[#667085]'
              }`}
            >
              {categorized.upcoming.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'completed'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827]'
            }`}
          >
            <span>Completed</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === 'completed' ? 'bg-white/20 text-white' : 'bg-gray-100 text-[#667085]'
              }`}
            >
              {categorized.completed.length}
            </span>
          </button>
        </div>

        {/* Right Filter & Action */}
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-[#F9FAFB] border border-[#D1D5DB] rounded-lg text-[#4B5563] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
          >
            <option value="ALL">All Channels</option>
            <option value="Call">Calls</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Meeting">Meetings</option>
            <option value="Email">Emails</option>
          </select>

          <button
            onClick={onOpenScheduleModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Touch</span>
          </button>
        </div>
      </div>

      {/* Follow-up Items */}
      {currentList.length === 0 ? (
        <EmptyState
          title={
            activeTab === 'today'
              ? 'No follow-ups due today'
              : activeTab === 'overdue'
              ? 'Zero overdue tasks'
              : activeTab === 'upcoming'
              ? 'No upcoming scheduled touchpoints'
              : 'No completed follow-ups yet'
          }
          description="Schedule a new client call, meeting, or message to keep active relationships progressing."
          icon={Calendar}
          actionLabel="Schedule Follow-up"
          onAction={onOpenScheduleModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {currentList.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#E5E7EB] hover:border-blue-200 rounded-xl p-4 shadow-2xs flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <button
                      onClick={() => {
                        if (item.relatedEntityType === 'lead') openLeadDrawer(item.relatedEntityId);
                        if (item.relatedEntityType === 'customer') openCustomerDrawer(item.relatedEntityId);
                      }}
                      className="font-bold text-sm text-[#111827] hover:text-[#2563EB] text-left transition-colors truncate block"
                    >
                      {item.company}
                    </button>
                    <p className="text-xs text-[#667085] mt-0.5">
                      {item.contactName} • {item.contactPhone}
                    </p>
                  </div>
                  <FollowupTypeBadge type={item.type} size="sm" />
                </div>

                <div className="mt-2.5 p-2.5 bg-[#F9FAFB] rounded-lg border border-[#F3F4F6] text-xs">
                  <p className="font-semibold text-[#111827]">{item.title}</p>
                  {item.notes && (
                    <p className="text-[#667085] mt-1 text-[11px] leading-relaxed">
                      "{item.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Footer with Schedule & Actions */}
              <div className="mt-4 pt-3 border-t border-[#F3F4F6] flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-[#4B5563]">
                  <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span className="font-medium text-[#111827]">{item.date}</span>
                  <span>at</span>
                  <span className="font-medium text-[#111827]">{item.time}</span>
                </div>

                <div className="flex items-center gap-2">
                  {item.status !== 'Completed' && (
                    <>
                      <button
                        onClick={() => onOpenRescheduleModal(item.id)}
                        className="px-2.5 py-1 text-xs font-medium text-[#4B5563] bg-white border border-[#D1D5DB] rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={() => completeFollowUp(item.id)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-2xs transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Done</span>
                      </button>
                    </>
                  )}
                  {item.status === 'Completed' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> Completed
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

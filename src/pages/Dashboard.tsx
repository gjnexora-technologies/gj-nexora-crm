import React, { useState, useEffect } from 'react';
import { useCRM } from '../context/CRMContext';
import { StatCard } from '../components/common/StatCard';
import { PipelineSummaryBar } from '../components/dashboard/PipelineSummaryBar';
import { TodayFollowupsWidget } from '../components/dashboard/TodayFollowupsWidget';
import { RecentActivityWidget } from '../components/dashboard/RecentActivityWidget';
import { RevenueOverviewWidget } from '../components/dashboard/RevenueOverviewWidget';
import { DemoGuideBanner } from '../components/layout/DemoGuideBanner';
import { formatINR } from '../data/initialData';
import { UserCheck, Users, CalendarCheck, Briefcase, Plus } from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: string) => void;
  onOpenAddLeadModal: () => void;
  onOpenRescheduleModal: (id: string) => void;
}

export const getGreeting = (date: Date = new Date()): string => {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
};

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  onOpenAddLeadModal,
  onOpenRescheduleModal,
}) => {
  const { metrics } = useCRM();
  const [currentDate, setCurrentDate] = useState(() => new Date());

  // Periodically refresh current time to update greeting across time boundaries
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // 1 minute interval

    return () => clearInterval(timer);
  }, []);

  const greeting = getGreeting(currentDate);

  const dateFormatted = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(currentDate);

  return (
    <div className="space-y-5 pb-12 w-full max-w-full min-w-0">
      {/* 1. Interactive Tour Guide Banner */}
      <DemoGuideBanner onNavigate={onNavigate} />

      {/* 2. Greeting Header Card */}
      <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-xl border border-[#E5E7EB] shadow-2xs w-full max-w-full min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
                {greeting}, Demo User
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Demo Mode Active
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-[#667085] mt-1.5 leading-relaxed">
              {dateFormatted} • Here's what's happening with your business today.
            </p>
          </div>

          {/* Primary Action Button */}
          <div className="flex items-center gap-2.5 shrink-0 pt-1 sm:pt-0">
            <button
              onClick={onOpenAddLeadModal}
              className="flex items-center justify-center gap-1.5 px-4 py-2 sm:py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-xs font-semibold shadow-2xs hover:shadow-xs transition-all w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Lead</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. 4 Dynamic KPI Cards (4-column on desktop, 2-column on mobile) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full min-w-0">
        <StatCard
          title="Total Leads"
          value={metrics.totalLeads}
          subtitle="Pipeline Inquiries"
          change="+3 this week"
          changeType="positive"
          icon={UserCheck}
          iconBg="bg-blue-50"
          iconColor="text-[#2563EB]"
          onClick={() => onNavigate('leads')}
        />

        <StatCard
          title="Customers"
          value={metrics.totalCustomers}
          subtitle="Active Accounts"
          change="+1 this week"
          changeType="positive"
          icon={Users}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-700"
          onClick={() => onNavigate('customers')}
        />

        <StatCard
          title="Follow-ups Due"
          value={metrics.followupsDueCount}
          subtitle={`${metrics.todayFollowupsCount} today, ${metrics.overdueFollowupsCount} overdue`}
          change={metrics.overdueFollowupsCount > 0 ? `${metrics.overdueFollowupsCount} Overdue` : 'On schedule'}
          changeType={metrics.overdueFollowupsCount > 0 ? 'urgent' : 'positive'}
          icon={CalendarCheck}
          iconBg="bg-amber-50"
          iconColor="text-amber-800"
          onClick={() => onNavigate('followups')}
        />

        <StatCard
          title="Pipeline Value"
          value={formatINR(metrics.pipelineValue, true)}
          subtitle="Active Opportunities"
          change="+₹1.2L this week"
          changeType="positive"
          icon={Briefcase}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-700"
          onClick={() => onNavigate('deals')}
        />
      </div>

      {/* 4. Pipeline Summary Bar */}
      <PipelineSummaryBar onNavigateToDeals={() => onNavigate('deals')} />

      {/* 5. 2-Column Work Center: Today's Follow-ups & Recent Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 w-full min-w-0">
        <TodayFollowupsWidget
          onNavigateToFollowups={() => onNavigate('followups')}
          onOpenReschedule={onOpenRescheduleModal}
        />
        <RecentActivityWidget />
      </div>

      {/* 6. Revenue & Growth Overview */}
      <RevenueOverviewWidget />
    </div>
  );
};

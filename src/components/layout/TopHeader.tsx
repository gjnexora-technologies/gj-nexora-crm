import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Plus,
  Bell,
  UserCheck,
  Users,
  CalendarPlus,
  Briefcase,
  ChevronDown,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { BrandLogo } from './BrandLogo';

interface TopHeaderProps {
  currentPage: string;
  onOpenMobileMenu: () => void;
  onOpenGlobalSearch: () => void;
  onOpenAddLeadModal: () => void;
  onOpenAddCustomerModal: () => void;
  onOpenScheduleFollowupModal: () => void;
  onOpenAddDealModal: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentPage,
  onOpenMobileMenu,
  onOpenGlobalSearch,
  onOpenAddLeadModal,
  onOpenAddCustomerModal,
  onOpenScheduleFollowupModal,
  onOpenAddDealModal,
}) => {
  const { activities } = useCRM();
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const quickActionRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (quickActionRef.current && !quickActionRef.current.contains(event.target as Node)) {
        setIsQuickActionOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageMeta = (page: string) => {
    switch (page) {
      case 'dashboard':
        return { title: 'Executive Dashboard', subtitle: "Here's what's happening with your business today." };
      case 'leads':
        return { title: 'Leads Pipeline', subtitle: 'Capture, qualify, and convert potential B2B relationships.' };
      case 'customers':
        return { title: 'Customer Directory', subtitle: 'Manage lifetime customer relationships and accounts.' };
      case 'followups':
        return { title: 'Follow-ups Work Queue', subtitle: 'Stay on top of scheduled calls, meetings, and WhatsApp touches.' };
      case 'deals':
        return { title: 'Sales Deals & Pipeline', subtitle: 'Visual Kanban pipeline tracking contract values and stages.' };
      case 'reports':
        return { title: 'Business Analytics & Reports', subtitle: 'Dynamic visual conversion metrics and revenue summaries.' };
      case 'settings':
        return { title: 'Settings & Demo Controls', subtitle: 'Demo dataset controls and system preferences.' };
      default:
        return { title: 'GJ Nexora CRM', subtitle: 'Executive business software demonstration' };
    }
  };

  const meta = getPageMeta(currentPage);

  return (
    <header className="h-14 sm:h-16 bg-white border-b border-[#E5E7EB] px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 w-full max-w-full box-border">
      {/* Left: Mobile Hamburger & Brand Mark / Desktop Page Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden text-[#4B5563] hover:text-[#111827] p-1.5 -ml-1 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Brand Mark */}
        <div className="lg:hidden flex items-center min-w-0">
          <BrandLogo variant="mobile" />
        </div>

        {/* Desktop Page Title */}
        <div className="hidden lg:block min-w-0">
          <h1 className="text-base font-bold text-[#111827] tracking-tight leading-none truncate">
            {meta.title}
          </h1>
          <p className="text-xs text-[#667085] mt-1 font-normal truncate">
            {meta.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Controls & Actions */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Global Search Button */}
        <button
          onClick={onOpenGlobalSearch}
          className="p-1.5 sm:px-3 sm:py-1.5 bg-[#F9FAFB] hover:bg-[#F3F4F6] text-[#667085] border border-[#E5E7EB] rounded-lg text-xs font-medium transition-colors group flex items-center gap-1.5"
          title="Search CRM"
          aria-label="Search CRM"
        >
          <Search className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#111827]" />
          <span className="hidden md:inline">Quick search...</span>
          <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono text-[#9CA3AF] bg-white border border-[#E5E7EB] rounded shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {/* Quick Action Dropdown - Desktop / Tablet only */}
        <div className="relative hidden sm:block" ref={quickActionRef}>
          <button
            onClick={() => setIsQuickActionOpen(!isQuickActionOpen)}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-80" />
          </button>

          {isQuickActionOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E5E7EB] rounded-xl shadow-xl py-1.5 z-50 animate-modal-in">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                Quick Create
              </div>
              <button
                onClick={() => {
                  setIsQuickActionOpen(false);
                  onOpenAddLeadModal();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#4B5563] hover:bg-blue-50 hover:text-[#2563EB] transition-colors text-left"
              >
                <UserCheck className="w-4 h-4 text-[#2563EB]" />
                <span>Add Lead</span>
              </button>
              <button
                onClick={() => {
                  setIsQuickActionOpen(false);
                  onOpenScheduleFollowupModal();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#4B5563] hover:bg-blue-50 hover:text-[#2563EB] transition-colors text-left"
              >
                <CalendarPlus className="w-4 h-4 text-amber-600" />
                <span>Schedule Follow-up</span>
              </button>
              <button
                onClick={() => {
                  setIsQuickActionOpen(false);
                  onOpenAddDealModal();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#4B5563] hover:bg-blue-50 hover:text-[#2563EB] transition-colors text-left"
              >
                <Briefcase className="w-4 h-4 text-purple-600" />
                <span>Create Deal</span>
              </button>
              <button
                onClick={() => {
                  setIsQuickActionOpen(false);
                  onOpenAddCustomerModal();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#4B5563] hover:bg-blue-50 hover:text-[#2563EB] transition-colors text-left"
              >
                <Users className="w-4 h-4 text-emerald-600" />
                <span>Add Customer</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-1.5 sm:p-2 text-[#667085] hover:text-[#111827] hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-2 h-2 rounded-full bg-[#2563EB]" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-[#E5E7EB] rounded-xl shadow-xl p-3 z-50 animate-modal-in">
              <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
                <h4 className="text-xs font-bold text-[#111827]">Recent Activity Alerts</h4>
                <span className="text-[10px] text-[#2563EB] font-semibold">Live Feed</span>
              </div>
              <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                {activities.slice(0, 5).map((act) => (
                  <div
                    key={act.id}
                    className="p-2 rounded-lg bg-[#F9FAFB] hover:bg-blue-50/50 transition-colors text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-[#111827]">{act.title}</p>
                      <span className="text-[10px] text-[#9CA3AF]">{act.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-[#667085] mt-0.5 line-clamp-2 leading-tight">
                      {act.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Badge - Desktop / Tablet */}
        <div className="hidden sm:flex items-center gap-1.5 pl-1.5 sm:pl-2 border-l border-[#E5E7EB]">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
            DU
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-[#111827] leading-none">Demo User</p>
            <p className="text-[10px] text-[#667085] mt-0.5">Sales Lead</p>
          </div>
        </div>
      </div>
    </header>
  );
};

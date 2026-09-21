import React from 'react';
import {
  LayoutDashboard,
  UserCheck,
  Users,
  CalendarCheck,
  Briefcase,
  BarChart3,
  Settings,
  RotateCcw,
  X,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { BrandLogo } from './BrandLogo';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenResetDialog: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isMobileOpen,
  onCloseMobile,
  onOpenResetDialog,
}) => {
  const { metrics } = useCRM();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads', icon: UserCheck, count: metrics.totalLeads },
    { id: 'customers', label: 'Customers', icon: Users, count: metrics.totalCustomers },
    {
      id: 'followups',
      label: 'Follow-ups',
      icon: CalendarCheck,
      count: metrics.followupsDueCount,
      badgeColor: metrics.followupsDueCount > 0 ? 'bg-amber-100 text-amber-800' : undefined,
    },
    { id: 'deals', label: 'Deals', icon: Briefcase },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#111827]/40 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-[#E5E7EB] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header with official GJ CRM Logo (centered, ~20px vertical padding) */}
        <div className="relative py-5 px-4 flex items-center justify-center border-b border-[#E5E7EB] bg-white">
          <BrandLogo variant="desktop" />

          <button
            onClick={onCloseMobile}
            className="lg:hidden text-[#667085] hover:text-[#111827] p-1 rounded-lg hover:bg-gray-100 absolute right-3 top-4"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Navigation */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
            Overview & Sales
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-2xs shadow-blue-600/30'
                    : 'text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-white' : 'text-[#667085] group-hover:text-[#111827]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.count !== undefined && (
                  <span
                    className={`text-[11px] font-medium px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badgeColor || 'bg-gray-100 text-[#667085]'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 pb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
            System
          </div>

          <button
            onClick={() => handleNavClick('settings')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all group ${
              currentPage === 'settings'
                ? 'bg-[#2563EB] text-white shadow-2xs'
                : 'text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827]'
            }`}
          >
            <Settings
              className={`w-4 h-4 ${
                currentPage === 'settings'
                  ? 'text-white'
                  : 'text-[#667085] group-hover:text-[#111827]'
              }`}
            />
            <span>Settings & Controls</span>
          </button>
        </div>

        {/* Demo Mode Card Footer */}
        <div className="p-3 border-t border-[#E5E7EB] bg-[#F9FAFB]">
          <div className="p-3 bg-white rounded-lg border border-[#E5E7EB] shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold text-[#111827] uppercase tracking-wide">
                  DEMO MODE
                </span>
              </div>
              <span className="text-[10px] font-medium text-[#667085]">v1.0</span>
            </div>
            <p className="text-[11px] text-[#667085] mt-1 line-clamp-2 leading-tight">
              GJ Nexora client interactive showcase.
            </p>

            <button
              onClick={onOpenResetDialog}
              className="mt-2.5 w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-gray-50 hover:bg-gray-100 text-[#4B5563] hover:text-[#111827] border border-[#E5E7EB] rounded-md text-[11px] font-medium transition-colors"
            >
              <RotateCcw className="w-3 h-3 text-[#667085]" />
              <span>Reset Demo Data</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

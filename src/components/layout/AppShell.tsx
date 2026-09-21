import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { DemoWatermark } from './DemoWatermark';
import { GlobalSearchModal } from '../common/GlobalSearchModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { AddLeadModal } from '../leads/AddLeadModal';
import { LeadDetailDrawer } from '../leads/LeadDetailDrawer';
import { AddCustomerModal } from '../customers/AddCustomerModal';
import { Customer360Drawer } from '../customers/Customer360Drawer';
import { ScheduleFollowupModal } from '../followups/ScheduleFollowupModal';
import { RescheduleFollowupModal } from '../followups/RescheduleFollowupModal';
import { AddDealModal } from '../deals/AddDealModal';
import { Dashboard } from '../../pages/Dashboard';
import { Leads } from '../../pages/Leads';
import { Customers } from '../../pages/Customers';
import { Followups } from '../../pages/Followups';
import { Deals } from '../../pages/Deals';
import { Reports } from '../../pages/Reports';
import { Settings } from '../../pages/Settings';
import { useCRM } from '../../context/CRMContext';
import { DealStage } from '../../types/crm';

export const AppShell: React.FC = () => {
  const {
    activeDrawer,
    openLeadDrawer,
    openCustomerDrawer,
    closeDrawer,
    resetDemoData,
  } = useCRM();

  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Global Modal States
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isScheduleFollowupOpen, setIsScheduleFollowupOpen] = useState(false);
  const [followupPrefillEntity, setFollowupPrefillEntity] = useState<{
    id: string | null;
    type: 'lead' | 'customer';
  }>({ id: null, type: 'lead' });
  const [rescheduleFollowupId, setRescheduleFollowupId] = useState<string | null>(null);
  const [isAddDealOpen, setIsAddDealOpen] = useState(false);
  const [addDealDefaultStage, setAddDealDefaultStage] = useState<DealStage>('New');

  // Global Cmd+K / Ctrl+K search shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenScheduleFollowup = (entityId?: string, entityType: 'lead' | 'customer' = 'lead') => {
    setFollowupPrefillEntity({ id: entityId || null, type: entityType });
    setIsScheduleFollowupOpen(true);
  };

  const handleOpenReschedule = (id: string) => {
    setRescheduleFollowupId(id);
  };

  const handleOpenAddDeal = (stage?: DealStage) => {
    if (stage) setAddDealDefaultStage(stage);
    setIsAddDealOpen(true);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            onNavigate={setCurrentPage}
            onOpenAddLeadModal={() => setIsAddLeadOpen(true)}
            onOpenRescheduleModal={handleOpenReschedule}
          />
        );
      case 'leads':
        return (
          <Leads
            onOpenAddModal={() => setIsAddLeadOpen(true)}
            onOpenLeadDrawer={openLeadDrawer}
            onOpenScheduleFollowup={(leadId) => handleOpenScheduleFollowup(leadId, 'lead')}
          />
        );
      case 'customers':
        return (
          <Customers
            onOpenAddModal={() => setIsAddCustomerOpen(true)}
            onOpenCustomerDrawer={openCustomerDrawer}
          />
        );
      case 'followups':
        return (
          <Followups
            onOpenScheduleModal={() => handleOpenScheduleFollowup()}
            onOpenRescheduleModal={handleOpenReschedule}
          />
        );
      case 'deals':
        return <Deals onOpenAddModal={handleOpenAddDeal} />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings onOpenResetDialog={() => setIsResetConfirmOpen(true)} />;
      default:
        return (
          <Dashboard
            onNavigate={setCurrentPage}
            onOpenAddLeadModal={() => setIsAddLeadOpen(true)}
            onOpenRescheduleModal={handleOpenReschedule}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex w-full">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenResetDialog={() => setIsResetConfirmOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 w-full lg:pl-64">
        {/* Top Header */}
        <TopHeader
          currentPage={currentPage}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          onOpenGlobalSearch={() => setIsGlobalSearchOpen(true)}
          onOpenAddLeadModal={() => setIsAddLeadOpen(true)}
          onOpenAddCustomerModal={() => setIsAddCustomerOpen(true)}
          onOpenScheduleFollowupModal={() => handleOpenScheduleFollowup()}
          onOpenAddDealModal={() => handleOpenAddDeal()}
        />

        {/* Page Content View */}
        <main className="flex-1 p-3.5 sm:p-5 lg:p-8 max-w-7xl w-full mx-auto min-w-0 animate-fade-in">
          {renderPage()}
        </main>
      </div>

      {/* Persistent Single Mounted Demo Watermark */}
      <DemoWatermark />

      {/* Global Modals */}
      <GlobalSearchModal
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
        onNavigate={setCurrentPage}
      />

      <AddLeadModal
        isOpen={isAddLeadOpen}
        onClose={() => setIsAddLeadOpen(false)}
      />

      <AddCustomerModal
        isOpen={isAddCustomerOpen}
        onClose={() => setIsAddCustomerOpen(false)}
      />

      <ScheduleFollowupModal
        isOpen={isScheduleFollowupOpen}
        onClose={() => setIsScheduleFollowupOpen(false)}
        prefillEntityId={followupPrefillEntity.id}
        prefillEntityType={followupPrefillEntity.type}
      />

      <RescheduleFollowupModal
        isOpen={!!rescheduleFollowupId}
        onClose={() => setRescheduleFollowupId(null)}
        followupId={rescheduleFollowupId}
      />

      <AddDealModal
        isOpen={isAddDealOpen}
        onClose={() => setIsAddDealOpen(false)}
        defaultStage={addDealDefaultStage}
      />

      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={resetDemoData}
        title="Reset Demo Dataset"
        confirmLabel="Reset All Demo Data"
        variant="danger"
        description="Are you sure you want to restore the default presentation state? This will clear locally modified records and return to the pristine initial demonstration dataset."
      />

      {/* Global Slide-over Drawers */}
      <LeadDetailDrawer
        isOpen={activeDrawer.type === 'lead'}
        onClose={closeDrawer}
        leadId={activeDrawer.id}
        onOpenScheduleFollowup={(leadId) => handleOpenScheduleFollowup(leadId, 'lead')}
      />

      <Customer360Drawer
        isOpen={activeDrawer.type === 'customer'}
        onClose={closeDrawer}
        customerId={activeDrawer.id}
        onOpenScheduleFollowup={(custId) => handleOpenScheduleFollowup(custId, 'customer')}
      />
    </div>
  );
};

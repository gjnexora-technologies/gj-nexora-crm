import React from 'react';
import { LeadsTable } from '../components/leads/LeadsTable';

interface LeadsProps {
  onOpenAddModal: () => void;
  onOpenLeadDrawer: (id: string) => void;
  onOpenScheduleFollowup?: (leadId: string) => void;
}

export const Leads: React.FC<LeadsProps> = ({
  onOpenAddModal,
  onOpenLeadDrawer,
  onOpenScheduleFollowup,
}) => {
  return (
    <div className="space-y-6 pb-12">
      <LeadsTable
        onOpenAddModal={onOpenAddModal}
        onOpenLeadDrawer={onOpenLeadDrawer}
        onOpenScheduleFollowup={onOpenScheduleFollowup}
      />
    </div>
  );
};

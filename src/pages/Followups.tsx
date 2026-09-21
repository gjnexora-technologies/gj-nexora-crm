import React from 'react';
import { FollowupList } from '../components/followups/FollowupList';

interface FollowupsProps {
  onOpenScheduleModal: () => void;
  onOpenRescheduleModal: (id: string) => void;
}

export const Followups: React.FC<FollowupsProps> = ({
  onOpenScheduleModal,
  onOpenRescheduleModal,
}) => {
  return (
    <div className="space-y-6 pb-12">
      <FollowupList
        onOpenScheduleModal={onOpenScheduleModal}
        onOpenRescheduleModal={onOpenRescheduleModal}
      />
    </div>
  );
};

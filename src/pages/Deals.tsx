import React from 'react';
import { PipelineBoard } from '../components/deals/PipelineBoard';
import { DealStage } from '../types/crm';

interface DealsProps {
  onOpenAddModal: (stage?: DealStage) => void;
}

export const Deals: React.FC<DealsProps> = ({ onOpenAddModal }) => {
  return (
    <div className="space-y-6 pb-12">
      <PipelineBoard onOpenAddModal={onOpenAddModal} />
    </div>
  );
};

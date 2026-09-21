import React from 'react';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { Lead } from '../../types/crm';
import { useCRM } from '../../context/CRMContext';
import { formatINR } from '../../data/initialData';
import { Sparkles, Building, UserCheck, CheckCircle2 } from 'lucide-react';

interface ConvertLeadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onConverted?: (customerId: string) => void;
}

export const ConvertLeadDialog: React.FC<ConvertLeadDialogProps> = ({
  isOpen,
  onClose,
  lead,
  onConverted,
}) => {
  const { convertLeadToCustomer, openCustomerDrawer } = useCRM();

  if (!lead) return null;

  const handleConfirm = () => {
    const newCustomer = convertLeadToCustomer(lead.id);
    if (newCustomer) {
      if (onConverted) onConverted(newCustomer.id);
      openCustomerDrawer(newCustomer.id);
    }
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Convert Lead to Customer"
      confirmLabel="Convert to Customer"
      variant="success"
      description={
        <div className="space-y-3">
          <p className="text-xs text-[#4B5563]">
            You are about to promote <strong className="text-[#111827]">{lead.company}</strong> from a prospective lead into an active Customer account.
          </p>

          <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200/80 text-xs space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-emerald-900">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>What happens upon conversion:</span>
            </div>
            <ul className="text-[11px] text-emerald-800 space-y-1 list-disc list-inside">
              <li>Creates a new Customer 360 profile with {formatINR(lead.value)} starting LTV</li>
              <li>Preserves all historical notes, audit timeline & contact history</li>
              <li>Marks this lead as <span className="font-semibold">Converted</span> in your pipeline</li>
              <li>Generates an initial Qualified deal in the Deals pipeline</li>
            </ul>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#667085] px-1">
            <span>Primary Contact: {lead.name}</span>
            <span>Est. Value: {formatINR(lead.value)}</span>
          </div>
        </div>
      }
    />
  );
};

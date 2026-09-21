import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary' | 'success';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary',
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return <AlertTriangle className="w-6 h-6 text-rose-600" />;
      case 'success':
        return <CheckCircle2 className="w-6 h-6 text-emerald-600" />;
      default:
        return <Info className="w-6 h-6 text-[#2563EB]" />;
    }
  };

  const getButtonClasses = () => {
    switch (variant) {
      case 'danger':
        return 'bg-rose-600 hover:bg-rose-700 text-white shadow-2xs';
      case 'success':
        return 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs';
      default:
        return 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-2xs';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="md">
      <div className="flex items-start gap-4">
        <div className="shrink-0 p-2 rounded-full bg-[#F3F4F6]">{getIcon()}</div>
        <div className="flex-1">
          <div className="text-sm text-[#4B5563] leading-relaxed">{description}</div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#E5E7EB]">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-xs font-medium text-[#4B5563] bg-white border border-[#D1D5DB] rounded-lg hover:bg-[#F9FAFB] transition-colors"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${getButtonClasses()}`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
};

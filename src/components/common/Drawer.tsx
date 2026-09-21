import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: 'md' | 'lg' | 'xl' | '2xl';
  headerActions?: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  width = 'xl',
  headerActions,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
  }[width];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#111827]/40 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex w-full sm:w-auto">
        <div
          className={`w-full ${widthClasses} bg-white shadow-2xl border-l border-[#E5E7EB] flex flex-col animate-drawer-in max-h-screen`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="drawer-title"
        >
          {/* Header */}
          <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-between gap-3 shrink-0">
            <div className="min-w-0 flex-1">
              <h2 id="drawer-title" className="text-sm sm:text-base font-bold text-[#111827] truncate tracking-tight">
                {title}
              </h2>
              {subtitle && <p className="text-[11px] sm:text-xs text-[#667085] truncate mt-0.5">{subtitle}</p>}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {headerActions}
              <button
                onClick={onClose}
                className="text-[#9CA3AF] hover:text-[#111827] p-1.5 rounded-lg hover:bg-black/5 transition-colors"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
};

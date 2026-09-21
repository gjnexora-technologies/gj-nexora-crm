import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastMessage } from '../types/crm';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (type: ToastMessage['type'], title: string, description?: string) => void;
  removeToast: (id: string) => void;
  toast: {
    success: (title: string, description?: string) => void;
    info: (title: string, description?: string) => void;
    warning: (title: string, description?: string) => void;
    error: (title: string, description?: string) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((type: ToastMessage['type'], title: string, description?: string) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    const newToast: ToastMessage = { id, type, title, description, duration: 3500 };
    setToasts((prev) => [...prev.slice(-3), newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 3500);
  }, [removeToast]);

  const toast = {
    success: (title: string, description?: string) => showToast('success', title, description),
    info: (title: string, description?: string) => showToast('info', title, description),
    warning: (title: string, description?: string) => showToast('warning', title, description),
    error: (title: string, description?: string) => showToast('error', title, description),
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast, toast }}>
      {children}
      {/* Floating Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => {
          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg shadow-lg border text-sm animate-modal-in transition-all duration-200 ${
                t.type === 'success'
                  ? 'bg-white border-emerald-200 text-[#111827]'
                  : t.type === 'error'
                  ? 'bg-white border-rose-200 text-[#111827]'
                  : t.type === 'warning'
                  ? 'bg-white border-amber-200 text-[#111827]'
                  : 'bg-white border-blue-200 text-[#111827]'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                {t.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600" />}
                {t.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                {t.type === 'info' && <Info className="w-5 h-5 text-blue-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-xs tracking-tight text-[#111827]">{t.title}</p>
                {t.description && (
                  <p className="text-xs text-[#667085] mt-0.5 leading-relaxed">{t.description}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-[#9CA3AF] hover:text-[#111827] transition-colors p-0.5 rounded"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

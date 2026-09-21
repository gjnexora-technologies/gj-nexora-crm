import React, { useState, useEffect } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Search, UserCheck, Briefcase, Users, X, ArrowRight } from 'lucide-react';
import { formatINR } from '../../data/initialData';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { leads, customers, deals, openLeadDrawer, openCustomerDrawer } = useCRM();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // toggle if handled by parent
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  const filteredLeads = cleanQuery
    ? leads.filter(
        (l) =>
          l.name.toLowerCase().includes(cleanQuery) ||
          l.company.toLowerCase().includes(cleanQuery) ||
          l.email.toLowerCase().includes(cleanQuery)
      ).slice(0, 4)
    : leads.slice(0, 3);

  const filteredCustomers = cleanQuery
    ? customers.filter(
        (c) =>
          c.name.toLowerCase().includes(cleanQuery) ||
          c.company.toLowerCase().includes(cleanQuery) ||
          c.industry.toLowerCase().includes(cleanQuery)
      ).slice(0, 4)
    : customers.slice(0, 3);

  const filteredDeals = cleanQuery
    ? deals.filter(
        (d) =>
          d.title.toLowerCase().includes(cleanQuery) ||
          d.company.toLowerCase().includes(cleanQuery)
      ).slice(0, 4)
    : deals.slice(0, 3);

  const handleSelectLead = (id: string) => {
    onClose();
    openLeadDrawer(id);
    onNavigate('leads');
  };

  const handleSelectCustomer = (id: string) => {
    onClose();
    openCustomerDrawer(id);
    onNavigate('customers');
  };

  const handleSelectDeal = () => {
    onClose();
    onNavigate('deals');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center pt-20 p-4 sm:p-6">
      <div
        className="fixed inset-0 bg-[#111827]/40 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl border border-[#E5E7EB] overflow-hidden z-10 animate-modal-in">
        {/* Search Bar */}
        <div className="flex items-center px-4 py-3 border-b border-[#E5E7EB] bg-white">
          <Search className="w-5 h-5 text-[#9CA3AF] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search leads, customers, deals, companies..."
            className="w-full px-3 py-1 text-sm bg-transparent text-[#111827] placeholder-[#9CA3AF] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#9CA3AF] hover:text-[#111827] p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[10px] font-mono text-[#9CA3AF] bg-[#F3F4F6] px-1.5 py-0.5 rounded ml-2">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {/* Leads */}
          {filteredLeads.length > 0 && (
            <div>
              <p className="px-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-[#667085] flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5" />
                Leads
              </p>
              <div className="space-y-1">
                {filteredLeads.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => handleSelectLead(l.id)}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-blue-50/70 text-left transition-colors group"
                  >
                    <div>
                      <p className="text-xs font-semibold text-[#111827] group-hover:text-[#2563EB]">
                        {l.company}
                      </p>
                      <p className="text-[11px] text-[#667085]">
                        {l.name} • {l.status}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-[#111827]">
                      {formatINR(l.value, true)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Customers */}
          {filteredCustomers.length > 0 && (
            <div>
              <p className="px-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-[#667085] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Customers
              </p>
              <div className="space-y-1">
                {filteredCustomers.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelectCustomer(c.id)}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-blue-50/70 text-left transition-colors group"
                  >
                    <div>
                      <p className="text-xs font-semibold text-[#111827] group-hover:text-[#2563EB]">
                        {c.company}
                      </p>
                      <p className="text-[11px] text-[#667085]">
                        {c.name} • {c.industry}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">
                      {formatINR(c.lifetimeValue, true)} LTV
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Deals */}
          {filteredDeals.length > 0 && (
            <div>
              <p className="px-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-[#667085] flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                Deals / Pipeline
              </p>
              <div className="space-y-1">
                {filteredDeals.map((d) => (
                  <button
                    key={d.id}
                    onClick={handleSelectDeal}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-blue-50/70 text-left transition-colors group"
                  >
                    <div>
                      <p className="text-xs font-semibold text-[#111827] group-hover:text-[#2563EB]">
                        {d.title}
                      </p>
                      <p className="text-[11px] text-[#667085]">
                        {d.company} • Stage: {d.stage}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-[#111827]">
                      {formatINR(d.value, true)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredLeads.length === 0 && filteredCustomers.length === 0 && filteredDeals.length === 0 && (
            <div className="p-8 text-center text-xs text-[#667085]">
              No records found matching "{query}".
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-[#F9FAFB] border-t border-[#E5E7EB] flex items-center justify-between text-[11px] text-[#667085]">
          <span>Tip: Click any record to view details directly</span>
          <span className="flex items-center gap-1 text-[#2563EB] font-medium">
            Jump to module <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
};

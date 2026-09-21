import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { DealStage, Priority } from '../../types/crm';
import { useCRM } from '../../context/CRMContext';
import { Briefcase, Building, UserCheck, Calendar, IndianRupee } from 'lucide-react';

interface AddDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStage?: DealStage;
}

export const AddDealModal: React.FC<AddDealModalProps> = ({
  isOpen,
  onClose,
  defaultStage = 'New',
}) => {
  const { leads, customers, addDeal } = useCRM();

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [contactName, setContactName] = useState('');
  const [value, setValue] = useState('');
  const [stage, setStage] = useState<DealStage>(defaultStage);
  const [priority, setPriority] = useState<Priority>('High');
  const [expectedCloseDate, setExpectedCloseDate] = useState(
    new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]
  );
  const [probability, setProbability] = useState(50);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Deal title is required';
    if (!company.trim()) newErrors.company = 'Company is required';
    if (!value || isNaN(Number(value))) newErrors.value = 'Valid value is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    addDeal({
      title: title.trim(),
      company: company.trim(),
      contactName: contactName.trim() || 'Key Decision Maker',
      value: Number(value),
      stage,
      priority,
      expectedCloseDate,
      probability,
    });

    setTitle('');
    setCompany('');
    setContactName('');
    setValue('');
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Deal"
      subtitle="Track a commercial proposal or contract value in your sales pipeline."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1">
            Deal Name / Scope <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Briefcase className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-2.5" />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Enterprise ERP License & AMC"
              className={`w-full pl-9 pr-3 py-1.5 text-xs bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB] ${
                errors.title ? 'border-rose-400 focus:border-rose-500' : 'border-[#D1D5DB]'
              }`}
            />
          </div>
          {errors.title && <p className="text-[11px] text-rose-500 mt-1">{errors.title}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Company <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Building className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-2.5" />
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Nova Group"
                className={`w-full pl-9 pr-3 py-1.5 text-xs bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB] ${
                  errors.company ? 'border-rose-400 focus:border-rose-500' : 'border-[#D1D5DB]'
                }`}
              />
            </div>
            {errors.company && <p className="text-[11px] text-rose-500 mt-1">{errors.company}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">Contact Name</label>
            <div className="relative">
              <UserCheck className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-2.5" />
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="e.g. Ananya Deshmukh"
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Deal Value (₹) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="180000"
              className={`w-full px-3 py-1.5 text-xs bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB] ${
                errors.value ? 'border-rose-400 focus:border-rose-500' : 'border-[#D1D5DB]'
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">Pipeline Stage</label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value as DealStage)}
              className="w-full px-3 py-1.5 text-xs bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Proposal">Proposal</option>
              <option value="Won">Won</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full px-3 py-1.5 text-xs bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Expected Close Date
            </label>
            <input
              type="date"
              value={expectedCloseDate}
              onChange={(e) => setExpectedCloseDate(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-[#374151]">Win Probability</label>
              <span className="text-xs font-bold text-[#2563EB]">{probability}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={probability}
              onChange={(e) => setProbability(Number(e.target.value))}
              className="w-full accent-[#2563EB]"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E7EB]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#4B5563] bg-white border border-[#D1D5DB] rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg shadow-2xs transition-colors"
          >
            Create Deal
          </button>
        </div>
      </form>
    </Modal>
  );
};

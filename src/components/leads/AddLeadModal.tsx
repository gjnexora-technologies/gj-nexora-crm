import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { LeadSource, Priority, FollowupType } from '../../types/crm';
import { useCRM } from '../../context/CRMContext';
import { UserCheck, Building, Mail, Phone, IndianRupee, Tag, Calendar, Clock } from 'lucide-react';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddLeadModal: React.FC<AddLeadModalProps> = ({ isOpen, onClose }) => {
  const { addLead } = useCRM();

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [source, setSource] = useState<LeadSource>('Website');
  const [interestedIn, setInterestedIn] = useState('');
  const [value, setValue] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [notes, setNotes] = useState('');
  
  // Optional initial follow-up
  const [scheduleFollowup, setScheduleFollowup] = useState(false);
  const [followupDate, setFollowupDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [followupTime, setFollowupTime] = useState('11:00 AM');
  const [followupType, setFollowupType] = useState<FollowupType>('Call');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Full name is required';
    if (!company.trim()) newErrors.company = 'Company name is required';
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (value && isNaN(Number(value))) {
      newErrors.value = 'Value must be a valid number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    addLead({
      name: name.trim(),
      company: company.trim(),
      email: email.trim() || `contact@${company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      phone: phone.trim() || '+91 98000 00000',
      source,
      status: 'New',
      value: value ? Number(value) : 100000,
      priority,
      interestedIn: interestedIn.trim() || 'Custom Enterprise Software',
      assignedTo: 'Demo User',
      ...(scheduleFollowup && {
        nextFollowupDate: followupDate,
        nextFollowupTime: followupTime,
        nextFollowupType: followupType,
      }),
    });

    // Reset fields
    setName('');
    setCompany('');
    setEmail('');
    setPhone('');
    setInterestedIn('');
    setValue('');
    setNotes('');
    setScheduleFollowup(false);
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Lead"
      subtitle="Register a new potential business opportunity into the CRM pipeline."
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Contact Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <UserCheck className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-2.5" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rajesh Kumar"
                className={`w-full pl-9 pr-3 py-1.5 text-xs bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB] ${
                  errors.name ? 'border-rose-400 focus:border-rose-500' : 'border-[#D1D5DB]'
                }`}
              />
            </div>
            {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
          </div>

          {/* Company */}
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Company Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Building className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-2.5" />
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Apex Traders Ltd"
                className={`w-full pl-9 pr-3 py-1.5 text-xs bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB] ${
                  errors.company ? 'border-rose-400 focus:border-rose-500' : 'border-[#D1D5DB]'
                }`}
              />
            </div>
            {errors.company && <p className="text-[11px] text-rose-500 mt-1">{errors.company}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-2.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rajesh@apextraders.com"
                className={`w-full pl-9 pr-3 py-1.5 text-xs bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB] ${
                  errors.email ? 'border-rose-400 focus:border-rose-500' : 'border-[#D1D5DB]'
                }`}
              />
            </div>
            {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-2.5" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 00000"
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>
          </div>

          {/* Lead Source */}
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">Lead Source</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as LeadSource)}
              className="w-full px-3 py-1.5 text-xs bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            >
              <option value="Website">Website</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Instagram">Instagram</option>
              <option value="Referral">Referral</option>
              <option value="Google">Google</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Priority */}
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

        {/* Interested In & Value */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Interested In / Project Scope
            </label>
            <input
              type="text"
              value={interestedIn}
              onChange={(e) => setInterestedIn(e.target.value)}
              placeholder="e.g. Custom ERP, B2B Portal, Lead Router"
              className="w-full px-3 py-1.5 text-xs bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Estimated Value (₹)
            </label>
            <div className="relative">
              <span className="text-[#9CA3AF] text-xs absolute left-3 top-2 font-bold">₹</span>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="150000"
                className={`w-full pl-7 pr-3 py-1.5 text-xs bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB] ${
                  errors.value ? 'border-rose-400 focus:border-rose-500' : 'border-[#D1D5DB]'
                }`}
              />
            </div>
            {errors.value && <p className="text-[11px] text-rose-500 mt-1">{errors.value}</p>}
          </div>
        </div>

        {/* Schedule Initial Follow-up Checkbox */}
        <div className="p-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={scheduleFollowup}
              onChange={(e) => setScheduleFollowup(e.target.checked)}
              className="w-4 h-4 text-[#2563EB] rounded border-gray-300 focus:ring-[#2563EB]"
            />
            <span className="text-xs font-semibold text-[#111827]">
              Schedule immediate follow-up task
            </span>
          </label>

          {scheduleFollowup && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 pt-2 border-t border-[#E5E7EB] animate-fade-in">
              <div>
                <label className="block text-[11px] text-[#667085] mb-1">Date</label>
                <input
                  type="date"
                  value={followupDate}
                  onChange={(e) => setFollowupDate(e.target.value)}
                  className="w-full px-2 py-1 text-xs bg-white border border-[#D1D5DB] rounded"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#667085] mb-1">Time</label>
                <input
                  type="text"
                  value={followupTime}
                  onChange={(e) => setFollowupTime(e.target.value)}
                  placeholder="11:00 AM"
                  className="w-full px-2 py-1 text-xs bg-white border border-[#D1D5DB] rounded"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#667085] mb-1">Channel</label>
                <select
                  value={followupType}
                  onChange={(e) => setFollowupType(e.target.value as FollowupType)}
                  className="w-full px-2 py-1 text-xs bg-white border border-[#D1D5DB] rounded"
                >
                  <option value="Call">Call</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Email">Email</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
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
            Create Lead
          </button>
        </div>
      </form>
    </Modal>
  );
};

import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { FollowupType } from '../../types/crm';
import { useCRM } from '../../context/CRMContext';
import { Calendar, Clock, Phone, MessageSquare, Users, Mail, Building, UserCheck } from 'lucide-react';

interface ScheduleFollowupModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillEntityId?: string | null;
  prefillEntityType?: 'lead' | 'customer';
}

export const ScheduleFollowupModal: React.FC<ScheduleFollowupModalProps> = ({
  isOpen,
  onClose,
  prefillEntityId,
  prefillEntityType = 'lead',
}) => {
  const { leads, customers, addFollowUp } = useCRM();

  const selectedLead = prefillEntityType === 'lead' ? leads.find((l) => l.id === prefillEntityId) : null;
  const selectedCustomer = prefillEntityType === 'customer' ? customers.find((c) => c.id === prefillEntityId) : null;

  const [title, setTitle] = useState('');
  const [selectedEntityId, setSelectedEntityId] = useState(prefillEntityId || (leads[0]?.id ?? ''));
  const [entityType, setEntityType] = useState<'lead' | 'customer'>(prefillEntityType);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('11:30 AM');
  const [type, setType] = useState<FollowupType>('Call');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrors({ title: 'Task title is required' });
      return;
    }

    let companyName = 'Demo Company';
    let contactName = 'Demo Contact';
    let contactEmail = 'contact@example.com';
    let contactPhone = '+91 98000 00000';

    if (entityType === 'lead') {
      const l = leads.find((x) => x.id === selectedEntityId) || selectedLead;
      if (l) {
        companyName = l.company;
        contactName = l.name;
        contactEmail = l.email;
        contactPhone = l.phone;
      }
    } else {
      const c = customers.find((x) => x.id === selectedEntityId) || selectedCustomer;
      if (c) {
        companyName = c.company;
        contactName = c.name;
        contactEmail = c.email;
        contactPhone = c.phone;
      }
    }

    addFollowUp({
      title: title.trim(),
      company: companyName,
      contactName,
      contactEmail,
      contactPhone,
      date,
      time,
      type,
      relatedEntityType: entityType,
      relatedEntityId: selectedEntityId,
      notes: notes.trim(),
    });

    setTitle('');
    setNotes('');
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule Follow-up Task"
      subtitle="Create a customer touchpoint reminder (Call, Meeting, WhatsApp, Email)."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1">
            Follow-up Objective <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Scope alignment call, share revised SLA proposal"
            className={`w-full px-3 py-1.5 text-xs bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB] ${
              errors.title ? 'border-rose-400 focus:border-rose-500' : 'border-[#D1D5DB]'
            }`}
          />
          {errors.title && <p className="text-[11px] text-rose-500 mt-1">{errors.title}</p>}
        </div>

        {/* Entity Type & Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">Link To</label>
            <select
              value={entityType}
              onChange={(e) => {
                const val = e.target.value as 'lead' | 'customer';
                setEntityType(val);
                if (val === 'lead') setSelectedEntityId(leads[0]?.id || '');
                else setSelectedEntityId(customers[0]?.id || '');
              }}
              className="w-full px-3 py-1.5 text-xs bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            >
              <option value="lead">Pipeline Lead</option>
              <option value="customer">Existing Customer</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Select {entityType === 'lead' ? 'Lead' : 'Customer'}
            </label>
            <select
              value={selectedEntityId}
              onChange={(e) => setSelectedEntityId(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            >
              {entityType === 'lead'
                ? leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.company} ({l.name})
                    </option>
                  ))
                : customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.company} ({c.name})
                    </option>
                  ))}
            </select>
          </div>
        </div>

        {/* Date, Time & Channel */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">Date</label>
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">Time</label>
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="11:30 AM"
              className="w-full px-3 py-1.5 text-xs bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">Channel</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as FollowupType)}
              className="w-full px-3 py-1.5 text-xs bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            >
              <option value="Call">Call</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Meeting">Meeting</option>
              <option value="Email">Email</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1">
            Notes / Agenda
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Brief discussion points or questions for the client..."
            rows={2}
            className="w-full p-2.5 text-xs bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
          />
        </div>

        {/* Actions */}
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
            Schedule Follow-up
          </button>
        </div>
      </form>
    </Modal>
  );
};

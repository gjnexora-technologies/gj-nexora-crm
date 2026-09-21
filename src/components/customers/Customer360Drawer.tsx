import React, { useState } from 'react';
import { Drawer } from '../common/Drawer';
import { StatusBadge } from '../common/StatusBadge';
import { FollowupTypeBadge } from '../common/FollowupTypeBadge';
import { useCRM } from '../../context/CRMContext';
import { formatINR } from '../../data/initialData';
import { CustomerStatus } from '../../types/crm';
import {
  Building,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  MapPin,
  Clock,
  Send,
  Plus,
  Award,
  Layers,
  CheckCircle2,
} from 'lucide-react';

interface Customer360DrawerProps {
  customerId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenScheduleFollowup?: (customerId: string) => void;
}

export const Customer360Drawer: React.FC<Customer360DrawerProps> = ({
  customerId,
  isOpen,
  onClose,
  onOpenScheduleFollowup,
}) => {
  const { customers, updateCustomer, deals, followUps, activities, notes, addNote, completeFollowUp } = useCRM();

  const [activeTab, setActiveTab] = useState<'overview' | 'deals' | 'activity' | 'notes'>('overview');
  const [newNoteText, setNewNoteText] = useState('');

  const customer = customers.find((c) => c.id === customerId);

  if (!customer) return null;

  const customerDeals = deals.filter(
    (d) => d.relatedCustomerId === customer.id || d.company === customer.company
  );
  const customerFollowups = followUps.filter(
    (f) => f.relatedEntityId === customer.id || f.company === customer.company
  );
  const customerActivities = activities.filter(
    (a) => a.entityId === customer.id || a.entityName === customer.company
  );
  const customerNotes = notes.filter(
    (n) => n.entityId === customer.id || n.entityType === 'customer'
  );

  const handleStatusChange = (status: CustomerStatus) => {
    updateCustomer(customer.id, { status });
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    addNote('customer', customer.id, newNoteText.trim());
    setNewNoteText('');
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={customer.company}
      subtitle={`Customer 360 Relationship • ${customer.name}`}
      width="2xl"
    >
      {/* KPI Header Bar */}
      <div className="bg-[#F9FAFB] p-4 border-b border-[#E5E7EB] grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <p className="text-[11px] text-[#667085] font-medium">Lifetime Value (LTV)</p>
          <p className="text-base font-bold text-emerald-700 mt-0.5 font-sans">
            {formatINR(customer.lifetimeValue)}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-[#667085] font-medium">Account Status</p>
          <div className="mt-1">
            <StatusBadge status={customer.status} size="sm" />
          </div>
        </div>
        <div>
          <p className="text-[11px] text-[#667085] font-medium">Total Deals</p>
          <p className="text-sm font-bold text-[#111827] mt-1">{customerDeals.length} active</p>
        </div>
        <div>
          <p className="text-[11px] text-[#667085] font-medium">Customer Since</p>
          <p className="text-xs font-semibold text-[#111827] mt-1">{customer.customerSince}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 px-6 border-b border-[#E5E7EB] bg-white sticky top-0 z-10">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-[#2563EB] text-[#2563EB]'
              : 'border-transparent text-[#667085] hover:text-[#111827]'
          }`}
        >
          Relationship 360
        </button>
        <button
          onClick={() => setActiveTab('deals')}
          className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'deals'
              ? 'border-[#2563EB] text-[#2563EB]'
              : 'border-transparent text-[#667085] hover:text-[#111827]'
          }`}
        >
          Deals & Contracts ({customerDeals.length})
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'activity'
              ? 'border-[#2563EB] text-[#2563EB]'
              : 'border-transparent text-[#667085] hover:text-[#111827]'
          }`}
        >
          Activity Stream ({customerActivities.length})
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'notes'
              ? 'border-[#2563EB] text-[#2563EB]'
              : 'border-transparent text-[#667085] hover:text-[#111827]'
          }`}
        >
          Account Notes ({customerNotes.length})
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* Status switcher */}
            <div className="p-3.5 bg-white border border-[#E5E7EB] rounded-xl shadow-2xs">
              <label className="block text-xs font-semibold text-[#374151] mb-2">
                Account Tier / Relationship Status
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(['Active', 'VIP', 'Onboarding', 'Inactive'] as CustomerStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(st)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                      customer.status === st
                        ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-2xs'
                        : 'bg-[#F9FAFB] text-[#4B5563] border-[#E5E7EB] hover:bg-gray-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Profile Info */}
            <div className="p-4 bg-white border border-[#E5E7EB] rounded-xl space-y-3 shadow-2xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">
                Account Profile & Contacts
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[#667085] block mb-0.5">Primary Contact Person</span>
                  <p className="font-semibold text-[#111827]">{customer.name}</p>
                </div>
                <div>
                  <span className="text-[#667085] block mb-0.5">Organization</span>
                  <p className="font-semibold text-[#111827] flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-[#667085]" />
                    {customer.company}
                  </p>
                </div>
                <div>
                  <span className="text-[#667085] block mb-0.5">Official Email</span>
                  <p className="font-semibold text-[#111827] flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#667085]" />
                    <a href={`mailto:${customer.email}`} className="text-[#2563EB] hover:underline">
                      {customer.email}
                    </a>
                  </p>
                </div>
                <div>
                  <span className="text-[#667085] block mb-0.5">Contact Phone</span>
                  <p className="font-semibold text-[#111827] flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#667085]" />
                    {customer.phone}
                  </p>
                </div>
                <div>
                  <span className="text-[#667085] block mb-0.5">Industry Vertical</span>
                  <p className="font-semibold text-[#111827] flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#667085]" />
                    {customer.industry}
                  </p>
                </div>
                <div>
                  <span className="text-[#667085] block mb-0.5">Location / City</span>
                  <p className="font-semibold text-[#111827] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#667085]" />
                    {customer.city}
                  </p>
                </div>
              </div>
            </div>

            {/* Upcoming Followups for this Customer */}
            <div className="p-4 bg-white border border-[#E5E7EB] rounded-xl space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">
                  Scheduled Account Follow-ups
                </h4>
                {onOpenScheduleFollowup && (
                  <button
                    onClick={() => onOpenScheduleFollowup(customer.id)}
                    className="flex items-center gap-1 px-2 py-0.5 text-xs font-semibold text-[#2563EB] bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Schedule</span>
                  </button>
                )}
              </div>

              {customerFollowups.length === 0 ? (
                <p className="text-xs text-[#667085] italic py-1">No pending follow-ups for this account.</p>
              ) : (
                <div className="space-y-2">
                  {customerFollowups.map((fol) => (
                    <div
                      key={fol.id}
                      className="p-2.5 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-semibold text-[#111827]">{fol.title}</p>
                        <p className="text-[11px] text-[#667085] mt-0.5">
                          {fol.date} at {fol.time} • <FollowupTypeBadge type={fol.type} size="sm" />
                        </p>
                      </div>
                      {fol.status === 'Scheduled' && (
                        <button
                          onClick={() => completeFollowUp(fol.id)}
                          className="px-2 py-0.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded hover:bg-emerald-100"
                        >
                          Mark Done
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: DEALS */}
        {activeTab === 'deals' && (
          <div className="space-y-3 animate-fade-in">
            {customerDeals.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#667085] bg-[#F9FAFB] rounded-lg border border-dashed border-[#E5E7EB]">
                No deals linked to this customer account yet.
              </div>
            ) : (
              customerDeals.map((deal) => (
                <div
                  key={deal.id}
                  className="p-3.5 bg-white border border-[#E5E7EB] rounded-xl shadow-2xs flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#111827]">{deal.title}</span>
                      <StatusBadge status={deal.stage} size="sm" />
                    </div>
                    <p className="text-[11px] text-[#667085] mt-1">
                      Expected Close: {deal.expectedCloseDate} • Probability: {deal.probability}%
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-[#111827]">
                      {formatINR(deal.value)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: ACTIVITY */}
        {activeTab === 'activity' && (
          <div className="space-y-4 animate-fade-in">
            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E5E7EB]">
              {customerActivities.length === 0 ? (
                <p className="text-xs text-[#667085] py-4">No recent activity logged for this account.</p>
              ) : (
                customerActivities.map((act) => (
                  <div key={act.id} className="relative">
                    <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                      <Clock className="w-3 h-3" />
                    </div>
                    <div className="text-xs">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-[#111827]">{act.title}</p>
                        <span className="text-[10px] text-[#9CA3AF]">{act.timestamp}</span>
                      </div>
                      <p className="text-[#667085] mt-0.5 leading-relaxed">{act.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: NOTES */}
        {activeTab === 'notes' && (
          <div className="space-y-4 animate-fade-in">
            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Add relationship notes, account reviews, client feedback..."
                rows={3}
                className="w-full p-3 text-xs bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newNoteText.trim()}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 rounded-lg shadow-2xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Account Note</span>
                </button>
              </div>
            </form>

            <div className="space-y-2.5 pt-2">
              {customerNotes.length === 0 ? (
                <p className="text-xs text-[#667085] text-center py-6">No account notes recorded.</p>
              ) : (
                customerNotes.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px] text-[#667085]">
                      <span className="font-semibold text-[#111827]">{n.author}</span>
                      <span>{n.createdAt}</span>
                    </div>
                    <p className="text-[#374151] leading-relaxed">{n.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};

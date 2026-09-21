import React, { useState } from 'react';
import { Drawer } from '../common/Drawer';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { FollowupTypeBadge } from '../common/FollowupTypeBadge';
import { ConvertLeadDialog } from './ConvertLeadDialog';
import { useCRM } from '../../context/CRMContext';
import { formatINR } from '../../data/initialData';
import { LeadStatus } from '../../types/crm';
import {
  Building,
  Mail,
  Phone,
  Calendar,
  Sparkles,
  MessageSquare,
  Clock,
  Send,
  Plus,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface LeadDetailDrawerProps {
  leadId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenScheduleFollowup?: (leadId: string) => void;
}

export const LeadDetailDrawer: React.FC<LeadDetailDrawerProps> = ({
  leadId,
  isOpen,
  onClose,
  onOpenScheduleFollowup,
}) => {
  const { leads, updateLeadStatus, addNote, notes, activities, followUps, completeFollowUp } = useCRM();

  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'notes' | 'followups'>('overview');
  const [isConvertOpen, setIsConvertOpen] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');

  const lead = leads.find((l) => l.id === leadId);

  if (!lead) return null;

  const leadNotes = notes.filter((n) => n.entityId === lead.id || n.entityType === 'lead');
  const leadActivities = activities.filter(
    (a) => a.entityId === lead.id || a.entityName === lead.company
  );
  const leadFollowups = followUps.filter((f) => f.relatedEntityId === lead.id);

  const handleStatusChange = (newStatus: LeadStatus) => {
    updateLeadStatus(lead.id, newStatus);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    addNote('lead', lead.id, newNoteText.trim());
    setNewNoteText('');
  };

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        title={lead.company}
        subtitle={`Lead ID: #${lead.id.slice(-6)} • Contact: ${lead.name}`}
        width="2xl"
        headerActions={
          lead.status !== 'Converted' && lead.status !== 'Lost' ? (
            <button
              onClick={() => setIsConvertOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Convert to Customer</span>
            </button>
          ) : lead.status === 'Converted' ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Converted Customer
            </span>
          ) : null
        }
      >
        {/* KPI Strip */}
        <div className="bg-[#F9FAFB] p-4 border-b border-[#E5E7EB] grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <p className="text-[11px] text-[#667085] font-medium">Pipeline Value</p>
            <p className="text-base font-bold text-[#111827] mt-0.5">{formatINR(lead.value)}</p>
          </div>
          <div>
            <p className="text-[11px] text-[#667085] font-medium">Current Status</p>
            <div className="mt-1">
              <StatusBadge status={lead.status} size="sm" />
            </div>
          </div>
          <div>
            <p className="text-[11px] text-[#667085] font-medium">Priority</p>
            <div className="mt-1">
              <PriorityBadge priority={lead.priority} />
            </div>
          </div>
          <div>
            <p className="text-[11px] text-[#667085] font-medium">Lead Source</p>
            <p className="text-xs font-bold text-[#111827] mt-1">{lead.source}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 border-b border-[#E5E7EB] bg-white sticky top-0 z-10">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-[#667085] hover:text-[#111827]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'activity'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-[#667085] hover:text-[#111827]'
            }`}
          >
            Activity Stream ({leadActivities.length})
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'notes'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-[#667085] hover:text-[#111827]'
            }`}
          >
            Notes ({leadNotes.length})
          </button>
          <button
            onClick={() => setActiveTab('followups')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'followups'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-[#667085] hover:text-[#111827]'
            }`}
          >
            Follow-ups ({leadFollowups.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              {/* Quick Status Bar */}
              <div className="p-3.5 bg-white border border-[#E5E7EB] rounded-xl shadow-2xs">
                <label className="block text-xs font-semibold text-[#374151] mb-2">
                  Update Lead Stage
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {(['New', 'Contacted', 'Qualified', 'Proposal', 'Converted', 'Lost'] as LeadStatus[]).map(
                    (st) => (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(st)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                          lead.status === st
                            ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-2xs'
                            : 'bg-[#F9FAFB] text-[#4B5563] border-[#E5E7EB] hover:bg-gray-100'
                        }`}
                      >
                        {st}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="p-4 bg-white border border-[#E5E7EB] rounded-xl space-y-3 shadow-2xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">
                  Contact & Organization
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#667085] block mb-0.5">Primary Contact</span>
                    <p className="font-semibold text-[#111827]">{lead.name}</p>
                  </div>
                  <div>
                    <span className="text-[#667085] block mb-0.5">Company</span>
                    <p className="font-semibold text-[#111827] flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-[#667085]" />
                      {lead.company}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#667085] block mb-0.5">Email</span>
                    <p className="font-semibold text-[#111827] flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#667085]" />
                      <a href={`mailto:${lead.email}`} className="text-[#2563EB] hover:underline">
                        {lead.email}
                      </a>
                    </p>
                  </div>
                  <div>
                    <span className="text-[#667085] block mb-0.5">Phone</span>
                    <p className="font-semibold text-[#111827] flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#667085]" />
                      {lead.phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Project Scope */}
              <div className="p-4 bg-white border border-[#E5E7EB] rounded-xl space-y-2 shadow-2xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">
                  Project Requirements / Scope
                </h4>
                <p className="text-xs font-medium text-[#111827] bg-[#F9FAFB] p-3 rounded-lg border border-[#F3F4F6] leading-relaxed">
                  {lead.interestedIn || 'Enterprise custom business software'}
                </p>
              </div>

              {/* Meta details */}
              <div className="flex items-center justify-between text-[11px] text-[#667085] px-1">
                <span>Created: {lead.createdAt}</span>
                <span>Assigned to: {lead.assignedTo}</span>
              </div>
            </div>
          )}

          {/* TAB 2: ACTIVITY */}
          {activeTab === 'activity' && (
            <div className="space-y-4 animate-fade-in">
              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E5E7EB]">
                {leadActivities.length === 0 ? (
                  <p className="text-xs text-[#667085] py-4">No logged activity yet for this lead.</p>
                ) : (
                  leadActivities.map((act) => (
                    <div key={act.id} className="relative">
                      <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB]">
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

          {/* TAB 3: NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-4 animate-fade-in">
              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="space-y-2">
                <textarea
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Type a meeting note, discussion takeaway, or requirement..."
                  rows={3}
                  className="w-full p-3 text-xs bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB] placeholder-[#9CA3AF]"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!newNoteText.trim()}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 rounded-lg shadow-2xs transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Note</span>
                  </button>
                </div>
              </form>

              {/* Notes List */}
              <div className="space-y-2.5 pt-2">
                {leadNotes.length === 0 ? (
                  <p className="text-xs text-[#667085] text-center py-6">No notes added yet.</p>
                ) : (
                  leadNotes.map((n) => (
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

          {/* TAB 4: FOLLOW-UPS */}
          {activeTab === 'followups' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#111827]">Scheduled Follow-ups</h4>
                {onOpenScheduleFollowup && (
                  <button
                    onClick={() => onOpenScheduleFollowup(lead.id)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#2563EB] bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Schedule Follow-up</span>
                  </button>
                )}
              </div>

              {leadFollowups.length === 0 ? (
                <div className="p-6 text-center bg-[#F9FAFB] rounded-lg border border-dashed border-[#E5E7EB]">
                  <p className="text-xs text-[#667085]">No follow-ups currently linked to this lead.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {leadFollowups.map((fol) => (
                    <div
                      key={fol.id}
                      className="p-3 bg-white rounded-lg border border-[#E5E7EB] flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#111827]">{fol.title}</span>
                          <StatusBadge status={fol.status} size="sm" />
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[#667085]">
                          <span>{fol.date} at {fol.time}</span>
                          <span>•</span>
                          <FollowupTypeBadge type={fol.type} size="sm" />
                        </div>
                      </div>

                      {fol.status === 'Scheduled' && (
                        <button
                          onClick={() => completeFollowUp(fol.id)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md hover:bg-emerald-100 transition-colors shrink-0"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Done</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Drawer>

      {/* Convert Lead Confirmation Dialog */}
      <ConvertLeadDialog
        isOpen={isConvertOpen}
        onClose={() => setIsConvertOpen(false)}
        lead={lead}
        onConverted={() => {
          onClose();
        }}
      />
    </>
  );
};

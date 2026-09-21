import React, { useState, useMemo } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Lead, LeadStatus, LeadSource, Priority } from '../../types/crm';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { FollowupTypeBadge } from '../common/FollowupTypeBadge';
import { SearchInput } from '../common/SearchInput';
import { EmptyState } from '../common/EmptyState';
import { formatINR } from '../../data/initialData';
import {
  Plus,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Calendar,
  Eye,
} from 'lucide-react';

interface LeadsTableProps {
  onOpenAddModal: () => void;
  onOpenLeadDrawer: (id: string) => void;
  onOpenScheduleFollowup?: (leadId: string) => void;
}

export const LeadsTable: React.FC<LeadsTableProps> = ({
  onOpenAddModal,
  onOpenLeadDrawer,
  onOpenScheduleFollowup,
}) => {
  const { leads } = useCRM();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'date' | 'value' | 'company' | 'priority'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Filtered & Sorted Leads
  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        const query = search.toLowerCase();
        const matchesSearch =
          !query ||
          lead.name.toLowerCase().includes(query) ||
          lead.company.toLowerCase().includes(query) ||
          lead.email.toLowerCase().includes(query) ||
          lead.interestedIn?.toLowerCase().includes(query);

        const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
        const matchesSource = sourceFilter === 'ALL' || lead.source === sourceFilter;
        const matchesPriority = priorityFilter === 'ALL' || lead.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesSource && matchesPriority;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortBy === 'value') comp = a.value - b.value;
        else if (sortBy === 'company') comp = a.company.localeCompare(b.company);
        else if (sortBy === 'priority') {
          const rank = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
          comp = rank[a.priority] - rank[b.priority];
        } else {
          comp = a.createdAt.localeCompare(b.createdAt);
        }
        return sortOrder === 'asc' ? comp : -comp;
      });
  }, [leads, search, statusFilter, sourceFilter, priorityFilter, sortBy, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const toggleSort = (col: 'date' | 'value' | 'company' | 'priority') => {
    if (sortBy === col) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortOrder('desc');
    }
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-2xs overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-3.5 sm:p-4 border-b border-[#E5E7EB] flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white">
        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <SearchInput
            value={search}
            onChange={(val) => {
              setSearch(val);
              setCurrentPage(1);
            }}
            placeholder="Search leads by name, company, email..."
            className="w-full sm:w-64"
          />

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 text-xs bg-[#F9FAFB] border border-[#D1D5DB] rounded-lg text-[#4B5563] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
          >
            <option value="ALL">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Proposal">Proposal</option>
            <option value="Converted">Converted</option>
            <option value="Lost">Lost</option>
          </select>

          {/* Source filter */}
          <select
            value={sourceFilter}
            onChange={(e) => {
              setSourceFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="hidden sm:block px-2.5 py-1.5 text-xs bg-[#F9FAFB] border border-[#D1D5DB] rounded-lg text-[#4B5563] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
          >
            <option value="ALL">All Sources</option>
            <option value="Website">Website</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Instagram">Instagram</option>
            <option value="Referral">Referral</option>
            <option value="Google">Google</option>
            <option value="Other">Other</option>
          </select>

          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="hidden md:block px-2.5 py-1.5 text-xs bg-[#F9FAFB] border border-[#D1D5DB] rounded-lg text-[#4B5563] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
          >
            <option value="ALL">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      {paginatedLeads.length === 0 ? (
        <div className="p-8">
          <EmptyState
            title="No leads match your criteria"
            description="Try clearing search filters or add a new lead to populate your pipeline."
            icon={UserCheck}
            actionLabel="Add Lead"
            onAction={onOpenAddModal}
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#111827]">
            <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB] text-[11px] font-bold text-[#667085] uppercase tracking-wider select-none">
              <tr>
                <th
                  onClick={() => toggleSort('company')}
                  className="py-3 px-4 cursor-pointer hover:text-[#111827]"
                >
                  <div className="flex items-center gap-1">
                    <span>Company & Lead</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 hidden sm:table-cell">Source</th>
                <th className="py-3 px-4">Status</th>
                <th
                  onClick={() => toggleSort('value')}
                  className="py-3 px-4 cursor-pointer hover:text-[#111827]"
                >
                  <div className="flex items-center gap-1">
                    <span>Est. Value</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('priority')}
                  className="py-3 px-4 cursor-pointer hover:text-[#111827] hidden md:table-cell"
                >
                  <div className="flex items-center gap-1">
                    <span>Priority</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 hidden lg:table-cell">Next Touch</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {paginatedLeads.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => onOpenLeadDrawer(lead.id)}
                  className="hover:bg-blue-50/40 cursor-pointer transition-colors group"
                >
                  {/* Lead & Company */}
                  <td className="py-3 px-4">
                    <div>
                      <span className="font-bold text-[#111827] group-hover:text-[#2563EB] transition-colors block text-xs">
                        {lead.company}
                      </span>
                      <span className="text-[11px] text-[#667085] block mt-0.5">
                        {lead.name} • {lead.email}
                      </span>
                    </div>
                  </td>

                  {/* Source */}
                  <td className="py-3 px-4 font-medium text-[#4B5563] text-xs hidden sm:table-cell">
                    {lead.source}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                    <StatusBadge status={lead.status} size="sm" />
                  </td>

                  {/* Value */}
                  <td className="py-3 px-4 font-bold text-[#111827]">
                    {formatINR(lead.value)}
                  </td>

                  {/* Priority */}
                  <td className="py-3 px-4 hidden md:table-cell">
                    <PriorityBadge priority={lead.priority} />
                  </td>

                  {/* Next Follow-up */}
                  <td className="py-3 px-4 hidden lg:table-cell">
                    {lead.nextFollowupDate ? (
                      <div className="flex items-center gap-1.5 text-xs text-[#4B5563]">
                        <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
                        <span>{lead.nextFollowupDate}</span>
                        {lead.nextFollowupType && (
                          <FollowupTypeBadge type={lead.nextFollowupType} size="sm" />
                        )}
                      </div>
                    ) : (
                      <span className="text-[#9CA3AF] text-[11px] italic">Not scheduled</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td
                    className="py-3 px-4 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onOpenLeadDrawer(lead.id)}
                        className="p-1 text-[#667085] hover:text-[#2563EB] hover:bg-white rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      <div className="px-4 py-3 border-t border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-between text-xs text-[#667085]">
        <span>
          Showing{' '}
          <strong className="text-[#111827]">
            {filteredLeads.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
          </strong>{' '}
          to{' '}
          <strong className="text-[#111827]">
            {Math.min(currentPage * pageSize, filteredLeads.length)}
          </strong>{' '}
          of <strong className="text-[#111827]">{filteredLeads.length}</strong> leads
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded border border-[#D1D5DB] bg-white text-[#4B5563] hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 font-medium text-[#111827]">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded border border-[#D1D5DB] bg-white text-[#4B5563] hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

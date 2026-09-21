import React, { useState, useMemo } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Customer, CustomerStatus } from '../../types/crm';
import { StatusBadge } from '../common/StatusBadge';
import { SearchInput } from '../common/SearchInput';
import { EmptyState } from '../common/EmptyState';
import { formatINR } from '../../data/initialData';
import {
  Plus,
  ArrowUpDown,
  Users,
  ChevronLeft,
  ChevronRight,
  Eye,
  Building,
  MapPin,
} from 'lucide-react';

interface CustomersTableProps {
  onOpenAddModal: () => void;
  onOpenCustomerDrawer: (id: string) => void;
}

export const CustomersTable: React.FC<CustomersTableProps> = ({
  onOpenAddModal,
  onOpenCustomerDrawer,
}) => {
  const { customers, deals } = useCRM();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'ltv' | 'company' | 'deals' | 'date'>('ltv');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const filteredCustomers = useMemo(() => {
    return customers
      .filter((cust) => {
        const query = search.toLowerCase();
        const matchesSearch =
          !query ||
          cust.name.toLowerCase().includes(query) ||
          cust.company.toLowerCase().includes(query) ||
          cust.email.toLowerCase().includes(query) ||
          cust.industry.toLowerCase().includes(query) ||
          cust.city.toLowerCase().includes(query);

        const matchesStatus = statusFilter === 'ALL' || cust.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortBy === 'ltv') comp = a.lifetimeValue - b.lifetimeValue;
        else if (sortBy === 'company') comp = a.company.localeCompare(b.company);
        else if (sortBy === 'deals') {
          const aDeals = deals.filter((d) => d.relatedCustomerId === a.id || d.company === a.company).length;
          const bDeals = deals.filter((d) => d.relatedCustomerId === b.id || d.company === b.company).length;
          comp = aDeals - bDeals;
        } else {
          comp = a.customerSince.localeCompare(b.customerSince);
        }
        return sortOrder === 'asc' ? comp : -comp;
      });
  }, [customers, deals, search, statusFilter, sortBy, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / pageSize));
  const paginated = filteredCustomers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const toggleSort = (col: 'ltv' | 'company' | 'deals' | 'date') => {
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
      <div className="p-4 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
        <div className="flex items-center gap-2.5 flex-1">
          <SearchInput
            value={search}
            onChange={(val) => {
              setSearch(val);
              setCurrentPage(1);
            }}
            placeholder="Search customers by name, company, industry..."
            className="w-full sm:w-72"
          />

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 text-xs bg-[#F9FAFB] border border-[#D1D5DB] rounded-lg text-[#4B5563] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
          >
            <option value="ALL">All Account Tiers</option>
            <option value="Active">Active</option>
            <option value="VIP">VIP</option>
            <option value="Onboarding">Onboarding</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Table Container */}
      {paginated.length === 0 ? (
        <div className="p-8">
          <EmptyState
            title="No customers found"
            description="No customer accounts match your search filters."
            icon={Users}
            actionLabel="Add Customer"
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
                    <span>Customer / Organization</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4">Industry / City</th>
                <th
                  onClick={() => toggleSort('deals')}
                  className="py-3 px-4 cursor-pointer hover:text-[#111827]"
                >
                  <div className="flex items-center gap-1">
                    <span>Contracts</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('ltv')}
                  className="py-3 px-4 cursor-pointer hover:text-[#111827]"
                >
                  <div className="flex items-center gap-1">
                    <span>Lifetime Value</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('date')}
                  className="py-3 px-4 cursor-pointer hover:text-[#111827]"
                >
                  <div className="flex items-center gap-1">
                    <span>Client Since</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {paginated.map((cust) => {
                const custDealsCount = deals.filter(
                  (d) => d.relatedCustomerId === cust.id || d.company === cust.company
                ).length;

                return (
                  <tr
                    key={cust.id}
                    onClick={() => onOpenCustomerDrawer(cust.id)}
                    className="hover:bg-blue-50/40 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-bold text-[#111827] group-hover:text-[#2563EB] transition-colors block text-xs">
                          {cust.company}
                        </span>
                        <span className="text-[11px] text-[#667085] block mt-0.5">
                          {cust.name} • {cust.email}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={cust.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-[#4B5563]">
                      <div>
                        <span className="block font-medium">{cust.industry}</span>
                        <span className="text-[11px] text-[#667085] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#9CA3AF]" />
                          {cust.city}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-[#111827]">
                      {custDealsCount} {custDealsCount === 1 ? 'deal' : 'deals'}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-emerald-700">
                      {formatINR(cust.lifetimeValue)}
                    </td>

                    <td className="py-3.5 px-4 text-[#667085]">
                      {cust.customerSince}
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onOpenCustomerDrawer(cust.id)}
                        className="p-1 text-[#667085] hover:text-[#2563EB] hover:bg-white rounded transition-colors"
                        title="Open Customer 360"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      <div className="px-4 py-3 border-t border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-between text-xs text-[#667085]">
        <span>
          Showing{' '}
          <strong className="text-[#111827]">
            {filteredCustomers.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
          </strong>{' '}
          to{' '}
          <strong className="text-[#111827]">
            {Math.min(currentPage * pageSize, filteredCustomers.length)}
          </strong>{' '}
          of <strong className="text-[#111827]">{filteredCustomers.length}</strong> accounts
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

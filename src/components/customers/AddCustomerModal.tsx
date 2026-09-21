import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { CustomerStatus } from '../../types/crm';
import { useCRM } from '../../context/CRMContext';
import { Building, UserCheck, Mail, Phone, MapPin, Briefcase } from 'lucide-react';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ isOpen, onClose }) => {
  const { addCustomer } = useCRM();

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<CustomerStatus>('Active');
  const [lifetimeValue, setLifetimeValue] = useState('');
  const [industry, setIndustry] = useState('');
  const [city, setCity] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Contact name is required';
    if (!company.trim()) newErrors.company = 'Company name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const todayStr = new Date().toISOString().split('T')[0];

    addCustomer({
      name: name.trim(),
      company: company.trim(),
      email: email.trim() || `procurement@${company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      phone: phone.trim() || '+91 98000 00000',
      status,
      lifetimeValue: lifetimeValue ? Number(lifetimeValue) : 150000,
      lastContactDate: todayStr,
      industry: industry.trim() || 'Enterprise Technology',
      city: city.trim() || 'Mumbai',
    });

    setName('');
    setCompany('');
    setEmail('');
    setPhone('');
    setLifetimeValue('');
    setIndustry('');
    setCity('');
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Customer"
      subtitle="Register an existing or direct client into the Customer 360 database."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                placeholder="e.g. Sunil Narang"
                className={`w-full pl-9 pr-3 py-1.5 text-xs bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB] ${
                  errors.name ? 'border-rose-400 focus:border-rose-500' : 'border-[#D1D5DB]'
                }`}
              />
            </div>
            {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
          </div>

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
                placeholder="e.g. Paramount Tech Labs"
                className={`w-full pl-9 pr-3 py-1.5 text-xs bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB] ${
                  errors.company ? 'border-rose-400 focus:border-rose-500' : 'border-[#D1D5DB]'
                }`}
              />
            </div>
            {errors.company && <p className="text-[11px] text-rose-500 mt-1">{errors.company}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">Email</label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-2.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@paramount.com"
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">Phone</label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-2.5" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98000 11111"
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as CustomerStatus)}
              className="w-full px-3 py-1.5 text-xs bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            >
              <option value="Active">Active</option>
              <option value="VIP">VIP</option>
              <option value="Onboarding">Onboarding</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">Initial LTV (₹)</label>
            <input
              type="number"
              value={lifetimeValue}
              onChange={(e) => setLifetimeValue(e.target.value)}
              placeholder="250000"
              className="w-full px-3 py-1.5 text-xs bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">Industry</label>
            <div className="relative">
              <Briefcase className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-2.5" />
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. Manufacturing, Retail"
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">City / Location</label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-2.5" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Mumbai, Bengaluru"
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>
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
            Save Customer
          </button>
        </div>
      </form>
    </Modal>
  );
};

import React from 'react';
import { useCRM } from '../context/CRMContext';
import { useToast } from '../context/ToastContext';
import { SCHEMA_VERSION } from '../data/initialData';
import { BrandLogo } from '../components/layout/BrandLogo';
import {
  RotateCcw,
  Sparkles,
  Building,
  ShieldCheck,
  Cpu,
  ArrowRight,
} from 'lucide-react';

interface SettingsProps {
  onOpenResetDialog: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onOpenResetDialog }) => {
  const { leads, customers, deals, followUps, activities } = useCRM();
  const { toast } = useToast();

  const handleRequestConsultation = () => {
    toast.success(
      'Inquiry Logged',
      'Thank you! A GJ Nexora Technologies solutions engineer will connect to discuss your custom software specifications.'
    );
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl">
      {/* Demo Controls Card */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#111827]">Demo Controls & Storage</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#2563EB] border border-blue-200">
                Active Client Demo
              </span>
            </div>
            <p className="text-xs text-[#667085] mt-1 leading-relaxed">
              Manage client demonstration data, view local storage status, or restore the curated initial presentation dataset.
            </p>
          </div>

          <button
            onClick={onOpenResetDialog}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-colors shrink-0 shadow-2xs"
          >
            <RotateCcw className="w-4 h-4 text-rose-600" />
            <span>Reset Demo Data</span>
          </button>
        </div>

        {/* Dataset Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-5 pt-4 border-t border-[#F3F4F6]">
          <div className="p-3 bg-[#F9FAFB] rounded-lg border border-[#F3F4F6]">
            <span className="text-[11px] text-[#667085] block">Leads</span>
            <span className="text-sm font-bold text-[#111827] mt-0.5 block">{leads.length} records</span>
          </div>
          <div className="p-3 bg-[#F9FAFB] rounded-lg border border-[#F3F4F6]">
            <span className="text-[11px] text-[#667085] block">Customers</span>
            <span className="text-sm font-bold text-[#111827] mt-0.5 block">{customers.length} accounts</span>
          </div>
          <div className="p-3 bg-[#F9FAFB] rounded-lg border border-[#F3F4F6]">
            <span className="text-[11px] text-[#667085] block">Follow-ups</span>
            <span className="text-sm font-bold text-[#111827] mt-0.5 block">{followUps.length} touches</span>
          </div>
          <div className="p-3 bg-[#F9FAFB] rounded-lg border border-[#F3F4F6]">
            <span className="text-[11px] text-[#667085] block">Deals</span>
            <span className="text-sm font-bold text-[#111827] mt-0.5 block">{deals.length} deals</span>
          </div>
          <div className="p-3 bg-[#F9FAFB] rounded-lg border border-[#F3F4F6]">
            <span className="text-[11px] text-[#667085] block">Audit Log</span>
            <span className="text-sm font-bold text-[#111827] mt-0.5 block">{activities.length} events</span>
          </div>
          <div className="p-3 bg-[#F9FAFB] rounded-lg border border-[#F3F4F6]">
            <span className="text-[11px] text-[#667085] block">Storage Key</span>
            <span className="text-[11px] font-mono font-bold text-[#2563EB] mt-0.5 block truncate">
              {SCHEMA_VERSION}
            </span>
          </div>
        </div>
      </div>

      {/* Product Architecture & Capabilities */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-3">
          <BrandLogo variant="compact" />
          <div>
            <h3 className="text-sm font-bold text-[#111827]">GJ NEXORA CRM — Architecture & Specifications</h3>
            <p className="text-xs text-[#667085]">Demonstrating custom business software engineered by GJ Nexora Technologies</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#111827]">
              <Cpu className="w-4 h-4 text-[#2563EB]" />
              <span>Technology & Performance</span>
            </div>
            <p className="text-[#667085] leading-relaxed">
              Ultra-lightweight React 19 + TypeScript architecture with Tailwind CSS, custom design tokens, and zero external charting bloat. Instant response times and seamless client demonstration.
            </p>
          </div>

          <div className="p-3.5 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#111827]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Realistic Workflow Integrity</span>
            </div>
            <p className="text-[#667085] leading-relaxed">
              Independent Lead & Deal lifecycles, full Lead-to-Customer conversion preserving activity audit trails, multi-channel reminder queues, and dynamic INR ₹ reporting.
            </p>
          </div>
        </div>
      </div>

      {/* Client CTA Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300">
            GJ Nexora Technologies
          </span>
          <h3 className="text-lg font-bold mt-1 text-white">Need software built around your workflow?</h3>
          <p className="text-xs text-blue-200 mt-1 max-w-lg leading-relaxed">
            GJ Nexora Technologies builds custom enterprise CRMs, ERP workflows, and customer management portals tailored to your real-world business operations.
          </p>
        </div>

        <div className="shrink-0">
          <button
            onClick={handleRequestConsultation}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#2563EB] hover:bg-blue-50 font-bold text-xs rounded-lg shadow-sm transition-all"
          >
            <span>Request a Custom Solution</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

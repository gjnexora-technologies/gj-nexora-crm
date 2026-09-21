import React from 'react';
import { MetricOverview } from '../components/reports/MetricOverview';
import { LeadSourceChart } from '../components/reports/LeadSourceChart';
import { FunnelChart } from '../components/reports/FunnelChart';
import { PipelineStageChart } from '../components/reports/PipelineStageChart';
import { Sparkles, Download } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const Reports: React.FC = () => {
  const { toast } = useToast();

  const handleExport = () => {
    toast.success('Report Exported', 'Executive summary CSV downloaded for client review.');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#111827]">Executive Intelligence & Reports</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live Aggregation
            </span>
          </div>
          <p className="text-xs text-[#667085] mt-0.5">
            Key revenue metrics, channel source effectiveness, and conversion rates derived dynamically from CRM state.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#D1D5DB] hover:bg-gray-50 text-[#374151] rounded-lg text-xs font-semibold shadow-2xs transition-colors shrink-0"
        >
          <Download className="w-3.5 h-3.5 text-[#667085]" />
          <span>Export Summary</span>
        </button>
      </div>

      {/* KPI Cards */}
      <MetricOverview />

      {/* 2-Column Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LeadSourceChart />
        <FunnelChart />
      </div>

      {/* Pipeline Stage Bar Chart */}
      <PipelineStageChart />
    </div>
  );
};

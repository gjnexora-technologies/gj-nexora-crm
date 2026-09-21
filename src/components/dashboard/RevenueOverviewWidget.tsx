import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { formatINR } from '../../data/initialData';
import { TrendingUp, Award, Target } from 'lucide-react';

export const RevenueOverviewWidget: React.FC = () => {
  const { metrics, deals } = useCRM();

  const wonDeals = deals.filter((d) => d.stage === 'Won');
  const targetRevenue = 1500000; // ₹15L demo target
  const achievementPct = Math.min(100, Math.round((metrics.wonRevenue / targetRevenue) * 100));

  // Monthly mock trend distribution for clean SVG line
  const points = [
    { month: 'May', val: 180000 },
    { month: 'Jun', val: 240000 },
    { month: 'Jul', val: 320000 },
    { month: 'Aug', val: 390000 },
    { month: 'Sep', val: metrics.wonRevenue },
  ];

  const maxVal = 600000;
  const svgPoints = points
    .map((p, idx) => {
      const x = (idx / (points.length - 1)) * 260 + 20;
      const y = 85 - (p.val / maxVal) * 65;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 sm:p-5 shadow-2xs w-full max-w-full min-w-0 box-border">
      <div className="flex items-center justify-between mb-3.5 gap-2">
        <div className="min-w-0">
          <h3 className="text-xs sm:text-sm font-bold text-[#111827] tracking-tight truncate">
            Revenue & Conversion
          </h3>
          <p className="text-[11px] sm:text-xs text-[#667085] mt-0.5 truncate">
            Current quarter performance trajectory
          </p>
        </div>
        <div className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>+{achievementPct}% target</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 items-center min-w-0">
        {/* Left: Won Revenue & Stats */}
        <div className="space-y-2.5 sm:space-y-3 min-w-0">
          <div className="p-3 bg-[#F9FAFB] rounded-lg border border-[#F3F4F6] min-w-0">
            <div className="flex items-center justify-between text-xs text-[#667085]">
              <span>Closed Won Revenue</span>
              <span className="font-semibold text-emerald-700">{wonDeals.length} deals closed</span>
            </div>
            <p className="text-lg sm:text-xl font-bold text-[#111827] mt-1 font-sans truncate">
              {formatINR(metrics.wonRevenue)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 min-w-0">
            <div className="p-2.5 bg-blue-50/50 rounded-lg border border-blue-100/60 min-w-0">
              <div className="flex items-center gap-1 text-[11px] font-semibold text-[#2563EB] truncate">
                <Target className="w-3 h-3 shrink-0" />
                <span>Avg Deal</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-[#111827] mt-1 truncate">
                {formatINR(metrics.averageDealValue, true)}
              </p>
            </div>

            <div className="p-2.5 bg-purple-50/50 rounded-lg border border-purple-100/60 min-w-0">
              <div className="flex items-center gap-1 text-[11px] font-semibold text-purple-700 truncate">
                <Award className="w-3 h-3 shrink-0" />
                <span>Win Rate</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-[#111827] mt-1 truncate">{metrics.winRate}%</p>
            </div>
          </div>
        </div>

        {/* Right: Pure SVG Trajectory Chart */}
        <div className="p-3 bg-[#F9FAFB] rounded-lg border border-[#F3F4F6] flex flex-col justify-between h-full min-w-0">
          <div className="flex items-center justify-between text-[11px] text-[#667085] mb-1">
            <span className="font-semibold text-[#111827]">Revenue Growth (INR)</span>
            <span>Target: ₹15L</span>
          </div>

          <div className="w-full flex items-center justify-center py-2 min-w-0 overflow-hidden">
            <svg viewBox="0 0 300 95" className="w-full h-20 sm:h-24 max-w-full">
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              <line x1="20" y1="20" x2="280" y2="20" stroke="#E5E7EB" strokeDasharray="3 3" />
              <line x1="20" y1="55" x2="280" y2="55" stroke="#E5E7EB" strokeDasharray="3 3" />
              <line x1="20" y1="85" x2="280" y2="85" stroke="#E5E7EB" />

              {/* Area */}
              <polygon
                points={`20,85 ${svgPoints} 280,85`}
                fill="url(#revenueGrad)"
              />

              {/* Line */}
              <polyline
                fill="none"
                stroke="#2563EB"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={svgPoints}
              />

              {/* Data points */}
              {points.map((p, idx) => {
                const x = (idx / (points.length - 1)) * 260 + 20;
                const y = 85 - (p.val / maxVal) * 65;
                return (
                  <circle
                    key={p.month}
                    cx={x}
                    cy={y}
                    r="3.5"
                    className="fill-white stroke-[#2563EB] stroke-2"
                  />
                );
              })}
            </svg>
          </div>

          <div className="flex justify-between text-[10px] text-[#9CA3AF] px-2 font-medium">
            {points.map((p) => (
              <span key={p.month}>{p.month}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

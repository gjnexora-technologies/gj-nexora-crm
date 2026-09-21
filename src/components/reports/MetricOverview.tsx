import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { StatCard } from '../common/StatCard';
import { formatINR } from '../../data/initialData';
import { IndianRupee, Briefcase, Award, Users, TrendingUp } from 'lucide-react';

export const MetricOverview: React.FC = () => {
  const { metrics, customers } = useCRM();

  const totalLTV = customers.reduce((sum, c) => sum + c.lifetimeValue, 0);
  const avgLTV = customers.length > 0 ? Math.round(totalLTV / customers.length) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Closed Won Revenue"
        value={formatINR(metrics.wonRevenue)}
        subtitle="Current Quarter"
        change="+18.4% QoQ"
        changeType="positive"
        icon={IndianRupee}
        iconBg="bg-emerald-50"
        iconColor="text-emerald-700"
      />
      <StatCard
        title="Active Pipeline Value"
        value={formatINR(metrics.pipelineValue)}
        subtitle="In negotiation"
        change="High confidence"
        changeType="positive"
        icon={Briefcase}
        iconBg="bg-blue-50"
        iconColor="text-[#2563EB]"
      />
      <StatCard
        title="Opportunity Win Rate"
        value={`${metrics.winRate}%`}
        subtitle="Based on closed deals"
        change="Top benchmark"
        changeType="positive"
        icon={Award}
        iconBg="bg-purple-50"
        iconColor="text-purple-700"
      />
      <StatCard
        title="Avg Customer LTV"
        value={formatINR(avgLTV, true)}
        subtitle={`${metrics.totalCustomers} active accounts`}
        change="+9.2% growth"
        changeType="positive"
        icon={Users}
        iconBg="bg-amber-50"
        iconColor="text-amber-800"
      />
    </div>
  );
};

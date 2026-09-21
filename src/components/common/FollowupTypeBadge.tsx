import React from 'react';
import { FollowupType } from '../../types/crm';
import { Phone, MessageSquare, Users, Mail, Calendar } from 'lucide-react';

interface FollowupTypeBadgeProps {
  type: FollowupType;
  size?: 'sm' | 'md';
}

export const FollowupTypeBadge: React.FC<FollowupTypeBadgeProps> = ({ type, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  let Icon = Phone;
  let styling = 'bg-blue-50 text-blue-700 border-blue-200';

  switch (type) {
    case 'Call':
      Icon = Phone;
      styling = 'bg-blue-50 text-blue-700 border-blue-200';
      break;
    case 'WhatsApp':
      Icon = MessageSquare;
      styling = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      break;
    case 'Meeting':
      Icon = Users;
      styling = 'bg-purple-50 text-purple-700 border-purple-200';
      break;
    case 'Email':
      Icon = Mail;
      styling = 'bg-amber-50 text-amber-700 border-amber-200';
      break;
    default:
      Icon = Calendar;
      styling = 'bg-gray-50 text-gray-700 border-gray-200';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${sizeClasses} ${styling} select-none`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{type}</span>
    </span>
  );
};

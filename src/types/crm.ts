export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Converted' | 'Lost';

export type LeadSource = 'Website' | 'WhatsApp' | 'Instagram' | 'Referral' | 'Google' | 'Other';

export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type FollowupType = 'Call' | 'WhatsApp' | 'Meeting' | 'Email' | 'Other';

export type FollowupStatus = 'Scheduled' | 'Completed' | 'Overdue';

export type CustomerStatus = 'Active' | 'Onboarding' | 'VIP' | 'Inactive';

export type DealStage = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Won' | 'Lost';

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: LeadSource;
  status: LeadStatus;
  value: number; // in INR (₹)
  priority: Priority;
  interestedIn: string;
  nextFollowupDate?: string; // YYYY-MM-DD
  nextFollowupTime?: string; // HH:mm AM/PM
  nextFollowupType?: FollowupType;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  convertedCustomerId?: string;
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: CustomerStatus;
  lifetimeValue: number;
  dealsCount: number;
  customerSince: string;
  lastContactDate: string;
  industry: string;
  city: string;
  originalLeadId?: string;
}

export interface FollowUp {
  id: string;
  title: string;
  company: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "11:30 AM"
  type: FollowupType;
  status: FollowupStatus;
  relatedEntityType: 'lead' | 'customer' | 'deal';
  relatedEntityId: string;
  notes?: string;
  completedAt?: string;
}

export interface Deal {
  id: string;
  title: string;
  company: string;
  contactName: string;
  value: number; // in INR
  stage: DealStage;
  priority: Priority;
  expectedCloseDate: string;
  createdAt: string;
  probability: number; // 0 to 100
  relatedLeadId?: string;
  relatedCustomerId?: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type:
    | 'lead_created'
    | 'lead_status_changed'
    | 'lead_converted'
    | 'followup_scheduled'
    | 'followup_completed'
    | 'followup_rescheduled'
    | 'deal_created'
    | 'deal_stage_changed'
    | 'note_added'
    | 'customer_created';
  entityType: 'lead' | 'customer' | 'deal' | 'followup';
  entityId: string;
  entityName: string;
  author: string;
}

export interface Note {
  id: string;
  entityType: 'lead' | 'customer' | 'deal';
  entityId: string;
  content: string;
  author: string;
  createdAt: string;
}

export interface CRMState {
  version: string;
  leads: Lead[];
  customers: Customer[];
  followUps: FollowUp[];
  deals: Deal[];
  activities: Activity[];
  notes: Note[];
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
}

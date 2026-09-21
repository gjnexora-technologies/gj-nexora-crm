import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  CRMState,
  Lead,
  Customer,
  FollowUp,
  Deal,
  Activity,
  Note,
  LeadStatus,
  DealStage,
} from '../types/crm';
import { getInitialState, SCHEMA_VERSION } from '../data/initialData';
import { useToast } from './ToastContext';

interface CRMContextType {
  // State
  leads: Lead[];
  customers: Customer[];
  followUps: FollowUp[];
  deals: Deal[];
  activities: Activity[];
  notes: Note[];
  
  // Dynamic Derived Metrics
  metrics: {
    totalLeads: number;
    totalCustomers: number;
    followupsDueCount: number;
    todayFollowupsCount: number;
    overdueFollowupsCount: number;
    pipelineValue: number;
    wonRevenue: number;
    averageDealValue: number;
    winRate: number;
  };

  // Actions
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => Lead;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  updateLeadStatus: (id: string, status: LeadStatus) => void;
  convertLeadToCustomer: (leadId: string) => Customer | null;
  
  addCustomer: (customer: Omit<Customer, 'id' | 'customerSince' | 'dealsCount'>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  
  addFollowUp: (followUp: Omit<FollowUp, 'id' | 'status'>) => FollowUp;
  completeFollowUp: (id: string, noteText?: string) => void;
  rescheduleFollowUp: (id: string, newDate: string, newTime: string) => void;
  
  addDeal: (deal: Omit<Deal, 'id' | 'createdAt'>) => Deal;
  updateDealStage: (id: string, stage: DealStage) => void;
  
  addNote: (entityType: 'lead' | 'customer' | 'deal', entityId: string, content: string) => void;
  
  resetDemoData: () => void;
  
  // Navigation & Drawer Helpers
  activeDrawer: {
    type: 'lead' | 'customer' | null;
    id: string | null;
  };
  openLeadDrawer: (id: string) => void;
  openCustomerDrawer: (id: string) => void;
  closeDrawer: () => void;
}

const CRM_STORAGE_KEY = SCHEMA_VERSION;

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();

  // Load state from localStorage with version validation
  const [state, setState] = useState<CRMState>(() => {
    try {
      const stored = localStorage.getItem(CRM_STORAGE_KEY);
      if (stored) {
        const parsed: CRMState = JSON.parse(stored);
        if (parsed.version === SCHEMA_VERSION && Array.isArray(parsed.leads)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load CRM state from localStorage, initializing fresh data', e);
    }
    return getInitialState();
  });

  // Drawer state
  const [activeDrawer, setActiveDrawer] = useState<{ type: 'lead' | 'customer' | null; id: string | null }>({
    type: null,
    id: null,
  });

  // Save to localStorage on state changes
  useEffect(() => {
    try {
      localStorage.setItem(CRM_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to persist CRM state', e);
    }
  }, [state]);

  // Activity logger helper
  const logActivity = useCallback(
    (
      type: Activity['type'],
      title: string,
      description: string,
      entityType: Activity['entityType'],
      entityId: string,
      entityName: string
    ) => {
      const newActivity: Activity = {
        id: 'act-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
        title,
        description,
        timestamp: 'Just now',
        type,
        entityType,
        entityId,
        entityName,
        author: 'Demo User',
      };

      setState((prev) => ({
        ...prev,
        activities: [newActivity, ...prev.activities],
      }));
    },
    []
  );

  // Dynamic Calculated Metrics
  const metrics = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Follow-ups due = Scheduled for today or before today
    const dueFollowups = state.followUps.filter(
      (f) => f.status === 'Scheduled' || f.status === 'Overdue'
    );
    const todayFollowups = state.followUps.filter(
      (f) => f.date === todayStr && f.status === 'Scheduled'
    );
    const overdueFollowups = state.followUps.filter(
      (f) => f.status === 'Overdue' || (f.date < todayStr && f.status === 'Scheduled')
    );

    // Active pipeline deals (excluding Lost)
    const activeDeals = state.deals.filter((d) => d.stage !== 'Lost');
    const wonDeals = state.deals.filter((d) => d.stage === 'Won');
    const pipelineValue = state.deals
      .filter((d) => d.stage !== 'Won' && d.stage !== 'Lost')
      .reduce((sum, d) => sum + d.value, 0);
    const wonRevenue = wonDeals.reduce((sum, d) => sum + d.value, 0);

    const averageDealValue = activeDeals.length > 0
      ? Math.round(activeDeals.reduce((sum, d) => sum + d.value, 0) / activeDeals.length)
      : 0;

    const completedDealsCount = state.deals.filter((d) => d.stage === 'Won' || d.stage === 'Lost').length;
    const winRate = completedDealsCount > 0
      ? Math.round((wonDeals.length / completedDealsCount) * 100)
      : 75;

    return {
      totalLeads: state.leads.length,
      totalCustomers: state.customers.length,
      followupsDueCount: dueFollowups.length,
      todayFollowupsCount: todayFollowups.length,
      overdueFollowupsCount: overdueFollowups.length,
      pipelineValue,
      wonRevenue,
      averageDealValue,
      winRate,
    };
  }, [state]);

  // Actions
  const addLead = useCallback(
    (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
      const todayStr = new Date().toISOString().split('T')[0];
      const newLead: Lead = {
        ...leadData,
        id: 'lead-' + Date.now(),
        createdAt: todayStr,
        updatedAt: todayStr,
      };

      setState((prev) => ({
        ...prev,
        leads: [newLead, ...prev.leads],
      }));

      logActivity(
        'lead_created',
        'Lead Created',
        `${newLead.name} from ${newLead.company} added as a new lead.`,
        'lead',
        newLead.id,
        newLead.company
      );

      // If lead had a scheduled followup, create it automatically
      if (newLead.nextFollowupDate) {
        const newFollowup: FollowUp = {
          id: 'fol-' + Date.now(),
          title: `Initial discovery with ${newLead.name}`,
          company: newLead.company,
          contactName: newLead.name,
          contactEmail: newLead.email,
          contactPhone: newLead.phone,
          date: newLead.nextFollowupDate,
          time: newLead.nextFollowupTime || '11:00 AM',
          type: newLead.nextFollowupType || 'Call',
          status: 'Scheduled',
          relatedEntityType: 'lead',
          relatedEntityId: newLead.id,
          notes: newLead.interestedIn,
        };
        setState((prev) => ({
          ...prev,
          followUps: [newFollowup, ...prev.followUps],
        }));
      }

      toast.success('Lead created successfully', `${newLead.company} was added to your pipeline.`);
      return newLead;
    },
    [logActivity, toast]
  );

  const updateLead = useCallback(
    (id: string, updates: Partial<Lead>) => {
      const todayStr = new Date().toISOString().split('T')[0];
      setState((prev) => {
        const lead = prev.leads.find((l) => l.id === id);
        if (!lead) return prev;
        return {
          ...prev,
          leads: prev.leads.map((l) =>
            l.id === id ? { ...l, ...updates, updatedAt: todayStr } : l
          ),
        };
      });
      toast.info('Lead updated', 'Lead details saved.');
    },
    [toast]
  );

  const updateLeadStatus = useCallback(
    (id: string, status: LeadStatus) => {
      const todayStr = new Date().toISOString().split('T')[0];
      let companyName = '';
      setState((prev) => {
        const lead = prev.leads.find((l) => l.id === id);
        if (lead) companyName = lead.company;
        return {
          ...prev,
          leads: prev.leads.map((l) =>
            l.id === id ? { ...l, status, updatedAt: todayStr } : l
          ),
        };
      });

      if (companyName) {
        logActivity(
          'lead_status_changed',
          'Lead Status Updated',
          `${companyName} status changed to ${status}.`,
          'lead',
          id,
          companyName
        );
      }

      toast.success('Status updated', `Lead is now marked as ${status}.`);
    },
    [logActivity, toast]
  );

  const convertLeadToCustomer = useCallback(
    (leadId: string): Customer | null => {
      const todayStr = new Date().toISOString().split('T')[0];
      const lead = state.leads.find((l) => l.id === leadId);
      if (!lead) return null;

      const newCustomerId = 'cust-' + Date.now();
      const newCustomer: Customer = {
        id: newCustomerId,
        name: lead.name,
        company: lead.company,
        email: lead.email,
        phone: lead.phone,
        status: 'Active',
        lifetimeValue: lead.value,
        dealsCount: 1,
        customerSince: todayStr,
        lastContactDate: todayStr,
        industry: lead.interestedIn || 'Corporate Enterprise',
        city: 'Mumbai',
        originalLeadId: lead.id,
      };

      // Create a converted deal if none existed
      const newDeal: Deal = {
        id: 'deal-' + Date.now(),
        title: lead.interestedIn || `${lead.company} Contract`,
        company: lead.company,
        contactName: lead.name,
        value: lead.value,
        stage: 'Qualified',
        priority: lead.priority,
        expectedCloseDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
        createdAt: todayStr,
        probability: 70,
        relatedCustomerId: newCustomerId,
        relatedLeadId: lead.id,
      };

      setState((prev) => ({
        ...prev,
        // Mark lead as Converted
        leads: prev.leads.map((l) =>
          l.id === leadId ? { ...l, status: 'Converted', convertedCustomerId: newCustomerId, updatedAt: todayStr } : l
        ),
        // Add new customer
        customers: [newCustomer, ...prev.customers],
        // Add deal
        deals: [newDeal, ...prev.deals],
        // Re-link followups to customer
        followUps: prev.followUps.map((f) =>
          f.relatedEntityId === leadId ? { ...f, relatedEntityType: 'customer', relatedEntityId: newCustomerId } : f
        ),
        // Re-link notes to customer
        notes: prev.notes.map((n) =>
          n.entityId === leadId ? { ...n, entityType: 'customer', entityId: newCustomerId } : n
        ),
      }));

      logActivity(
        'lead_converted',
        'Lead Converted to Customer',
        `${lead.company} (${lead.name}) converted into an active customer account.`,
        'customer',
        newCustomerId,
        lead.company
      );

      toast.success(
        'Lead converted successfully',
        `${lead.company} is now an active Customer with full relationship history preserved.`
      );

      return newCustomer;
    },
    [state.leads, logActivity, toast]
  );

  const addCustomer = useCallback(
    (customerData: Omit<Customer, 'id' | 'customerSince' | 'dealsCount'>) => {
      const todayStr = new Date().toISOString().split('T')[0];
      const newCustomer: Customer = {
        ...customerData,
        id: 'cust-' + Date.now(),
        customerSince: todayStr,
        dealsCount: 0,
      };

      setState((prev) => ({
        ...prev,
        customers: [newCustomer, ...prev.customers],
      }));

      logActivity(
        'customer_created',
        'Customer Profile Created',
        `${newCustomer.company} (${newCustomer.name}) added to customers directory.`,
        'customer',
        newCustomer.id,
        newCustomer.company
      );

      toast.success('Customer added', `${newCustomer.company} has been added.`);
      return newCustomer;
    },
    [logActivity, toast]
  );

  const updateCustomer = useCallback(
    (id: string, updates: Partial<Customer>) => {
      setState((prev) => ({
        ...prev,
        customers: prev.customers.map((c) => (c.id === id ? { ...c, ...updates } : c)),
      }));
      toast.info('Customer updated', 'Customer profile changes saved.');
    },
    [toast]
  );

  const addFollowUp = useCallback(
    (followUpData: Omit<FollowUp, 'id' | 'status'>) => {
      const newFollowUp: FollowUp = {
        ...followUpData,
        id: 'fol-' + Date.now(),
        status: 'Scheduled',
      };

      setState((prev) => ({
        ...prev,
        followUps: [newFollowUp, ...prev.followUps],
      }));

      logActivity(
        'followup_scheduled',
        'Follow-up Scheduled',
        `Scheduled ${newFollowUp.type} with ${newFollowUp.company} for ${newFollowUp.date} at ${newFollowUp.time}.`,
        'followup',
        newFollowUp.id,
        newFollowUp.company
      );

      toast.success('Follow-up scheduled', `${newFollowUp.type} set for ${newFollowUp.company}.`);
      return newFollowUp;
    },
    [logActivity, toast]
  );

  const completeFollowUp = useCallback(
    (id: string, noteText?: string) => {
      const todayStr = new Date().toISOString().split('T')[0];
      let companyName = '';
      setState((prev) => {
        const item = prev.followUps.find((f) => f.id === id);
        if (item) companyName = item.company;
        return {
          ...prev,
          followUps: prev.followUps.map((f) =>
            f.id === id ? { ...f, status: 'Completed', completedAt: todayStr } : f
          ),
        };
      });

      if (companyName) {
        logActivity(
          'followup_completed',
          'Follow-up Completed',
          `Follow-up completed for ${companyName}. ${noteText ? `Note: "${noteText}"` : ''}`,
          'followup',
          id,
          companyName
        );
      }

      toast.success('Follow-up completed', `Marked as done for ${companyName || 'contact'}.`);
    },
    [logActivity, toast]
  );

  const rescheduleFollowUp = useCallback(
    (id: string, newDate: string, newTime: string) => {
      let companyName = '';
      setState((prev) => {
        const item = prev.followUps.find((f) => f.id === id);
        if (item) companyName = item.company;
        return {
          ...prev,
          followUps: prev.followUps.map((f) =>
            f.id === id ? { ...f, date: newDate, time: newTime, status: 'Scheduled' } : f
          ),
        };
      });

      if (companyName) {
        logActivity(
          'followup_rescheduled',
          'Follow-up Rescheduled',
          `Rescheduled for ${companyName} to ${newDate} at ${newTime}.`,
          'followup',
          id,
          companyName
        );
      }

      toast.info('Follow-up rescheduled', `Moved to ${newDate} at ${newTime}.`);
    },
    [logActivity, toast]
  );

  const addDeal = useCallback(
    (dealData: Omit<Deal, 'id' | 'createdAt'>) => {
      const todayStr = new Date().toISOString().split('T')[0];
      const newDeal: Deal = {
        ...dealData,
        id: 'deal-' + Date.now(),
        createdAt: todayStr,
      };

      setState((prev) => ({
        ...prev,
        deals: [newDeal, ...prev.deals],
      }));

      logActivity(
        'deal_created',
        'Deal Created',
        `Deal "${newDeal.title}" for ${newDeal.company} created in ${newDeal.stage}.`,
        'deal',
        newDeal.id,
        newDeal.company
      );

      toast.success('Deal created', `"${newDeal.title}" added to pipeline.`);
      return newDeal;
    },
    [logActivity, toast]
  );

  const updateDealStage = useCallback(
    (id: string, stage: DealStage) => {
      let companyName = '';
      let dealTitle = '';
      setState((prev) => {
        const item = prev.deals.find((d) => d.id === id);
        if (item) {
          companyName = item.company;
          dealTitle = item.title;
        }
        return {
          ...prev,
          deals: prev.deals.map((d) => (d.id === id ? { ...d, stage } : d)),
        };
      });

      if (dealTitle) {
        logActivity(
          'deal_stage_changed',
          stage === 'Won' ? 'Deal Won 🎉' : 'Deal Stage Updated',
          `Deal "${dealTitle}" moved to stage: ${stage}.`,
          'deal',
          id,
          companyName
        );
      }

      toast.success('Deal updated', `Moved to ${stage} stage.`);
    },
    [logActivity, toast]
  );

  const addNote = useCallback(
    (entityType: 'lead' | 'customer' | 'deal', entityId: string, content: string) => {
      const newNote: Note = {
        id: 'note-' + Date.now(),
        entityType,
        entityId,
        content,
        author: 'Demo User',
        createdAt: 'Just now',
      };

      setState((prev) => ({
        ...prev,
        notes: [newNote, ...prev.notes],
      }));

      logActivity(
        'note_added',
        'Note Added',
        `Added note: "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`,
        entityType,
        entityId,
        entityType.toUpperCase()
      );

      toast.success('Note added', 'Saved to relationship timeline.');
    },
    [logActivity, toast]
  );

  const resetDemoData = useCallback(() => {
    try {
      localStorage.removeItem(CRM_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
    const fresh = getInitialState();
    setState(fresh);
    setActiveDrawer({ type: null, id: null });
    toast.info('Demo data reset', 'Restored original presentation dataset.');
  }, [toast]);

  const openLeadDrawer = useCallback((id: string) => {
    setActiveDrawer({ type: 'lead', id });
  }, []);

  const openCustomerDrawer = useCallback((id: string) => {
    setActiveDrawer({ type: 'customer', id });
  }, []);

  const closeDrawer = useCallback(() => {
    setActiveDrawer({ type: null, id: null });
  }, []);

  return (
    <CRMContext.Provider
      value={{
        leads: state.leads,
        customers: state.customers,
        followUps: state.followUps,
        deals: state.deals,
        activities: state.activities,
        notes: state.notes,
        metrics,
        addLead,
        updateLead,
        updateLeadStatus,
        convertLeadToCustomer,
        addCustomer,
        updateCustomer,
        addFollowUp,
        completeFollowUp,
        rescheduleFollowUp,
        addDeal,
        updateDealStage,
        addNote,
        resetDemoData,
        activeDrawer,
        openLeadDrawer,
        openCustomerDrawer,
        closeDrawer,
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};

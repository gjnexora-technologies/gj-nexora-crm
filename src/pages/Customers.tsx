import React from 'react';
import { CustomersTable } from '../components/customers/CustomersTable';

interface CustomersProps {
  onOpenAddModal: () => void;
  onOpenCustomerDrawer: (id: string) => void;
}

export const Customers: React.FC<CustomersProps> = ({
  onOpenAddModal,
  onOpenCustomerDrawer,
}) => {
  return (
    <div className="space-y-6 pb-12">
      <CustomersTable
        onOpenAddModal={onOpenAddModal}
        onOpenCustomerDrawer={onOpenCustomerDrawer}
      />
    </div>
  );
};

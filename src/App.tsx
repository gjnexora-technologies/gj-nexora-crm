import React from 'react';
import { ToastProvider } from './context/ToastContext';
import { CRMProvider } from './context/CRMContext';
import { AppShell } from './components/layout/AppShell';

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <CRMProvider>
        <AppShell />
      </CRMProvider>
    </ToastProvider>
  );
};

export default App;

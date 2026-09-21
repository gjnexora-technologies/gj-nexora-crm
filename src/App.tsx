import React, { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { CRMProvider } from './context/CRMContext';
import { AppShell } from './components/layout/AppShell';
import { AppSplashScreen } from './components/layout/AppSplashScreen';

export const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <ToastProvider>
      <CRMProvider>
        {showSplash && (
          <AppSplashScreen onComplete={() => setShowSplash(false)} durationMs={1350} />
        )}
        <AppShell />
      </CRMProvider>
    </ToastProvider>
  );
};

export default App;

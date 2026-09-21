import React, { useState, useEffect } from 'react';

interface AppSplashScreenProps {
  onComplete?: () => void;
  durationMs?: number; // total duration before starting fadeout
}

export const AppSplashScreen: React.FC<AppSplashScreenProps> = ({
  onComplete,
  durationMs = 1350,
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    // Start exit transition after durationMs
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, durationMs);

    // Completely unmount after fade-out transition completes (350ms fade)
    const unmountTimer = setTimeout(() => {
      setIsMounted(false);
      if (onComplete) onComplete();
    }, durationMs + 350);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(unmountTimer);
    };
  }, [durationMs, onComplete]);

  if (!isMounted) return null;

  return (
    <div
      aria-label="GJ Nexora CRM Opening Screen"
      role="status"
      className={`fixed inset-0 z-[9999] bg-[#F7F8FA] flex flex-col items-center justify-center select-none pointer-events-auto transition-all duration-350 ease-out ${
        isExiting
          ? 'opacity-0 scale-[1.01] pointer-events-none'
          : 'opacity-100 scale-100'
      }`}
    >
      <div className="flex flex-col items-center text-center px-4 max-w-sm">
        {/* Favicon Logo with smooth cubic-bezier scale & fade entrance */}
        <div className="animate-splash-logo mb-4">
          <img
            src="/favicon_1.png"
            alt="GJ Nexora CRM"
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-2xl shadow-xs"
            loading="eager"
          />
        </div>

        {/* Brand Name Reveal */}
        <div className="animate-splash-text">
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight font-sans">
            GJ NEXORA CRM
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] font-medium mt-1 tracking-normal">
            Business Management • Simplified
          </p>
        </div>

        {/* Subtle Entrance Progress Line */}
        <div className="w-40 sm:w-48 h-1 bg-[#E5E7EB] rounded-full overflow-hidden mt-6 animate-splash-fade">
          <div className="h-full bg-[#2563EB] rounded-full animate-splash-progress" />
        </div>
      </div>
    </div>
  );
};

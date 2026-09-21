import React from 'react';

interface BrandLogoProps {
  variant?: 'desktop' | 'mobile' | 'compact';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'desktop',
  className = '',
}) => {
  // Mobile brand mark uses favicon_1.png (28px) with clean compact typography (UNCHANGED)
  if (variant === 'mobile') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <img
          src="/favicon_1.png"
          alt="GJ Nexora CRM"
          className="w-7 h-7 sm:w-8 sm:h-8 object-contain rounded select-none shrink-0"
          loading="eager"
        />
        <div className="flex flex-col justify-center min-w-0">
          <span className="font-extrabold text-xs tracking-tight text-[#111827] leading-none truncate">
            GJ NEXORA
          </span>
          <span className="text-[9px] font-bold text-[#2563EB] tracking-wider leading-none mt-0.5">
            CRM • DEMO
          </span>
        </div>
      </div>
    );
  }

  // Compact variant (icon only)
  if (variant === 'compact') {
    return (
      <img
        src="/favicon_1.png"
        alt="GJ Nexora CRM"
        className={`w-7 h-7 object-contain rounded select-none shrink-0 ${className}`}
        loading="eager"
      />
    );
  }

  // Desktop full brand logo: ~160px wide, centered, maintaining aspect ratio
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img
        src="/gj_crm.png"
        alt="GJ Nexora CRM"
        className="w-[160px] h-auto max-h-12 object-contain select-none"
        loading="eager"
      />
    </div>
  );
};

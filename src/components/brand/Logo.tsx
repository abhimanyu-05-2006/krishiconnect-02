import React from 'react';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  variant?: 'full' | 'mark' | 'horizontal';
  theme?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
  variant = 'full',
  theme = 'light',
}) => {
  // Exact asset path provided by the user
  const logoSrc = '/assets/aistudio/Krishi_Connect__Farms_to_Homes_7b6e4fc8.png';

  // Responsive dimensions tailored to size prop
  const heights = {
    xs: 'h-8 sm:h-9',
    sm: 'h-10 sm:h-11',
    md: 'h-12 sm:h-14',
    lg: 'h-16 sm:h-20',
    xl: 'h-24 sm:h-28',
  };

  return (
    <div className={`inline-flex items-center gap-2 select-none group ${className}`}>
      {/* High-fidelity official logo asset */}
      <img
        src={logoSrc}
        alt="KrishiConnect - From Our Farms to Your Homes"
        className={`${heights[size]} w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02] filter ${
          theme === 'dark' ? 'brightness-110 drop-shadow-[0_2px_12px_rgba(255,255,255,0.18)]' : 'drop-shadow-sm'
        }`}
        loading="eager"
      />
    </div>
  );
};

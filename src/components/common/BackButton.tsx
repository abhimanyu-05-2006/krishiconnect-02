import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.js';

interface BackButtonProps {
  onClick: () => void;
  label?: string;
  variant?: 'subtle' | 'solid' | 'pill' | 'white';
  className?: string;
  showIcon?: boolean;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  label,
  variant = 'subtle',
  className = '',
  showIcon = true,
}) => {
  const { t } = useLanguage();
  const text = label || t('btn_back', 'Back');

  const baseStyles =
    'inline-flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer rounded-xl group select-none';

  let variantStyles = '';
  switch (variant) {
    case 'solid':
      variantStyles =
        'bg-[#174D35] text-white hover:bg-[#123B28] px-3.5 py-2 shadow-xs';
      break;
    case 'pill':
      variantStyles =
        'bg-white/90 text-[#174D35] hover:bg-white border border-[#174D35]/20 px-3 py-1.5 rounded-full shadow-2xs hover:shadow-xs';
      break;
    case 'white':
      variantStyles =
        'bg-white text-[#174D35] hover:bg-[#F7F8F2] border border-[#174D35]/15 px-3 py-1.5 shadow-2xs';
      break;
    case 'subtle':
    default:
      variantStyles =
        'bg-[#174D35]/8 text-[#174D35] hover:bg-[#174D35]/15 border border-[#174D35]/15 px-3 py-1.5';
      break;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseStyles} ${variantStyles} ${className}`}
      title={text}
      aria-label={text}
    >
      {showIcon && (
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
      )}
      <span>{text}</span>
    </button>
  );
};

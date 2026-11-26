import React from 'react';

interface TaskScriptLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
  showSubtitle?: boolean;
  layout?: 'horizontal' | 'vertical';
}

export const TaskScriptLogo: React.FC<TaskScriptLogoProps> = ({
  size = 'md',
  variant = 'light',
  showSubtitle = true,
  layout = 'horizontal',
}) => {
  const sizeMap = {
    xs: { icon: 'w-7 h-7', text: 'text-base', sub: 'text-[9px]' },
    sm: { icon: 'w-8 h-8', text: 'text-lg', sub: 'text-[10px]' },
    md: { icon: 'w-10 h-10', text: 'text-xl', sub: 'text-xs' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', sub: 'text-sm' },
  };

  const textColor = variant === 'light' ? 'text-white' : 'text-slate-900';
  const subColor = variant === 'light' ? 'text-sky-300/80' : 'text-slate-500';

  return (
    <div
      className={`flex items-center select-none ${
        layout === 'vertical' ? 'flex-col text-center gap-2' : 'flex-row gap-2.5'
      }`}
    >
      {/* TaskScript Geometric Brand Mark */}
      <div
        className={`${sizeMap[size].icon} relative rounded-xl bg-gradient-to-tr from-[#003875] via-[#0052CC] to-[#00A3FF] p-[1.5px] shadow-md shadow-sky-950/40 shrink-0 group`}
      >
        <div className="w-full h-full rounded-[10px] bg-[#00142A] flex items-center justify-center relative overflow-hidden">
          {/* Subtle grid accent inside logo */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          
          <svg
            className="w-3/5 h-3/5 text-[#00A3FF]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Terminal prompt script bracket & underscore cursor */}
            <polyline points="4 17 10 11 4 5" />
            <line x1="12" y1="19" x2="20" y2="19" strokeWidth="3" />
          </svg>
        </div>
      </div>

      {/* Brand Wordmark */}
      <div className="flex flex-col leading-none">
        <div className={`font-extrabold tracking-headline font-display ${textColor} ${sizeMap[size].text} flex items-center`}>
          <span>Task</span>
          <span className="text-[#00A3FF]">Script</span>
        </div>
        {showSubtitle && (
          <span className={`font-semibold font-ui tracking-wider uppercase mt-1 ${subColor} ${sizeMap[size].sub}`}>
            Prompt &amp; SOP Engine
          </span>
        )}
      </div>
    </div>
  );
};

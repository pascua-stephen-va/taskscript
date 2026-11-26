import React, { useState } from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

interface ReactiveButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'brand' | 'navy' | 'cyan' | 'secondary' | 'gold' | 'outline' | 'dark-outline' | 'glass' | 'ghost' | 'danger' | 'ai';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  badge?: string | number;
}

export const ReactiveButton: React.FC<ReactiveButtonProps> = ({
  variant = 'brand',
  size = 'md',
  icon,
  children,
  className = '',
  badge,
  onClick,
  disabled,
  ...props
}) => {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { x, y, id: Date.now() };

    setRipples((prev) => [...prev.slice(-3), newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);

    if (onClick) {
      onClick(e);
    }
  };

  const variantStyles = {
    // TaskScript Brand Royal Blue
    brand:
      'bg-[#0052CC] text-white hover:bg-[#0043A8] active:bg-[#00358A] shadow-xs hover:shadow-md border border-[#0052CC]/30 font-semibold',
    // Midnight Navy
    primary:
      'bg-[#001B39] text-white hover:bg-[#0A2540] active:bg-[#001226] shadow-xs hover:shadow-md border border-[#001B39]/20 font-semibold',
    navy:
      'bg-[#001B39] text-white hover:bg-[#0A2540] active:bg-[#001226] shadow-xs hover:shadow-md border border-[#001B39]/20 font-semibold',
    // Electric Cyan
    cyan:
      'bg-[#00A3FF] text-white hover:bg-[#008FE0] active:bg-[#007AC0] shadow-xs hover:shadow-md border border-[#00A3FF]/30 font-semibold',
    // AI Gemini Gradient
    ai:
      'bg-gradient-to-r from-[#0052CC] via-[#0066EE] to-[#00A3FF] text-white hover:from-[#0043A8] hover:via-[#0052CC] hover:to-[#008FE0] active:from-[#00358A] shadow-md hover:shadow-lg border border-sky-300/40 font-semibold text-shadow-xs',
    // Amber Accent Gold
    gold:
      'bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 active:bg-amber-600 shadow-xs hover:shadow-md border border-amber-600/30 font-semibold',
    // Clean Slate secondary
    secondary:
      'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 active:bg-slate-300 dark:active:bg-slate-600 border border-slate-200/90 dark:border-slate-700 font-semibold',
    // Outline style (Light background)
    outline:
      'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 active:bg-slate-100 dark:active:bg-slate-700 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 shadow-2xs font-semibold',
    // Dark outline / Glass style for dark hero containers
    'dark-outline':
      'bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 border border-slate-700 hover:border-sky-400/50 shadow-xs font-semibold',
    glass:
      'bg-[#002244]/80 text-white hover:bg-[#003366] active:bg-[#001B39] border border-sky-500/30 hover:border-sky-400/50 shadow-sm font-semibold',
    // Ghost
    ghost:
      'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 active:bg-slate-200 dark:active:bg-slate-700 font-semibold',
    // Danger
    danger:
      'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 active:bg-rose-200 dark:active:bg-rose-800/60 border border-rose-200 dark:border-rose-800 font-semibold',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5',
    md: 'px-4 py-2 text-sm rounded-2xl gap-2',
    lg: 'px-5 py-2.5 text-base rounded-2xl gap-2.5',
  };

  return (
    <motion.button
      whileHover={disabled ? undefined : { y: -1, scale: 1.015 }}
      whileTap={disabled ? undefined : { scale: 0.96, y: 0 }}
      transition={{ type: 'spring', stiffness: 450, damping: 25 }}
      onClick={handleClick}
      disabled={disabled}
      className={`relative overflow-hidden inline-flex items-center justify-center font-ui font-semibold tracking-ui transition-all cursor-pointer select-none whitespace-nowrap shrink-0 ${
        disabled ? 'opacity-65 cursor-not-allowed pointer-events-none' : ''
      } ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {/* Tap Ripple Effect */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none animate-ping opacity-25 bg-white"
          style={{
            left: ripple.x - 12,
            top: ripple.y - 12,
            width: 24,
            height: 24,
          }}
        />
      ))}

      {icon && <span className="shrink-0 flex items-center">{icon}</span>}
      <span className="whitespace-nowrap">{children}</span>

      {badge !== undefined && (
        <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-white/20 text-current whitespace-nowrap">
          {badge}
        </span>
      )}
    </motion.button>
  );
};

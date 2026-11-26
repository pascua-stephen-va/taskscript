import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Theme, ThemeMode } from '../hooks/useTheme';

export interface ThemeToggleProps {
  theme?: Theme;
  mode?: ThemeMode;
  systemTheme?: Theme;
  onSelectMode?: (mode: ThemeMode) => void;
  onToggle?: () => void;
  onSelectTheme?: (theme: Theme) => void;
  isSystemAuto?: boolean;
  onResetToSystem?: () => void;
}

const iconTransition = {
  type: 'spring' as const,
  stiffness: 320,
  damping: 24,
  mass: 0.6,
};

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  theme = 'light',
  mode,
  systemTheme = 'light',
  onSelectMode,
  onToggle,
  onSelectTheme,
  isSystemAuto,
  onResetToSystem,
}) => {
  const activeMode: ThemeMode =
    mode || (isSystemAuto ? 'auto' : theme === 'dark' ? 'dark' : 'light');
  const effectiveTheme: Theme = activeMode === 'auto' ? theme || systemTheme : activeMode;

  const getNextMode = (): ThemeMode => {
    if (activeMode === 'auto') {
      return effectiveTheme === 'dark' ? 'light' : 'dark';
    }
    if (systemTheme === 'dark') {
      return activeMode === 'light' ? 'dark' : 'auto';
    }
    return activeMode === 'dark' ? 'light' : 'auto';
  };

  const handleCycleMode = () => {
    const nextMode = getNextMode();
    if (onSelectMode) {
      onSelectMode(nextMode);
    } else if (nextMode === 'auto' && onResetToSystem) {
      onResetToSystem();
    } else if (nextMode !== 'auto' && onSelectTheme) {
      onSelectTheme(nextMode);
    } else if (onToggle) {
      onToggle();
    }
  };

  const nextMode = getNextMode();
  const modeLabel =
    activeMode === 'auto' ? 'Auto' : activeMode === 'dark' ? 'Dark' : 'Light';
  const nextLabel =
    nextMode === 'auto' ? 'Auto' : nextMode === 'dark' ? 'Dark' : 'Light';
  const tooltipText = `Theme: ${modeLabel} (switch to ${nextLabel})`;

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.92 }}
      onClick={handleCycleMode}
      title={tooltipText}
      aria-label={tooltipText}
      className="relative inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3FF] transition-colors cursor-pointer shrink-0"
    >
      <span className="relative inline-flex items-center justify-center w-4 h-4">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={activeMode}
            initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0.6, opacity: 0 }}
            transition={iconTransition}
            className="absolute inset-0 flex items-center justify-center"
          >
            {activeMode === 'auto' ? (
              <Monitor className="w-4 h-4 text-sky-300" />
            ) : activeMode === 'dark' ? (
              <Moon className="w-4 h-4 text-sky-300" />
            ) : (
              <Sun className="w-4 h-4 text-amber-300" />
            )}
          </motion.span>
        </AnimatePresence>
      </span>
    </motion.button>
  );
};

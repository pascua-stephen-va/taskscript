import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Theme, ThemeMode } from '../hooks/useTheme';

export interface ThemeToggleProps {
  theme?: Theme;
  mode?: ThemeMode;
  systemTheme?: Theme;
  onSelectMode?: (mode: ThemeMode) => void;
  // Fallbacks for compatibility
  onToggle?: () => void;
  onSelectTheme?: (theme: Theme) => void;
  isSystemAuto?: boolean;
  onResetToSystem?: () => void;
  compact?: boolean;
}

const iconTransition = {
  type: 'spring' as const,
  stiffness: 260,
  damping: 20,
  mass: 0.7,
};

/**
 * Tactile Sun/Moon icon that smoothly rotates 180deg whenever the active
 * theme switches — whether triggered by a click or an OS preference change.
 */
const AnimatedThemeIcon: React.FC<{
  effectiveTheme: Theme;
  sizeClass?: string;
}> = ({ effectiveTheme, sizeClass = 'w-4 h-4' }) => {
  const isDark = effectiveTheme === 'dark';

  return (
    <span className={`relative inline-flex items-center justify-center ${sizeClass} shrink-0`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={effectiveTheme}
          initial={{ rotate: -180, scale: 0.55, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 180, scale: 0.55, opacity: 0 }}
          transition={iconTransition}
          className="absolute inset-0 flex items-center justify-center"
        >
          {isDark ? (
            <Moon className={`${sizeClass} text-sky-300`} />
          ) : (
            <Sun className={`${sizeClass} text-amber-300`} />
          )}
        </motion.span>
      </AnimatePresence>
    </span>
  );
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
  compact = false,
}) => {
  // Determine current active mode and resolved visual theme
  const activeMode: ThemeMode =
    mode || (isSystemAuto ? 'auto' : theme === 'dark' ? 'dark' : 'light');
  const effectiveTheme: Theme = activeMode === 'auto' ? (theme || systemTheme) : activeMode;
  const isAuto = activeMode === 'auto';

  const handleToggleLightDark = () => {
    const nextTheme: Theme = effectiveTheme === 'dark' ? 'light' : 'dark';
    if (onSelectMode) {
      onSelectMode(nextTheme);
    } else if (onSelectTheme) {
      onSelectTheme(nextTheme);
    } else if (onToggle) {
      onToggle();
    }
  };

  const handleEnableAuto = () => {
    if (onSelectMode) {
      onSelectMode('auto');
    } else if (onResetToSystem) {
      onResetToSystem();
    }
  };

  // Compact mobile version
  if (compact) {
    return (
      <div
        className="inline-flex items-center bg-[#001328] border border-[#0a3666] rounded-full p-0.5 select-none shadow-inner shrink-0 gap-0.5"
        role="group"
        aria-label="Theme selector"
      >
        <motion.button
          type="button"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleToggleLightDark}
          className={`relative p-1.5 rounded-full text-xs transition-colors cursor-pointer flex items-center justify-center ${
            !isAuto
              ? 'text-white font-bold'
              : 'text-[#8da3be] hover:text-white hover:bg-white/5'
          }`}
          title={
            effectiveTheme === 'dark'
              ? 'Switch to Light Mode'
              : 'Switch to Dark Mode'
          }
          aria-label={
            effectiveTheme === 'dark'
              ? 'Switch to Light Mode'
              : 'Switch to Dark Mode'
          }
          aria-pressed={!isAuto}
        >
          {!isAuto && (
            <motion.div
              layoutId="compactThemeActivePill"
              className="absolute inset-0 bg-[#003875] border border-sky-400/30 rounded-full shadow-xs"
              transition={{ type: 'spring', stiffness: 500, damping: 32 }}
            />
          )}
          <span className="relative z-10 flex items-center justify-center">
            <AnimatedThemeIcon effectiveTheme={effectiveTheme} sizeClass="w-3.5 h-3.5" />
          </span>
        </motion.button>

        <motion.button
          type="button"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleEnableAuto}
          className={`relative p-1.5 rounded-full text-xs transition-colors cursor-pointer flex items-center justify-center ${
            isAuto
              ? 'text-white font-bold'
              : 'text-[#8da3be] hover:text-white hover:bg-white/5'
          }`}
          title="Match system theme automatically"
          aria-label="Auto system theme"
          aria-pressed={isAuto}
        >
          {isAuto && (
            <motion.div
              layoutId="compactThemeActivePill"
              className="absolute inset-0 bg-[#003875] border border-sky-400/30 rounded-full shadow-xs"
              transition={{ type: 'spring', stiffness: 500, damping: 32 }}
            />
          )}
          <Monitor className="relative z-10 w-3.5 h-3.5 text-sky-300" />
        </motion.button>
      </div>
    );
  }

  // Desktop tactile Sun/Moon toggle with 180deg icon rotation + Auto system sync button
  return (
    <div
      className="inline-flex items-center bg-[#001328] border border-[#0a3666] rounded-full p-1 select-none shadow-inner shrink-0 backdrop-blur-sm gap-0.5"
      role="group"
      aria-label="Theme mode selector"
    >
      {/* 1. Tactile Light / Dark Toggle Button (rotates 180deg on click OR OS change) */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleToggleLightDark}
        className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-ui font-semibold tracking-ui transition-colors cursor-pointer ${
          !isAuto
            ? 'text-white font-bold'
            : 'text-[#c3d4e8] hover:text-white hover:bg-[#002042]/70'
        }`}
        aria-pressed={!isAuto}
        aria-label={
          effectiveTheme === 'dark'
            ? 'Current theme: Dark. Click to switch to Light mode'
            : 'Current theme: Light. Click to switch to Dark mode'
        }
        title={
          effectiveTheme === 'dark'
            ? 'Switch to Light Mode'
            : 'Switch to Dark Mode'
        }
      >
        {!isAuto && (
          <motion.div
            layoutId="themeActivePill"
            className="absolute inset-0 bg-[#003875] border border-sky-400/25 rounded-full shadow-xs"
            transition={{ type: 'spring', stiffness: 500, damping: 32 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-1.5">
          <AnimatedThemeIcon effectiveTheme={effectiveTheme} sizeClass="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="leading-none w-8 text-left">
            {effectiveTheme === 'dark' ? 'Dark' : 'Light'}
          </span>
        </span>
      </motion.button>

      {/* 2. Auto System Preference Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleEnableAuto}
        className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-ui font-semibold tracking-ui transition-colors cursor-pointer ${
          isAuto
            ? 'text-white font-bold'
            : 'text-[#8da3be] hover:text-white hover:bg-[#002042]/70'
        }`}
        aria-pressed={isAuto}
        title="Automatically match your system color scheme"
      >
        {isAuto && (
          <motion.div
            layoutId="themeActivePill"
            className="absolute inset-0 bg-[#003875] border border-sky-400/25 rounded-full shadow-xs"
            transition={{ type: 'spring', stiffness: 500, damping: 32 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-1.5">
          <Monitor
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-colors ${
              isAuto ? 'text-white' : 'text-[#4ba3e3]'
            }`}
          />
          <span className="leading-none">Auto</span>
        </span>
      </motion.button>
    </div>
  );
};

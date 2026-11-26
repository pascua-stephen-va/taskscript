import React from 'react';
import { motion } from 'motion/react';
import { HelpCircle } from 'lucide-react';
import { TaskScriptLogo } from './TaskScriptLogo';
import { ThemeToggle } from './ThemeToggle';
import { Theme, ThemeMode } from '../hooks/useTheme';

interface NavbarProps {
  activeTab: 'vault' | 'studio' | 'sops' | 'sheets';
  setActiveTab: (tab: 'vault' | 'studio' | 'sops' | 'sheets') => void;
  onOpenTourGuide?: () => void;
  theme: Theme;
  mode?: ThemeMode;
  systemTheme?: Theme;
  onSelectMode?: (mode: ThemeMode) => void;
  onToggleTheme: () => void;
  onSelectTheme?: (theme: Theme) => void;
  isSystemAuto?: boolean;
  onResetToSystem?: () => void;
}

const NAV_ITEMS = [
  { id: 'vault' as const, label: 'Vault' },
  { id: 'studio' as const, label: 'Studio' },
  { id: 'sops' as const, label: 'SOPs' },
  { id: 'sheets' as const, label: 'Sync' },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenTourGuide,
  theme,
  mode,
  systemTheme,
  onSelectMode,
  onToggleTheme,
  onSelectTheme,
  isSystemAuto = false,
  onResetToSystem,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#00132B]/95 dark:bg-[#000F22]/95 text-white border-b border-sky-950/80 dark:border-slate-800/80 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-8">
          {/* 1. Left: Clean Brand Wordmark */}
          <button
            type="button"
            onClick={() => setActiveTab('vault')}
            className="shrink-0 cursor-pointer rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3FF]"
            aria-label="TaskScript Home"
          >
            <TaskScriptLogo size="sm" variant="light" showSubtitle={false} layout="horizontal" />
          </button>

          {/* 2. Center: Flat Typography Navigation */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-7 h-full shrink-0"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`relative h-full inline-flex items-center px-1 text-sm font-ui font-semibold tracking-ui transition-colors cursor-pointer select-none whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:text-white ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 hover:text-slate-100'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="taskscriptActiveTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00A3FF] rounded-full"
                      transition={{
                        type: 'spring',
                        stiffness: 460,
                        damping: 32,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* 3. Right: Compact Icon-Only Utilities */}
          <div className="flex items-center gap-1 shrink-0">
            <ThemeToggle
              theme={theme}
              mode={mode}
              systemTheme={systemTheme}
              onSelectMode={onSelectMode}
              onToggle={onToggleTheme}
              onSelectTheme={onSelectTheme}
              isSystemAuto={isSystemAuto}
              onResetToSystem={onResetToSystem}
            />

            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              onClick={() => onOpenTourGuide?.()}
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3FF] transition-colors cursor-pointer shrink-0"
              title="Tour Guide"
              aria-label="Open Tour Guide"
            >
              <HelpCircle className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Slim Mobile Underline Navigation */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden border-t border-sky-950/70 dark:border-slate-800/70 px-4"
      >
        <div className="grid grid-cols-4">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`relative py-2.5 text-xs font-ui font-semibold tracking-ui text-center transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:text-slate-100'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span>{item.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="taskscriptMobileTabUnderline"
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#00A3FF] rounded-full"
                    transition={{
                      type: 'spring',
                      stiffness: 460,
                      damping: 32,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};

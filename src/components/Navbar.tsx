import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calculator,
  FileText,
  LayoutGrid,
  HelpCircle,
  Plus,
  Search,
  FileSpreadsheet,
  Menu,
  X,
} from 'lucide-react';
import { TaskScriptLogo } from './TaskScriptLogo';
import { ThemeToggle } from './ThemeToggle';
import { Theme, ThemeMode } from '../hooks/useTheme';

interface NavbarProps {
  activeTab: 'vault' | 'studio' | 'sops' | 'sheets';
  setActiveTab: (tab: 'vault' | 'studio' | 'sops' | 'sheets') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenNewPrompt: () => void;
  onOpenSheetsModal: () => void;
  totalPromptsCount: number;
  totalCopiesCount: number;
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

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onOpenNewPrompt,
  onOpenSheetsModal,
  totalPromptsCount,
  totalCopiesCount,
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      id: 'vault' as const,
      label: 'Prompt Vault',
      icon: <Calculator className="w-4 h-4" />,
    },
    {
      id: 'studio' as const,
      label: 'Interactive Studio',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'sops' as const,
      label: 'SOP Matrix',
      icon: <LayoutGrid className="w-4 h-4" />,
    },
    {
      id: 'sheets' as const,
      label: 'Sheets & Sync',
      icon: <FileSpreadsheet className="w-4 h-4" />,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#00132B] dark:bg-[#000F22] text-white border-b border-sky-950 dark:border-slate-800 shadow-md backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3 sm:gap-6">
          {/* 1. Left: TaskScript Brand Mark + App Title & Subtitle */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
            {/* TaskScript Logo */}
            <div className="shrink-0 select-none">
              <TaskScriptLogo size="sm" variant="light" showSubtitle={false} layout="horizontal" />
            </div>

            {/* Vertical Divider */}
            <div className="h-7 w-px bg-slate-700/70 shrink-0 hidden sm:block" />

            {/* Title, Badge & Subtitle */}
            <div className="select-none hidden sm:block shrink-0">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-semibold font-ui tracking-wider text-[#00A3FF] bg-[#002B59]/80 border border-[#0070BA]/80 uppercase whitespace-nowrap">
                  PROMPT &amp; SOP HUB
                </span>
                <span className="text-[11px] text-slate-400 font-medium font-ui tracking-ui">
                  {totalPromptsCount} Workflows
                </span>
              </div>
              <p className="text-[10.5px] sm:text-[11px] text-slate-400 font-medium font-body mt-0.5 leading-normal whitespace-nowrap">
                Standardized AI Workflow &amp; Procedure Launcher
              </p>
            </div>
          </div>

          {/* 2. Center: Pill Navigation Bar */}
          <nav className="hidden lg:flex items-center bg-[#002244]/80 dark:bg-slate-900/80 border border-sky-900/60 dark:border-slate-800 rounded-full p-1 shadow-inner shrink-0 backdrop-blur-md">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.93, y: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 25,
                    mass: 0.5,
                  }}
                  className={`relative flex items-center gap-1.5 px-3.5 xl:px-4.5 py-1.5 xl:py-2 rounded-full text-[12px] xl:text-[13px] font-ui font-semibold tracking-ui transition-colors cursor-pointer select-none whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="taskscriptActiveTabPill"
                      className="absolute inset-0 bg-[#00A3FF] rounded-full shadow-lg shadow-sky-500/40 border border-sky-300/30"
                      transition={{
                        type: 'spring',
                        stiffness: 420,
                        damping: 28,
                        mass: 0.7,
                      }}
                    />
                  )}
                  <motion.span
                    animate={{
                      scale: isActive ? 1.08 : 1,
                      y: isActive ? -0.5 : 0,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 24,
                    }}
                    className="relative z-10 shrink-0"
                  >
                    {item.icon}
                  </motion.span>
                  <span className="relative z-10 tracking-tight whitespace-nowrap">{item.label}</span>
                </motion.button>
              );
            })}
          </nav>

          {/* 3. Right: Theme Toggle, Tour Guide, Sheets Sync & New Prompt Pill Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Light / Dark Mode Toggle (Desktop) */}
            <div className="hidden sm:block">
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
            </div>

            {/* Sheets & Sync Modal Pill Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={onOpenSheetsModal}
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-sky-800/60 bg-[#002244]/40 hover:bg-[#002B59] text-sky-200 hover:text-white font-ui font-semibold tracking-ui text-xs transition-all cursor-pointer shadow-xs whitespace-nowrap shrink-0"
              title="Sheets & low-code export"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#00A3FF] shrink-0" />
              <span className="whitespace-nowrap">Sheets Sync</span>
            </motion.button>

            {/* Tour Guide Pill Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={() => onOpenTourGuide?.()}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 xl:px-3.5 py-1.5 xl:py-2 rounded-full border border-sky-800/80 bg-[#002244]/50 hover:bg-[#002B59] text-sky-300 hover:text-white font-ui font-semibold tracking-ui text-xs xl:text-sm transition-all cursor-pointer shadow-xs whitespace-nowrap shrink-0"
              title="Open TaskScript Tour Guide"
            >
              <HelpCircle className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-[#00A3FF] shrink-0" />
              <span className="whitespace-nowrap">Tour Guide</span>
            </motion.button>

            {/* New Prompt Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={onOpenNewPrompt}
              className="inline-flex items-center gap-1.5 px-3.5 xl:px-4 py-1.5 xl:py-2 rounded-full bg-[#0052CC] hover:bg-[#0066EE] text-white font-ui font-semibold tracking-ui text-xs xl:text-sm transition-all cursor-pointer shadow-xs border border-sky-400/30 whitespace-nowrap shrink-0"
              title="Add New Department Prompt"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">New Prompt</span>
            </motion.button>

            {/* Compact Mobile Theme Toggle */}
            <div className="sm:hidden">
              <ThemeToggle
                theme={theme}
                mode={mode}
                systemTheme={systemTheme}
                onSelectMode={onSelectMode}
                onToggle={onToggleTheme}
                onSelectTheme={onSelectTheme}
                isSystemAuto={isSystemAuto}
                onResetToSystem={onResetToSystem}
                compact
              />
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white lg:hidden rounded-full hover:bg-slate-800 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Horizontal Pill Navigation (Responsive fallback) */}
        <div className="lg:hidden pb-3 pt-1 border-t border-sky-950 dark:border-slate-800 flex items-center justify-start overflow-x-auto no-scrollbar gap-1.5">
          <div className="flex items-center bg-[#002244]/90 dark:bg-slate-900/90 border border-sky-900/70 dark:border-slate-800 rounded-full p-1 shadow-inner">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#00A3FF] text-white shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
          <button
            onClick={() => onOpenTourGuide?.()}
            className="sm:hidden px-3 py-1.5 rounded-full border border-sky-700 bg-sky-950/80 text-[#00A3FF] font-bold text-xs whitespace-nowrap"
          >
            Tour Guide
          </button>
        </div>
      </div>

      {/* Mobile Drawer if opened */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.2, 0.0, 0, 1.0] }}
            className="lg:hidden border-t border-sky-950 dark:border-slate-800 bg-[#001738] dark:bg-slate-900 px-4 py-3 space-y-2 overflow-hidden"
          >
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search prompts & SOPs..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-[#001E3D] dark:bg-slate-950 border border-sky-900/80 dark:border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#00A3FF]"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenSheetsModal();
                }}
                className="px-3 py-2 rounded-xl bg-[#002244] dark:bg-slate-800 border border-sky-900 dark:border-slate-700 text-xs font-bold text-slate-200 hover:bg-[#002D5A] flex items-center justify-center gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#00A3FF]" />
                <span>Sheets Sync</span>
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenNewPrompt();
                }}
                className="px-3 py-2 rounded-xl bg-[#0052CC] text-white text-xs font-bold hover:bg-[#0066EE] flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Prompt</span>
              </button>
            </div>
            <div className="pt-2 border-t border-sky-950 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenTourGuide?.();
                  }}
                  className="text-sky-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 py-1.5"
                >
                  <HelpCircle className="w-4 h-4 text-[#00A3FF]" />
                  <span>Tour Guide</span>
                </button>
                <ThemeToggle
                  theme={theme}
                  onToggle={onToggleTheme}
                  isSystemAuto={isSystemAuto}
                />
              </div>
              <span className="text-slate-400 text-xs font-mono">
                {totalCopiesCount.toLocaleString()} Total Runs
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

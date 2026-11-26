/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  SlidersHorizontal,
  BookOpen,
  Search,
  X,
  ArrowUpDown,
  Star,
  FileSpreadsheet,
  Zap,
} from 'lucide-react';
import { PromptItem, Department } from './types';
import { INITIAL_PROMPT_ITEMS, DEPARTMENT_CONFIG } from './data/defaultData';
import { Navbar } from './components/Navbar';
import { DepartmentRail } from './components/DepartmentRail';
import { PromptCard } from './components/PromptCard';
import { InteractiveStudio } from './components/InteractiveStudio';
import { SopLibraryView } from './components/SopLibraryView';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { ReactiveButton } from './components/ReactiveButton';
import { useTheme } from './hooks/useTheme';

const SopModal = lazy(() =>
  import('./components/SopModal').then((m) => ({ default: m.SopModal }))
);
const NewPromptModal = lazy(() =>
  import('./components/NewPromptModal').then((m) => ({ default: m.NewPromptModal }))
);
const GoogleSheetsSyncModal = lazy(() =>
  import('./components/GoogleSheetsSyncModal').then((m) => ({
    default: m.GoogleSheetsSyncModal,
  }))
);
const TourGuideModal = lazy(() =>
  import('./components/TourGuideModal').then((m) => ({ default: m.TourGuideModal }))
);

const STORAGE_KEY = 'taskscript_prompts_v1';
const LEGACY_STORAGE_KEY = 'proxflow_prompts_v1';
const COPIES_KEY = 'taskscript_total_copies';
const LEGACY_COPIES_KEY = 'proxflow_total_copies';
const TOUR_SEEN_KEY = 'taskscript_has_seen_tour';

export default function App() {
  const {
    theme,
    mode,
    systemTheme,
    setMode,
    toggleTheme,
    setTheme,
    resetToSystemTheme,
    isSystemAuto,
  } = useTheme();
  const [prompts, setPrompts] = useState<PromptItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading saved prompts:', e);
    }
    return INITIAL_PROMPT_ITEMS;
  });

  const [totalCopies, setTotalCopies] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(COPIES_KEY) || localStorage.getItem(LEGACY_COPIES_KEY);
      return saved ? parseInt(saved, 10) : 842;
    } catch {
      return 842;
    }
  });

  // Navigation and Filter States
  const [activeTab, setActiveTab] = useState<'vault' | 'studio' | 'sops' | 'sheets'>('vault');
  const [selectedDept, setSelectedDept] = useState<Department>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'alphabetical'>('popular');

  // Modals & Active Selections
  const [activeSopItem, setActiveSopItem] = useState<PromptItem | null>(null);
  const [studioItem, setStudioItem] = useState<PromptItem | null>(prompts[0] || null);
  const [isNewPromptModalOpen, setIsNewPromptModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<PromptItem | null>(null);
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);
  const vaultSearchInputRef = useRef<HTMLInputElement | null>(null);

  // Toast Notification State
  const [toastInfo, setToastInfo] = useState<{ message: string; subMessage?: string } | null>(null);

  // Trigger Tour automatically for first time users
  useEffect(() => {
    const hasSeenTour = localStorage.getItem(TOUR_SEEN_KEY);
    if (hasSeenTour !== 'true') {
      const timer = setTimeout(() => {
        setIsTourModalOpen(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, []);

  // Save to LocalStorage whenever prompts changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
    } catch (e) {
      console.error('Failed to save to local storage:', e);
    }
  }, [prompts]);

  // Save total copies
  useEffect(() => {
    try {
      localStorage.setItem(COPIES_KEY, totalCopies.toString());
    } catch (e) {
      console.error('Failed to save copy counter:', e);
    }
  }, [totalCopies]);

  // Handle Global keyboard shortcut (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (activeTab !== 'vault') {
          setActiveTab('vault');
          setTimeout(() => vaultSearchInputRef.current?.focus(), 60);
        } else {
          vaultSearchInputRef.current?.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);

  // Department counts
  const departmentCounts = useMemo(() => {
    const counts: Record<string, number> = { all: prompts.length };
    prompts.forEach((p) => {
      counts[p.department] = (counts[p.department] || 0) + 1;
    });
    return counts;
  }, [prompts]);

  // Favorites count
  const favoritesCount = useMemo(() => {
    return prompts.filter((p) => p.isFavorite).length;
  }, [prompts]);

  // Filtered & Sorted prompts
  const filteredPrompts = useMemo(() => {
    return prompts
      .filter((item) => {
        const matchesDept = selectedDept === 'all' || item.department === selectedDept;
        const matchesFavorites = !onlyFavorites || !!item.isFavorite;
        const matchesTag = !selectedTag || item.tags.includes(selectedTag);

        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.taskType.toLowerCase().includes(q) ||
          item.basePrompt.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q));

        return matchesDept && matchesFavorites && matchesTag && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.usageCount - a.usageCount;
        if (sortBy === 'recent') return (b.createdAt || '').localeCompare(a.createdAt || '');
        return a.title.localeCompare(b.title);
      });
  }, [prompts, selectedDept, onlyFavorites, selectedTag, searchQuery, sortBy]);

  // Handle Copy Action
  const handleCopyPrompt = (promptText: string, title: string) => {
    setTotalCopies((prev) => prev + 1);
    setToastInfo({
      message: '1-Click Prompt Copied!',
      subMessage: `"${title}" is copied and ready to paste into ChatGPT, Claude, or Teams.`,
    });
    setTimeout(() => {
      setToastInfo(null);
    }, 3500);
  };

  // Toggle Favorite
  const handleToggleFavorite = (id: string) => {
    setPrompts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  // Open Studio with item
  const handleOpenStudio = (item: PromptItem) => {
    setStudioItem(item);
    setActiveTab('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open SOP Modal with item
  const handleOpenSop = (item: PromptItem) => {
    setActiveSopItem(item);
  };

  // Add or update custom prompt
  const handleSavePrompt = (savedItem: PromptItem) => {
    const isUpdate = prompts.some((p) => p.id === savedItem.id);
    setPrompts((prev) =>
      isUpdate ? prev.map((p) => (p.id === savedItem.id ? savedItem : p)) : [savedItem, ...prev]
    );
    if (studioItem?.id === savedItem.id) {
      setStudioItem(savedItem);
    }
    if (activeSopItem?.id === savedItem.id) {
      setActiveSopItem(savedItem);
    }
    setEditingPrompt(null);
    setToastInfo({
      message: isUpdate ? 'Template Updated!' : 'New Template Saved!',
      subMessage: `"${savedItem.title}" was ${isUpdate ? 'updated in' : 'added to'} the ${DEPARTMENT_CONFIG[savedItem.department]?.label} vault.`,
    });
    setTimeout(() => setToastInfo(null), 3500);
  };

  // Edit custom prompt
  const handleEditPrompt = (item: PromptItem) => {
    setEditingPrompt(item);
    setIsNewPromptModalOpen(true);
  };

  // Delete custom prompt
  const handleDeletePrompt = (id: string) => {
    const target = prompts.find((p) => p.id === id);
    const remaining = prompts.filter((p) => p.id !== id);
    setPrompts(remaining);
    if (studioItem?.id === id) {
      setStudioItem(remaining[0] || null);
    }
    if (activeSopItem?.id === id) {
      setActiveSopItem(null);
    }
    setToastInfo({
      message: 'Custom Prompt Deleted',
      subMessage: target ? `"${target.title}" was removed from your vault.` : 'Template removed.',
    });
    setTimeout(() => setToastInfo(null), 3500);
  };

  // Import prompts from JSON
  const handleImportItems = (imported: PromptItem[]) => {
    setPrompts(imported);
    setToastInfo({
      message: 'Database Restored!',
      subMessage: `Imported ${imported.length} prompt & SOP templates successfully.`,
    });
    setTimeout(() => setToastInfo(null), 3500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Enterprise Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenNewPrompt={() => {
          setEditingPrompt(null);
          setIsNewPromptModalOpen(true);
        }}
        onOpenSheetsModal={() => setIsSheetsModalOpen(true)}
        onOpenTourGuide={() => setIsTourModalOpen(true)}
        totalPromptsCount={prompts.length}
        totalCopiesCount={totalCopies}
        theme={theme}
        mode={mode}
        systemTheme={systemTheme}
        onSelectMode={setMode}
        onToggleTheme={toggleTheme}
        onSelectTheme={setTheme}
        isSystemAuto={isSystemAuto}
        onResetToSystem={resetToSystemTheme}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 overflow-hidden">
        <AnimatePresence mode="wait">
          {/* VIEW 1: PROMPT & SOP VAULT */}
          {activeTab === 'vault' && (
            <motion.div
              key="vault"
              initial={{ opacity: 0, y: 16, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.985 }}
              transition={{
                type: 'spring',
                stiffness: 380,
                damping: 28,
                mass: 0.8,
              }}
              className="space-y-6"
            >
              {/* Expressive Hero Welcome Card for Operations Teams */}
              <div className="relative overflow-hidden bg-gradient-to-br from-[#001B39] via-[#0A2540] to-[#0A192F] rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-slate-800">
              {/* Decorative Accent Glow */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-3xl space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold font-ui tracking-wider bg-amber-400 text-slate-950 flex items-center gap-1 shadow-xs">
                    <Zap className="w-3.5 h-3.5 fill-slate-950" />
                    QUICK-LAUNCHER DASHBOARD
                  </span>
                  <span className="text-xs text-slate-300 font-medium font-ui tracking-ui">
                    TaskScript Operations Suite
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-headline font-display text-white leading-snug">
                  Department-Specific AI Prompts &amp; SOP Execution Vault
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 leading-body max-w-2xl font-body font-normal">
                  Side-by-side standard operating procedures and instant 1-click AI prompt templates. Select your department, click to copy into ChatGPT, or open the Interactive Studio to auto-assemble variables.
                </p>

                {/* Quick Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <ReactiveButton
                    variant="gold"
                    size="sm"
                    onClick={() => {
                      setStudioItem(prompts[0]);
                      setActiveTab('studio');
                    }}
                    icon={<SlidersHorizontal className="w-4 h-4" />}
                  >
                    Launch Interactive Studio
                  </ReactiveButton>

                  <ReactiveButton
                    variant="dark-outline"
                    size="sm"
                    onClick={() => setActiveTab('sops')}
                    icon={<BookOpen className="w-4 h-4 text-sky-400" />}
                  >
                    Browse SOP Library
                  </ReactiveButton>

                  <ReactiveButton
                    variant="dark-outline"
                    size="sm"
                    onClick={() => setIsSheetsModalOpen(true)}
                    icon={<FileSpreadsheet className="w-4 h-4 text-amber-300" />}
                    className="border-amber-400/40 hover:border-amber-300/70"
                  >
                    Google Sheets / AppSheet Guide
                  </ReactiveButton>
                </div>
              </div>
            </div>

            {/* Department Navigation Rail */}
            <DepartmentRail
              selectedDept={selectedDept}
              onSelectDept={(dept) => {
                setSelectedDept(dept);
                setSelectedTag(null);
              }}
              onlyFavorites={onlyFavorites}
              onToggleFavorites={() => setOnlyFavorites(!onlyFavorites)}
              counts={departmentCounts}
              favoritesCount={favoritesCount}
            />

            {/* Active Filters, Search & Sorting Controls */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs transition-colors duration-200">
              <div className="flex items-center gap-2 flex-wrap text-xs text-slate-600 dark:text-slate-400">
                <span className="font-semibold font-ui text-slate-900 dark:text-slate-100">
                  Showing {filteredPrompts.length} of {prompts.length} Prompts
                </span>
                {selectedDept !== 'all' && (
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold font-ui tracking-ui">
                    Dept: {DEPARTMENT_CONFIG[selectedDept]?.label}
                  </span>
                )}
                {searchQuery && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-semibold font-ui tracking-ui">
                    Search: "{searchQuery}"
                  </span>
                )}
                {onlyFavorites && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-semibold font-ui tracking-ui flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    Starred Only
                  </span>
                )}
              </div>

              {/* Search Input & Sort By Dropdown */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="relative w-full sm:w-64 lg:w-72">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    ref={vaultSearchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search prompts, tags, or SOPs..."
                    aria-label="Search prompts, tags, or SOPs"
                    className="w-full pl-8 pr-14 py-1.5 text-xs font-ui font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0052CC]/30 focus:border-[#0052CC]"
                  />
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                      ⌘K
                    </kbd>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs shrink-0">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium font-ui">
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    Sort by:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-2.5 py-1.5 text-xs font-semibold font-ui bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  >
                    <option value="popular">Most Used / Popular</option>
                    <option value="recent">Recently Added</option>
                    <option value="alphabetical">Alphabetical (A-Z)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Prompt Cards Grid */}
            {filteredPrompts.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
                  No Prompts Match Your Filters
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
                  Try clearing your search query or switching to All Departments.
                </p>
                <ReactiveButton
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedDept('all');
                    setOnlyFavorites(false);
                    setSelectedTag(null);
                  }}
                >
                  Reset All Filters
                </ReactiveButton>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredPrompts.map((item) => (
                  <PromptCard
                    key={item.id}
                    item={item}
                    onCopyPrompt={handleCopyPrompt}
                    onOpenStudio={handleOpenStudio}
                    onOpenSop={handleOpenSop}
                    onToggleFavorite={handleToggleFavorite}
                    onEditPrompt={handleEditPrompt}
                    onDeletePrompt={handleDeletePrompt}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* VIEW 2: INTERACTIVE PROMPT STUDIO */}
        {activeTab === 'studio' && (
          <motion.div
            key="studio"
            initial={{ opacity: 0, y: 16, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.985 }}
            transition={{
              type: 'spring',
              stiffness: 380,
              damping: 28,
              mass: 0.8,
            }}
          >
            <InteractiveStudio
              selectedItem={studioItem}
              allItems={prompts}
              onSelectItem={(item) => setStudioItem(item)}
              onOpenSop={handleOpenSop}
              onCopyPrompt={handleCopyPrompt}
              onBackToVault={() => setActiveTab('vault')}
            />
          </motion.div>
        )}

        {/* VIEW 3: SOP LIBRARY & STEP-BY-STEP CHECKLISTS */}
        {activeTab === 'sops' && (
          <motion.div
            key="sops"
            initial={{ opacity: 0, y: 16, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.985 }}
            transition={{
              type: 'spring',
              stiffness: 380,
              damping: 28,
              mass: 0.8,
            }}
          >
            <SopLibraryView
              items={prompts}
              onOpenSop={handleOpenSop}
              onOpenStudio={handleOpenStudio}
              onCopyPrompt={handleCopyPrompt}
            />
          </motion.div>
        )}

        {/* VIEW 4: GOOGLE SHEETS & APP BUILDING HUB */}
        {activeTab === 'sheets' && (
          <motion.div
            key="sheets"
            initial={{ opacity: 0, y: 16, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.985 }}
            transition={{
              type: 'spring',
              stiffness: 380,
              damping: 28,
              mass: 0.8,
            }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-r from-[#00142A] via-[#001E3D] to-[#002B59] rounded-3xl p-6 sm:p-8 text-white shadow-md border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-2xl bg-amber-400 text-slate-950">
                    <FileSpreadsheet className="w-5 h-5" />
                  </span>
                  <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                    Internal Ecosystem &amp; Sync
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  Google Sheets, AppSheet &amp; Power Apps Architecture
                </h2>
                <p className="text-xs sm:text-sm text-sky-200/90 leading-relaxed">
                  Connect your team's internal Google Drive, Google Sheets, or Microsoft 365 environment without third-party subscriptions.
                </p>
              </div>

              <ReactiveButton
                variant="gold"
                size="md"
                onClick={() => setIsSheetsModalOpen(true)}
                icon={<FileSpreadsheet className="w-4 h-4" />}
                className="shrink-0"
              >
                Open Full Interactive Hub
              </ReactiveButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Option 1 AppSheet Card */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between transition-colors duration-200">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 flex items-center justify-center font-black">
                      1
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                        Google Workspace &amp; AppSheet Method
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Recommended for Google Drive &amp; Gmail teams
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Export the TaskScript database as a CSV, import into Google Sheets, then go to <strong>Extensions &gt; AppSheet &gt; Create an app</strong>. Add a 1-click clipboard action.
                  </p>

                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300">
                    CONCATENATE([Base Prompt], " Client: ", [Prospect Name], " Topic: ", [Topic])
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-2.5">
                  <ReactiveButton
                    variant="brand"
                    size="sm"
                    onClick={() => setIsSheetsModalOpen(true)}
                    icon={<FileSpreadsheet className="w-4 h-4" />}
                  >
                    Launch Google AppSheet Guide
                  </ReactiveButton>
                </div>
              </div>

              {/* Option 2 Power Apps Card */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between transition-colors duration-200">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 flex items-center justify-center font-black">
                      2
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                        Microsoft 365 &amp; Power Apps Method
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Recommended for Outlook &amp; Microsoft Teams teams
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Import the CSV into <strong>Microsoft Lists</strong>, click <strong>Integrate &gt; Power Apps &gt; Create an app</strong>, and pin the app directly into your team's Microsoft Teams channel sidebar.
                  </p>

                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300">
                    "Summarize for " &amp; Dropdown1.Selected.Value &amp; ": " &amp; TextInput1.Text
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-2.5">
                  <ReactiveButton
                    variant="outline"
                    size="sm"
                    onClick={() => setIsSheetsModalOpen(true)}
                    icon={<FileSpreadsheet className="w-4 h-4 text-indigo-700" />}
                  >
                    Launch Microsoft 365 Guide
                  </ReactiveButton>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </main>

      {/* Global Interactive Modals (Lazy-Loaded) */}
      <Suspense fallback={null}>
        {activeSopItem && (
          <SopModal
            item={activeSopItem}
            onClose={() => setActiveSopItem(null)}
            onOpenStudio={handleOpenStudio}
            onCopyPrompt={handleCopyPrompt}
          />
        )}

        {isNewPromptModalOpen && (
          <NewPromptModal
            isOpen={isNewPromptModalOpen}
            editingItem={editingPrompt}
            onClose={() => {
              setIsNewPromptModalOpen(false);
              setEditingPrompt(null);
            }}
            onSave={handleSavePrompt}
          />
        )}

        {isSheetsModalOpen && (
          <GoogleSheetsSyncModal
            isOpen={isSheetsModalOpen}
            onClose={() => setIsSheetsModalOpen(false)}
            items={prompts}
            onImportItems={handleImportItems}
          />
        )}

        {isTourModalOpen && (
          <TourGuideModal
            isOpen={isTourModalOpen}
            onClose={() => setIsTourModalOpen(false)}
            onSelectTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </Suspense>

      {/* Material 3 Toast Notification */}
      <Toast
        message={toastInfo?.message || null}
        subMessage={toastInfo?.subMessage}
        onClose={() => setToastInfo(null)}
      />

      {/* 3-Column Enterprise Footer */}
      <Footer
        onOpenDept={(dept) => {
          setSelectedDept(dept);
          setActiveTab('vault');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSheetsModal={() => setIsSheetsModalOpen(true)}
      />
    </div>
  );
}

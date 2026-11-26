import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  BookOpen,
  Search,
  Clock,
  SlidersHorizontal,
  Copy,
  Check,
} from 'lucide-react';
import { PromptItem, Department } from '../types';
import { DEPARTMENT_CONFIG } from '../data/defaultData';
import { ReactiveButton } from './ReactiveButton';

interface SopLibraryViewProps {
  items: PromptItem[];
  onOpenSop: (item: PromptItem) => void;
  onOpenStudio: (item: PromptItem) => void;
  onCopyPrompt: (promptText: string, title: string) => void;
}

export const SopLibraryView: React.FC<SopLibraryViewProps> = ({
  items,
  onOpenSop,
  onOpenStudio,
  onCopyPrompt,
}) => {
  const [selectedDept, setSelectedDept] = useState<Department>('all');
  const [query, setQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredItems = items.filter((item) => {
    const matchesDept = selectedDept === 'all' || item.department === selectedDept;
    const matchesSearch =
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.sop.summary.toLowerCase().includes(query.toLowerCase()) ||
      item.sop.title.toLowerCase().includes(query.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
    return matchesDept && matchesSearch;
  });

  const handleCopy = (item: PromptItem) => {
    navigator.clipboard.writeText(item.basePrompt);
    setCopiedId(item.id);
    onCopyPrompt(item.basePrompt, item.title);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-gradient-to-r from-[#001B39] via-[#002D62] to-[#0047BA] rounded-3xl p-6 sm:p-8 text-white shadow-md border border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <span className="p-2 rounded-2xl bg-white/10 text-sky-300">
            <BookOpen className="w-5 h-5" />
          </span>
          <span className="text-xs font-semibold font-ui uppercase tracking-wider text-sky-300">
            Standard Operating Procedures
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-headline font-display text-white mb-2">
          SOP Library &amp; Step-by-Step Checklists
        </h2>
        <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-body font-body font-normal">
          Access complete documentation, video walkthroughs, execution checklists, and paired AI prompt templates across all departmental service hubs.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 transition-colors duration-200">
        {/* Department Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto pb-1">
          {(['all', 'executive', 'marketing', 'sales', 'operations', 'support', 'hr'] as Department[]).map(
            (dept) => {
              const config = DEPARTMENT_CONFIG[dept];
              const isSelected = selectedDept === dept;
              return (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-ui tracking-ui transition-all cursor-pointer whitespace-nowrap border ${
                    isSelected
                      ? 'bg-[#0052CC] text-white border-[#0052CC] shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {config.label}
                </button>
              );
            }
          )}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter SOPs & procedures..."
            className="w-full pl-9 pr-4 py-1.5 text-xs font-ui font-medium bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0052CC]/30 focus:border-[#0052CC]"
          />
        </div>
      </div>

      {/* Grid of SOP Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredItems.map((item) => {
          const deptConfig = DEPARTMENT_CONFIG[item.department] || DEPARTMENT_CONFIG.all;
          const isCopied = copiedId === item.id;

          return (
            <motion.div
              key={item.id}
              whileHover={{ y: -2 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-semibold font-ui tracking-ui ${deptConfig.bgLight} ${deptConfig.color} border ${deptConfig.border}`}
                  >
                    {deptConfig.label}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium font-ui text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-lg">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {item.sop.estimatedTime || '10 mins'}
                  </span>
                </div>

                <h3 className="text-base font-bold font-display tracking-title text-slate-900 dark:text-slate-100 mb-1">
                  {item.sop.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-body line-clamp-2 font-body font-normal">
                  {item.sop.summary}
                </p>

                {/* Steps Preview */}
                <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-3.5 border border-slate-200/80 dark:border-slate-800 mb-4">
                  <span className="text-[11px] font-semibold font-ui uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                    Execution Steps ({item.sop.steps.length}):
                  </span>
                  <ol className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 list-decimal pl-4 font-body leading-body font-normal">
                    {item.sop.steps.slice(0, 3).map((step, idx) => (
                      <li key={idx} className="line-clamp-1">
                        {step}
                      </li>
                    ))}
                    {item.sop.steps.length > 3 && (
                      <li className="text-[11px] font-semibold font-ui text-sky-700 dark:text-sky-400 list-none pt-0.5">
                        +{item.sop.steps.length - 3} more steps in full checklist...
                      </li>
                    )}
                  </ol>
                </div>
              </div>

              {/* Action Controls */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
                <ReactiveButton
                  variant="brand"
                  size="sm"
                  onClick={() => onOpenSop(item)}
                  icon={<BookOpen className="w-3.5 h-3.5" />}
                  className="flex-1"
                >
                  Interactive Checklist
                </ReactiveButton>

                <ReactiveButton
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenStudio(item)}
                  icon={<SlidersHorizontal className="w-3.5 h-3.5 text-[#0052CC] dark:text-[#00A3FF]" />}
                >
                  Studio
                </ReactiveButton>

                <ReactiveButton
                  variant={isCopied ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => handleCopy(item)}
                  icon={
                    isCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )
                  }
                >
                  {isCopied ? 'Copied' : 'Prompt'}
                </ReactiveButton>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Copy,
  Check,
  SlidersHorizontal,
  BookOpen,
  Star,
  Clock,
  Sparkles,
  ArrowRight,
  Pencil,
  Trash2,
} from 'lucide-react';
import { PromptItem } from '../types';
import { DEPARTMENT_CONFIG } from '../data/defaultData';
import { ReactiveButton } from './ReactiveButton';

interface PromptCardProps {
  item: PromptItem;
  onCopyPrompt: (promptText: string, title: string) => void;
  onOpenStudio: (item: PromptItem) => void;
  onOpenSop: (item: PromptItem) => void;
  onToggleFavorite: (id: string) => void;
  onEditPrompt?: (item: PromptItem) => void;
  onDeletePrompt?: (id: string) => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  item,
  onCopyPrompt,
  onOpenStudio,
  onOpenSop,
  onToggleFavorite,
  onEditPrompt,
  onDeletePrompt,
}) => {
  const [copied, setCopied] = useState(false);
  const [expandedPrompt, setExpandedPrompt] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deptConfig = DEPARTMENT_CONFIG[item.department] || DEPARTMENT_CONFIG.all;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.basePrompt);
    setCopied(true);
    onCopyPrompt(item.basePrompt, item.title);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
    >
      <div>
        {/* Header & Badges */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center flex-wrap gap-2">
            {/* Department Badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold font-ui tracking-ui ${deptConfig.bgLight} ${deptConfig.color} border ${deptConfig.border}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {deptConfig.label}
            </span>

            {/* Task Type Pill */}
            <span className="px-2.5 py-1 rounded-xl text-xs font-semibold font-ui tracking-ui bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {item.taskType}
            </span>

            {/* Estimated SOP Time */}
            {item.sop.estimatedTime && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] text-slate-500 dark:text-slate-400 font-medium font-ui bg-slate-50 dark:bg-slate-800/60">
                <Clock className="w-3 h-3 text-slate-400" />
                {item.sop.estimatedTime}
              </span>
            )}
            {/* Custom Badge */}
            {item.isCustom && (
              <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold font-ui uppercase tracking-wider bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                Custom
              </span>
            )}
          </div>

          {/* Card Header Actions (Edit / Delete for custom prompts + Star) */}
          <div className="flex items-center gap-1 shrink-0">
            {item.isCustom && onEditPrompt && (
              <button
                type="button"
                onClick={() => onEditPrompt(item)}
                title="Edit custom prompt"
                aria-label="Edit custom prompt"
                className="p-1.5 rounded-xl text-slate-400 hover:text-[#0052CC] dark:hover:text-[#00A3FF] hover:bg-sky-50 dark:hover:bg-sky-950/40 transition-colors cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}

            {item.isCustom && onDeletePrompt && (
              confirmDelete ? (
                <div className="inline-flex items-center gap-1 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl px-1.5 py-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmDelete(false);
                      onDeletePrompt(item.id);
                    }}
                    className="text-[10px] font-semibold font-ui text-rose-700 dark:text-rose-300 hover:underline cursor-pointer px-1"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="text-[10px] font-medium font-ui text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer px-0.5"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  title="Delete custom prompt"
                  aria-label="Delete custom prompt"
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )
            )}

            {/* Star Button */}
            <button
              type="button"
              onClick={() => onToggleFavorite(item.id)}
              title={item.isFavorite ? 'Remove from favorites' : 'Mark as favorite'}
              className="p-1.5 rounded-xl text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors cursor-pointer"
            >
              <Star
                className={`w-4 h-4 transition-transform active:scale-125 ${
                  item.isFavorite ? 'fill-amber-400 text-amber-400' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-base font-bold font-display tracking-title text-slate-900 dark:text-slate-100 leading-snug group-hover:text-[#0052CC] dark:group-hover:text-[#00A3FF] transition-colors mb-1.5">
          {item.title}
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-body mb-4 font-body font-normal">
          {item.description}
        </p>

        {/* SOP Quick Overview Callout */}
        <div className="bg-sky-50/80 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-900/60 rounded-2xl p-3 mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold font-ui uppercase tracking-wider text-[#0052CC] dark:text-[#00A3FF] flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-[#0052CC] dark:text-[#00A3FF]" />
              Standard Operating Procedure (SOP)
            </span>
            <button
              onClick={() => onOpenSop(item)}
              className="text-[11px] font-semibold font-ui text-[#0052CC] dark:text-sky-300 hover:text-[#00388C] dark:hover:text-white hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>View {item.sop.steps.length} Steps</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 leading-body font-body font-normal">
            {item.sop.summary}
          </p>
        </div>

        {/* The Prompt Code Block (The "Quick-Launcher" Plain Text Block) */}
        <div className="mb-4">
          <div className="flex items-center justify-between px-3 py-1.5 bg-[#001B39] dark:bg-[#00142A] text-slate-200 rounded-t-2xl text-xs font-mono">
            <span className="text-[11px] text-sky-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#00A3FF]" />
              Pre-built AI Prompt
            </span>
            <span className="text-[10px] text-slate-400 font-ui font-medium">
              {item.variables.length} Dynamic Variables
            </span>
          </div>
          <div className="relative bg-slate-950 text-slate-200 p-3 rounded-b-2xl border-t border-slate-800 font-mono text-xs overflow-hidden">
            <p
              className={`leading-relaxed whitespace-pre-wrap ${
                expandedPrompt ? '' : 'line-clamp-4'
              }`}
            >
              {item.basePrompt}
            </p>

            {item.basePrompt.length > 200 && (
              <button
                onClick={() => setExpandedPrompt(!expandedPrompt)}
                className="mt-2 text-[11px] font-ui font-semibold text-sky-400 hover:text-sky-300 transition-colors block cursor-pointer"
              >
                {expandedPrompt ? 'Show Less' : 'Show Full Prompt...'}
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Variable Chips */}
        {item.variables.length > 0 && (
          <div className="mb-4">
            <span className="text-[10px] font-semibold font-ui uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1.5">
              Available Form Inputs:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {item.variables.map((v) => (
                <span
                  key={v.id}
                  className="px-2 py-0.5 rounded-lg text-[11px] font-medium font-mono bg-sky-50 dark:bg-sky-950/60 text-[#0052CC] dark:text-sky-300 border border-sky-200/80 dark:border-sky-800/80"
                >
                  [{v.name}]
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons: 1-Click Copy & Interactive Fill */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-2">
        <ReactiveButton
          variant={copied ? 'primary' : 'brand'}
          size="sm"
          onClick={handleCopy}
          icon={
            copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-300" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )
          }
          className="flex-1"
        >
          {copied ? 'Copied to Clipboard!' : '1-Click Copy Prompt'}
        </ReactiveButton>

        <ReactiveButton
          variant="outline"
          size="sm"
          onClick={() => onOpenStudio(item)}
          icon={<SlidersHorizontal className="w-3.5 h-3.5 text-[#0052CC] dark:text-[#00A3FF]" />}
          className="flex-1 text-slate-700 dark:text-slate-200 hover:border-[#0052CC]/50 dark:hover:border-sky-500/50"
        >
          Interactive Studio
        </ReactiveButton>
      </div>
    </motion.div>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  BookOpen,
  CheckCircle2,
  Circle,
  ExternalLink,
  Clock,
  Video,
  Lightbulb,
  AlertTriangle,
  Copy,
  Check,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import { PromptItem } from '../types';
import { DEPARTMENT_CONFIG } from '../data/defaultData';
import { ReactiveButton } from './ReactiveButton';

interface SopModalProps {
  item: PromptItem | null;
  onClose: () => void;
  onOpenStudio: (item: PromptItem) => void;
  onCopyPrompt: (promptText: string, title: string) => void;
}

export const SopModal: React.FC<SopModalProps> = ({
  item,
  onClose,
  onOpenStudio,
  onCopyPrompt,
}) => {
  if (!item) return null;

  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  const deptConfig = DEPARTMENT_CONFIG[item.department] || DEPARTMENT_CONFIG.all;

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(item.basePrompt);
    setCopied(true);
    onCopyPrompt(item.basePrompt, item.title);
    setTimeout(() => setCopied(false), 2000);
  };

  const progressPercent = Math.round(
    (completedSteps.length / (item.sop.steps.length || 1)) * 100
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 max-h-[90vh] flex flex-col transition-colors duration-200"
        >
          {/* Modal Header */}
          <div className="bg-[#001B39] dark:bg-[#00142A] text-white p-5 sm:p-6 flex items-start justify-between gap-4 border-b border-sky-950 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold font-ui tracking-ui ${deptConfig.bgLight} ${deptConfig.color}`}
                >
                  {deptConfig.label}
                </span>
                <span className="text-xs font-medium font-ui text-slate-300">
                  {item.sop.title}
                </span>
                {item.sop.estimatedTime && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium font-ui bg-white/10 text-amber-300">
                    <Clock className="w-3 h-3" />
                    {item.sop.estimatedTime}
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-display tracking-title text-white leading-tight">
                {item.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-body font-normal leading-body">
                {item.sop.summary}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* SOP Interactive Step Progress Bar */}
          <div className="bg-slate-100 dark:bg-slate-800/80 px-6 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Step-by-Step Execution Checklist:
              </span>
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                {completedSteps.length} of {item.sop.steps.length} Completed ({progressPercent}%)
              </span>
            </div>
            <div className="w-32 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Modal Body Scroll Area */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Loom / Video Walkthrough Section */}
            {item.sop.loomUrl && (
              <div className="bg-slate-900 rounded-3xl p-4 sm:p-5 text-white border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Loom Video Walkthrough (2-Min SOP Guide)
                      </h4>
                      <p className="text-xs text-slate-400">
                        Watch the Project Manager demonstrate the exact workflow
                      </p>
                    </div>
                  </div>

                  <ReactiveButton
                    variant={showVideoPlayer ? 'primary' : 'gold'}
                    size="sm"
                    onClick={() => setShowVideoPlayer(!showVideoPlayer)}
                    className="text-xs"
                  >
                    {showVideoPlayer ? 'Hide Player' : 'Play Video Demo'}
                  </ReactiveButton>
                </div>

                {showVideoPlayer ? (
                  <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-slate-700 flex items-center justify-center p-6 text-center">
                    <div>
                      <Video className="w-12 h-12 text-amber-400 mx-auto mb-3 opacity-80" />
                      <p className="text-sm font-bold text-white mb-1">
                        SOP Walkthrough &amp; Video Demo
                      </p>
                      <p className="text-xs text-slate-400 mb-4 max-w-md">
                        Video stream reference: {item.sop.loomUrl}
                      </p>
                      <a
                        href={item.sop.loomUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors"
                      >
                        <span>Open in Loom Player</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => setShowVideoPlayer(true)}
                    className="p-3 bg-slate-800/80 hover:bg-slate-800 rounded-2xl border border-slate-700/80 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span className="text-xs text-slate-300">
                      📹 Click to view interactive walkthrough & step explanations
                    </span>
                    <span className="text-xs font-semibold text-amber-400 hover:underline">
                      Watch Video →
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Step-by-Step Interactive Checklist */}
            <div>
              <h3 className="text-sm font-bold font-display tracking-title uppercase text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                Step-by-Step SOP Instructions
              </h3>

              <div className="space-y-2.5">
                {item.sop.steps.map((step, idx) => {
                  const isChecked = completedSteps.includes(idx);
                  return (
                    <motion.div
                      key={idx}
                      whileHover={{ x: 2 }}
                      onClick={() => toggleStep(idx)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                        isChecked
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
                          : 'bg-slate-50 dark:bg-slate-850 hover:bg-slate-100/90 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <button
                        type="button"
                        className="mt-0.5 shrink-0 text-emerald-600 focus:outline-none"
                      >
                        {isChecked ? (
                          <CheckCircle2 className="w-5 h-5 fill-emerald-500 text-white" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-400" />
                        )}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-semibold font-ui px-2 py-0.5 rounded-md ${
                              isChecked
                                ? 'bg-emerald-200/80 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                            }`}
                          >
                            Step {idx + 1}
                          </span>
                          <p
                            className={`text-xs sm:text-sm font-normal font-body leading-body ${
                              isChecked
                                ? 'line-through text-slate-500 dark:text-slate-400'
                                : 'text-slate-900 dark:text-slate-100'
                            }`}
                          >
                            {step}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Pro Tips & Best Practices */}
            {item.sop.proTips && item.sop.proTips.length > 0 && (
              <div className="bg-amber-50/80 dark:bg-amber-950/30 rounded-3xl p-4 sm:p-5 border border-amber-200/80 dark:border-amber-800/50">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 flex items-center gap-1.5 mb-2">
                  <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  Department Pro Tips &amp; Best Practices
                </h4>
                <ul className="space-y-1.5">
                  {item.sop.proTips.map((tip, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2"
                    >
                      <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Paired AI Prompt Code Block */}
            <div className="bg-slate-950 rounded-3xl p-4 sm:p-5 border border-slate-800 text-white">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Paired AI Prompt Template
                </span>
                <ReactiveButton
                  variant={copied ? 'primary' : 'brand'}
                  size="sm"
                  onClick={handleCopyPrompt}
                  icon={
                    copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-white" />
                    )
                  }
                >
                  {copied ? 'Copied Prompt!' : '1-Click Copy'}
                </ReactiveButton>
              </div>
              <pre className="font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto bg-slate-900 p-3 rounded-2xl">
                {item.basePrompt}
              </pre>
            </div>
          </div>

          {/* Modal Footer Bar */}
          <div className="bg-slate-50 dark:bg-slate-950 px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              SOP ID: <span className="font-mono font-semibold">{item.id}</span>
            </span>

            <div className="flex items-center gap-2">
              <ReactiveButton
                variant="outline"
                size="sm"
                onClick={onClose}
              >
                Close
              </ReactiveButton>

              <ReactiveButton
                variant="brand"
                size="sm"
                icon={<SlidersHorizontal className="w-4 h-4" />}
                onClick={() => {
                  onClose();
                  onOpenStudio(item);
                }}
              >
                Open in Interactive Studio
              </ReactiveButton>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

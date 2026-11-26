import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Copy,
  Check,
  Play,
  RotateCcw,
  BookOpen,
  ArrowLeft,
  ChevronDown,
  Bot,
  FileText,
} from 'lucide-react';
import { PromptItem, PromptVariable } from '../types';
import { DEPARTMENT_CONFIG } from '../data/defaultData';
import { ReactiveButton } from './ReactiveButton';

interface InteractiveStudioProps {
  selectedItem: PromptItem | null;
  allItems: PromptItem[];
  onSelectItem: (item: PromptItem) => void;
  onOpenSop: (item: PromptItem) => void;
  onCopyPrompt: (assembledText: string, title: string) => void;
  onBackToVault: () => void;
}

export const InteractiveStudio: React.FC<InteractiveStudioProps> = ({
  selectedItem,
  allItems,
  onSelectItem,
  onOpenSop,
  onCopyPrompt,
  onBackToVault,
}) => {
  const currentItem = selectedItem || allItems[0];
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [aiRunning, setAiRunning] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [isSimulated, setIsSimulated] = useState(false);
  const [aiCopied, setAiCopied] = useState(false);

  // Initialize form values when currentItem changes
  useEffect(() => {
    if (currentItem) {
      const initial: Record<string, string> = {};
      currentItem.variables.forEach((v) => {
        initial[v.name] = v.defaultValue || '';
      });
      setFormValues(initial);
      setAiResult(null);
    }
  }, [currentItem?.id]);

  if (!currentItem) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
        <p className="text-slate-500 dark:text-slate-400">No prompt template selected.</p>
        <ReactiveButton onClick={onBackToVault} className="mt-4">
          Back to Vault
        </ReactiveButton>
      </div>
    );
  }

  const deptConfig = DEPARTMENT_CONFIG[currentItem.department] || DEPARTMENT_CONFIG.all;

  const handleInputChange = (varName: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [varName]: value }));
  };

  const handleResetDefaults = () => {
    const reset: Record<string, string> = {};
    currentItem.variables.forEach((v) => {
      reset[v.name] = v.defaultValue || '';
    });
    setFormValues(reset);
    setAiResult(null);
  };

  // Compute assembled prompt in real time
  const getAssembledPrompt = (): string => {
    let result = currentItem.basePrompt;
    currentItem.variables.forEach((v) => {
      const val = formValues[v.name] || `[${v.name}]`;
      // Replace all occurrences of [VariableName]
      const regex = new RegExp(`\\[${v.name}\\]`, 'g');
      result = result.replace(regex, val);
    });
    return result;
  };

  const assembledPrompt = getAssembledPrompt();

  const handleCopy = () => {
    navigator.clipboard.writeText(assembledPrompt);
    setCopied(true);
    onCopyPrompt(assembledPrompt, currentItem.title);
    setTimeout(() => setCopied(false), 2000);
  };

  // Run Test using Server-side Gemini Flash API
  const handleRunAiTest = async () => {
    setAiRunning(true);
    setAiResult(null);

    try {
      const response = await fetch('/api/gemini/test-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: assembledPrompt,
          systemInstruction: `You are an elite virtual assistant executing tasks according to standard operating procedures. Provide a thoroughly polished, professional, and directly usable output.`,
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      if (!response.ok || !contentType.includes('application/json')) {
        setAiResult(
          `[Simulation Mode: Live AI backend is not connected in static preview. Copy the assembled prompt above into ChatGPT, Claude, or Gemini, or run the Express server with GEMINI_API_KEY configured.]\n\nGenerated Sample Preview for "${currentItem.title}":\n---\n${assembledPrompt.slice(0, 320)}${assembledPrompt.length > 320 ? '...' : ''}\n\n✅ Prompt variables assembled and ready for execution according to SOP guidelines.`
        );
        setIsSimulated(true);
        return;
      }

      const data = await response.json();
      if (data.error) {
        setAiResult(`Error: ${data.error}`);
      } else {
        setAiResult(data.text);
        setIsSimulated(data.simulated || false);
      }
    } catch {
      setAiResult(
        `[Simulation Mode: Unable to reach backend API server. Copy the assembled prompt above into ChatGPT, Claude, or Gemini, or start the server with GEMINI_API_KEY configured.]\n\nGenerated Sample Preview for "${currentItem.title}":\n---\n${assembledPrompt.slice(0, 320)}${assembledPrompt.length > 320 ? '...' : ''}\n\n✅ Prompt variables assembled and ready for execution according to SOP guidelines.`
      );
      setIsSimulated(true);
    } finally {
      setAiRunning(false);
    }
  };

  const handleCopyAiResult = () => {
    if (!aiResult) return;
    navigator.clipboard.writeText(aiResult);
    setAiCopied(true);
    setTimeout(() => setAiCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Navigation & Template Selector */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors duration-200">
        <div className="flex items-center gap-3">
          <ReactiveButton
            variant="secondary"
            size="sm"
            onClick={onBackToVault}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Vault
          </ReactiveButton>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold font-ui tracking-ui ${deptConfig.bgLight} ${deptConfig.color} border ${deptConfig.border}`}
              >
                {deptConfig.label}
              </span>
              <span className="text-xs font-semibold font-ui text-slate-500 dark:text-slate-400">
                {currentItem.taskType}
              </span>
            </div>
            <h2 className="text-lg font-bold font-display tracking-title text-slate-900 dark:text-slate-100 leading-tight">
              {currentItem.title}
            </h2>
          </div>
        </div>

        {/* Dropdown to switch templates quickly */}
        <div className="w-full md:w-auto flex items-center gap-2">
          <span className="text-xs font-medium font-ui text-slate-500 dark:text-slate-400 whitespace-nowrap hidden sm:inline">
            Switch Template:
          </span>
          <div className="relative flex-1 md:w-64">
            <select
              value={currentItem.id}
              onChange={(e) => {
                const found = allItems.find((item) => item.id === e.target.value);
                if (found) onSelectItem(found);
              }}
              className="w-full appearance-none pl-3 pr-8 py-2 text-xs font-semibold font-ui bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
            >
              {allItems.map((item) => (
                <option key={item.id} value={item.id}>
                  [{item.department.toUpperCase()}] {item.title}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <ReactiveButton
            variant="outline"
            size="sm"
            icon={<BookOpen className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />}
            onClick={() => onOpenSop(currentItem)}
          >
            SOP Guide
          </ReactiveButton>
        </div>
      </div>

      {/* Main Studio 2-Column Split: Form Inputs vs Live Assembled Prompt */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): Dynamic Variable Input Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm transition-colors duration-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold font-display tracking-title text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#0052CC] dark:text-[#00A3FF]" />
                  Dynamic Form Inputs ({currentItem.variables.length})
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-body font-normal">
                  Fill in these variables to assemble the tailored prompt
                </p>
              </div>

              <button
                onClick={handleResetDefaults}
                className="text-xs font-semibold font-ui text-slate-500 dark:text-slate-400 hover:text-[#0052CC] dark:hover:text-[#00A3FF] flex items-center gap-1 hover:underline cursor-pointer"
                title="Reset all inputs to sample default values"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Defaults
              </button>
            </div>

            {/* Variable Form Fields */}
            <div className="space-y-4">
              {currentItem.variables.map((variable: PromptVariable) => {
                const value = formValues[variable.name] || '';

                return (
                  <div key={variable.id} className="space-y-1.5">
                    <label className="block text-xs font-semibold font-ui text-slate-800 dark:text-slate-200">
                      {variable.label}{' '}
                      <span className="text-[11px] font-semibold font-mono text-[#0052CC] dark:text-[#00A3FF]">
                        [{variable.name}]
                      </span>
                    </label>

                    {variable.type === 'select' && variable.options ? (
                      <select
                        value={value}
                        onChange={(e) => handleInputChange(variable.name, e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0052CC]/30 focus:border-[#0052CC] font-medium"
                      >
                        {variable.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : variable.type === 'textarea' ? (
                      <textarea
                        rows={4}
                        value={value}
                        onChange={(e) => handleInputChange(variable.name, e.target.value)}
                        placeholder={variable.placeholder || `Enter ${variable.label}...`}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#0052CC]/30 focus:border-[#0052CC] font-mono leading-relaxed"
                      />
                    ) : (
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleInputChange(variable.name, e.target.value)}
                        placeholder={variable.placeholder || `Enter ${variable.label}...`}
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#0052CC]/30 focus:border-[#0052CC] font-medium"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick SOP Micro-Card */}
          <div className="bg-sky-50 dark:bg-sky-950/40 rounded-3xl p-4 border border-sky-200/80 dark:border-sky-900/60 transition-colors duration-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-sky-900 dark:text-sky-300 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-sky-700 dark:text-sky-400" />
                Linked SOP Guidelines
              </span>
              <button
                onClick={() => onOpenSop(currentItem)}
                className="text-xs font-bold text-sky-700 dark:text-sky-300 hover:underline cursor-pointer"
              >
                Full Checklist →
              </button>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 mb-2">{currentItem.sop.summary}</p>
            <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 list-disc pl-4">
              {currentItem.sop.steps.slice(0, 3).map((step, idx) => (
                <li key={idx} className="line-clamp-1">
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column (7 Cols): Live Assembled Prompt & AI Execution Workbench */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-950 rounded-3xl p-5 border border-slate-800 shadow-md text-white flex flex-col justify-between">
            <div>
              {/* Studio Header Bar */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <h3 className="text-sm font-bold font-display tracking-title text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Live Assembled Output
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-800 text-slate-300">
                    ~{Math.ceil(assembledPrompt.split(' ').length * 1.3)} Tokens
                  </span>
                </div>

                <span className="text-[11px] text-slate-400 font-ui">
                  Ready to copy into ChatGPT / Claude / Gemini
                </span>
              </div>

              {/* Live Preview Box */}
              <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed max-h-[340px] overflow-y-auto whitespace-pre-wrap selection:bg-amber-400 selection:text-slate-950">
                {assembledPrompt}
              </div>
            </div>

            {/* Bottom Execution & Copy Actions */}
            <div className="pt-4 mt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ReactiveButton
                  variant={copied ? 'primary' : 'brand'}
                  size="md"
                  onClick={handleCopy}
                  icon={
                    copied ? (
                      <Check className="w-4 h-4 text-emerald-300" />
                    ) : (
                      <Copy className="w-4 h-4 text-white" />
                    )
                  }
                >
                  {copied ? 'Copied Prompt to Clipboard!' : '1-Click Copy Assembled Prompt'}
                </ReactiveButton>
              </div>

              {/* Server-Side AI Tester using Gemini Flash */}
              <ReactiveButton
                variant="ai"
                size="md"
                onClick={handleRunAiTest}
                disabled={aiRunning}
                icon={
                  aiRunning ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Play className="w-4 h-4 fill-white" />
                  )
                }
              >
                {aiRunning ? 'Generating with Gemini...' : 'Test Run with Gemini AI'}
              </ReactiveButton>
            </div>
          </div>

          {/* AI Loading State Skeleton */}
          {aiRunning && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-sky-200/80 dark:border-sky-800/80 shadow-md space-y-3"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-[#0052CC] dark:text-[#00A3FF]">
                <div className="w-4 h-4 border-2 border-[#0052CC] dark:border-[#00A3FF] border-t-transparent rounded-full animate-spin" />
                <span>Executing prompt on server-side Gemini Flash engine...</span>
              </div>
              <div className="space-y-2">
                <div className="h-3.5 bg-sky-100 dark:bg-slate-800 rounded-full w-5/6 animate-pulse" />
                <div className="h-3.5 bg-sky-50 dark:bg-slate-800/60 rounded-full w-full animate-pulse" />
                <div className="h-3.5 bg-sky-100/70 dark:bg-slate-800 rounded-full w-4/6 animate-pulse" />
              </div>
            </motion.div>
          )}

          {/* AI Execution Results Box (Server-Side Output) */}
          <AnimatePresence>
            {aiResult && !aiRunning && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-md"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-xl bg-sky-100 dark:bg-sky-950 text-[#0052CC] dark:text-sky-300">
                      <Bot className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="text-sm font-bold font-display tracking-title text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        Gemini Flash Output Preview
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold font-ui uppercase tracking-ui bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          Active
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-body font-normal">
                        Generated by server-side Gemini runner for virtual assistant preview
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isSimulated && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold font-ui bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        Simulation Mode
                      </span>
                    )}
                    <button
                      onClick={() => setAiResult(null)}
                      className="text-xs font-semibold font-ui text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Dismiss output"
                    >
                      Clear
                    </button>
                    <ReactiveButton
                      variant={aiCopied ? 'primary' : 'brand'}
                      size="sm"
                      onClick={handleCopyAiResult}
                      icon={
                        aiCopied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-300" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-white" />
                        )
                      }
                    >
                      {aiCopied ? 'Copied AI Response' : 'Copy Output'}
                    </ReactiveButton>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 font-body font-normal text-xs text-slate-800 dark:text-slate-200 leading-body max-h-[340px] overflow-y-auto whitespace-pre-wrap selection:bg-[#00A3FF]/20">
                  {aiResult}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

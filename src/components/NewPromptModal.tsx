import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Plus,
  Pencil,
  Trash2,
  Sparkles,
  BookOpen,
  Tag,
} from 'lucide-react';
import { PromptItem, Department, PromptVariable } from '../types';
import { ReactiveButton } from './ReactiveButton';

interface NewPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: PromptItem) => void;
  editingItem?: PromptItem | null;
}

export const NewPromptModal: React.FC<NewPromptModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingItem = null,
}) => {
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState<Department>('executive');
  const [taskType, setTaskType] = useState('');
  const [description, setDescription] = useState('');
  const [basePrompt, setBasePrompt] = useState('');
  const [sopTitle, setSopTitle] = useState('');
  const [sopSummary, setSopSummary] = useState('');
  const [sopTime, setSopTime] = useState('10 mins');
  const [loomUrl, setLoomUrl] = useState('');
  const [steps, setSteps] = useState<string[]>(['Step 1 description here']);
  const [tags, setTags] = useState('Operations, VA, Productivity');

  useEffect(() => {
    if (!isOpen) return;
    if (editingItem) {
      setTitle(editingItem.title);
      setDepartment(editingItem.department);
      setTaskType(editingItem.taskType);
      setDescription(editingItem.description);
      setBasePrompt(editingItem.basePrompt);
      setSopTitle(editingItem.sop.title);
      setSopSummary(editingItem.sop.summary);
      setSopTime(editingItem.sop.estimatedTime || '10 mins');
      setLoomUrl(editingItem.sop.loomUrl || '');
      setSteps(editingItem.sop.steps.length > 0 ? editingItem.sop.steps : ['Step 1 description here']);
      setTags(editingItem.tags.join(', '));
    } else {
      setTitle('');
      setDepartment('executive');
      setTaskType('');
      setDescription('');
      setBasePrompt('');
      setSopTitle('');
      setSopSummary('');
      setSopTime('10 mins');
      setLoomUrl('');
      setSteps(['Step 1 description here']);
      setTags('Operations, VA, Productivity');
    }
  }, [isOpen, editingItem]);

  // Auto-detect variables in basePrompt e.g. [Variable Name]
  const detectedVariables = React.useMemo(() => {
    const matches = basePrompt.match(/\[(.*?)\]/g);
    if (!matches) return [];
    // remove duplicates and brackets
    const unique = Array.from(new Set(matches.map((m) => m.slice(1, -1).trim())));
    return unique.filter(Boolean);
  }, [basePrompt]);

  if (!isOpen) return null;

  const isEditing = Boolean(editingItem);

  const handleAddStep = () => {
    setSteps([...steps, `Step ${steps.length + 1} description`]);
  };

  const handleRemoveStep = (index: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
    }
  };

  const handleStepChange = (index: number, val: string) => {
    const updated = [...steps];
    updated[index] = val;
    setSteps(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !basePrompt) return;

    const existingVarsByName = new Map(
      (editingItem?.variables || []).map((v) => [v.name, v])
    );

    const parsedVariables: PromptVariable[] = detectedVariables.map((vName, idx) => {
      const existing = existingVarsByName.get(vName);
      if (existing) return existing;
      return {
        id: `var-${Date.now()}-${idx}`,
        name: vName,
        label: vName,
        placeholder: `Enter ${vName}...`,
        defaultValue: '',
        type:
          vName.toLowerCase().includes('transcript') ||
          vName.toLowerCase().includes('content') ||
          vName.toLowerCase().includes('notes')
            ? 'textarea'
            : 'text',
      };
    });

    const parsedTags = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const savedItem: PromptItem = {
      id: editingItem?.id || `custom-ts-${Date.now()}`,
      title,
      department,
      taskType: taskType || 'General Task',
      description: description || 'Custom prompt and standard operating procedure.',
      basePrompt,
      variables: parsedVariables,
      sop: {
        title: sopTitle || `SOP: ${title}`,
        summary: sopSummary || description || 'Follow the step-by-step instructions.',
        estimatedTime: sopTime,
        loomUrl: loomUrl || undefined,
        steps: steps.filter(Boolean),
        proTips: editingItem?.sop.proTips || ['Review assembled output before sending to clients.'],
      },
      tags: parsedTags.length > 0 ? parsedTags : ['Custom', 'VA'],
      isFavorite: editingItem?.isFavorite ?? false,
      usageCount: editingItem?.usageCount ?? 0,
      isCustom: true,
      createdAt: editingItem?.createdAt || new Date().toISOString().split('T')[0],
    };

    onSave(savedItem);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 max-h-[90vh] flex flex-col transition-colors duration-200"
        >
          {/* Header */}
          <div className="bg-[#001B39] dark:bg-[#00142A] text-white p-5 sm:p-6 flex items-center justify-between border-b border-sky-950 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                {isEditing ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </div>
              <div>
                <h2 className="text-lg font-bold font-display tracking-title text-white">
                  {isEditing ? 'Edit Custom Prompt & SOP' : 'Add New Prompt & SOP Template'}
                </h2>
                <p className="text-xs text-slate-300 font-body font-normal">
                  {isEditing
                    ? 'Update your saved template in the TaskScript Vault'
                    : 'Save custom prompts into the TaskScript Vault'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
            {/* Title & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Task / Prompt Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Weekly KPI & Client Dashboard Recap"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Department Hub *
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as Department)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400 font-semibold"
                >
                  <option value="executive">Executive & Admin</option>
                  <option value="marketing">Marketing & Content</option>
                  <option value="sales">Sales & Lead Gen</option>
                  <option value="operations">Operations & PM</option>
                  <option value="support">Customer Support</option>
                  <option value="hr">HR & Talent Ops</option>
                </select>
              </div>
            </div>

            {/* Task Type & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Task Type Tag
                </label>
                <input
                  type="text"
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value)}
                  placeholder="e.g. Email Outreach, Meeting Summary, KPI Log"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Estimated SOP Duration
                </label>
                <input
                  type="text"
                  value={sopTime}
                  onChange={(e) => setSopTime(e.target.value)}
                  placeholder="e.g. 5 - 10 mins"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            {/* Short Description */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Short Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe when and how to use this prompt..."
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {/* Base Prompt Text */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Base AI Prompt (Use [Variable Name] for dynamic inputs) *
                </label>
                <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                  {detectedVariables.length} Variables Detected
                </span>
              </div>
              <textarea
                required
                rows={5}
                value={basePrompt}
                onChange={(e) => setBasePrompt(e.target.value)}
                placeholder="Write the AI instruction here. Example: Summarize the transcript for [Client Name] focusing on [Key Deliverables] and deadline [Target Date]..."
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-slate-400 dark:placeholder-slate-600"
              />
              {detectedVariables.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">
                    Auto-generated Form Variables:
                  </span>
                  {detectedVariables.map((v, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700"
                    >
                      [{v}]
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* SOP Details */}
            <div className="bg-sky-50/70 dark:bg-sky-950/40 p-4 rounded-3xl border border-sky-200/80 dark:border-sky-900/60 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-900 dark:text-sky-300 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-sky-700 dark:text-sky-400" />
                Standard Operating Procedure (SOP) Checklist
              </h4>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  SOP Summary
                </label>
                <input
                  type="text"
                  value={sopSummary}
                  onChange={(e) => setSopSummary(e.target.value)}
                  placeholder="Brief 1-sentence overview of the procedure..."
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-950 border border-sky-200 dark:border-sky-900 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              {/* Steps */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Execution Steps:
                </label>
                {steps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-sky-800 dark:text-sky-300 w-12">
                      #{idx + 1}
                    </span>
                    <input
                      type="text"
                      value={step}
                      onChange={(e) => handleStepChange(idx, e.target.value)}
                      placeholder={`Step ${idx + 1} details...`}
                      className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-950 border border-sky-200 dark:border-sky-900 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                    {steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveStep(idx)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddStep}
                  className="text-xs font-bold text-sky-700 dark:text-sky-400 hover:text-sky-900 dark:hover:text-sky-200 flex items-center gap-1 mt-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Another Step
                </button>
              </div>

              <div className="space-y-1 pt-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Video Walkthrough URL (Optional)
                </label>
                <input
                  type="text"
                  value={loomUrl}
                  onChange={(e) => setLoomUrl(e.target.value)}
                  placeholder="https://www.loom.com/share/..."
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-950 border border-sky-200 dark:border-sky-900 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                Tags (Comma separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. Zoom, Slack, Outreach, KPI"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {/* Footer buttons */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
              <ReactiveButton variant="outline" size="sm" type="button" onClick={onClose}>
                Cancel
              </ReactiveButton>
              <ReactiveButton variant="brand" size="sm" type="submit">
                {isEditing ? 'Save Changes' : 'Save to Vault'}
              </ReactiveButton>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

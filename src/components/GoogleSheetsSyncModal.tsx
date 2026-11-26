import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  FileSpreadsheet,
  Download,
  Upload,
  Check,
  ExternalLink,
  Layers,
  Database,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Copy,
  Terminal,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { PromptItem } from '../types';
import { ReactiveButton } from './ReactiveButton';

interface GoogleSheetsSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: PromptItem[];
  onImportItems: (imported: PromptItem[]) => void;
}

export const GoogleSheetsSyncModal: React.FC<GoogleSheetsSyncModalProps> = ({
  isOpen,
  onClose,
  items,
  onImportItems,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'export' | 'appsheet' | 'powerapps' | 'json'>('export');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  const appsheetFormula = 'CONCATENATE([Base AI Prompt], "\n\nClient Name: ", [Client_Name], "\nTask Specifics: ", [Specific_Context])';
  const powerappsFormula = '"Summarize following notes for " & Dropdown_Dept.Selected.Value & ": " & TextInput_Context.Text & "\n\n" & ThisItem.BasePrompt';

  const handleCopyFormula = (formula: string, formulaId: string) => {
    navigator.clipboard.writeText(formula);
    setCopiedFormula(formulaId);
    setTimeout(() => {
      setCopiedFormula(null);
    }, 2000);
  };

  // Generate CSV data from all prompts
  const downloadCSV = () => {
    const headers = ['Department', 'Task Type', 'Task Title', 'SOP Summary', 'Base AI Prompt', 'Estimated Time', 'Tags'];
    const rows = items.map((item) => [
      `"${item.department}"`,
      `"${item.taskType.replace(/"/g, '""')}"`,
      `"${item.title.replace(/"/g, '""')}"`,
      `"${item.sop.summary.replace(/"/g, '""')}"`,
      `"${item.basePrompt.replace(/"/g, '""')}"`,
      `"${item.sop.estimatedTime || ''}"`,
      `"${item.tags.join(', ')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `TaskScript_Prompts_SOPs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download complete JSON Backup
  const downloadJSON = () => {
    const jsonStr = JSON.stringify(items, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `taskscript_vault_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle JSON Import
  const handleJSONUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].title && parsed[0].basePrompt) {
          onImportItems(parsed);
          setImportStatus(`Successfully imported ${parsed.length} Prompts and SOPs!`);
          setTimeout(() => setImportStatus(null), 3500);
        } else {
          setImportStatus('Invalid file format. Please upload a valid TaskScript JSON backup.');
        }
      } catch (err) {
        setImportStatus('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs cursor-pointer"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 max-h-[90vh] flex flex-col transition-colors duration-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#00142A] via-[#001E3D] to-[#002B59] text-white p-5 sm:p-6 flex items-center justify-between border-b border-sky-900/60 shrink-0">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold font-display tracking-title text-white">
                    Google Sheets &amp; AppSheet Guide Hub
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold font-ui uppercase tracking-wider text-amber-300 bg-amber-400/20 border border-amber-400/30">
                    Ecosystem
                  </span>
                </div>
                <p className="text-xs text-sky-200/90 mt-0.5 font-body font-normal leading-body">
                  Export CSV/JSON repository or link directly to Google AppSheet &amp; Microsoft 365
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-200 transition-colors cursor-pointer"
              title="Close Dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cyan Blue Horizontal Divider Bar */}
          <div className="h-1 bg-[#00A3FF] w-full shrink-0" />

          {/* Sub-Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 sm:px-6 pt-3 gap-2 overflow-x-auto no-scrollbar shrink-0">
            <button
              onClick={() => setActiveTab('export')}
              className={`pb-2.5 px-3 text-xs font-semibold font-ui tracking-ui border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'export'
                  ? 'border-[#0052CC] text-[#0052CC] dark:text-[#00A3FF] dark:border-[#00A3FF]'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>1. Export CSV (Google Sheets)</span>
            </button>
            <button
              onClick={() => setActiveTab('appsheet')}
              className={`pb-2.5 px-3 text-xs font-semibold font-ui tracking-ui border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'appsheet'
                  ? 'border-[#0052CC] text-[#0052CC] dark:text-[#00A3FF] dark:border-[#00A3FF]'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>2. Google AppSheet Guide</span>
            </button>
            <button
              onClick={() => setActiveTab('powerapps')}
              className={`pb-2.5 px-3 text-xs font-semibold font-ui tracking-ui border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'powerapps'
                  ? 'border-[#0052CC] text-[#0052CC] dark:text-[#00A3FF] dark:border-[#00A3FF]'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>3. Microsoft Power Apps</span>
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`pb-2.5 px-3 text-xs font-semibold font-ui tracking-ui border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'json'
                  ? 'border-[#0052CC] text-[#0052CC] dark:text-[#00A3FF] dark:border-[#00A3FF]'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>4. JSON Backup &amp; Restore</span>
            </button>
          </div>

          {/* Tab Contents */}
          <div className="p-6 sm:p-7 overflow-y-auto space-y-5 flex-1 text-xs text-slate-700">
            {/* TAB 1: CSV EXPORT */}
            {activeTab === 'export' && (
              <div className="space-y-4">
                <div className="bg-sky-50/80 dark:bg-sky-950/40 rounded-2xl p-4 sm:p-5 border border-sky-200/80 dark:border-sky-900/60">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="p-1.5 rounded-lg bg-[#0052CC] text-white">
                      <FileSpreadsheet className="w-4 h-4" />
                    </span>
                    <h3 className="text-sm font-bold text-sky-950 dark:text-sky-100">
                      Download Your TaskScript Knowledge Base as a Google Sheet
                    </h3>
                  </div>
                  <p className="text-xs text-sky-900 dark:text-sky-200 leading-relaxed pt-1">
                    Export all <strong>{items.length} department prompts</strong>, variables, SOP checklists, and estimated durations into a clean CSV format ready for Google Sheets or Microsoft Excel.
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 space-y-4">
                  <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                    Columns included in the export dataset:
                  </h4>
                  <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-slate-700 dark:text-slate-300 font-semibold">
                    <li className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">1. Department</li>
                    <li className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">2. Task Type</li>
                    <li className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">3. Task Title</li>
                    <li className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">4. SOP Summary</li>
                    <li className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">5. Base Prompt</li>
                    <li className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">6. Tags</li>
                  </ul>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <ReactiveButton
                      variant="brand"
                      size="md"
                      onClick={downloadCSV}
                      icon={<Download className="w-4 h-4" />}
                      className="shadow-sm"
                    >
                      Download CSV for Google Sheets ({items.length} items)
                    </ReactiveButton>

                    <ReactiveButton
                      variant="outline"
                      size="md"
                      onClick={() => setActiveTab('appsheet')}
                      icon={<ArrowRight className="w-4 h-4 text-[#0052CC]" />}
                    >
                      Next: Setup Google AppSheet
                    </ReactiveButton>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: APPSHEET GUIDE */}
            {activeTab === 'appsheet' && (
              <div className="space-y-5">
                <div className="bg-sky-50 dark:bg-sky-950/40 rounded-2xl p-4 sm:p-5 border border-sky-200/80 dark:border-sky-900/60">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="p-1.5 rounded-lg bg-[#00A3FF] text-white">
                      <Zap className="w-4 h-4" />
                    </span>
                    <h3 className="text-sm font-bold text-sky-950 dark:text-sky-100">
                      Option 1: Google AppSheet No-Code Architecture Guide
                    </h3>
                  </div>
                  <p className="text-xs text-sky-900 dark:text-sky-200 leading-relaxed pt-0.5">
                    If your organization uses Google Workspace, you can link the downloaded Google Sheet directly to AppSheet with single-sign-on (SSO) and 1-click clipboard actions.
                  </p>
                </div>

                {/* Step by Step Cards */}
                <div className="space-y-3">
                  <div className="bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-start gap-3.5">
                    <div className="w-6 h-6 rounded-full bg-[#0052CC] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      1
                    </div>
                    <div className="space-y-1 flex-1">
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Download CSV &amp; Import to Google Sheets</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Click the button below to download the CSV, open <strong>Google Drive</strong>, create a new sheet named <code className="bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded font-mono text-[11px]">TaskScript_Prompt_Vault</code>, and import the CSV file.
                      </p>
                      <div className="pt-1 flex items-center gap-2">
                        <ReactiveButton
                          variant="secondary"
                          size="sm"
                          onClick={downloadCSV}
                          icon={<Download className="w-3.5 h-3.5" />}
                        >
                          Download CSV
                        </ReactiveButton>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-start gap-3.5">
                    <div className="w-6 h-6 rounded-full bg-[#0052CC] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      2
                    </div>
                    <div className="space-y-1 flex-1">
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Launch AppSheet Builder</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        In your newly created Google Sheet menu bar, go to <strong>Extensions &gt; AppSheet &gt; Create an app</strong>. AppSheet will automatically structure the columns.
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-start gap-3.5">
                    <div className="w-6 h-6 rounded-full bg-[#0052CC] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      3
                    </div>
                    <div className="space-y-1 flex-1">
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Configure Views &amp; Dynamic Variable Formula</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Set primary UX View to <strong>"Deck"</strong> or <strong>"Gallery"</strong>. To automatically concatenate prompt variables, use the following AppSheet formula:
                      </p>
                      <div className="mt-2 p-3 bg-[#00142A] text-sky-200 rounded-xl font-mono text-[11px] flex items-center justify-between gap-3 border border-sky-900/60">
                        <span className="truncate">{appsheetFormula}</span>
                        <ReactiveButton
                          variant="brand"
                          size="sm"
                          onClick={() => handleCopyFormula(appsheetFormula, 'appsheet')}
                          icon={
                            copiedFormula === 'appsheet' ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )
                          }
                          className="shrink-0"
                        >
                          {copiedFormula === 'appsheet' ? 'Copied' : 'Copy Formula'}
                        </ReactiveButton>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-start gap-3.5">
                    <div className="w-6 h-6 rounded-full bg-[#0052CC] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      4
                    </div>
                    <div className="space-y-1 flex-1">
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Add 1-Click Clipboard Action</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        In AppSheet Behavior &gt; Actions, add a new action <strong>"Copy Prompt to Clipboard"</strong> attached to the card tap event so virtual assistants can paste directly into ChatGPT or Claude.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: POWER APPS GUIDE */}
            {activeTab === 'powerapps' && (
              <div className="space-y-5">
                <div className="bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl p-4 sm:p-5 border border-indigo-200/80 dark:border-indigo-900/60">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="p-1.5 rounded-lg bg-indigo-700 text-white">
                      <Layers className="w-4 h-4" />
                    </span>
                    <h3 className="text-sm font-bold text-indigo-950 dark:text-indigo-100">
                      Option 2: Microsoft 365 / Power Apps &amp; Teams Guide
                    </h3>
                  </div>
                  <p className="text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed pt-0.5">
                    If your team operates on Microsoft Outlook and Teams, pin this prompt vault directly to the Microsoft Teams department channel sidebar.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-start gap-3.5">
                    <div className="w-6 h-6 rounded-full bg-indigo-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      1
                    </div>
                    <div className="space-y-1 flex-1">
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Import to Microsoft Lists</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Open <strong>Microsoft Lists</strong> in your 365 portal, select <strong>New list &gt; From CSV</strong>, and upload your exported TaskScript CSV.
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-start gap-3.5">
                    <div className="w-6 h-6 rounded-full bg-indigo-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      2
                    </div>
                    <div className="space-y-1 flex-1">
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Create Power App from List</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Click <strong>Integrate &gt; Power Apps &gt; Create an app</strong>. Set the Gallery template with a search bar filtered by department.
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-start gap-3.5">
                    <div className="w-6 h-6 rounded-full bg-indigo-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      3
                    </div>
                    <div className="space-y-1 flex-1">
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Power Apps Prompt Assembler Formula</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        In the card action formula bar, use this string formula to inject variables:
                      </p>
                      <div className="mt-2 p-3 bg-[#00142A] text-indigo-200 rounded-xl font-mono text-[11px] flex items-center justify-between gap-3 border border-indigo-900/60">
                        <span className="truncate">{powerappsFormula}</span>
                        <ReactiveButton
                          variant="brand"
                          size="sm"
                          onClick={() => handleCopyFormula(powerappsFormula, 'powerapps')}
                          icon={
                            copiedFormula === 'powerapps' ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )
                          }
                          className="shrink-0"
                        >
                          {copiedFormula === 'powerapps' ? 'Copied' : 'Copy Formula'}
                        </ReactiveButton>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-start gap-3.5">
                    <div className="w-6 h-6 rounded-full bg-indigo-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      4
                    </div>
                    <div className="space-y-1 flex-1">
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Pin to Microsoft Teams Channel</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        In Microsoft Teams, open your department channel, click <strong>+ Add a tab</strong>, choose <strong>Power Apps</strong>, and select your published TaskScript app.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: JSON BACKUP */}
            {activeTab === 'json' && (
              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-emerald-600 text-white">
                      <Database className="w-4 h-4" />
                    </span>
                    <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                      Complete JSON Database Backup &amp; Restore
                    </h4>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                    Export complete raw JSON data including all custom prompt templates, variables, step-by-step checklist steps, and department assignments.
                  </p>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <ReactiveButton
                      variant="primary"
                      size="sm"
                      onClick={downloadJSON}
                      icon={<Download className="w-3.5 h-3.5" />}
                    >
                      Export Full JSON Backup ({items.length} items)
                    </ReactiveButton>

                    <label className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-98 cursor-pointer shadow-2xs transition-all">
                      <Upload className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                      <span>Upload &amp; Restore JSON File</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleJSONUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {importStatus && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs font-bold"
                    >
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{importStatus}</span>
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="bg-slate-50 dark:bg-slate-950 px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
            <div className="text-slate-500 dark:text-slate-400 text-[11px] font-medium hidden sm:block">
              TaskScript Enterprise Sync System
            </div>
            <div className="flex items-center gap-2.5">
              <ReactiveButton variant="outline" size="sm" onClick={onClose}>
                Close Guide
              </ReactiveButton>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};


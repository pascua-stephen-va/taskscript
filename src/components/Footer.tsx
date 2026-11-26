import React from 'react';
import {
  ShieldCheck,
  Sparkles,
  Layers,
  FileSpreadsheet,
  BookOpen,
  SlidersHorizontal,
} from 'lucide-react';
import { TaskScriptLogo } from './TaskScriptLogo';

interface FooterProps {
  onOpenDept?: (dept: any) => void;
  onOpenSheetsModal?: () => void;
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="mt-20 bg-[#00132B] text-white border-t border-slate-800/80 relative overflow-hidden">
      {/* Subtle Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0052CC]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 relative z-10">
        {/* Two Main Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* Card 1: TaskScript Platform Info */}
          <div className="bg-[#002244]/60 backdrop-blur-md rounded-3xl border border-sky-900/40 p-7 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl">
            <div className="space-y-4">
              {/* TaskScript Logo */}
              <div className="flex items-center">
                <TaskScriptLogo size="sm" variant="light" layout="horizontal" />
              </div>

              {/* Tagline / Mission */}
              <p className="text-sm text-slate-300/90 leading-body font-body font-normal">
                TaskScript is a standardized prompt assembler and standard operating procedure (SOP) engine designed to empower virtual assistants, project managers, and operations specialists to execute AI workflows with zero hallucination and maximum repeatability.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="border-t border-slate-700/60 pt-4 grid grid-cols-2 gap-3 text-slate-300 text-xs sm:text-[13px] font-ui font-medium">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00A3FF] shrink-0" />
                <span>Gemini Flash Runner</span>
              </div>
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#00A3FF] shrink-0" />
                <span>Dynamic Bracket Variables</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#00A3FF] shrink-0" />
                <span>Step-by-Step SOP Checklists</span>
              </div>
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#00A3FF] shrink-0" />
                <span>Google Sheets &amp; AppSheet Sync</span>
              </div>
            </div>
          </div>

          {/* Card 2: Operations Intelligence Engine */}
          <div className="bg-[#002244]/60 backdrop-blur-md rounded-3xl border border-sky-900/40 p-7 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl">
            <div className="space-y-4">
              {/* Badges Header */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3.5 py-1 rounded-full text-[11px] font-semibold font-ui tracking-wider text-[#00A3FF] bg-[#003875]/70 border border-[#0070BA] uppercase">
                  PROMPT &amp; SOP OPERATIONS ENGINE
                </span>
                <span className="px-3.5 py-1 rounded-full text-[11px] font-semibold font-ui text-emerald-400 bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Active Workspace
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-bold font-display tracking-title text-white">
                Standardized AI Workflow &amp; Procedure Intelligence
              </h3>

              {/* Description */}
              <p className="text-sm text-slate-300/90 leading-body font-body font-normal">
                Purpose-built for rapid team execution, department-tailored AI prompt compilation, spreadsheet synchronization, interactive Studio generation, and consistent operational quality assurance.
              </p>
            </div>

            {/* Pill Feature Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold font-ui tracking-ui text-slate-300 bg-[#001733]/90 border border-slate-700/70">
                Department Prompt Vault
              </span>
              <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold font-ui tracking-ui text-slate-300 bg-[#001733]/90 border border-slate-700/70">
                Interactive Studio
              </span>
              <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold font-ui tracking-ui text-slate-300 bg-[#001733]/90 border border-slate-700/70">
                SOP Matrix
              </span>
              <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold font-ui tracking-ui text-slate-300 bg-[#001733]/90 border border-slate-700/70">
                Sheets &amp; Sync
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Section: Divider & Centered Copyright Notice */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 text-center space-y-1">
          <p className="text-xs sm:text-sm text-slate-200 font-normal">
            © 2026 TaskScript. All Rights Reserved.
          </p>
          <p className="text-xs sm:text-sm text-[#00A3FF] font-medium">
            Centralized prompt intelligence and standard operating procedures launcher.
          </p>
        </div>
      </div>
    </footer>
  );
};

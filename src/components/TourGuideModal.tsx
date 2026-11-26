import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Layers,
  SlidersHorizontal,
  FileSpreadsheet,
  PlusCircle,
  LayoutGrid,
  ArrowRight,
} from 'lucide-react';

interface TourGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: 'vault' | 'studio' | 'sops' | 'sheets') => void;
}

export const TourGuideModal: React.FC<TourGuideModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
}) => {
  // [currentStep, direction]: 1 = forward (Next), -1 = backward (Back)
  const [[currentStep, direction], setStepWithDirection] = useState<[number, number]>([0, 1]);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  // Reset to step 0 whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      setStepWithDirection([0, 1]);
    }
  }, [isOpen]);

  const tourSteps = [
    {
      stepNumber: 1,
      badge: 'OPERATIONAL SUITE',
      title: 'Welcome to TaskScript',
      subtitle: 'Department AI Prompt & SOP Quick-Launcher',
      icon: <Sparkles className="w-7 h-7 text-[#0052CC]" />,
      cards: [
        {
          title: 'Centralized Operational Hub',
          desc: 'Standardized prompt templates and live SOP checklists purpose-built for virtual assistants, project managers, and operations specialists.',
        },
        {
          title: 'Client-Tested Prompt Architecture',
          desc: 'Tested dynamic bracket variables [Client_Name] ensure high-precision deliverables and zero AI hallucination.',
        },
        {
          title: 'Integrated Knowledge Base',
          desc: 'Direct synchronization with your team Google Sheets databases and AppSheet mobile applications.',
        },
      ],
      tabTarget: 'vault' as const,
    },
    {
      stepNumber: 2,
      badge: 'PROMPT REPOSITORY',
      title: 'Prompt Vault & Quick-Launch',
      subtitle: 'Fast 1-Click execution for client deliverables across 6 departments.',
      icon: <Layers className="w-7 h-7 text-[#0052CC]" />,
      cards: [
        {
          title: 'Role-Based Filtering',
          desc: 'Instantly filter across Executive VAs, B2B Sales, Content Marketing, Technical Ops, Customer Support, and HR hubs.',
        },
        {
          title: 'Smart Search & Tag Index',
          desc: 'Search by client tool (HubSpot, Asana, Slack, Zapier), complexity tier, and operational skill category.',
        },
        {
          title: 'Instant Clipboard Copy',
          desc: 'Copy prompts directly with fully assembled default variables ready to paste into ChatGPT, Claude, or Gemini.',
        },
      ],
      tabTarget: 'vault' as const,
    },
    {
      stepNumber: 3,
      badge: 'DYNAMIC PROMPT GENERATOR',
      title: 'Interactive Studio Customization',
      subtitle: 'Inject client names, dates, tone styles, and business parameters in real time.',
      icon: <SlidersHorizontal className="w-7 h-7 text-[#0052CC]" />,
      cards: [
        {
          title: 'Instant Tag Substitution',
          desc: 'Dynamic form fields automatically replace bracketed placeholders with live updates in the preview panel.',
        },
        {
          title: 'Built-in AI Assistant Preview',
          desc: 'Test and inspect simulated AI output responses directly before executing for client deliverables.',
        },
        {
          title: 'One-Click Default Reset',
          desc: 'Instantly restore battle-tested default parameters if you need to start with pre-approved samples.',
        },
      ],
      tabTarget: 'studio' as const,
    },
    {
      stepNumber: 4,
      badge: 'COMPLIANCE & PROTOCOLS',
      title: 'Step-by-Step SOP Documentation',
      subtitle: 'Every prompt is paired with complete standard operating procedures.',
      icon: <BookOpen className="w-7 h-7 text-[#0052CC]" />,
      cards: [
        {
          title: 'Loom Video Walkthroughs',
          desc: 'Watch embedded or linked video guides recorded by senior department leads.',
        },
        {
          title: 'Interactive Execution Checklists',
          desc: 'Check off steps as you complete tasks with persistent browser tracking that remembers your progress.',
        },
        {
          title: 'Pro-Tips & Prerequisites',
          desc: 'Review pre-execution credential requirements, client communication rules, and efficiency shortcuts.',
        },
      ],
      tabTarget: 'sops' as const,
    },
    {
      stepNumber: 5,
      badge: 'ENTERPRISE INTEGRATION',
      title: 'Google Sheets & AppSheet Hub',
      subtitle: 'Export, backup, or synchronize prompts directly with your team spreadsheet.',
      icon: <FileSpreadsheet className="w-7 h-7 text-[#0052CC]" />,
      cards: [
        {
          title: 'CSV & Google Sheets Export',
          desc: 'Download formatted datasets containing all department prompts, variable schemas, and SOP checklists.',
        },
        {
          title: 'AppSheet & PowerApps Schema',
          desc: 'Ready-to-use tabular schema with automated formulas and column structures for no-code mobile deployment.',
        },
        {
          title: 'Bulk JSON & Custom Import',
          desc: 'Import team-created custom prompts with instant local vault persistence and zero server latency.',
        },
      ],
      tabTarget: 'sheets' as const,
    },
    {
      stepNumber: 6,
      badge: 'TEAM EXPANSION',
      title: 'Vault Expansion & Custom Workflows',
      subtitle: 'Empower your team by creating and sharing new department-specific prompt templates.',
      icon: <PlusCircle className="w-7 h-7 text-[#0052CC]" />,
      cards: [
        {
          title: 'Dynamic Variable Builder',
          desc: 'Define dropdowns, text areas, and text inputs with bracketed [Variable_Name] syntax.',
        },
        {
          title: 'Custom SOP Generator',
          desc: 'Add checklist steps, Loom video URLs, and operational guidelines for your teammates.',
        },
        {
          title: 'Local Vault Persistence',
          desc: 'All created prompts stay saved in your browser and can be exported as CSV or JSON anytime.',
        },
      ],
      tabTarget: 'vault' as const,
    },
    {
      stepNumber: 7,
      badge: 'QUALITY ASSURANCE',
      title: 'Scenario Matrix Benchmarking',
      subtitle: 'Verify calculations against verified operational benchmarks or test custom scenarios.',
      icon: <LayoutGrid className="w-7 h-7 text-[#0052CC]" />,
      cards: [
        {
          title: 'Built-in Test Cases',
          desc: 'Includes preloaded benchmark cases like Acme Corp ($1,295 to $2,295 Upgrade) and Beta Logistics ($1,495 Cancellation with $43.66 Fee).',
        },
        {
          title: 'One-Click Load',
          desc: 'Click "Load Scenario" to immediately populate all calculator parameters and inspect the result.',
        },
        {
          title: 'Re-open Tour Guide Anytime',
          desc: 'You can revisit this complete guide anytime by clicking the "Tour Guide" button in the top navigation bar!',
        },
      ],
      tabTarget: 'vault' as const,
    },
  ];

  const totalSteps = tourSteps.length;
  const currentTourData = tourSteps[currentStep];

  const handleNext = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) triggerRipple(e);
    if (currentStep < totalSteps - 1) {
      setStepWithDirection([currentStep + 1, 1]);
    }
  };

  const handleBack = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) triggerRipple(e);
    if (currentStep > 0) {
      setStepWithDirection([currentStep - 1, -1]);
    }
  };

  const handleGoToStep = (index: number) => {
    if (index === currentStep) return;
    const dir = index > currentStep ? 1 : -1;
    setStepWithDirection([index, dir]);
  };

  const handleFinish = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) triggerRipple(e);
    localStorage.setItem('taskscript_has_seen_tour', 'true');
    onSelectTab('vault');
    onClose();
  };

  const handleSkip = () => {
    localStorage.setItem('taskscript_has_seen_tour', 'true');
    onSelectTab('vault');
    onClose();
  };

  const triggerRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { x, y, id: Date.now() };
    setRipples((prev) => [...prev.slice(-4), newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  // Material 3 Expressive shared-axis directional slide variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 56 : -56,
      opacity: 0,
      scale: 0.96,
      filter: 'blur(4px)',
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        x: { type: 'spring' as const, stiffness: 380, damping: 30, mass: 0.8 },
        opacity: { duration: 0.25, ease: [0.2, 0, 0, 1] as [number, number, number, number] },
        scale: { type: 'spring' as const, stiffness: 360, damping: 28 },
        filter: { duration: 0.2 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -56 : 56,
      opacity: 0,
      scale: 0.96,
      filter: 'blur(4px)',
      transition: {
        x: { type: 'spring' as const, stiffness: 380, damping: 30, mass: 0.8 },
        opacity: { duration: 0.2, ease: [0.4, 0, 1, 1] as [number, number, number, number] },
        scale: { duration: 0.2 },
        filter: { duration: 0.15 },
      },
    }),
  };

  // Header step number rolling transition
  const stepNumberVariants = {
    enter: (dir: number) => ({
      y: dir > 0 ? 10 : -10,
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 420,
        damping: 24,
      },
    },
    exit: (dir: number) => ({
      y: dir > 0 ? -10 : 10,
      opacity: 0,
      transition: {
        duration: 0.15,
      },
    }),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          {/* Backdrop with Expressive Material 3 Blur and Fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
            onClick={handleSkip}
            className="absolute inset-0 bg-slate-950/65 backdrop-blur-sm cursor-pointer"
          />

          {/* Expressive Material 3 Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.91, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 16 }}
            transition={{
              type: 'spring',
              stiffness: 340,
              damping: 28,
              mass: 0.85,
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 w-full max-w-xl sm:max-w-2xl overflow-hidden flex flex-col max-h-[92vh] transition-colors duration-200"
          >
            {/* 1. Header Bar with Expressive Material Navigation */}
            <div className="px-6 py-4 flex items-center justify-between bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-20 shrink-0 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                  className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00A3FF]/10 to-[#0052CC]/15 border border-[#00A3FF]/25 flex items-center justify-center shadow-2xs"
                >
                  <BookOpen className="w-4 h-4 text-[#0088EE]" />
                </motion.div>
                <div>
                  <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-[#0088EE] leading-none">
                    INTERNAL OPERATIONS TOUR
                  </h3>
                  <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-slate-500 leading-none">
                    <span>Step</span>
                    <span className="relative inline-flex items-center justify-center font-bold text-[#0052CC] leading-none min-w-[10px] h-3.5 overflow-hidden">
                      <AnimatePresence custom={direction} mode="popLayout" initial={false}>
                        <motion.span
                          key={currentTourData.stepNumber}
                          custom={direction}
                          variants={stepNumberVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          className="inline-block text-xs font-bold text-[#0052CC] leading-none select-none"
                        >
                          {currentTourData.stepNumber}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                    <span>of {totalSteps}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSkip}
                  className="text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors cursor-pointer px-2.5 py-1 rounded-lg hover:bg-slate-100/80"
                >
                  Skip Tour
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                  onClick={handleSkip}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Close Tour"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Expressive Progress Bar (Google Material 3 Dynamic Progress Indicator) */}
            <div className="h-1 bg-slate-100 w-full shrink-0 relative overflow-hidden">
              <motion.div
                className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#0052CC] via-[#00A3FF] to-[#38BDF8] rounded-r-full shadow-xs"
                initial={false}
                animate={{
                  width: `${((currentStep + 1) / totalSteps) * 100}%`,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 28,
                  mass: 0.7,
                }}
              />
            </div>

            {/* 2. Main Content Area with Material 3 Directional Shared-Axis Animation */}
            <div className="p-6 sm:p-8 overflow-y-auto overflow-x-hidden flex-1 relative min-h-[380px]">
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="space-y-6"
                >
                  {/* Title Block with Expressive Spring Icon & Badge */}
                  <div className="flex items-start gap-4">
                    <motion.div
                      initial={{ scale: 0.65, rotate: direction * 14, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 420,
                        damping: 20,
                        delay: 0.05,
                      }}
                      className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#EAF5FF] to-[#D5E7FA]/80 border border-[#D5E7FA] flex items-center justify-center shrink-0 shadow-xs"
                    >
                      {currentTourData.icon}
                    </motion.div>

                    <div className="space-y-1">
                      <motion.span
                        initial={{ opacity: 0, y: 6, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 24,
                          delay: 0.08,
                        }}
                        className="inline-block px-3 py-0.5 rounded-full border border-[#BBE3FC] bg-[#F0F8FF] text-[#0070D2] text-[10.5px] font-semibold font-ui uppercase tracking-wider"
                      >
                        {currentTourData.badge}
                      </motion.span>
                      <motion.h2
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          type: 'spring',
                          stiffness: 380,
                          damping: 25,
                          delay: 0.1,
                        }}
                        className="text-xl sm:text-2xl font-bold font-display tracking-title text-[#0A2540] dark:text-white leading-snug"
                      >
                        {currentTourData.title}
                      </motion.h2>
                      <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          type: 'spring',
                          stiffness: 360,
                          damping: 25,
                          delay: 0.13,
                        }}
                        className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-body font-normal leading-body pt-0.5"
                      >
                        {currentTourData.subtitle}
                      </motion.p>
                    </div>
                  </div>

                  {/* 3 Staggered Feature Cards with Expressive Hover & Entry Physics */}
                  <div className="space-y-3 pt-1">
                    {currentTourData.cards.map((card, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 16, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          type: 'spring',
                          stiffness: 380,
                          damping: 26,
                          delay: 0.14 + idx * 0.07,
                        }}
                        whileHover={{
                          scale: 1.015,
                          x: 4,
                          backgroundColor: '#F3F7FA',
                          borderColor: '#CBD5E1',
                        }}
                        className="bg-[#F8FAFC] border border-slate-200/90 rounded-2xl p-4 flex items-start gap-3.5 transition-colors duration-200 shadow-2xs"
                      >
                        <motion.div
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{
                            type: 'spring',
                            stiffness: 500,
                            damping: 22,
                            delay: 0.2 + idx * 0.07,
                          }}
                          className="shrink-0 mt-0.5"
                        >
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        </motion.div>
                        <div className="space-y-0.5">
                          <h4 className="text-sm font-bold text-[#0A2540] leading-snug">
                            {card.title}
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed font-normal">
                            {card.desc}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* 3. Footer Bar with Expressive Morphing Pagination & Tactile Reactive Buttons */}
            <div className="bg-white dark:bg-slate-900 px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
              {/* Material 3 Expressive Dynamic Morphing Pagination Indicator */}
              <div className="flex items-center gap-2">
                {tourSteps.map((_, index) => {
                  const isActive = index === currentStep;
                  const isPassed = index < currentStep;
                  return (
                    <motion.button
                      key={index}
                      onClick={() => handleGoToStep(index)}
                      whileHover={{ scale: 1.28 }}
                      whileTap={{ scale: 0.85 }}
                      transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                      className="relative h-6 flex items-center justify-center cursor-pointer p-0.5 focus:outline-hidden"
                      title={`Go to step ${index + 1}`}
                    >
                      <motion.div
                        layout
                        transition={{
                          type: 'spring',
                          stiffness: 420,
                          damping: 26,
                          mass: 0.6,
                        }}
                        className={`h-2.5 rounded-full transition-colors ${
                          isActive
                            ? 'w-7 bg-gradient-to-r from-[#0052CC] to-[#00A3FF] shadow-xs ring-2 ring-[#00A3FF]/30'
                            : isPassed
                            ? 'w-2.5 bg-[#00A3FF]/60 hover:bg-[#00A3FF]'
                            : 'w-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'
                        }`}
                      />
                    </motion.button>
                  );
                })}
              </div>

              {/* Navigation Action Buttons with Expressive Spring Press Physics */}
              <div className="flex items-center gap-2.5">
                {/* Back Button with Expressive Material Spring & Micro-interaction */}
                <motion.button
                  whileHover={
                    currentStep > 0
                      ? {
                          scale: 1.04,
                          y: -1,
                          backgroundColor: '#1E293B',
                          borderColor: '#475569',
                        }
                      : {}
                  }
                  whileTap={currentStep > 0 ? { scale: 0.94, y: 1 } : {}}
                  transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className={`relative overflow-hidden px-4 py-2.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs select-none ${
                    currentStep === 0
                      ? 'opacity-40 text-slate-400 bg-slate-50 dark:bg-slate-800 cursor-not-allowed border-slate-100 dark:border-slate-800'
                      : 'text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <motion.span
                    animate={{ x: currentStep > 0 ? [0, -2, 0] : 0 }}
                    transition={{
                      repeat: Infinity,
                      repeatDelay: 3.5,
                      duration: 0.6,
                      ease: 'easeInOut',
                    }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </motion.span>
                  <span>Back</span>
                </motion.button>

                {/* Next Step / Get Started Button with Expressive Spring & Morphing Label */}
                {currentStep < totalSteps - 1 ? (
                  <motion.button
                    whileHover={{
                      scale: 1.03,
                      y: -1,
                      boxShadow: '0 8px 24px -4px rgba(0, 82, 204, 0.45)',
                    }}
                    whileTap={{ scale: 0.96, y: 0 }}
                    transition={{ type: 'spring', stiffness: 480, damping: 20 }}
                    onClick={handleNext}
                    className="relative overflow-hidden px-5 sm:px-6 py-2.5 rounded-xl bg-[#0052CC] hover:bg-[#0042A6] active:bg-[#00358A] text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-2 cursor-pointer border border-[#0052CC] select-none"
                  >
                    {/* Ripple particles */}
                    {ripples.map((ripple) => (
                      <span
                        key={ripple.id}
                        className="absolute rounded-full pointer-events-none animate-ping opacity-35 bg-white"
                        style={{
                          left: ripple.x - 14,
                          top: ripple.y - 14,
                          width: 28,
                          height: 28,
                        }}
                      />
                    ))}

                    <span className="relative z-10 text-white font-bold">Next Step</span>
                    <motion.span
                      className="relative z-10 flex items-center text-white"
                      animate={{ x: [0, 2.5, 0] }}
                      transition={{
                        repeat: Infinity,
                        repeatDelay: 2.5,
                        duration: 0.7,
                        ease: 'easeInOut',
                      }}
                    >
                      <ChevronRight className="w-4 h-4 text-white" />
                    </motion.span>
                  </motion.button>
                ) : (
                  <motion.button
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{
                      scale: 1.03,
                      y: -1,
                      boxShadow: '0 10px 24px -4px rgba(0, 82, 204, 0.5)',
                    }}
                    whileTap={{ scale: 0.96, y: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                    onClick={handleFinish}
                    className="relative overflow-hidden px-5 sm:px-6 py-2.5 rounded-xl bg-[#0052CC] hover:bg-[#0042A6] active:bg-[#00358A] text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 cursor-pointer border border-[#0052CC] select-none"
                  >
                    {/* Ripple particles */}
                    {ripples.map((ripple) => (
                      <span
                        key={ripple.id}
                        className="absolute rounded-full pointer-events-none animate-ping opacity-40 bg-white"
                        style={{
                          left: ripple.x - 14,
                          top: ripple.y - 14,
                          width: 28,
                          height: 28,
                        }}
                      />
                    ))}

                    <span className="relative z-10">GET STARTED</span>
                    <motion.span
                      className="relative z-10 flex items-center"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        repeat: Infinity,
                        repeatDelay: 2,
                        duration: 0.8,
                        ease: 'easeInOut',
                      }}
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    </motion.span>
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};


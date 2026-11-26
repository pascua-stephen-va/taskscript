import React from 'react';
import { motion } from 'motion/react';
import {
  LayoutGrid,
  Briefcase,
  Sparkles,
  Target,
  Cpu,
  Headphones,
  Users,
  Star,
} from 'lucide-react';
import { Department } from '../types';
import { DEPARTMENT_CONFIG } from '../data/defaultData';

interface DepartmentRailProps {
  selectedDept: Department;
  onSelectDept: (dept: Department) => void;
  onlyFavorites: boolean;
  onToggleFavorites: () => void;
  counts: Record<string, number>;
  favoritesCount: number;
}

const getIcon = (name: string) => {
  switch (name) {
    case 'LayoutGrid':
      return <LayoutGrid className="w-4 h-4" />;
    case 'Briefcase':
      return <Briefcase className="w-4 h-4" />;
    case 'Sparkles':
      return <Sparkles className="w-4 h-4" />;
    case 'Target':
      return <Target className="w-4 h-4" />;
    case 'Cpu':
      return <Cpu className="w-4 h-4" />;
    case 'Headphones':
      return <Headphones className="w-4 h-4" />;
    case 'Users':
      return <Users className="w-4 h-4" />;
    default:
      return <LayoutGrid className="w-4 h-4" />;
  }
};

export const DepartmentRail: React.FC<DepartmentRailProps> = ({
  selectedDept,
  onSelectDept,
  onlyFavorites,
  onToggleFavorites,
  counts,
  favoritesCount,
}) => {
  const departments: Department[] = [
    'all',
    'executive',
    'marketing',
    'sales',
    'operations',
    'support',
    'hr',
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-3 border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors duration-200">
      <div className="flex items-center justify-between px-3 py-1.5 mb-2 border-b border-slate-100 dark:border-slate-800">
        <span className="text-xs font-semibold font-ui uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Department Vaults
        </span>
        <button
          onClick={onToggleFavorites}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold font-ui tracking-ui transition-all cursor-pointer ${
            onlyFavorites
              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Star
            className={`w-3.5 h-3.5 ${
              onlyFavorites ? 'fill-amber-500 text-amber-500' : 'text-slate-400'
            }`}
          />
          <span>Starred ({favoritesCount})</span>
        </button>
      </div>

      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {departments.map((dept) => {
          const config = DEPARTMENT_CONFIG[dept];
          const isSelected = selectedDept === dept && !onlyFavorites;
          const count = counts[dept] || 0;

          return (
            <motion.button
              key={dept}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.94, y: 1 }}
              transition={{
                type: 'spring',
                stiffness: 480,
                damping: 24,
                mass: 0.5,
              }}
              onClick={() => {
                if (onlyFavorites) onToggleFavorites();
                onSelectDept(dept);
              }}
              className={`group relative flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-semibold font-ui tracking-ui transition-colors cursor-pointer whitespace-nowrap border ${
                isSelected
                  ? 'bg-[#0052CC] text-white border-[#0052CC] shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-700 border-slate-200/80 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <motion.span
                animate={{ scale: isSelected ? 1.1 : 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                className={`transition-colors shrink-0 ${
                  isSelected ? 'text-white' : config.color
                }`}
              >
                {getIcon(config.iconName)}
              </motion.span>
              <span>{config.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold font-ui ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                }`}
              >
                {count}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

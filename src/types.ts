export type Department =
  | 'all'
  | 'executive'
  | 'marketing'
  | 'sales'
  | 'operations'
  | 'support'
  | 'hr';

export interface PromptVariable {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  defaultValue?: string;
  type?: 'text' | 'textarea' | 'select';
  options?: string[];
  description?: string;
}

export interface SOPDetails {
  title: string;
  summary: string;
  steps: string[];
  loomUrl?: string;
  docUrl?: string;
  estimatedTime?: string;
  proTips?: string[];
  prerequisites?: string[];
}

export interface PromptItem {
  id: string;
  title: string;
  department: Department;
  taskType: string;
  description: string;
  basePrompt: string;
  variables: PromptVariable[];
  sop: SOPDetails;
  tags: string[];
  isFavorite?: boolean;
  usageCount: number;
  lastUsed?: string;
  isCustom?: boolean;
  createdAt: string;
}

export interface QuickFilter {
  department: Department;
  search: string;
  tag: string | null;
  onlyFavorites: boolean;
  sortBy: 'popular' | 'recent' | 'alphabetical';
}

export interface GeminiTestResponse {
  text: string;
  simulated: boolean;
  error?: string;
}

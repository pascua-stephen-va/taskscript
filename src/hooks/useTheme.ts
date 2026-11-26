import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark';
export type ThemeMode = 'light' | 'dark' | 'auto';

const THEME_STORAGE_KEY = 'taskscript_theme';

function getSystemTheme(): Theme {
  if (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark';
  }
  return 'light';
}

function getSavedMode(): ThemeMode {
  if (typeof window === 'undefined') return 'auto';
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'auto') {
      return saved;
    }
    if (saved === 'system') {
      return 'auto';
    }
  } catch (e) {
    console.error('Failed to read theme preference:', e);
  }
  return 'auto';
}

export function useTheme() {
  // 1. Automatically detect and track live OS color scheme preference
  const [systemTheme, setSystemTheme] = useState<Theme>(getSystemTheme);

  // 2. Track selected mode: 'auto' (follows OS) or manual override ('light' | 'dark')
  const [mode, setModeState] = useState<ThemeMode>(getSavedMode);

  // Effective theme currently active on the page
  const theme: Theme = mode === 'auto' ? systemTheme : mode;
  const isDark = theme === 'dark';
  const isSystemAuto = mode === 'auto';

  // Apply resolved theme to document root element
  const applyTheme = useCallback((newTheme: Theme) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, []);

  // Update mode and persist in localStorage
  const setMode = useCallback(
    (newMode: ThemeMode) => {
      setModeState(newMode);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, newMode);
      } catch (e) {
        console.error('Failed to save theme mode:', e);
      }
      const targetTheme: Theme = newMode === 'auto' ? systemTheme : newMode;
      applyTheme(targetTheme);
    },
    [systemTheme, applyTheme]
  );

  // Set explicit manual override ('light' | 'dark')
  const setTheme = useCallback(
    (newTheme: Theme) => {
      setMode(newTheme);
    },
    [setMode]
  );

  // Toggle directly between Light and Dark as a manual override (persisted in localStorage)
  const toggleTheme = useCallback(() => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    setMode(nextTheme);
  }, [theme, setMode]);

  // Return to automatic OS preference detection
  const resetToSystemTheme = useCallback(() => {
    setMode('auto');
  }, [setMode]);

  // Keep DOM synchronized whenever effective theme changes (manual or OS-triggered)
  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  // Dynamically listen for OS prefers-color-scheme changes
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Sync once on mount in case OS preference changed before hydration
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const detected: Theme = e.matches ? 'dark' : 'light';
      setSystemTheme(detected);
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
      return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }

    // Legacy Safari fallback
    mediaQuery.addListener(handleSystemThemeChange);
    return () => mediaQuery.removeListener(handleSystemThemeChange);
  }, []);

  // Keep theme synchronized across browser tabs when localStorage changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY) {
        setModeState(getSavedMode());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    theme,
    mode,
    systemTheme,
    isDark,
    isSystemAuto,
    setMode,
    setTheme,
    toggleTheme,
    resetToSystemTheme,
  };
}

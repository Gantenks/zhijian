import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { InkTheme, PaperTheme } from '@/features/paper/colors';
import { ThemeMode } from '@/features/diary/types';
import { loadThemeMode, saveThemeMode } from '@/features/diary/storage';

type ThemeColors = typeof PaperTheme | typeof InkTheme;

type ThemeContextValue = {
  mode: ThemeMode;
  colors: ThemeColors;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  ready: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('paper');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadThemeMode().then((m) => {
      setModeState(m);
      setReady(true);
    });
  }, []);

  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m);
    void saveThemeMode(m);
  }, []);

  const isDark = mode === 'ink' || (mode === 'system' && system === 'dark');
  const colors: ThemeColors = isDark ? InkTheme : PaperTheme;

  const value = useMemo(
    () => ({ mode, colors, isDark, setMode, ready }),
    [mode, colors, isDark, setMode, ready],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

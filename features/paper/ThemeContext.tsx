import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { IosDarkTheme, IosLightTheme } from '@/features/ios/colors';
import { InkTheme, PaperTheme } from '@/features/paper/colors';
import { ThemeMode } from '@/features/diary/types';
import { loadThemeMode, saveThemeMode } from '@/features/diary/storage';

type ThemeColors =
  | typeof IosLightTheme
  | typeof IosDarkTheme
  | typeof PaperTheme
  | typeof InkTheme;

type ThemeContextValue = {
  mode: ThemeMode;
  colors: ThemeColors;
  isDark: boolean;
  skin: 'ios' | 'paper';
  setMode: (mode: ThemeMode) => void;
  ready: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolveColors(mode: ThemeMode, system: string | null | undefined): {
  colors: ThemeColors;
  isDark: boolean;
  skin: 'ios' | 'paper';
} {
  if (mode === 'paper') {
    return { colors: PaperTheme, isDark: false, skin: 'paper' };
  }
  if (mode === 'ink') {
    return { colors: InkTheme, isDark: true, skin: 'paper' };
  }
  // ios | system — paper frozen off default path
  const dark = mode === 'ios-dark' || (mode === 'system' && system === 'dark');
  return {
    colors: dark ? IosDarkTheme : IosLightTheme,
    isDark: dark,
    skin: 'ios',
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('ios');
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

  const { colors, isDark, skin } = resolveColors(mode, system);

  const value = useMemo(
    () => ({ mode, colors, isDark, skin, setMode, ready }),
    [mode, colors, isDark, skin, setMode, ready],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

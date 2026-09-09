import AsyncStorage from '@react-native-async-storage/async-storage';
import { DiaryEntry, ThemeMode } from '@/features/diary/types';

const ENTRIES_KEY = '@zhijian/entries';
const THEME_KEY = '@zhijian/theme';
const SEEDED_KEY = '@zhijian/seeded';

export async function loadEntries(): Promise<DiaryEntry[]> {
  const raw = await AsyncStorage.getItem(ENTRIES_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as DiaryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveEntries(entries: DiaryEntry[]): Promise<void> {
  await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
}

export async function loadThemeMode(): Promise<ThemeMode> {
  const raw = await AsyncStorage.getItem(THEME_KEY);
  if (raw === 'paper' || raw === 'ink' || raw === 'system') return raw;
  return 'paper';
}

export async function saveThemeMode(mode: ThemeMode): Promise<void> {
  await AsyncStorage.setItem(THEME_KEY, mode);
}

export async function hasSeeded(): Promise<boolean> {
  return (await AsyncStorage.getItem(SEEDED_KEY)) === '1';
}

export async function markSeeded(): Promise<void> {
  await AsyncStorage.setItem(SEEDED_KEY, '1');
}

export async function clearAllData(): Promise<void> {
  await AsyncStorage.removeMany([ENTRIES_KEY, SEEDED_KEY]);
}

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DiaryEntry } from '@/features/diary/types';
import { createId } from '@/lib/id';
import { toDateKey } from '@/lib/date';
import { createSeedEntries } from '@/features/diary/seed';
import {
  clearAllData,
  hasSeeded,
  loadEntries,
  markSeeded,
  saveEntries,
} from '@/features/diary/storage';

export type EntryInput = {
  title: string;
  body: string;
  mood: DiaryEntry['mood'];
  tags: string[];
  date: string;
};

type DiaryContextValue = {
  entries: DiaryEntry[];
  ready: boolean;
  refreshing: boolean;
  refresh: () => Promise<void>;
  getEntry: (id: string) => DiaryEntry | undefined;
  addEntry: (input: EntryInput) => Promise<DiaryEntry>;
  updateEntry: (id: string, input: EntryInput) => Promise<DiaryEntry | null>;
  deleteEntry: (id: string) => Promise<void>;
  entriesOnDate: (dateKey: string) => DiaryEntry[];
  searchEntries: (query: string, mood?: DiaryEntry['mood'] | null, tag?: string | null) => DiaryEntry[];
  allTags: string[];
  resetDemoData: () => Promise<void>;
};

const DiaryContext = createContext<DiaryContextValue | null>(null);

function sortEntries(list: DiaryEntry[]): DiaryEntry[] {
  return [...list].sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date);
    return b.updatedAt.localeCompare(a.updatedAt);
  });
}

export function DiaryProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [ready, setReady] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const persist = useCallback(async (next: DiaryEntry[]) => {
    const sorted = sortEntries(next);
    setEntries(sorted);
    await saveEntries(sorted);
  }, []);

  const bootstrap = useCallback(async () => {
    let list = await loadEntries();
    const seeded = await hasSeeded();
    if (!seeded && list.length === 0) {
      list = createSeedEntries();
      await saveEntries(list);
      await markSeeded();
    }
    setEntries(sortEntries(list));
    setReady(true);
  }, []);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const list = await loadEntries();
      setEntries(sortEntries(list));
    } finally {
      setRefreshing(false);
    }
  }, []);

  const getEntry = useCallback(
    (id: string) => entries.find((e) => e.id === id),
    [entries],
  );

  const addEntry = useCallback(
    async (input: EntryInput) => {
      const now = new Date().toISOString();
      const entry: DiaryEntry = {
        id: createId(),
        title: input.title.trim() || '无题',
        body: input.body.trim(),
        mood: input.mood,
        tags: input.tags.map((t) => t.trim()).filter(Boolean),
        date: input.date || toDateKey(new Date()),
        createdAt: now,
        updatedAt: now,
      };
      await persist([entry, ...entries]);
      return entry;
    },
    [entries, persist],
  );

  const updateEntry = useCallback(
    async (id: string, input: EntryInput) => {
      const idx = entries.findIndex((e) => e.id === id);
      if (idx < 0) return null;
      const updated: DiaryEntry = {
        ...entries[idx],
        title: input.title.trim() || '无题',
        body: input.body.trim(),
        mood: input.mood,
        tags: input.tags.map((t) => t.trim()).filter(Boolean),
        date: input.date || entries[idx].date,
        updatedAt: new Date().toISOString(),
      };
      const next = [...entries];
      next[idx] = updated;
      await persist(next);
      return updated;
    },
    [entries, persist],
  );

  const deleteEntry = useCallback(
    async (id: string) => {
      await persist(entries.filter((e) => e.id !== id));
    },
    [entries, persist],
  );

  const entriesOnDate = useCallback(
    (dateKey: string) => entries.filter((e) => e.date === dateKey),
    [entries],
  );

  const searchEntries = useCallback(
    (query: string, mood?: DiaryEntry['mood'] | null, tag?: string | null) => {
      const q = query.trim().toLowerCase();
      return entries.filter((e) => {
        if (mood && e.mood !== mood) return false;
        if (tag && !e.tags.includes(tag)) return false;
        if (!q) return true;
        const hay = `${e.title} ${e.body} ${e.tags.join(' ')}`.toLowerCase();
        return hay.includes(q);
      });
    },
    [entries],
  );

  const allTags = useMemo(() => {
    const set = new Set<string>();
    entries.forEach((e) => e.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'zh-CN'));
  }, [entries]);

  const resetDemoData = useCallback(async () => {
    await clearAllData();
    const list = createSeedEntries();
    await saveEntries(list);
    await markSeeded();
    setEntries(sortEntries(list));
  }, []);

  const value = useMemo(
    () => ({
      entries,
      ready,
      refreshing,
      refresh,
      getEntry,
      addEntry,
      updateEntry,
      deleteEntry,
      entriesOnDate,
      searchEntries,
      allTags,
      resetDemoData,
    }),
    [
      entries,
      ready,
      refreshing,
      refresh,
      getEntry,
      addEntry,
      updateEntry,
      deleteEntry,
      entriesOnDate,
      searchEntries,
      allTags,
      resetDemoData,
    ],
  );

  return <DiaryContext.Provider value={value}>{children}</DiaryContext.Provider>;
}

export function useDiary() {
  const ctx = useContext(DiaryContext);
  if (!ctx) throw new Error('useDiary must be used within DiaryProvider');
  return ctx;
}

/**
 * Smoke: diary list → write → "kill app" (reload store) → data still there.
 * Uses an in-memory AsyncStorage stand-in so we can run without a device.
 */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const mem = new Map();
const AsyncStorage = {
  async getItem(k) { return mem.has(k) ? mem.get(k) : null; },
  async setItem(k, v) { mem.set(k, String(v)); },
  async removeItem(k) { mem.delete(k); },
  async removeMany(keys) { keys.forEach((k) => mem.delete(k)); },
};

const ENTRIES_KEY = '@zhijian/entries';
const SEEDED_KEY = '@zhijian/seeded';

function createId() {
  return `e_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function sortEntries(list) {
  return [...list].sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date);
    return b.updatedAt.localeCompare(a.updatedAt);
  });
}

async function loadEntries() {
  const raw = await AsyncStorage.getItem(ENTRIES_KEY);
  if (!raw) return [];
  return JSON.parse(raw);
}

async function saveEntries(entries) {
  await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(sortEntries(entries)));
}

async function addEntry(entries, input) {
  const now = new Date().toISOString();
  const entry = {
    id: createId(),
    title: input.title.trim() || '无题',
    body: input.body.trim(),
    mood: input.mood,
    tags: input.tags,
    date: input.date,
    createdAt: now,
    updatedAt: now,
  };
  const next = sortEntries([entry, ...entries]);
  await saveEntries(next);
  return { entry, next };
}

// --- simulate first launch seed ---
const seed = [{
  id: 'seed1', title: '纸间的第一页', body: 'hello', mood: 'good',
  tags: ['开始'], date: '2026-09-10', createdAt: '2026-09-10T01:00:00.000Z',
  updatedAt: '2026-09-10T01:00:00.000Z',
}];
await saveEntries(seed);
await AsyncStorage.setItem(SEEDED_KEY, '1');

let list = await loadEntries();
assert.equal(list.length, 1, 'seed present');

// write one entry
const { next } = await addEntry(list, {
  title: '夜测',
  body: '杀进程后再看还应在。',
  mood: 'great',
  tags: ['测试'],
  date: '2026-09-10',
});
assert.equal(next.length, 2);

// kill process = wipe JS memory, keep AsyncStorage
list = null;
const reopened = await loadEntries();
assert.equal(reopened.length, 2, 'persisted after reopen');
assert.ok(reopened.some((e) => e.title === '夜测'), 'new entry survives');
assert.ok(reopened.some((e) => e.title === '纸间的第一页'), 'seed survives');

console.log('SMOKE_OK persistence list+write+reopen');

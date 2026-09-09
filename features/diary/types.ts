export type Mood = 'great' | 'good' | 'okay' | 'low' | 'bad';

export type ThemeMode = 'paper' | 'ink' | 'system';

export interface DiaryEntry {
  id: string;
  title: string;
  body: string;
  mood: Mood;
  tags: string[];
  date: string; // ISO date YYYY-MM-DD
  createdAt: string;
  updatedAt: string;
}

export const MOODS: { key: Mood; label: string; emoji: string; color: string }[] = [
  { key: 'great', label: '超棒', emoji: '✨', color: '#E8B86D' },
  { key: 'good', label: '不错', emoji: '🌿', color: '#7BA17B' },
  { key: 'okay', label: '还行', emoji: '☁️', color: '#8B9BB4' },
  { key: 'low', label: '低落', emoji: '🌧️', color: '#6B7C93' },
  { key: 'bad', label: '糟糕', emoji: '🌑', color: '#5C4B51' },
];

export function moodMeta(mood: Mood) {
  return MOODS.find((m) => m.key === mood) ?? MOODS[2];
}

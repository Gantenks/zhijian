import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { DiaryEntry, moodMeta } from '@/features/diary/types';
import { formatEntryDate, formatTime } from '@/lib/date';
import { useTheme } from '@/features/paper/ThemeContext';

type Props = {
  entry: DiaryEntry;
  onPress: () => void;
};

export function EntryCard({ entry, onPress }: Props) {
  const { colors, skin } = useTheme();
  const mood = moodMeta(entry.mood);
  const preview = entry.body.replace(/\s+/g, ' ').trim();
  const ios = skin === 'ios';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        ios ? styles.cardIos : styles.cardPaper,
        {
          backgroundColor: colors.card,
          borderColor: ios ? colors.borderSoft : colors.borderSoft,
          opacity: pressed ? 0.92 : 1,
          shadowColor: colors.shadow,
        },
      ]}
    >
      <View style={styles.top}>
        <Text style={[styles.date, { color: colors.textTertiary }]}>
          {formatEntryDate(entry.date)} · {formatTime(entry.updatedAt)}
        </Text>
        <Text style={styles.mood}>{mood.emoji}</Text>
      </View>
      <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
        {entry.title}
      </Text>
      {preview ? (
        <Text style={[styles.body, { color: colors.textSecondary }]} numberOfLines={3}>
          {preview}
        </Text>
      ) : null}
      {entry.tags.length > 0 ? (
        <View style={styles.tags}>
          {entry.tags.slice(0, 4).map((t) => (
            <View
              key={t}
              style={[styles.tag, { backgroundColor: colors.highlight }]}
            >
              <Text style={[styles.tagText, { color: colors.accent }]}>#{t}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 12,
  },
  cardIos: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 0,
  },
  cardPaper: {
    borderRadius: 18,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  date: { fontSize: 13, fontWeight: '400', letterSpacing: -0.08 },
  mood: { fontSize: 18 },
  title: { fontSize: 17, fontWeight: '600', marginBottom: 6, letterSpacing: -0.4 },
  body: { fontSize: 15, lineHeight: 22, letterSpacing: -0.2 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  tag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  tagText: { fontSize: 12, fontWeight: '500' },
});

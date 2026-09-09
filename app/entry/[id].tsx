import React, { useLayoutEffect } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useDiary } from '@/features/diary/context';
import { useTheme } from '@/features/paper/ThemeContext';
import { moodMeta } from '@/features/diary/types';
import { formatFullDate, formatTime } from '@/lib/date';

export default function EntryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getEntry, deleteEntry } = useDiary();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const entry = getEntry(id);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: entry?.title ?? '日记',
      headerRight: () =>
        entry ? (
          <View style={{ flexDirection: 'row', gap: 16, marginRight: 4 }}>
            <Pressable onPress={() => router.push({ pathname: '/entry/edit', params: { id: entry.id } })}>
              <Text style={{ color: colors.accent, fontSize: 16, fontWeight: '600' }}>编辑</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                Alert.alert('删除日记', '确定删除这篇日记？', [
                  { text: '取消', style: 'cancel' },
                  {
                    text: '删除',
                    style: 'destructive',
                    onPress: async () => {
                      await deleteEntry(entry.id);
                      router.back();
                    },
                  },
                ]);
              }}
            >
              <Text style={{ color: colors.danger, fontSize: 16, fontWeight: '600' }}>删除</Text>
            </Pressable>
          </View>
        ) : null,
    });
  }, [navigation, entry, colors, deleteEntry]);

  if (!entry) {
    return (
      <View style={[styles.missing, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textSecondary, fontSize: 16 }}>找不到这篇日记</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: colors.accent, fontWeight: '600' }}>返回</Text>
        </Pressable>
      </View>
    );
  }

  const mood = moodMeta(entry.mood);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
    >
      <View style={[styles.metaCard, { backgroundColor: colors.card, borderColor: colors.borderSoft }]}>
        <Text style={[styles.date, { color: colors.textTertiary }]}>
          {formatFullDate(entry.date)} · {formatTime(entry.updatedAt)}
        </Text>
        <View style={styles.moodRow}>
          <Text style={{ fontSize: 28 }}>{mood.emoji}</Text>
          <Text style={[styles.moodLabel, { color: colors.textSecondary }]}>{mood.label}</Text>
        </View>
      </View>

      <Text style={[styles.title, { color: colors.text }]}>{entry.title}</Text>
      <Text style={[styles.body, { color: colors.textSecondary }]}>
        {entry.body || '（无正文）'}
      </Text>

      {entry.tags.length > 0 ? (
        <View style={styles.tags}>
          {entry.tags.map((t) => (
            <View key={t} style={[styles.tag, { backgroundColor: colors.highlight }]}>
              <Text style={{ color: colors.accent, fontWeight: '500' }}>#{t}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 20, paddingBottom: 48 },
  metaCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 20,
  },
  date: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
  moodRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  moodLabel: { fontSize: 15, fontWeight: '600' },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.2,
    marginBottom: 16,
    lineHeight: 36,
  },
  body: { fontSize: 17, lineHeight: 28, letterSpacing: 0.2 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 28 },
  tag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
});

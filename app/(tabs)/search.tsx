import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EntryCard } from '@/features/diary/components/EntryCard';
import { EmptyState } from '@/features/diary/components/EmptyState';
import { LargeTitle } from '@/features/paper/components/LargeTitle';
import { useDiary } from '@/features/diary/context';
import { useTheme } from '@/features/paper/ThemeContext';
import { MOODS, Mood } from '@/features/diary/types';

export default function SearchScreen() {
  const { colors } = useTheme();
  const { searchEntries, allTags } = useDiary();
  const [query, setQuery] = useState('');
  const [mood, setMood] = useState<Mood | null>(null);
  const [tag, setTag] = useState<string | null>(null);

  const results = useMemo(
    () => searchEntries(query, mood, tag),
    [searchEntries, query, mood, tag],
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <LargeTitle title="搜索" subtitle="按文字、心情或标签筛选" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="搜索标题、正文或标签…"
              placeholderTextColor={colors.textTertiary}
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              clearButtonMode="while-editing"
            />

            <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>心情</Text>
            <View style={styles.chips}>
              <Pressable
                onPress={() => setMood(null)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: mood === null ? colors.accentMuted : colors.surface,
                    borderColor: mood === null ? colors.accentSoft : colors.border,
                  },
                ]}
              >
                <Text style={{ color: mood === null ? colors.accent : colors.textSecondary, fontSize: 13 }}>
                  全部
                </Text>
              </Pressable>
              {MOODS.map((m) => (
                <Pressable
                  key={m.key}
                  onPress={() => setMood(mood === m.key ? null : m.key)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: mood === m.key ? colors.accentMuted : colors.surface,
                      borderColor: mood === m.key ? colors.accentSoft : colors.border,
                    },
                  ]}
                >
                  <Text style={{ fontSize: 13 }}>
                    {m.emoji} {m.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {allTags.length > 0 ? (
              <>
                <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>标签</Text>
                <View style={styles.chips}>
                  {allTags.map((t) => (
                    <Pressable
                      key={t}
                      onPress={() => setTag(tag === t ? null : t)}
                      style={[
                        styles.chip,
                        {
                          backgroundColor: tag === t ? colors.accentMuted : colors.surface,
                          borderColor: tag === t ? colors.accentSoft : colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          color: tag === t ? colors.accent : colors.textSecondary,
                          fontSize: 13,
                        }}
                      >
                        #{t}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </>
            ) : null}

            <Text style={[styles.count, { color: colors.textTertiary }]}>
              {results.length} 条结果
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <EntryCard entry={item} onPress={() => router.push(`/entry/${item.id}`)} />
        )}
        ListEmptyComponent={
          <EmptyState
            emoji="🔎"
            title="没有找到日记"
            subtitle="试试换个关键词，或清除筛选条件。"
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
    marginHorizontal: 4,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  count: { fontSize: 13, marginBottom: 12, marginLeft: 4 },
});

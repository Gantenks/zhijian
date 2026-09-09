import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { addMonths, subMonths } from 'date-fns';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EntryCard } from '@/features/diary/components/EntryCard';
import { EmptyState } from '@/features/diary/components/EmptyState';
import { LargeTitle } from '@/features/paper/components/LargeTitle';
import { useDiary } from '@/features/diary/context';
import { useTheme } from '@/features/paper/ThemeContext';
import {
  formatMonthTitle,
  isSameDay,
  isToday,
  monthGrid,
  toDateKey,
} from '@/lib/date';

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日'];

export default function CalendarScreen() {
  const { colors } = useTheme();
  const { entries, entriesOnDate } = useDiary();
  const [month, setMonth] = useState(new Date());
  const [selected, setSelected] = useState(toDateKey(new Date()));

  const cells = useMemo(() => monthGrid(month), [month]);
  const marked = useMemo(() => new Set(entries.map((e) => e.date)), [entries]);
  const dayEntries = entriesOnDate(selected);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <LargeTitle title="日历" subtitle="按日子回看" />

        <View style={[styles.cal, { backgroundColor: colors.card, borderColor: colors.borderSoft }]}>
          <View style={styles.monthRow}>
            <Pressable onPress={() => setMonth((m) => subMonths(m, 1))} hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}>
              <Text style={[styles.nav, { color: colors.accent }]}>‹</Text>
            </Pressable>
            <Text style={[styles.monthTitle, { color: colors.text }]}>{formatMonthTitle(month)}</Text>
            <Pressable onPress={() => setMonth((m) => addMonths(m, 1))} hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}>
              <Text style={[styles.nav, { color: colors.accent }]}>›</Text>
            </Pressable>
          </View>

          <View style={styles.weekRow}>
            {WEEKDAYS.map((d) => (
              <Text key={d} style={[styles.weekday, { color: colors.textTertiary }]}>
                {d}
              </Text>
            ))}
          </View>

          <View style={styles.grid}>
            {cells.map((day, idx) => {
              if (!day) {
                return <View key={`e-${idx}`} style={styles.cell} />;
              }
              const key = toDateKey(day);
              const isSelected = key === selected;
              const has = marked.has(key);
              const today = isToday(day);
              return (
                <Pressable
                  key={key}
                  onPress={() => setSelected(key)}
                  style={[
                    styles.cell,
                    isSelected && { backgroundColor: colors.accent, borderRadius: 14 },
                  ]}
                >
                  <Text
                    style={[
                      styles.dayNum,
                      {
                        color: isSelected
                          ? '#FFFBF5'
                          : today
                            ? colors.accent
                            : colors.text,
                        fontWeight: today || isSelected ? '700' : '500',
                      },
                    ]}
                  >
                    {day.getDate()}
                  </Text>
                  {has ? (
                    <View
                      style={[
                        styles.dot,
                        { backgroundColor: isSelected ? '#FFFBF5' : colors.accentSoft },
                      ]}
                    />
                  ) : (
                    <View style={styles.dotPlaceholder} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            {selected} · {dayEntries.length} 篇
          </Text>
          {dayEntries.length === 0 ? (
            <EmptyState
              emoji="📅"
              title="这一天还没有记录"
              subtitle="选中日期后可点下方写一篇。"
            />
          ) : (
            dayEntries.map((e) => (
              <EntryCard
                key={e.id}
                entry={e}
                onPress={() => router.push(`/entry/${e.id}`)}
              />
            ))
          )}
          <Pressable
            onPress={() =>
              router.push({ pathname: '/entry/edit', params: { date: selected } })
            }
            style={[styles.writeBtn, { backgroundColor: colors.accentMuted, borderColor: colors.border }]}
          >
            <Text style={[styles.writeText, { color: colors.accent }]}>在这一天写日记</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  cal: {
    marginHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  monthTitle: { fontSize: 18, fontWeight: '700' },
  nav: { fontSize: 28, fontWeight: '300', paddingHorizontal: 8 },
  weekRow: { flexDirection: 'row', marginBottom: 6 },
  weekday: { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: {
    width: (Dimensions.get('window').width - 32 - 32) / 7,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNum: { fontSize: 15 },
  dot: { width: 5, height: 5, borderRadius: 3, marginTop: 3 },
  dotPlaceholder: { width: 5, height: 5, marginTop: 3 },
  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionTitle: { fontSize: 14, fontWeight: '600', marginBottom: 12 },
  writeBtn: {
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  writeText: { fontSize: 15, fontWeight: '700' },
});

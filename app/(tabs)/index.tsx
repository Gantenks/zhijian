import React, { useCallback, useRef } from 'react';
import {
  Alert,
  Animated,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Swipeable } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EntryCard } from '@/features/diary/components/EntryCard';
import { EmptyState } from '@/features/diary/components/EmptyState';
import { LargeTitle } from '@/features/paper/components/LargeTitle';
import { useDiary } from '@/features/diary/context';
import { useTheme } from '@/features/paper/ThemeContext';
import { DiaryEntry } from '@/features/diary/types';

export default function TimelineScreen() {
  const { colors } = useTheme();
  const { entries, refreshing, refresh, deleteEntry } = useDiary();
  const openRef = useRef<Swipeable | null>(null);

  const confirmDelete = useCallback(
    (id: string) => {
      Alert.alert('删除日记', '确定要删除这篇日记吗？此操作无法撤销。', [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: () => void deleteEntry(id),
        },
      ]);
    },
    [deleteEntry],
  );

  const renderRight = useCallback(
    (id: string, progress: Animated.AnimatedInterpolation<number>) => {
      const scale = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0.8, 1],
      });
      return (
        <Pressable
          onPress={() => confirmDelete(id)}
          style={[styles.deleteAction, { backgroundColor: colors.danger }]}
        >
          <Animated.Text style={[styles.deleteText, { transform: [{ scale }] }]}>
            删除
          </Animated.Text>
        </Pressable>
      );
    },
    [colors.danger, confirmDelete],
  );

  const renderItem = useCallback(
    ({ item }: { item: DiaryEntry }) => (
      <Swipeable
        overshootRight={false}
        onSwipeableWillOpen={() => {
          if (openRef.current) openRef.current.close();
        }}
        ref={(ref) => {
          // keep last opened
        }}
        renderRightActions={(_, progress) => renderRight(item.id, progress)}
      >
        <EntryCard
          entry={item}
          onPress={() => router.push(`/entry/${item.id}`)}
        />
      </Swipeable>
    ),
    [renderRight],
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <LargeTitle
            title="纸间"
            subtitle={entries.length ? `共 ${entries.length} 篇日记` : '把日子写在纸间'}
            right={
              <Pressable
                onPress={() => router.push('/entry/edit')}
                accessibilityRole="button"
                accessibilityLabel="写日记"
                style={[
                  styles.fab,
                  {
                    backgroundColor: colors.accentMuted,
                    borderColor: colors.accentSoft,
                  },
                ]}
              >
                <Text style={[styles.fabText, { color: colors.accent }]}>＋ 写</Text>
              </Pressable>
            }
          />
        }
        ListEmptyComponent={
          <EmptyState
            emoji="🪶"
            title="还没有日记"
            subtitle="点右上角「写」，开始你的第一页。"
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
  fab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  fabText: { fontWeight: '700', fontSize: 15, letterSpacing: 0.6 },
  deleteAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 84,
    marginBottom: 12,
    borderRadius: 18,
    marginLeft: 8,
  },
  deleteText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});

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

const DELETE_W = 88;

export default function TimelineScreen() {
  const { colors } = useTheme();
  const { entries, refreshing, refresh, deleteEntry } = useDiary();
  const openRef = useRef<Swipeable | null>(null);

  const confirmDelete = useCallback(
    (id: string, closer?: Swipeable | null) => {
      Alert.alert('删除日记', '确定要删除这篇日记吗？此操作无法撤销。', [
        {
          text: '取消',
          style: 'cancel',
          onPress: () => closer?.close(),
        },
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
    (
      id: string,
      progress: Animated.AnimatedInterpolation<number>,
      dragX: Animated.AnimatedInterpolation<number>,
      closer: Swipeable | null,
    ) => {
      // Keep delete fully off-screen at rest — no red/brown peek strip.
      const translateX = dragX.interpolate({
        inputRange: [-DELETE_W, 0],
        outputRange: [0, DELETE_W],
        extrapolate: 'clamp',
      });
      const opacity = progress.interpolate({
        inputRange: [0, 0.05, 1],
        outputRange: [0, 1, 1],
        extrapolate: 'clamp',
      });
      return (
        <Animated.View
          style={[
            styles.deleteWrap,
            { transform: [{ translateX }], opacity },
          ]}
        >
          <Pressable
            onPress={() => confirmDelete(id, closer)}
            accessibilityRole="button"
            accessibilityLabel="删除日记"
            style={[styles.deleteAction, { backgroundColor: colors.danger }]}
          >
            <Text style={styles.deleteText}>删除</Text>
          </Pressable>
        </Animated.View>
      );
    },
    [colors.danger, confirmDelete],
  );

  const renderItem = useCallback(
    ({ item }: { item: DiaryEntry }) => {
      let rowRef: Swipeable | null = null;
      return (
        <View style={styles.rowClip}>
          <Swipeable
            ref={(ref) => {
              rowRef = ref;
            }}
            overshootRight={false}
            friction={2}
            rightThreshold={40}
            onSwipeableWillOpen={() => {
              if (openRef.current && openRef.current !== rowRef) {
                openRef.current.close();
              }
              openRef.current = rowRef;
            }}
            onSwipeableClose={() => {
              if (openRef.current === rowRef) openRef.current = null;
            }}
            renderRightActions={(progress, dragX) =>
              renderRight(item.id, progress, dragX, rowRef)
            }
          >
            <EntryCard
              entry={item}
              onPress={() => {
                openRef.current?.close();
                router.push(`/entry/${item.id}`);
              }}
            />
          </Swipeable>
        </View>
      );
    },
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
                hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
                style={[
                  styles.fab,
                  {
                    backgroundColor: colors.accentMuted,
                    borderColor: colors.accentSoft,
                    minHeight: 44,
                    justifyContent: 'center',
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
  rowClip: {
    overflow: 'hidden',
    borderRadius: 18,
    marginBottom: 0,
  },
  fab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  fabText: { fontWeight: '700', fontSize: 15, letterSpacing: 0.6 },
  deleteWrap: {
    width: DELETE_W,
    marginBottom: 12,
    marginLeft: 4,
  },
  deleteAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    minHeight: 72,
  },
  deleteText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});

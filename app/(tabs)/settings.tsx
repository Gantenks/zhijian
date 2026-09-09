import React from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LargeTitle } from '@/features/paper/components/LargeTitle';
import { useDiary } from '@/features/diary/context';
import { useTheme } from '@/features/paper/ThemeContext';
import { ThemeMode } from '@/features/diary/types';

const THEMES: { key: ThemeMode; title: string; desc: string }[] = [
  { key: 'paper', title: '纸感浅色', desc: '奶油底 + 软墨色，默认纸间气质' },
  { key: 'ink', title: '墨色深色', desc: '深夜书写，降低屏幕刺激' },
  { key: 'system', title: '跟随系统', desc: '根据系统外观自动切换' },
];

export default function SettingsScreen() {
  const { colors, mode, setMode } = useTheme();
  const { entries, resetDemoData } = useDiary();

  const onReset = () => {
    Alert.alert('恢复示例日记', '将清空当前全部日记，并重新写入演示数据。', [
      { text: '取消', style: 'cancel' },
      {
        text: '恢复',
        style: 'destructive',
        onPress: () => void resetDemoData(),
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 48 }}>
        <LargeTitle title="设置" subtitle="纸间 · 本地日记" />

        <Text style={[styles.section, { color: colors.textSecondary }]}>外观</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.borderSoft }]}>
          {THEMES.map((t, i) => {
            const selected = mode === t.key;
            return (
              <Pressable
                key={t.key}
                onPress={() => setMode(t.key)}
                style={[
                  styles.row,
                  i < THEMES.length - 1 && {
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.rowTitle, { color: colors.text }]}>{t.title}</Text>
                  <Text style={[styles.rowDesc, { color: colors.textTertiary }]}>{t.desc}</Text>
                </View>
                <View
                  style={[
                    styles.radio,
                    {
                      borderColor: selected ? colors.accent : colors.border,
                      backgroundColor: selected ? colors.accent : 'transparent',
                    },
                  ]}
                />
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.section, { color: colors.textSecondary }]}>数据</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.borderSoft }]}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowTitle, { color: colors.text }]}>本地存储</Text>
              <Text style={[styles.rowDesc, { color: colors.textTertiary }]}>
                当前共 {entries.length} 篇，保存在本机 AsyncStorage
              </Text>
            </View>
          </View>
          <Pressable
            onPress={onReset}
            style={[
              styles.row,
              {
                borderTopWidth: StyleSheet.hairlineWidth,
                borderTopColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.rowTitle, { color: colors.danger }]}>恢复示例日记</Text>
          </Pressable>
        </View>

        <Text style={[styles.section, { color: colors.textSecondary }]}>关于</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.borderSoft }]}>
          <View style={styles.row}>
            <View>
              <Text style={[styles.rowTitle, { color: colors.text }]}>纸间</Text>
              <Text style={[styles.rowDesc, { color: colors.textTertiary }]}>
                版本 1.0.0 · Expo · 本地优先 · 无账号
              </Text>
            </View>
          </View>
        </View>

        <Text style={[styles.footer, { color: colors.textTertiary }]}>
          把日子写在纸间。数据只留在你的设备上。
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  section: {
    marginTop: 8,
    marginBottom: 8,
    marginHorizontal: 24,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  card: {
    marginHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowTitle: { fontSize: 16, fontWeight: '600' },
  rowDesc: { fontSize: 13, marginTop: 3, lineHeight: 18 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
  },
  footer: {
    textAlign: 'center',
    marginTop: 28,
    fontSize: 13,
    paddingHorizontal: 32,
    lineHeight: 20,
  },
});

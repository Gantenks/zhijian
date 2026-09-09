import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/features/paper/ThemeContext';

type Props = {
  title: string;
  subtitle?: string;
  emoji?: string;
};

export function EmptyState({ title, subtitle, emoji = '📄' }: Props) {
  const { colors } = useTheme();
  return (
    <View style={styles.wrap}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: colors.textTertiary }]}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emoji: { fontSize: 44, marginBottom: 16 },
  title: { fontSize: 18, fontWeight: '600', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 15, lineHeight: 22, textAlign: 'center' },
});

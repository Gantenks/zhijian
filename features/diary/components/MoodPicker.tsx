import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MOODS, Mood } from '@/features/diary/types';
import { useTheme } from '@/features/paper/ThemeContext';

type Props = {
  value: Mood;
  onChange: (mood: Mood) => void;
};

export function MoodPicker({ value, onChange }: Props) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      {MOODS.map((m) => {
        const selected = value === m.key;
        return (
          <Pressable
            key={m.key}
            onPress={() => onChange(m.key)}
            style={[
              styles.item,
              {
                backgroundColor: selected ? colors.accentMuted : colors.surface,
                borderColor: selected ? colors.accentSoft : colors.border,
              },
            ]}
          >
            <Text style={styles.emoji}>{m.emoji}</Text>
            <Text
              style={[
                styles.label,
                { color: selected ? colors.accent : colors.textSecondary },
              ]}
            >
              {m.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  item: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
    minWidth: 58,
  },
  emoji: { fontSize: 20, marginBottom: 4 },
  label: { fontSize: 12, fontWeight: '500' },
});

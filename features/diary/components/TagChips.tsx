import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useTheme } from '@/features/paper/ThemeContext';

type Props = {
  tags: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
};

export function TagChips({ tags, onChange, suggestions = [] }: Props) {
  const { colors } = useTheme();
  const [draft, setDraft] = useState('');

  const add = (raw: string) => {
    const t = raw.trim().replace(/^#/, '');
    if (!t || tags.includes(t)) {
      setDraft('');
      return;
    }
    onChange([...tags, t]);
    setDraft('');
  };

  const remove = (t: string) => onChange(tags.filter((x) => x !== t));

  const unused = suggestions.filter((s) => !tags.includes(s)).slice(0, 8);

  return (
    <View>
      <View style={styles.wrap}>
        {tags.map((t) => (
          <Pressable
            key={t}
            onPress={() => remove(t)}
            style={[styles.chip, { backgroundColor: colors.accentMuted, borderColor: colors.border }]}
          >
            <Text style={[styles.chipText, { color: colors.accent }]}>#{t} ×</Text>
          </Pressable>
        ))}
      </View>
      <TextInput
        value={draft}
        onChangeText={setDraft}
        onSubmitEditing={() => add(draft)}
        placeholder="添加标签，回车确认"
        placeholderTextColor={colors.textTertiary}
        style={[
          styles.input,
          {
            color: colors.text,
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
        returnKeyType="done"
      />
      {unused.length > 0 ? (
        <View style={[styles.wrap, { marginTop: 8 }]}>
          {unused.map((s) => (
            <Pressable
              key={s}
              onPress={() => add(s)}
              style={[styles.suggest, { borderColor: colors.borderSoft }]}
            >
              <Text style={{ color: colors.textTertiary, fontSize: 13 }}>#{s}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipText: { fontSize: 13, fontWeight: '500' },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  suggest: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
});

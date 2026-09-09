import React, { useLayoutEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { MoodPicker } from '@/features/diary/components/MoodPicker';
import { TagChips } from '@/features/diary/components/TagChips';
import { useDiary } from '@/features/diary/context';
import { useTheme } from '@/features/paper/ThemeContext';
import { Mood } from '@/features/diary/types';
import { toDateKey } from '@/lib/date';

export default function EditEntryScreen() {
  const { id, date: dateParam } = useLocalSearchParams<{ id?: string; date?: string }>();
  const { getEntry, addEntry, updateEntry, allTags } = useDiary();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const existing = id ? getEntry(id) : undefined;
  const isEdit = Boolean(existing);

  const [title, setTitle] = useState(existing?.title ?? '');
  const [body, setBody] = useState(existing?.body ?? '');
  const [mood, setMood] = useState<Mood>(existing?.mood ?? 'okay');
  const [tags, setTags] = useState<string[]>(existing?.tags ?? []);
  const [date, setDate] = useState(
    existing?.date ?? (typeof dateParam === 'string' ? dateParam : toDateKey(new Date())),
  );
  const [saving, setSaving] = useState(false);

  const canSave = useMemo(
    () => title.trim().length > 0 || body.trim().length > 0,
    [title, body],
  );

  const onSave = async () => {
    if (!canSave || saving) {
      Alert.alert('写点什么', '请至少填写标题或正文。');
      return;
    }
    setSaving(true);
    try {
      const payload = { title, body, mood, tags, date };
      if (isEdit && existing) {
        await updateEntry(existing.id, payload);
        router.back();
      } else {
        const created = await addEntry(payload);
        router.replace(`/entry/${created.id}`);
      }
    } finally {
      setSaving(false);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEdit ? '编辑日记' : '写日记',
      headerLeft: () => (
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Text style={{ color: colors.textSecondary, fontSize: 16 }}>取消</Text>
        </Pressable>
      ),
      headerRight: () => (
        <Pressable onPress={onSave} disabled={saving} hitSlop={10}>
          <Text
            style={{
              color: canSave ? colors.accent : colors.textTertiary,
              fontSize: 16,
              fontWeight: '700',
            }}
          >
            {saving ? '保存中…' : '保存'}
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, isEdit, colors, canSave, saving, title, body, mood, tags, date]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.label, { color: colors.textSecondary }]}>日期 (YYYY-MM-DD)</Text>
        <TextInput
          value={date}
          onChangeText={setDate}
          placeholder="2026-09-10"
          placeholderTextColor={colors.textTertiary}
          autoCapitalize="none"
          style={[
            styles.input,
            { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        />

        <Text style={[styles.label, { color: colors.textSecondary }]}>标题</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="给这一页起个名字"
          placeholderTextColor={colors.textTertiary}
          style={[
            styles.input,
            styles.titleInput,
            { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        />

        <Text style={[styles.label, { color: colors.textSecondary }]}>心情</Text>
        <MoodPicker value={mood} onChange={setMood} />

        <Text style={[styles.label, { color: colors.textSecondary, marginTop: 18 }]}>正文</Text>
        <TextInput
          value={body}
          onChangeText={setBody}
          placeholder="把今天想留下来的话写在这里…"
          placeholderTextColor={colors.textTertiary}
          multiline
          textAlignVertical="top"
          style={[
            styles.input,
            styles.bodyInput,
            { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        />

        <Text style={[styles.label, { color: colors.textSecondary }]}>标签</Text>
        <TagChips tags={tags} onChange={setTags} suggestions={allTags} />

        <Pressable
          onPress={onSave}
          accessibilityRole="button"
          style={[
            styles.saveBtn,
            {
              backgroundColor: canSave ? colors.accentMuted : colors.surface,
              borderColor: canSave ? colors.accentSoft : colors.border,
            },
          ]}
        >
          <Text style={[styles.saveText, { color: canSave ? colors.accent : colors.textTertiary }]}>
            {isEdit ? '更新日记' : '保存到纸间'}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 48 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 8, marginTop: 4 },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  titleInput: { fontSize: 20, fontWeight: '700' },
  bodyInput: { minHeight: 180, lineHeight: 24 },
  saveBtn: {
    marginTop: 24,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  saveText: { fontSize: 16, fontWeight: '700', letterSpacing: 0.4 },
});

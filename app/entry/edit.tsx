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
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { MoodPicker } from '@/features/diary/components/MoodPicker';
import { TagChips } from '@/features/diary/components/TagChips';
import { useDiary } from '@/features/diary/context';
import { useTheme } from '@/features/paper/ThemeContext';
import { Mood } from '@/features/diary/types';
import { formatFullDate, parseISO, toDateKey } from '@/lib/date';

/** Expand touch target to at least 44pt (HIG). */
const HIT_44 = { top: 14, bottom: 14, left: 14, right: 14 } as const;

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
  const [showPicker, setShowPicker] = useState(false);

  const canSave = useMemo(
    () => title.trim().length > 0 || body.trim().length > 0,
    [title, body],
  );

  const pickerValue = useMemo(() => {
    try {
      return parseISO(date);
    } catch {
      return new Date();
    }
  }, [date]);

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

  const onDateChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
      if (event.type === 'dismissed') return;
    }
    if (selected) {
      setDate(toDateKey(selected));
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEdit ? '编辑日记' : '写日记',
      headerLeft: () => (
        <Pressable
          onPress={() => router.back()}
          hitSlop={HIT_44}
          accessibilityRole="button"
          accessibilityLabel="取消"
          style={styles.headerBtn}
        >
          <Text style={{ color: colors.textSecondary, fontSize: 16 }}>取消</Text>
        </Pressable>
      ),
      headerRight: () => (
        <Pressable
          onPress={onSave}
          disabled={saving}
          hitSlop={HIT_44}
          accessibilityRole="button"
          accessibilityLabel="保存"
          style={styles.headerBtn}
        >
          <Text
            style={{
              color: colors.accent,
              fontSize: 17,
              fontWeight: '600',
              opacity: canSave && !saving ? 1 : 0.35,
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
        <Text style={[styles.label, { color: colors.textSecondary }]}>日期</Text>
        <Pressable
          onPress={() => setShowPicker(true)}
          accessibilityRole="button"
          accessibilityLabel="选择日期"
          style={[
            styles.input,
            styles.dateBtn,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={{ color: colors.text, fontSize: 16 }}>{formatFullDate(date)}</Text>
          <Text style={{ color: colors.textTertiary, fontSize: 13 }}>轻触选择</Text>
        </Pressable>

        {showPicker && (
          <View style={styles.pickerWrap}>
            <DateTimePicker
              value={pickerValue}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              locale="zh-CN"
            />
            {Platform.OS === 'ios' && (
              <Pressable
                onPress={() => setShowPicker(false)}
                hitSlop={HIT_44}
                style={[styles.pickerDone, { borderColor: colors.border }]}
              >
                <Text style={{ color: colors.accent, fontWeight: '700' }}>完成</Text>
              </Pressable>
            )}
          </View>
        )}

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
  dateBtn: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleInput: { fontSize: 20, fontWeight: '700' },
  bodyInput: { minHeight: 180, lineHeight: 24 },
  headerBtn: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  pickerWrap: { marginBottom: 12 },
  pickerDone: {
    alignSelf: 'flex-end',
    minHeight: 44,
    minWidth: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  saveBtn: {
    marginTop: 24,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    minHeight: 52,
  },
  saveText: { fontSize: 16, fontWeight: '700', letterSpacing: 0.4 },
});

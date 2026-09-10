import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/features/paper/ThemeContext';

type Props = {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
};

export function LargeTitle({ title, subtitle, right }: Props) {
  const { colors, skin } = useTheme();
  const ios = skin === 'ios';
  return (
    <View style={styles.wrap}>
      <View style={{ flex: 1, paddingRight: right ? 12 : 0 }}>
        <Text
          style={[
            styles.title,
            ios ? styles.titleIos : styles.titlePaper,
            { color: colors.text },
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: colors.textTertiary }]} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: { fontSize: 34 },
  titleIos: { fontWeight: '700', letterSpacing: 0.35 },
  titlePaper: { fontWeight: '800', letterSpacing: 1.4 },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
    fontWeight: '400',
    letterSpacing: -0.08,
    lineHeight: 18,
  },
});

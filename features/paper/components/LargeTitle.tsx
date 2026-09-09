import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/features/paper/ThemeContext';

type Props = {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
};

export function LargeTitle({ title, subtitle, right }: Props) {
  const { colors, isDark } = useTheme();
  return (
    <View style={styles.wrap}>
      <View style={{ flex: 1, paddingRight: right ? 12 : 0 }}>
        <Text
          style={[
            styles.title,
            {
              color: colors.text,
              textShadowColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.95)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: isDark ? 3 : 0.5,
            },
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
    paddingBottom: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: '500',
    letterSpacing: 0.3,
    lineHeight: 20,
  },
});

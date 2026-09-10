/** iOS Human Interface–inspired tokens. Same shape as paper themes for shared screens. */
export const IosLightTheme = {
  name: 'ios' as const,
  background: '#F2F2F7',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  card: '#FFFFFF',
  border: '#C6C6C8',
  borderSoft: '#E5E5EA',
  text: '#000000',
  textSecondary: '#3C3C43',
  textTertiary: '#8E8E93',
  accent: '#007AFF',
  accentSoft: '#5AC8FA',
  accentMuted: '#E5F1FF',
  danger: '#FF3B30',
  dangerSoft: '#FFE5E3',
  tabBar: '#F9F9F9',
  tabInactive: '#8E8E93',
  tabActive: '#007AFF',
  shadow: 'rgba(0, 0, 0, 0.06)',
  ink: '#000000',
  cream: '#F2F2F7',
  highlight: '#E5E5EA',
};

export const IosDarkTheme = {
  name: 'ios-dark' as const,
  background: '#000000',
  surface: '#1C1C1E',
  surfaceElevated: '#2C2C2E',
  card: '#1C1C1E',
  border: '#38383A',
  borderSoft: '#2C2C2E',
  text: '#FFFFFF',
  textSecondary: '#EBEBF5',
  textTertiary: '#8E8E93',
  accent: '#0A84FF',
  accentSoft: '#64D2FF',
  accentMuted: '#0A2540',
  danger: '#FF453A',
  dangerSoft: '#3A1512',
  tabBar: '#1C1C1E',
  tabInactive: '#8E8E93',
  tabActive: '#0A84FF',
  shadow: 'rgba(0, 0, 0, 0.45)',
  ink: '#FFFFFF',
  cream: '#000000',
  highlight: '#2C2C2E',
};

export type IosColors = typeof IosLightTheme;

export default {
  light: IosLightTheme,
  dark: IosDarkTheme,
};

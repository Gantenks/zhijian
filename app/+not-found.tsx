import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: '未找到' }} />
      <View style={styles.container}>
        <Text style={styles.title}>这一页不在纸间里</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>回到时间线</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F7F1E8',
  },
  title: { fontSize: 20, fontWeight: '700', color: '#2C2416' },
  link: { marginTop: 16, paddingVertical: 12 },
  linkText: { fontSize: 16, color: '#8B6914', fontWeight: '600' },
});

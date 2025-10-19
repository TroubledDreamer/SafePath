import 'react-native-get-random-values';

import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import SearchBar from '@/components/searchBar';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Optional top spacing */}
      <View style={{ marginTop: 100 }} />

      {/* Core Search UI */}
      <SearchBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});

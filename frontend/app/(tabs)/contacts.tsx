import { Image } from 'expo-image';

import { Link } from 'expo-router';
import { View, Text,  StyleSheet } from 'react-native';

import { SearchBar } from 'react-native-screens';
export default function ScheduleScreen() {
  return (
    <View>

      <SearchBar/>

      

    </View>
  
  );
}

const styles = StyleSheet.create({
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

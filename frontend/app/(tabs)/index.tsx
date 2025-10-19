import { Image } from 'expo-image';

import { Link } from 'expo-router';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import SearchBar from '@/components/searchBar';
import SearchBar2 from '@/components/SearchBar2';

export default function HomeScreen() {
  return (

    <View>


          <View style={{marginTop: 100}}> 
          </View>

          
          <SearchBar/>





  

          <SearchBar2 />
          </View>

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
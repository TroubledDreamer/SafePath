import { Image } from 'expo-image';

import { Link } from 'expo-router';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import SearchBar from '@/components/searchBar';

export default function HomeScreen() {
  return (
    <View>

        <ScrollView>

                  <View style={{marginTop: 100}}> 

            </View>
          <SearchBar/>
        </ScrollView>


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

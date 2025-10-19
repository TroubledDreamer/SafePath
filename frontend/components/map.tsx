import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Dimensions,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';


const { height } = Dimensions.get('window'); // for proportional sizing

export function mapk() {
  // to be able to pull name from DB
  const userName = 'Elle';

  const hours = new Date().getHours();
  let timeOfDay = 'Day';
  if (hours < 12) timeOfDay = 'Morning';
  else if (hours < 18) timeOfDay = 'Afternoon';
  else timeOfDay = 'Evening';

  return (
    <View style={styles.container}>
      {/* Scrollable content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Map Placeholder */}
        <View style={styles.mapContainer}>
          <ImageBackground
            source={{
              uri: 'https://cdn.serc.carleton.edu/images/sp/library/google_earth/google_maps_hello_world.webp',
            }}
            style={styles.mapImage}
            blurRadius={0.5}
          >
            <View style={styles.overlay}>
              <TouchableOpacity style={styles.searchBar}>
                <Ionicons name="search" size={20} color="#888" />
                <Text style={styles.searchText}>Where to?</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
        {/* Map Placeholder END */}


        {/* Greeting */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>
            Good {timeOfDay}, <Text style={styles.username}>{userName}</Text>
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="people" size={28} color="#007AFF" />
            <Text style={styles.cardText}>Trusted Contacts</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="camera" size={28} color="#007AFF" />
            <Text style={styles.cardText}>Quick Capture</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="calendar" size={28} color="#007AFF" />
            <Text style={styles.cardText}>Schedule</Text>
          </TouchableOpacity>
        </View>

        {/* SOS Button (part of scroll, not fixed) */}
        <TouchableOpacity style={styles.sosButton}>
          <Text style={styles.sosText}>SEND SOS</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: height * 0.05, 
  },
  mapContainer: {
    height: height * 0.35, 
    width: '100%',
  },
  mapImage: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  overlay: {
    paddingTop: height * 0.08,
    paddingHorizontal: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  searchText: {
    marginLeft: 10,
    color: '#888',
    fontSize: 16,
  },
  greetingContainer: {
    marginTop: height * 0.02,
    paddingHorizontal: 20,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
  },
  username: {
    color: '#007AFF',
    fontWeight: '700',
  },
  actionSection: {
    flexDirection: 'column',
    justifyContent: 'space-evenly', 
    paddingHorizontal: 20,
    marginTop: height * 0.02,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 14,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: height * 0.008, 
  },
  cardText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  sosButton: {
    backgroundColor: '#ff3b30',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: height * 0.02,
    elevation: 5,
  },
  sosText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});




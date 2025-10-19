import 'react-native-get-random-values';
import React, { useState } from 'react';
import { View, StyleSheet, Text, Alert, ActivityIndicator, TouchableOpacity, TextInput, FlatList, Platform, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LocationCoords, PathDeviation, Place } from '../lib/types/navigation';
import { useLocationMonitoring } from '../hooks/use-location-monitoring';
import { DeviationWarning } from './DeviationWarning';

import { calculateDistance, assessDanger } from '../lib/services/location-service';

const SearchBar: React.FC = () => {
  const router = useRouter();
  const [destination, setDestination] = useState<LocationCoords | null>(null);
  const [destinationName, setDestinationName] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMonitoringPath, setIsMonitoringPath] = useState<boolean>(false);

  // Use our custom location monitoring hook
  const { currentLocation, loadingLocation, pathDeviation } = useLocationMonitoring({
    destination,
    isMonitoringPath
  });

  // Location monitoring is now handled by the useLocationMonitoring hook

  const searchPlaces = async (query: string) => {
    if (!query.trim() || !currentLocation) return;
    
    setIsLoading(true);
    try {
      // Add specific type filtering for better results
      const types = [
        'establishment',
        'point_of_interest',
        'street_address',
        'premise',
        'subpremise',
        'school',
        'university'
      ].join('|');

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
          query
        )}&location=${currentLocation.latitude},${currentLocation.longitude}&radius=50000&key=AIzaSyDxTf__KpaQErFQ_p5j8PZQ8mRTGD7er2g&components=country:jm&type=${types}`
      );
      
      const data = await response.json();
      
      if (data.status === 'OK' && data.results) {
        const places: Place[] = data.results.map((result: any) => ({
          id: result.place_id,
          name: result.name,
          address: result.formatted_address || '',
          location: {
            lat: result.geometry.location.lat,
            lng: result.geometry.location.lng,
          },
        }));
        setSearchResults(places);
      } else {
        console.warn('Places API response:', data.status);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching places:', error);
      Alert.alert('Error', 'Failed to search for places');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaceSelect = (place: Place) => {
    setDestination({
      latitude: place.location.lat,
      longitude: place.location.lng,
    });
    setDestinationName(place.name);
    setSearchResults([]); // Clear results after selection
    setSearchQuery(place.name); // Update search input
  };

  const handleStartTrip = () => {
    if (!currentLocation || !destination) {
      Alert.alert('Missing Information', 'Please select a destination.');
      return;
    }

    // Start monitoring path deviation
    setIsMonitoringPath(true);

    router.push({
      pathname: '/(tabs)/trip',
      params: {
        origin: `${currentLocation.latitude},${currentLocation.longitude}`,
        destination: `${destination.latitude},${destination.longitude}`,
        mode: 'DRIVING',
      },
    });
  };

  if (loadingLocation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Fetching current location...</Text>
      </View>
    );
  }

  if (!currentLocation) return null;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.searchContainer}>
            <TextInput
              style={[
                styles.textInput,
                Platform.OS === 'ios' && styles.iosInput
              ]}
              placeholder="Search for destination..."
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                if (text.length >= 2) {
                  searchPlaces(text);
                } else {
                  setSearchResults([]);
                }
              }}
              placeholderTextColor="#555"
              returnKeyType="search"
              onSubmitEditing={() => {
                searchPlaces(searchQuery);
                if (Platform.OS === 'android') {
                  Keyboard.dismiss();
                }
              }}
              clearButtonMode="while-editing"
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="default"
            />
            
            {isLoading && (
              <ActivityIndicator style={styles.searchingIndicator} />
            )}

            {searchResults.length > 0 && (
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item.id}
                style={styles.searchResultsList}
                keyboardShouldPersistTaps="handled"
                bounces={false}
                showsVerticalScrollIndicator={true}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.searchResultItem}
                    onPress={() => {
                      handlePlaceSelect(item);
                      Keyboard.dismiss();
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.placeName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.placeAddress} numberOfLines={2}>{item.address}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: destination ? '#27ae60' : '#95a5a6' },
            ]}
            onPress={handleStartTrip}
            disabled={!destination}
          >
            <Text style={styles.buttonText}>
              {destination ? `Go to ${destinationName}` : 'Select a destination'}
            </Text>
          </TouchableOpacity>

          {/* Debug and Path Monitoring */}
          <View style={styles.debugInfo}>
            <Text style={styles.debugText}>
              📍 Current: {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
            </Text>
            {destination && (
              <>
                <Text style={styles.debugText}>
                  🎯 Destination: {destination.latitude.toFixed(6)}, {destination.longitude.toFixed(6)}
                </Text>
                {pathDeviation && (
                  <View style={[styles.deviationInfo, styles[`danger${pathDeviation.dangerLevel}`]]}>
                    <Text style={styles.deviationText}>
                      ⚠️ {Math.round(pathDeviation.distance)}m off path
                    </Text>
                    <Text style={styles.deviationText}>
                      Risk Level: {pathDeviation.dangerLevel}
                    </Text>
                    <Text style={styles.deviationReason}>
                      {pathDeviation.reason}
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

type DangerLevel = 'LOW' | 'MEDIUM' | 'HIGH';

type StyleProps = {
  [key: string]: any;
  container: any;
  iosInput: any;
  searchContainer: any;
  textInput: any;
  searchingIndicator: any;
  searchResultsList: any;
  searchResultItem: any;
  placeName: any;
  placeAddress: any;
  button: any;
  buttonText: any;
  debugInfo: any;
  debugText: any;
  loadingContainer: any;
  deviationInfo: any;
  deviationText: any;
  deviationReason: any;
} & {
  [K in `danger${DangerLevel}`]: any;
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 10,
    ...Platform.select({
      ios: {
        zIndex: 1
      }
    })
  },
  iosInput: {
    paddingVertical: 12,
  },
  searchContainer: {
    flex: 0,
    zIndex: 1000,
    position: 'relative',
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  textInput: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        paddingVertical: 10,
      },
      android: {
        paddingVertical: 8,
      },
    }),
  },
  searchingIndicator: {
    position: 'absolute',
    right: 10,
    top: 15,
    ...Platform.select({
      ios: {
        zIndex: 1,
      },
    }),
  },
  searchResultsList: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: 5,
    maxHeight: 200,
    position: 'absolute',
    top: 55,
    left: 0,
    right: 0,
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    ...Platform.select({
      ios: {
        zIndex: 2,
      },
    }),
  },
  searchResultItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  placeName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  placeAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  button: {
    marginTop: 15,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  debugInfo: { 
    marginTop: 10, 
    padding: 10, 
    backgroundColor: '#f5f5f5', 
    borderRadius: 5 
  },
  debugText: { 
    fontSize: 12, 
    fontFamily: 'monospace' 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  deviationInfo: {
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
  },
  deviationText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deviationReason: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
  dangerLOW: {
    backgroundColor: '#2ecc71',
  },
  dangerMEDIUM: {
    backgroundColor: '#f1c40f',
  },
  dangerHIGH: {
    backgroundColor: '#e74c3c',
  },
});

export default SearchBar;

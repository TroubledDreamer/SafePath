// SearchBar.tsx
import 'react-native-get-random-values'; // required for uuid
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { GooglePlacesAutocomplete, GooglePlaceDetail } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

interface LocationCoords {
  latitude: number;
  longitude: number;
}

const SearchBar: React.FC = () => {
  const router = useRouter();
  const [currentLocation, setCurrentLocation] = useState<LocationCoords | null>(null);
  const [destination, setDestination] = useState<LocationCoords | null>(null);
  const [destinationName, setDestinationName] = useState<string>('');
  const [loadingLocation, setLoadingLocation] = useState<boolean>(true);

  // Get user's current location
  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location access is required.');
          setLoadingLocation(false);
          return;
        }

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
        });

        setCurrentLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      } catch (err) {
        console.error('Error fetching location:', err);
        Alert.alert('Error', 'Failed to get current location.');
      } finally {
        setLoadingLocation(false);
      }
    };

    getLocation();
  }, []);

  const handlePlaceSelect = (data: any, details: GooglePlaceDetail | null = null) => {
    if (!details?.geometry?.location) return;

    setDestination({
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
    });
    setDestinationName(details.name || details.formatted_address || '');
  };

  const handleStartTrip = () => {
    if (!currentLocation || !destination) {
      Alert.alert('Missing Information', 'Please select a destination.');
      return;
    }

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
          <GooglePlacesAutocomplete
            placeholder="Search for destination..."
            fetchDetails={true}
            onPress={handlePlaceSelect}
            query={{
              key: 'AIzaSyDxTf__KpaQErFQ_p5j8PZQ8mRTGD7er2g',
              language: 'en',
            }}
            enablePoweredByContainer={false}
            debounce={300}
            minLength={2}
            styles={{
              container: styles.autocompleteContainer,
              textInput: styles.textInput,
              listView: styles.listView,
              row: styles.row,
            }}
            predefinedPlaces={[]} // prevents filter / onFocus errors
            textInputProps={{
              placeholderTextColor: '#555',
              returnKeyType: 'search',
              onFocus: () => {}, // ensures onFocus exists
            }}
          />

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

          {/* Debug */}
          <View style={styles.debugInfo}>
            <Text style={styles.debugText}>
              📍 Current: {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
            </Text>
            {destination && (
              <Text style={styles.debugText}>
                🎯 Destination: {destination.latitude.toFixed(6)}, {destination.longitude.toFixed(6)}
              </Text>
            )}
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  autocompleteContainer: { flex: 0, zIndex: 1000 },
  textInput: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: 'white',
  },
  listView: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: 5,
    elevation: 3,
  },
  row: { padding: 13, height: 44, flexDirection: 'row' },
  button: {
    marginTop: 15,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  debugInfo: { marginTop: 10, padding: 10, backgroundColor: '#f5f5f5', borderRadius: 5 },
  debugText: { fontSize: 12, fontFamily: 'monospace' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default SearchBar;

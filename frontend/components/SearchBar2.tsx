// SearchBar.tsx
import 'react-native-get-random-values'; // required for uuid in some stacks
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {
  GooglePlacesAutocomplete,
  GooglePlaceDetail,
} from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';

interface LocationCoords {
  latitude: number;
  longitude: number;
}

const API_KEY = "AIzaSyDxTf__KpaQErFQ_p5j8PZQ8mRTGD7er2g";

const SearchBar: React.FC = () => {
  const router = useRouter();

  const [currentLocation, setCurrentLocation] = useState<LocationCoords | null>(null);
  const [destination, setDestination] = useState<LocationCoords | null>(null);
  const [destinationName, setDestinationName] = useState<string>('');
  const [loadingLocation, setLoadingLocation] = useState<boolean>(true);
  const [countryCode, setCountryCode] = useState<string | null>(null); // e.g., "HR"

  // Get user's current location (GPS) and (optionally) resolve country code
  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location access is required for nearby search.');
          setLoadingLocation(false);
          return;
        }

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced, // BestForNavigation works too; Balanced is faster/cheaper
        });

        const coords = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        };
        console.log(coords);

        setCurrentLocation(coords);


        try {
          const [rev] = await Location.reverseGeocodeAsync(coords);
          if (rev?.isoCountryCode) setCountryCode(rev.isoCountryCode);
        } catch {

        }
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
    const lat = details?.geometry?.location?.lat;
    const lng = details?.geometry?.location?.lng;
    if (typeof lat !== 'number' || typeof lng !== 'number') return;

    setDestination({ latitude: lat, longitude: lng });
    setDestinationName(details?.name || details?.formatted_address || '');
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
        <Text>Fetching current location…</Text>
      </View>
    );
  }

  if (!currentLocation) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ textAlign: 'center', paddingHorizontal: 16 }}>
          We couldn’t access your location. Enable permissions and try again.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder="Where to?"
        fetchDetails
        onPress={handlePlaceSelect}
        query={{
          key: API_KEY, 
          language: 'en',
          location: `${currentLocation.latitude},${currentLocation.longitude}`,
          radius: 50000,
          components: countryCode ? `country:${countryCode.toLowerCase()}` : undefined,
        }}
        enablePoweredByContainer={false}
        debounce={300}
        minLength={2}
        predefinedPlaces={[]} 
        styles={{
          container: styles.autocompleteContainer,
          textInput: styles.textInput,
          listView: styles.listView,
          row: styles.row,
        }}
        textInputProps={{
          placeholderTextColor: '#555',
          returnKeyType: 'search',
        }}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: destination ? '#27ae60' : '#95a5a6' }]}
        onPress={handleStartTrip}
        disabled={!destination}
      >
        <Text style={styles.buttonText}>
          {destination ? `Go to ${destinationName}` : 'Select a destination'}
        </Text>
      </TouchableOpacity>

      <View style={styles.debugInfo}>
        <Text style={styles.debugText}>
          📍 Current: {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
        </Text>
        {/* {countryCode && <Text style={styles.debugText}>🌍 Country: {countryCode}</Text>} */}
        {destination && (
          <Text style={styles.debugText}>
            🎯 Destination: {destination.latitude.toFixed(6)}, {destination.longitude.toFixed(6)}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10 },
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
  row: { padding: 13, height: 44, flexDirection: 'row', alignItems: 'center' },
  button: {
    marginTop: 15,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  debugInfo: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  debugText: { fontSize: 12, fontFamily: 'monospace' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default SearchBar;

// SearchBar.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import * as Location from 'expo-location';
import UIInput from './ui/UIInput';
import SearchList from './searchList';
import UIButton from './ui/UIButton';
import { useRouter } from 'expo-router';

const SearchBar = () => {
  const router = useRouter();
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(false);

  // Ask permission + get current GPS
  const fetchLocation = async () => {
    try {
      setLoading(true);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location permission needed',
          'Enable location to use your GPS as the trip origin.'
        );
        setLoading(false);
        return;
      }

      // Optional: ensure location services are on
      const services = await Location.hasServicesEnabledAsync();
      if (!services) {
        Alert.alert('Turn on Location', 'Please enable location services (GPS).');
        setLoading(false);
        return;
      }

      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced, // use High for tighter accuracy if needed
        mayShowUserSettingsDialog: true,
      });

      setCoords({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
    } catch (e: any) {
      console.error(e);
      Alert.alert('Location error', e?.message ?? 'Could not get current location.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  const handleSelect = () => {
    // Fallback if GPS not ready yet
    const origin = coords
      ? `${coords.latitude.toFixed(6)},${coords.longitude.toFixed(6)}`
      : '45.815000,15.981000'; // Zagreb center fallback (example)

    router.push({
      pathname: '/(tabs)/trip',
      params: {
        origin,
        destination: '45.803000,15.977000', // replace with user-picked destination when you wire SearchList
        mode: 'DRIVING',
      },
    });
  };

  return (
    <View style={styles.container}>
      <UIInput />
      <SearchList />

      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>GPS:</Text>
        {coords ? (
          <Text>
            {coords.latitude.toFixed(6)}, {coords.longitude.toFixed(6)}
          </Text>
        ) : (
          <Text>{loading ? 'Getting location…' : 'Not available'}</Text>
        )}
      </View>

      <View style={styles.actions}>
        <UIButton title={loading ? 'Locating…' : 'Refresh GPS'} disabled={loading} onPress={fetchLocation} />
        <UIButton title="Start Trip" onPress={handleSelect} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: 12, padding: 12 },
  statusRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  statusLabel: { fontWeight: '600' },
  actions: { gap: 10 },
});

export default SearchBar;

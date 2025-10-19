// Mapper.tsx
import React, { useMemo, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, LatLng } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

// If using Expo:
import Constants from 'expo-constants';

const GOOGLE_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ||
  (Constants?.expoConfig?.extra as any)?.googleMapsApiKey ||
  '';
console.log(GOOGLE_KEY);
type MapperProps = {
  origin?: LatLng;
  destination?: LatLng;
  mode?: 'DRIVING' | 'WALKING' | 'BICYCLING' | 'TRANSIT';
};

const DEFAULT_ORIGIN: LatLng = { latitude: 18.012, longitude: -76.799 };     // example: Kingston
const DEFAULT_DEST: LatLng  = { latitude: 18.018, longitude: -76.744 };      // example: Half-Way-Tree

const Mapper: React.FC<MapperProps> = ({
  origin = DEFAULT_ORIGIN,
  destination = DEFAULT_DEST,
  mode = 'DRIVING',
}) => {
  const mapRef = useRef<MapView | null>(null);

  const initialRegion = useMemo(
    () => ({
      latitude: (origin.latitude + destination.latitude) / 2,
      longitude: (origin.longitude + destination.longitude) / 2,
      latitudeDelta: Math.abs(origin.latitude - destination.latitude) * 2 || 0.05,
      longitudeDelta: Math.abs(origin.longitude - destination.longitude) * 2 || 0.05,
    }),
    [origin, destination]
  );

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        // Optional: improves Google tiles on Android
        mapPadding={{ top: 24, right: 24, bottom: 24, left: 24 }}
      >
        <Marker coordinate={origin} title="Origin" />
        <Marker coordinate={destination} title="Destination" />

        {GOOGLE_KEY ? (
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={GOOGLE_KEY}
            mode={mode}
            strokeWidth={5}
            // Do not set a color unless you want a specific one
            onReady={(result) => {
              // Fit the map to the route
              if (mapRef.current && result.coordinates.length) {
                mapRef.current.fitToCoordinates(result.coordinates, {
                  edgePadding: { top: 60, right: 60, bottom: 60, left: 60 },
                  animated: true,
                });
              }
            }}
            onError={(e) => {
              console.warn('Directions error:', e);
            }}
          />
        ) : null}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: {
    width: '100%',
    height: Platform.select({ ios: 500, android: 500, default: 500 }),
    borderRadius: 16,
    overflow: 'hidden',
  },
});

export default Mapper;

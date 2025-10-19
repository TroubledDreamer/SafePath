// app/(tabs)/trip.tsx
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Mapper from '@/components/mapper';
import type { LatLng } from 'react-native-maps';

type TravelMode = 'DRIVING' | 'WALKING' | 'BICYCLING' | 'TRANSIT';

function parseLatLngPair(str?: string): LatLng | null {
  if (!str) return null;
  const [latStr, lngStr] = str.split(',');
  const lat = Number(latStr);
  const lng = Number(lngStr);
  return Number.isFinite(lat) && Number.isFinite(lng)
    ? { latitude: lat, longitude: lng }
    : null;
}

function parseLatLngFromPieces(
  lat?: string | string[],
  lng?: string | string[]
): LatLng | null {
  const latNum = typeof lat === 'string' ? Number(lat) : NaN;
  const lngNum = typeof lng === 'string' ? Number(lng) : NaN;
  return Number.isFinite(latNum) && Number.isFinite(lngNum)
    ? { latitude: latNum, longitude: lngNum }
    : null;
}

export default function TripScreen() {
  const params = useLocalSearchParams<{
    origin?: string | string[];
    destination?: string | string[];
    originLat?: string | string[];
    originLng?: string | string[];
    destinationLat?: string | string[];
    destinationLng?: string | string[];
    mode?: string | string[];
    data?: string | string[];
  }>();

  const {
    origin,
    destination,
    originLat,
    originLng,
    destinationLat,
    destinationLng,
    mode,
    data,
  } = params;

  const { parsedOrigin, parsedDestination, parsedMode } = useMemo(() => {
    // 1) Try JSON in `data`
    if (typeof data === 'string') {
      try {
        const obj = JSON.parse(data);
        const o = obj?.origin as LatLng | undefined;
        const d = obj?.destination as LatLng | undefined;
        const m = (obj?.mode as TravelMode | undefined)?.toUpperCase() as
          | TravelMode
          | undefined;
        if (
          o &&
          typeof o.latitude === 'number' &&
          typeof o.longitude === 'number' &&
          d &&
          typeof d.latitude === 'number' &&
          typeof d.longitude === 'number'
        ) {
          return {
            parsedOrigin: o,
            parsedDestination: d,
            parsedMode: (m ?? 'DRIVING') as TravelMode,
          };
        }
      } catch {
        // ignore and fall through
      }
    }

    // 2) Try comma-separated strings
    const o2 = typeof origin === 'string' ? parseLatLngPair(origin) : null;
    const d2 =
      typeof destination === 'string' ? parseLatLngPair(destination) : null;

    // 3) Try individual pieces
    const o3 = o2 ?? parseLatLngFromPieces(originLat, originLng);
    const d3 = d2 ?? parseLatLngFromPieces(destinationLat, destinationLng);

    // Mode
    const mRaw = typeof mode === 'string' ? mode.toUpperCase() : 'DRIVING';
    const allowed: TravelMode[] = ['DRIVING', 'WALKING', 'BICYCLING', 'TRANSIT'];
    const mFinal: TravelMode = (allowed.includes(mRaw as TravelMode)
      ? (mRaw as TravelMode)
      : 'DRIVING') as TravelMode;

    return {
      parsedOrigin: o3 ?? null,
      parsedDestination: d3 ?? null,
      parsedMode: mFinal,
    };
  }, [
    origin,
    destination,
    originLat,
    originLng,
    destinationLat,
    destinationLng,
    mode,
    data,
  ]);

  const ready = !!parsedOrigin && !!parsedDestination;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginTop: 100 }} />
      {ready ? (
        <Mapper
          origin={parsedOrigin!}
          destination={parsedDestination!}
          mode={parsedMode}
        />
      ) : (
        <View style={styles.fallback}>
          <Text style={styles.fallbackText}>
            {`Missing or invalid origin/destination. Pass them via:
• origin=lat,lng & destination=lat,lng
• originLat, originLng, destinationLat, destinationLng
• data={"origin":{"latitude":..,"longitude":..},"destination":...}
`}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: { padding: 16 },
  fallbackText: { fontSize: 14, lineHeight: 20 },
});

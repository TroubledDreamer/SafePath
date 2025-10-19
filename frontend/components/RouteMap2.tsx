import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";


export default function RouteMap2() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    const startTracking = async () => {
      // Request permission to access location
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log("Permission status:", status);

      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location access is required.");
        return;
      }

      // Get initial position
      const location = await Location.getCurrentPositionAsync({});
      const initialCoords = location.coords;
      setCurrentLocation(initialCoords);
      setRouteCoordinates([initialCoords]);
      
      console.log("🚀 STARTING GPS TRACKING");
      console.log("📍 Initial position:", {
        latitude: initialCoords.latitude,
        longitude: initialCoords.longitude,
        accuracy: initialCoords.accuracy,
        timestamp: new Date().toISOString()
      });

      // Subscribe to live position updates
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000, // every second
          distanceInterval: 0, // update on any change
        },
        (loc) => {
          const coords = loc.coords;
          const newLocation = {
            latitude: coords.latitude,
            longitude: coords.longitude,
            accuracy: coords.accuracy,
            speed: coords.speed,
            heading: coords.heading,
            timestamp: new Date().toISOString()
          };

          setCurrentLocation(newLocation);
          setRouteCoordinates(prev => [...prev, newLocation]);

          // Enhanced logging for real-time GPS changes
          console.log("📡 GPS UPDATE →", {
            lat: coords.latitude.toFixed(6),
            lng: coords.longitude.toFixed(6),
            accuracy: `${coords.accuracy?.toFixed(1) || 'N/A'}m`,
            speed: coords.speed ? `${(coords.speed * 3.6).toFixed(1)} km/h` : 'N/A',
            heading: coords.heading ? `${coords.heading.toFixed(0)}°` : 'N/A',
            timestamp: new Date().toLocaleTimeString(),
            totalPoints: routeCoordinates.length + 1
          });

          // Log route statistics every 10 points
          if ((routeCoordinates.length + 1) % 10 === 0) {
            console.log("📊 ROUTE STATS →", {
              totalPoints: routeCoordinates.length + 1,
              duration: `${routeCoordinates.length + 1} seconds`,
              startTime: routeCoordinates[0]?.timestamp,
              currentTime: newLocation.timestamp
            });
          }

          // Smoothly move map center
          mapRef.current?.animateToRegion({
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          });
        }
      );

      // Clean up subscription when unmounted
      return () => {
        console.log("🛑 STOPPING GPS TRACKING");
        console.log("📈 FINAL ROUTE SUMMARY →", {
          totalPoints: routeCoordinates.length,
          startLocation: routeCoordinates[0],
          endLocation: routeCoordinates[routeCoordinates.length - 1],
          duration: `${routeCoordinates.length} seconds`
        });
        subscription?.remove();
      };
    };

    startTracking();
  }, []);

  // Log when route coordinates update
  useEffect(() => {
    if (routeCoordinates.length > 0) {
      console.log(`🗺️ Route now has ${routeCoordinates.length} coordinate points`);
    }
  }, [routeCoordinates.length]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 37.78825, // fallback if GPS not ready
          longitude: -122.4324,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={false} // We're using custom marker
        showsMyLocationButton={true}
        followsUserLocation={true}
      >
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="You are here"
            description="Live GPS tracking active"
            pinColor="blue"
          />
        )}
        
        {/* Optional: Show all route points as markers */}
        {routeCoordinates.map((coord, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: coord.latitude,
              longitude: coord.longitude,
            }}
            pinColor={index === 0 ? "green" : "red"} // Start = green, others = red
            title={index === 0 ? "Start" : `Point ${index}`}
            description={`Accuracy: ${coord.accuracy?.toFixed(1)}m`}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
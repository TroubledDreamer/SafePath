import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function RouteMap() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    let subscription = null;

    const startTracking = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission Denied", "Location access is required.");
          return;
        }

        // Get initial GPS fix
        const initialLoc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
        });

        const initialCoords = {
          latitude: initialLoc.coords.latitude,
          longitude: initialLoc.coords.longitude,
          accuracy: initialLoc.coords.accuracy,
          speed: initialLoc.coords.speed,
          heading: initialLoc.coords.heading,
          timestamp: new Date().toISOString(),
        };

        setCurrentLocation(initialCoords);
        setRouteCoordinates([initialCoords]);

        // Start watching GPS
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 1000,
            distanceInterval: 0,
          },
          (loc) => {
            const newCoords = {
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
              accuracy: loc.coords.accuracy,
              speed: loc.coords.speed,
              heading: loc.coords.heading,
              timestamp: new Date().toISOString(),
            };

            setCurrentLocation(newCoords);
            setRouteCoordinates((prev) => [...prev, newCoords]);

            mapRef.current?.animateToRegion({
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            });
          }
        );
      } catch (err) {
        console.error("Error getting location:", err);
        Alert.alert("Error", "Failed to get GPS location.");
      }
    };

    startTracking();

    return () => {
      subscription?.remove();
    };
  }, []);

  if (!currentLocation) {
    return <View style={styles.container} />; // or a loading indicator
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={false}
        showsMyLocationButton={true}
        followsUserLocation={true}
      >
        <Marker
          coordinate={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          }}
          title="You are here"
          description="Live GPS tracking active"
          pinColor="blue"
        />

        {routeCoordinates.map((coord, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: coord.latitude,
              longitude: coord.longitude,
            }}
            pinColor={index === 0 ? "green" : "red"}
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

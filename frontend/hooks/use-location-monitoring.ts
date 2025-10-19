import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';
import { LocationCoords, PathDeviation } from '../lib/types/navigation';
import { calculateDistance, assessDanger } from '../lib/services/location-service';

interface UseLocationMonitoringProps {
  destination?: LocationCoords | null;
  isMonitoringPath: boolean;
}

export const useLocationMonitoring = ({ destination, isMonitoringPath }: UseLocationMonitoringProps) => {
  const [currentLocation, setCurrentLocation] = useState<LocationCoords | null>(null);
  const [loadingLocation, setLoadingLocation] = useState<boolean>(true);
  const [pathDeviation, setPathDeviation] = useState<PathDeviation | null>(null);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    const setupLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location access is required.');
          setLoadingLocation(false);
          return;
        }

        // Get initial location
        const initialLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
        });

        console.log('Initial Location:', {
          latitude: initialLocation.coords.latitude,
          longitude: initialLocation.coords.longitude,
          timestamp: new Date(initialLocation.timestamp).toLocaleString(),
          accuracy: initialLocation.coords.accuracy,
          speed: initialLocation.coords.speed,
        });

        setCurrentLocation({
          latitude: initialLocation.coords.latitude,
          longitude: initialLocation.coords.longitude,
        });

        // Start watching location updates
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 1000,
            distanceInterval: 1,
          },
          (location) => {
            const newLocation = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            };

            console.log('Location Update:', {
              ...newLocation,
              timestamp: new Date(location.timestamp).toLocaleString(),
              accuracy: location.coords.accuracy,
              speed: location.coords.speed,
            });

            // Check for path deviation if we have a destination and monitoring is active
            if (destination && isMonitoringPath) {
              const deviationDistance = calculateDistance(
                newLocation.latitude,
                newLocation.longitude,
                destination.latitude,
                destination.longitude
              );

              const assessment = assessDanger(deviationDistance, location.coords.speed);
              setPathDeviation(assessment);

              console.log('Path Deviation:', {
                distance: Math.round(assessment.distance),
                dangerLevel: assessment.dangerLevel,
                reason: assessment.reason
              });

              if (assessment.dangerLevel === 'HIGH' && assessment.distance > 100) {
                Alert.alert(
                  'Warning!',
                  `You are ${Math.round(assessment.distance)}m off the recommended path. ${assessment.reason}.`,
                  [{ text: 'OK' }],
                  { cancelable: true }
                );
              }
            }

            setCurrentLocation(newLocation);
          }
        );

      } catch (err) {
        console.error('Error setting up location:', err);
        Alert.alert('Error', 'Failed to get current location.');
      } finally {
        setLoadingLocation(false);
      }
    };

    setupLocation();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [destination, isMonitoringPath]);

  return {
    currentLocation,
    loadingLocation,
    pathDeviation
  };
};
import * as Location from 'expo-location';
import { LocationCoords, PathDeviation } from '../types/navigation';

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const assessDanger = (deviation: number, speed: number | null): PathDeviation => {
  let dangerLevel: PathDeviation['dangerLevel'] = 'LOW';
  let reason = '';

  if (deviation > 100) {
    dangerLevel = 'HIGH';
    reason = 'Significantly off the recommended route';
  } else if (deviation > 50) {
    dangerLevel = 'MEDIUM';
    reason = 'Moderately off the recommended route';
  } else {
    reason = 'Slightly off the recommended route';
  }

  if (speed !== null && speed > 0) {
    if (speed > 20) {
      dangerLevel = 'HIGH';
      reason += ' - Moving at high speed';
    }
  }

  return {
    distance: deviation,
    dangerLevel,
    reason
  };
};
export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface Place {
  id: string;
  name: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
}

export interface PathDeviation {
  distance: number;
  dangerLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  reason: string;
}
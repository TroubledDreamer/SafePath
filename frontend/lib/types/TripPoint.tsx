export interface TripPoint {
  id: number;                   // BIGINT -> fits in JS number for small ids; otherwise use string
  trip_id: number;
  lat: number;
  lng: number;
  recorded_at: string;          // ISO datetime
}
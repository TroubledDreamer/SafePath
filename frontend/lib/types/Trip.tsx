
import { TripStatus, TripMode, RiskLevel } from "./Enums";

export interface Trip {
  id: number;
  user_id: number;

  origin_lat: number;           // DECIMAL(9,6)
  origin_lng: number;
  dest_lat: number;
  dest_lng: number;

  mode: TripMode;
  route_polyline: string;
  eta_sec: number;
  distance_m: number;

  status: TripStatus;
  started_at: string;           // ISO datetime
  ended_at: string | null;

  cluster_id: number | null;
  cluster_sim: number | null;   // DECIMAL(4,3)
  risk_level: RiskLevel | null;
  alert_sent: boolean;
}

export interface CreateTripRequestFlat {
  origin_lat: number;
  origin_lng: number;
  dest_lat: number;
  dest_lng: number;
  mode: TripMode;
  route_polyline: string;
  eta_sec: number;
  distance_m: number;
}

/* If you implemented the nicer nested → flat mapping in TripService */
export interface CreateTripRequestNested {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  mode: TripMode;
  route_polyline: string;
  eta_sec: number;
  distance_m: number;
}

/* GET /api/v1/trips?range=... returns ApiList<Trip> */

export interface TripPingRequest {
  lat: number;
  lng: number;
}

export interface TripPingResponse {
  trip_id: number;
  risk_level: RiskLevel | null;
  cluster_id: number | null;
  similarity: number; // 0..1
}

export interface TripEndResponse extends Trip {}

export interface TripPoint {
  id: number;                   // BIGINT -> fits in JS number for small ids; otherwise use string
  trip_id: number;
  lat: number;
  lng: number;
  recorded_at: string;          // ISO datetime
}

import { ClusterStatus } from "./Enums";

export interface ClusterizeRouteRequest {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  encoded_polyline?: string;
  path?: [number, number][]; // optional fallback: [[lat, lng], ...]
}

export interface ClusterizeRouteResponse {
  cluster_id: number;
  similarity: number;          // 0..1
  status: ClusterStatus;
  trips_count: number;
  note?: string;               // "New cluster created" on 201
}
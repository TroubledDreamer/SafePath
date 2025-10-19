
import { ClusterStatus } from "./Enums";

export interface RouteCluster {
  id: number;
  origin_hash: string;          // up to 24 chars
  dest_hash: string;
  geohashes_json: string;       // JSON stringified array of geohashes
  trips_count: number;
  status: ClusterStatus;
  last_seen: string;            // ISO datetime
}
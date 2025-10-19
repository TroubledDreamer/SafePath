// src/features/trips/hooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { BaseAPI } from '../BaseAPI';
import { TripPingRequest, TripPingResponse, CreateTripRequestFlat } from '@/lib/types/Trip';
import { Trip } from '@/lib/types/Trip';
const TripsApi = new BaseAPI<Trip>('/trips/');

export function useTrips(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['trips', params],
    queryFn: () => (params ? TripsApi.filter(params) : TripsApi.getAll()),
  });
}
export function useTrip(id?: number) {
  return useQuery({
    queryKey: ['trip', id],
    queryFn: () => (id ? TripsApi.getById(id) : Promise.reject('no id')),
    enabled: !!id,
  });
}
export function useCreateTrip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTripRequestFlat) => TripsApi.create(payload),
    onSuccess: (trip) => {
      qc.invalidateQueries({ queryKey: ['trips'] });
      qc.setQueryData(['trip', trip.id], trip);
    },
  });
}
export function usePingTrip(tripId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: TripPingRequest) =>
      api.post<TripPingResponse>(`/trips/${tripId}/ping`, payload).then(r => r.data),
    onSuccess: (data) => {
      // light live-update: merge new risk/similarity into trip cache if present
      qc.setQueryData<Trip>(['trip', tripId], (prev) =>
        prev ? { ...prev, risk_level: data.risk_level, cluster_id: data.cluster_id, cluster_sim: data.similarity } : prev
      );
    },
  });
}
export function useEndTrip(tripId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post<Trip>(`/trips/${tripId}/end`).then(r => r.data),
    onSuccess: (trip) => {
      qc.invalidateQueries({ queryKey: ['trips'] });
      qc.setQueryData(['trip', trip.id], trip);
    },
  });
}

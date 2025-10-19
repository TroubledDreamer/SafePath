// src/features/routes/hooks.ts
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/axios';
import {ClusterizeRouteRequest} from '@/lib/types/Clusterize';
import {ClusterizeRouteResponse} from '@/lib/types/Clusterize';
export function useClusterizeRoute() {
  return useMutation({
    mutationFn: (payload: ClusterizeRouteRequest) =>
      api.post<ClusterizeRouteResponse>('/routes/clusterize', payload).then(r => r.data),
  });
}

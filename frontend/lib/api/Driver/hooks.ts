// src/features/drivers/hooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BaseAPI } from '../BaseAPI';
import { Driver } from '@/lib/types/Driver';

const DriversApi = new BaseAPI<Driver>('/drivers/');

export function useDrivers() {
  return useQuery({ queryKey: ['drivers'], queryFn: DriversApi.getAll });
}
export function useCreateDriver() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Pick<Driver, 'plate' | 'car_type'>) => DriversApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['drivers'] }),
  });
}
export function useDeleteDriver() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => DriversApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['drivers'] }),
  });
}

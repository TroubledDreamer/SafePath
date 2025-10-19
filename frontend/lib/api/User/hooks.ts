// src/features/users/hooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BaseAPI } from '../BaseAPI';
import { UserContact } from '@/lib/types/Contact';

const UsersApi = new BaseAPI<User>('/users/');

export function useUsers(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => params ? UsersApi.filter(params) : UsersApi.getAll(),
  });
}
export function useUser(id?: number) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => (id ? UsersApi.getById(id) : Promise.reject('no id')),
    enabled: !!id,
  });
}
export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<User> }) => UsersApi.update(id, payload),
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ['users'] });
      qc.invalidateQueries({ queryKey: ['user', v.id] });
      qc.invalidateQueries({ queryKey: ['me'] });
    },
  });
}

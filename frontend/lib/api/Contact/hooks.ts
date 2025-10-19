// src/features/contacts/hooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BaseAPI } from '../BaseAPI';
import { UserContact } from '@/lib/types/Contact';

const ContactsApi = new BaseAPI<UserContact>('/user-contacts/');

export function useContacts() {
  return useQuery({ queryKey: ['contacts'], queryFn: ContactsApi.getAll });
}
export function useAddContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { contact_user_id: number; label?: string; is_emergency?: boolean }) =>
      ContactsApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contacts'] }),
  });
}
export function useRemoveContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ContactsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contacts'] }),
  });
}

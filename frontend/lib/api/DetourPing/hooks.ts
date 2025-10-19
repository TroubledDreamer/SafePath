// src/features/activity-config/api/hooks.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import LActivityAllowedVariationApi from '.';

export function useActivityAllowedVariations(activityId?: number) {
  return useQuery({
    queryKey: ['activity-allowed-variation', { activityId }],
    queryFn: () =>
      activityId
        ? LActivityAllowedVariationApi.filter({ activity_list_id: activityId, order_by: 'id', order_dir: 'desc' })
        : LActivityAllowedVariationApi.getAll(),
  });
}


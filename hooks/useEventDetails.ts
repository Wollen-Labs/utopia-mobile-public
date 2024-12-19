import { useQuery } from '@tanstack/react-query';
import type { Tables } from 'utils/database.types';
import { supabase } from 'utils/supabase';

export type Event = Tables<'event'>;

export function useEventDetails(eventId: string, initialData?: Partial<Event>) {
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      const { data, error } = await supabase.from('event').select('*').eq('id', eventId).single();

      if (error) throw error;
      return data as Event;
    },
    initialData: initialData as Event,
    enabled: !!eventId,
  });
}

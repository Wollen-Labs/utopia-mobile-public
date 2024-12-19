import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from 'utils/supabase';

import { Event } from './useEvents';

export const FAVORITES_QUERY_KEY = ['favorites'];

export const useFavorites = () => {
  const queryClient = useQueryClient();

  return {
    ...useQuery({
      queryKey: FAVORITES_QUERY_KEY,
      queryFn: async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const { data, error } = await supabase
          .from('favorite_events')
          .select('event_id')
          .eq('user_id', session?.user.id as string);

        if (error) throw error;

        const eventIds = data.map((favorite) => favorite.event_id);

        const { data: events, error: eventsError } = await supabase
          .from('event')
          .select('id, title, points, location, start_date, images')
          .in('id', eventIds);

        if (eventsError) throw eventsError;

        return events as Event[];
      },
    }),
    queryClient,
  };
};

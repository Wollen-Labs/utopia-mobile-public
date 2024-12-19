import { useQuery } from '@tanstack/react-query';
import { supabase } from 'utils/supabase';

import { Event } from './useEvents';

export const useBookings = () => {

  return useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const { data, error } = await supabase
        .from('booking')
        .select('event_id')
        .eq('user_id', session?.user.id as string);

      if (error) throw error;

      const eventIds = data.map((booking) => booking.event_id);

      const { data: events, error: eventsError } = await supabase
        .from('event')
        .select('id, title, points, location, start_date, images')
        .in('id', eventIds);

      if (eventsError) throw eventsError;

      return events as Event[];
    },
  });
}; 
import { useInfiniteQuery } from '@tanstack/react-query';
import { EventImage } from 'utils/database.types';
import { supabase } from 'utils/supabase';

const EVENTS_PER_PAGE = 25;

export interface Event {
  id: string;
  title: string;
  points: number;
  location: string;
  start_date: string;
  images: EventImage[];
}

export const useEvents = () => {
  return useInfiniteQuery({
    queryKey: ['events'],
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * EVENTS_PER_PAGE;
      const to = from + EVENTS_PER_PAGE - 1;

      const { data, error } = await supabase
        .from('event')
        .select('id, title, points, location, start_date, images')
        .range(from, to)
        .order('start_date', { ascending: true });

      if (error) throw error;

      return data;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < EVENTS_PER_PAGE) return undefined;
      return allPages.length;
    },
    initialPageParam: 0,
  });
};

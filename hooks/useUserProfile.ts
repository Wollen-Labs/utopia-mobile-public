import { useQuery } from '@tanstack/react-query';
import { supabase } from 'utils/supabase';

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  points: number | null;
}

export const useUserProfile = () => {
  const getUserProfile = async (): Promise<UserProfile | null> => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) return null;

    const { data, error } = await supabase
      .from('user_profile')
      .select('id, first_name, last_name, avatar_url, points')
      .eq('id', session.user.id)
      .single();

    if (error && error.code === 'PGRST116') {
      const { error: insertError } = await supabase.from('user_profile').insert({
        id: session.user.id,
        first_name: null,
        last_name: null,
        points: 0,
      });

      if (insertError) {
        console.error('Error creating user profile:', insertError);
        throw insertError;
      }

      const { data: newData, error: newError } = await supabase
        .from('user_profile')
        .select('id, first_name, last_name, avatar_url, points')
        .eq('id', session.user.id)
        .single();

      if (newError) {
        console.error('Error fetching user profile after creation:', newError);
        throw newError;
      }

      return newData;
    } else if (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }

    return data;
  };

  return useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
  });
};

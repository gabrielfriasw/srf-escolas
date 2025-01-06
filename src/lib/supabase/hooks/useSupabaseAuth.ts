import { useEffect } from 'react';
import { useAuthStore } from '../../../store/useAuthStore';
import { supabase } from '../supabase';

export const useSupabaseAuth = () => {
  const { setUser, clearUser } = useAuthStore();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.name,
          role: session.user.user_metadata.role,
        });
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.name,
          role: session.user.user_metadata.role,
        });
      } else if (event === 'SIGNED_OUT') {
        clearUser();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, clearUser]);
};
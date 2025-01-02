import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { authService } from '../lib/supabase/services/auth.service';
import { supabase } from '../lib/supabase/supabase';

export const useSupabaseAuth = () => {
  const { setUser, clearUser } = useAuthStore();

  useEffect(() => {
    // Check for existing session
    authService.getSession().then((session) => {
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

  return {
    signUp: authService.signUp,
    signIn: authService.signIn,
    signOut: authService.signOut,
  };
};
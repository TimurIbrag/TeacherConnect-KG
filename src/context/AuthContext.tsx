
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🚀 AuthProvider initializing...');
    console.log('🔧 Environment check:', {
      hasSupabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
      hasSupabaseKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      currentUrl: window.location.href,
      timestamp: new Date().toISOString()
    });
    
    // Test Supabase client
    console.log('🔧 Supabase client test:', {
      clientExists: !!supabase,
      authExists: !!supabase.auth,
      hasGetSession: typeof supabase.auth.getSession === 'function'
    });
    
    // Check for OAuth token in URL hash
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      console.log('🔑 OAuth token detected in URL hash, processing...');
      console.log('🔑 Hash content:', hash.substring(0, 100) + '...');
      // Clear the hash to prevent issues
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Check for OAuth parameters in URL
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
    const refreshToken = urlParams.get('refresh_token');
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');
    
    if (error) {
      console.error('❌ OAuth error in URL params:', { error, errorDescription });
    }
    
    if (accessToken) {
      console.log('🔑 Access token found in URL params');
    }
    
    if (refreshToken) {
      console.log('🔑 Refresh token found in URL params');
    }
    
    // Handle OAuth callback manually if tokens are present
    const handleOAuthCallback = async () => {
      if (hash && hash.includes('access_token')) {
        console.log('🔄 Processing OAuth callback from hash...');
        try {
          // Parse the hash to extract tokens
          const hashParams = new URLSearchParams(hash.substring(1));
          const hashAccessToken = hashParams.get('access_token');
          const hashRefreshToken = hashParams.get('refresh_token');
          
          if (hashAccessToken) {
            console.log('🔑 Processing access token from hash...');
            // Set the session manually
            const { data, error } = await supabase.auth.setSession({
              access_token: hashAccessToken,
              refresh_token: hashRefreshToken || ''
            });
            
            if (error) {
              console.error('❌ Error setting session from hash:', error);
            } else {
              console.log('✅ Session set successfully from hash');
            }
          }
        } catch (error) {
          console.error('❌ Error processing OAuth callback:', error);
        }
      }
    };
    
    // Process OAuth callback if needed
    handleOAuthCallback();
    
    // Add a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn('⚠️ Auth loading timeout, setting loading to false');
        setLoading(false);
      }
    }, 10000); // 10 second timeout

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔍 Initial session check:', { hasSession: !!session, userEmail: session?.user?.email });
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        // If no session but we have tokens in URL, try to refresh
        if (accessToken || refreshToken || (hash && hash.includes('access_token'))) {
          console.log('🔄 No session but tokens detected, attempting to refresh...');
          supabase.auth.refreshSession().then(({ data: { session: refreshedSession }, error }) => {
            if (error) {
              console.error('❌ Error refreshing session:', error);
              setLoading(false);
            } else if (refreshedSession?.user) {
              console.log('✅ Session refreshed successfully:', refreshedSession.user.email);
              setUser(refreshedSession.user);
              fetchProfile(refreshedSession.user.id);
            } else {
              console.log('⚠️ No session after refresh attempt');
              setLoading(false);
            }
          });
        } else {
          setLoading(false);
        }
      }
    }).catch(error => {
      console.error('❌ Error getting initial session:', error);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state change:', { event, hasSession: !!session, userEmail: session?.user?.email });
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('✅ User signed in successfully:', session.user.email);
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        console.log('🚪 User signed out');
        setUser(null);
        setProfile(null);
        setLoading(false);
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        console.log('🔄 Token refreshed for user:', session.user.email);
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        console.log('🔄 Other auth event:', event);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    });

    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('🔍 Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // Use maybeSingle instead of single to avoid errors

      if (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
        setLoading(false);
        return;
      }
      
      if (data) {
        console.log('✅ Profile found:', data);
        setProfile(data);
        setLoading(false);
        return;
      }
      
      // No profile found, create one
      console.log('⚠️ No profile found for user, creating one...');
      
      // Get user metadata from the current user
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: currentUser?.email || '',
          full_name: currentUser?.user_metadata?.full_name || currentUser?.user_metadata?.name || '',
          role: null, // Will be set during user type selection
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating profile:', createError);
        setProfile(null);
      } else {
        console.log('✅ Profile created:', newProfile);
        setProfile(newProfile);
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          last_seen_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const value = {
    user,
    profile,
    loading,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

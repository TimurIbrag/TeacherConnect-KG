
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import UserTypeSelectionModal from '@/components/auth/UserTypeSelectionModal';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<Profile>;
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
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUserTypeModal, setShowUserTypeModal] = useState(false);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      console.log('Profile fetched:', data);
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user?.id) throw new Error('No user logged in');

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const handleUserTypeSelection = (userType: 'teacher' | 'school') => {
    // Refresh profile after user type selection
    setTimeout(() => {
      refreshProfile();
    }, 100);
  };

  const extractUserTypeFromUrl = (): 'teacher' | 'school' | null => {
    // Check current URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const userType = urlParams.get('userType');
    
    console.log('URL userType parameter:', userType);
    
    if (userType === 'teacher' || userType === 'school') {
      return userType;
    }
    
    // Also check for 'type' parameter as fallback
    const typeParam = urlParams.get('type');
    console.log('URL type parameter:', typeParam);
    
    if (typeParam === 'teacher' || typeParam === 'school') {
      return typeParam;
    }
    
    return null;
  };

  const determineUserTypeFromStorage = (): 'teacher' | 'school' | null => {
    // Step 1: Check URL parameters first (most reliable for OAuth redirects)
    const urlUserType = extractUserTypeFromUrl();
    if (urlUserType) {
      console.log('User type determined from URL:', urlUserType);
      return urlUserType;
    }

    // Step 2: Check localStorage and sessionStorage
    const localStorageType = localStorage.getItem('pendingUserType');
    const sessionStorageType = sessionStorage.getItem('pendingUserType');
    
    console.log('LocalStorage pendingUserType:', localStorageType);
    console.log('SessionStorage pendingUserType:', sessionStorageType);
    
    // Prefer sessionStorage as it's more session-specific
    if (sessionStorageType === 'teacher' || sessionStorageType === 'school') {
      console.log('User type determined from sessionStorage:', sessionStorageType);
      return sessionStorageType;
    }
    
    if (localStorageType === 'teacher' || localStorageType === 'school') {
      console.log('User type determined from localStorage:', localStorageType);
      return localStorageType;
    }
    
    // Step 3: Check OAuth flow type
    const oauthFlow = localStorage.getItem('pendingOAuthFlow') || sessionStorage.getItem('pendingOAuthFlow');
    console.log('OAuth flow type:', oauthFlow);
    
    // If we can't determine user type, return null instead of defaulting
    console.log('Could not determine user type from any source');
    return null;
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        console.log('Session details:', session);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && event === 'SIGNED_IN') {
          // Handle new user creation or existing user login
          setTimeout(async () => {
            try {
              // Check if profile exists
              const { data: existingProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();
              
              console.log('Existing profile check:', existingProfile);
              
              if (!existingProfile) {
                console.log('Creating new profile for user');
                
                // Get user type from storage or URL
                const userType = determineUserTypeFromStorage();
                console.log('Determined user type for new profile:', userType);
                
                if (!userType) {
                  console.log('No user type determined, showing selection modal');
                  setShowUserTypeModal(true);
                  setLoading(false);
                  return;
                }
                
                // Clean up storage after successful determination
                localStorage.removeItem('pendingUserType');
                localStorage.removeItem('pendingOAuthFlow');
                sessionStorage.removeItem('pendingUserType');
                sessionStorage.removeItem('pendingOAuthFlow');
                
                const { data: newProfile, error: profileError } = await supabase
                  .from('profiles')
                  .insert({
                    id: session.user.id,
                    email: session.user.email || '',
                    full_name: session.user.user_metadata?.full_name || 
                             session.user.user_metadata?.name || 
                             '',
                    role: userType,
                  })
                  .select()
                  .single();
                  
                if (profileError) {
                  console.error('Error creating profile:', profileError);
                  // If profile creation fails, show user type selection modal
                  setShowUserTypeModal(true);
                } else {
                  console.log('Profile created successfully with role:', newProfile.role);
                  setProfile(newProfile);
                }
              } else {
                // Check if existing profile has a role set
                if (!existingProfile.role) {
                  console.log('Existing profile without role, showing selection modal');
                  setShowUserTypeModal(true);
                } else {
                  console.log('Existing profile found with role:', existingProfile.role);
                }
                setProfile(existingProfile);
              }
            } catch (error) {
              console.error('Error handling user authentication:', error);
              // Show user type selection modal as fallback
              setShowUserTypeModal(true);
            } finally {
              setLoading(false);
            }
          }, 100);
        } else if (session?.user) {
          // Existing user, just fetch profile
          setTimeout(() => {
            fetchProfile(session.user.id);
            setLoading(false);
          }, 100);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    // Clean up any pending user type data
    localStorage.removeItem('pendingUserType');
    localStorage.removeItem('pendingOAuthFlow');
    sessionStorage.removeItem('pendingUserType');
    sessionStorage.removeItem('pendingOAuthFlow');
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signOut,
    refreshProfile,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <UserTypeSelectionModal
        isOpen={showUserTypeModal}
        onClose={() => setShowUserTypeModal(false)}
        onUserTypeSelected={handleUserTypeSelection}
      />
    </AuthContext.Provider>
  );
};

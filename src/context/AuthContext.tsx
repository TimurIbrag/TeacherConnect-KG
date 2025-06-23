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
      console.log('🔍 Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error fetching profile:', error);
        return;
      }

      console.log('✅ Profile fetched:', data);
      setProfile(data);
    } catch (error) {
      console.error('❌ Error fetching profile:', error);
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
    setTimeout(() => {
      refreshProfile();
    }, 100);
  };

  // Enhanced user type detection from all possible sources
  const determineUserTypeFromAllSources = (): 'teacher' | 'school' | null => {
    console.log('🔍 COMPREHENSIVE USER TYPE DETECTION STARTED');
    
    // Step 1: Check URL parameters (highest priority for OAuth redirects)
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    
    const possibleUrlKeys = ['userType', 'type', 'user_type', 'role'];
    
    // Check URL search params first
    for (const key of possibleUrlKeys) {
      const value = urlParams.get(key);
      if (value === 'teacher' || value === 'school') {
        console.log(`✅ Found user type in URL param ${key}:`, value);
        return value;
      }
    }
    
    // Check URL hash params (OAuth sometimes puts params here)
    for (const key of possibleUrlKeys) {
      const value = hashParams.get(key);
      if (value === 'teacher' || value === 'school') {
        console.log(`✅ Found user type in hash param ${key}:`, value);
        return value;
      }
    }

    // Step 2: Check sessionStorage (session-scoped, higher priority)
    const sessionKeys = [
      'oauth_user_type',
      'confirmed_user_type', 
      'pendingUserType',
      'registration_user_type',
      'intended_user_type',
      'user_type_source'
    ];
    
    for (const key of sessionKeys) {
      const value = sessionStorage.getItem(key);
      if (value === 'teacher' || value === 'school') {
        console.log(`✅ Found user type in sessionStorage ${key}:`, value);
        return value;
      }
    }

    // Step 3: Check localStorage as fallback
    for (const key of sessionKeys) {
      const value = localStorage.getItem(key);
      if (value === 'teacher' || value === 'school') {
        console.log(`✅ Found user type in localStorage ${key}:`, value);
        return value;
      }
    }
    
    console.log('❌ No user type found in any source');
    return null;
  };

  // Store user type with maximum persistence
  const storeUserType = (userType: 'teacher' | 'school', source: string) => {
    console.log(`💾 Storing user type: ${userType} from source: ${source}`);
    
    const timestamp = Date.now().toString();
    const storageEntries = {
      'confirmed_user_type': userType,
      'oauth_user_type': userType,
      'user_type_source': source,
      'user_type_timestamp': timestamp,
      'pendingUserType': userType,
      'registration_user_type': userType
    };
    
    // Store in both localStorage and sessionStorage
    Object.entries(storageEntries).forEach(([key, value]) => {
      localStorage.setItem(key, value);
      sessionStorage.setItem(key, value);
    });
    
    console.log('💾 User type stored successfully');
  };

  // Clean up temporary storage
  const cleanupTemporaryStorage = () => {
    const keysToClean = [
      'oauth_user_type',
      'pendingUserType', 
      'pendingOAuthFlow',
      'registration_user_type',
      'intended_user_type',
      'user_type_source',
      'user_type_timestamp'
    ];
    
    keysToClean.forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
    
    console.log('🧹 Cleaned up temporary storage keys');
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.id);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && event === 'SIGNED_IN') {
          console.log('🚀 PROCESSING SIGN IN EVENT');
          
          // Give a moment for URL params to be available
          setTimeout(async () => {
            try {
              // Check if profile already exists
              const { data: existingProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();
              
              console.log('🔍 Existing profile check:', existingProfile);
              
              if (!existingProfile) {
                console.log('👤 New user - creating profile');
                
                // Determine user type from all sources
                const userType = determineUserTypeFromAllSources();
                console.log('🎯 DETERMINED USER TYPE FOR NEW USER:', userType);
                
                if (!userType) {
                  console.log('❓ No user type found - showing selection modal');
                  setShowUserTypeModal(true);
                  setLoading(false);
                  return;
                }
                
                // Create profile with determined role
                console.log('📝 Creating profile with role:', userType);
                
                const { data: newProfile, error: profileError } = await supabase
                  .from('profiles')
                  .insert({
                    id: session.user.id,
                    email: session.user.email || '',
                    full_name: session.user.user_metadata?.full_name || 
                             session.user.user_metadata?.name || 
                             '',
                    role: userType, // This is the critical line - ensure correct role assignment
                  })
                  .select()
                  .single();
                  
                if (profileError) {
                  console.error('❌ Error creating profile:', profileError);
                  setShowUserTypeModal(true);
                } else {
                  console.log('✅ Profile created with role:', newProfile.role);
                  setProfile(newProfile);
                  
                  // Store the confirmed user type
                  storeUserType(userType, 'profile_creation');
                  
                  // Clean up temporary storage after successful creation
                  setTimeout(cleanupTemporaryStorage, 1000);
                }
              } else {
                console.log('👤 Existing user found');
                
                // Check if existing profile lacks a role
                if (!existingProfile.role) {
                  console.log('⚠️ Existing profile missing role - showing selection modal');
                  setShowUserTypeModal(true);
                } else {
                  console.log('✅ Existing profile with role:', existingProfile.role);
                }
                
                setProfile(existingProfile);
              }
            } catch (error) {
              console.error('❌ Error in auth flow:', error);
              setShowUserTypeModal(true);
            } finally {
              setLoading(false);
            }
          }, 200); // Slight delay to ensure URL params are available
        } else if (session?.user) {
          // Existing session, just fetch profile
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
      console.log('🔍 Initial session check:', session);
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
    cleanupTemporaryStorage();
    localStorage.removeItem('confirmed_user_type');
    sessionStorage.removeItem('confirmed_user_type');
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

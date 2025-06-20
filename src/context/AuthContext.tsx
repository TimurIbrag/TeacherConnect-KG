
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

  const getAllStorageValues = () => {
    console.log('🔍 COMPLETE STORAGE DEBUG:');
    console.log('Current URL:', window.location.href);
    console.log('URL Search:', window.location.search);
    console.log('URL Hash:', window.location.hash);
    
    // Check all possible storage keys
    const possibleKeys = [
      'oauth_user_type',
      'pendingUserType', 
      'registration_user_type',
      'intended_user_type',
      'pendingOAuthFlow',
      'userType',
      'type',
      'user_type'
    ];
    
    console.log('LocalStorage contents:');
    possibleKeys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) console.log(`  ${key}: ${value}`);
    });
    
    console.log('SessionStorage contents:');
    possibleKeys.forEach(key => {
      const value = sessionStorage.getItem(key);
      if (value) console.log(`  ${key}: ${value}`);
    });
    
    // Check URL parameters comprehensively
    const urlParams = new URLSearchParams(window.location.search);
    console.log('URL Parameters:');
    urlParams.forEach((value, key) => {
      console.log(`  ${key}: ${value}`);
    });
    
    // Check hash parameters
    const hash = window.location.hash.substring(1);
    if (hash) {
      const hashParams = new URLSearchParams(hash);
      console.log('Hash Parameters:');
      hashParams.forEach((value, key) => {
        console.log(`  ${key}: ${value}`);
      });
    }
  };

  const extractUserTypeFromUrl = (): 'teacher' | 'school' | null => {
    getAllStorageValues();
    
    // Check current URL parameters with comprehensive detection
    const urlParams = new URLSearchParams(window.location.search);
    
    // Check all possible parameter names
    const userTypeParams = ['userType', 'type', 'user_type', 'role'];
    
    for (const param of userTypeParams) {
      const value = urlParams.get(param);
      console.log(`🔍 URL parameter ${param}:`, value);
      
      if (value === 'teacher' || value === 'school') {
        console.log('✅ User type determined from URL parameter:', value);
        return value;
      }
    }
    
    // Check hash parameters (sometimes OAuth puts params in hash)
    const hash = window.location.hash.substring(1);
    if (hash) {
      const hashParams = new URLSearchParams(hash);
      for (const param of userTypeParams) {
        const value = hashParams.get(param);
        console.log(`🔍 Hash parameter ${param}:`, value);
        
        if (value === 'teacher' || value === 'school') {
          console.log('✅ User type determined from hash parameter:', value);
          return value;
        }
      }
    }
    
    console.log('❌ No user type found in URL or hash parameters');
    return null;
  };

  const determineUserTypeFromStorage = (): 'teacher' | 'school' | null => {
    console.log('🔍 ENHANCED USER TYPE DETERMINATION...');
    
    // Step 1: Check URL parameters first (most reliable for OAuth redirects)
    const urlUserType = extractUserTypeFromUrl();
    if (urlUserType) {
      console.log('✅ User type determined from URL:', urlUserType);
      // Store in both for persistence with enhanced keys
      localStorage.setItem('oauth_user_type', urlUserType);
      localStorage.setItem('confirmed_user_type', urlUserType);
      sessionStorage.setItem('oauth_user_type', urlUserType);
      sessionStorage.setItem('confirmed_user_type', urlUserType);
      return urlUserType;
    }

    // Step 2: Check storage with improved key priority
    const storageKeys = [
      'confirmed_user_type', // New higher priority key
      'oauth_user_type',
      'pendingUserType', 
      'registration_user_type',
      'intended_user_type'
    ];
    
    // Check sessionStorage first (more session-specific)
    for (const key of storageKeys) {
      const value = sessionStorage.getItem(key);
      console.log(`🔍 SessionStorage ${key}:`, value);
      
      if (value === 'teacher' || value === 'school') {
        console.log('✅ User type determined from sessionStorage:', value);
        // Promote to confirmed_user_type
        localStorage.setItem('confirmed_user_type', value);
        sessionStorage.setItem('confirmed_user_type', value);
        return value;
      }
    }
    
    // Check localStorage as fallback
    for (const key of storageKeys) {
      const value = localStorage.getItem(key);
      console.log(`🔍 LocalStorage ${key}:`, value);
      
      if (value === 'teacher' || value === 'school') {
        console.log('✅ User type determined from localStorage:', value);
        // Promote to confirmed_user_type
        localStorage.setItem('confirmed_user_type', value);
        sessionStorage.setItem('confirmed_user_type', value);
        return value;
      }
    }
    
    console.log('❌ Could not determine user type from any source');
    return null;
  };

  const cleanupStorageKeys = () => {
    // Clean up all possible storage keys except confirmed ones
    const keysToClean = [
      'oauth_user_type',
      'pendingUserType',
      'pendingOAuthFlow',
      'registration_user_type',
      'intended_user_type'
    ];
    
    keysToClean.forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
    
    console.log('🧹 Cleaned up temporary storage keys');
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.id);
        console.log('Session details:', session);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && event === 'SIGNED_IN') {
          console.log('🚀 PROCESSING SIGN IN EVENT');
          getAllStorageValues(); // Full debug output
          
          // Handle new user creation or existing user login
          setTimeout(async () => {
            try {
              // Check if profile exists
              const { data: existingProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();
              
              console.log('🔍 Existing profile check:', existingProfile);
              
              if (!existingProfile) {
                console.log('👤 Creating new profile for user');
                
                // Get user type with enhanced detection
                const userType = determineUserTypeFromStorage();
                console.log('🎯 FINAL DETERMINED USER TYPE:', userType);
                
                if (!userType) {
                  console.log('❓ No user type determined, showing selection modal');
                  setShowUserTypeModal(true);
                  setLoading(false);
                  return;
                }
                
                console.log('📝 Creating profile with role:', userType);
                
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
                  console.error('❌ Error creating profile:', profileError);
                  // If profile creation fails, show user type selection modal
                  setShowUserTypeModal(true);
                } else {
                  console.log('✅ Profile created successfully with role:', newProfile.role);
                  setProfile(newProfile);
                  // Clean up only after successful profile creation
                  cleanupStorageKeys();
                }
              } else {
                // Check if existing profile has a role set
                if (!existingProfile.role) {
                  console.log('👤 Existing profile without role, showing selection modal');
                  setShowUserTypeModal(true);
                } else {
                  console.log('✅ Existing profile found with role:', existingProfile.role);
                }
                setProfile(existingProfile);
              }
            } catch (error) {
              console.error('❌ Error handling user authentication:', error);
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
    // Clean up any pending user type data
    cleanupStorageKeys();
    // Also clean up confirmed user type on logout
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

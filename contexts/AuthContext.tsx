import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, Profile, Subscription, TIER_LIMITS } from '../lib/supabase';

interface AuthContextType {
    user: User | null;
    profile: Profile | null;
    subscription: Subscription | null;
    session: Session | null;
    isLoading: boolean;
    isAdmin: boolean;
    tierLimits: typeof TIER_LIMITS.free;
    signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
    signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
    signInWithGoogle: () => Promise<{ error: Error | null }>;
    signInWithGitHub: () => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProfile = useCallback(async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error fetching profile:', error);
                return null;
            }
            return data as Profile;
        } catch (err) {
            console.error('Error fetching profile:', err);
            return null;
        }
    }, []);

    const fetchSubscription = useCallback(async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching subscription:', error);
                return null;
            }
            return data as Subscription | null;
        } catch (err) {
            console.error('Error fetching subscription:', err);
            return null;
        }
    }, []);

    const refreshProfile = useCallback(async () => {
        if (!user) return;

        const [profileData, subscriptionData] = await Promise.all([
            fetchProfile(user.id),
            fetchSubscription(user.id),
        ]);

        setProfile(profileData);
        setSubscription(subscriptionData);
    }, [user, fetchProfile, fetchSubscription]);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                Promise.all([
                    fetchProfile(session.user.id),
                    fetchSubscription(session.user.id),
                ]).then(([profileData, subscriptionData]) => {
                    setProfile(profileData);
                    setSubscription(subscriptionData);
                    setIsLoading(false);
                });
            } else {
                setIsLoading(false);
            }
        });

        // Listen for auth changes
        const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setSession(session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    const [profileData, subscriptionData] = await Promise.all([
                        fetchProfile(session.user.id),
                        fetchSubscription(session.user.id),
                    ]);
                    setProfile(profileData);
                    setSubscription(subscriptionData);
                } else {
                    setProfile(null);
                    setSubscription(null);
                }
            }
        );

        return () => {
            authSubscription.unsubscribe();
        };
    }, [fetchProfile, fetchSubscription]);

    const signUp = async (email: string, password: string, fullName: string) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                },
            });

            if (error) return { error };

            // Create profile after signup
            if (data.user) {
                await supabase.from('profiles').insert({
                    id: data.user.id,
                    email: data.user.email,
                    full_name: fullName,
                    role: 'user',
                });

                // Create free subscription
                await supabase.from('subscriptions').insert({
                    user_id: data.user.id,
                    tier: 'free',
                    status: 'active',
                });
            }

            return { error: null };
        } catch (err) {
            return { error: err as Error };
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            return { error };
        } catch (err) {
            return { error: err as Error };
        }
    };

    const signInWithGoogle = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                },
            });
            return { error };
        } catch (err) {
            return { error: err as Error };
        }
    };

    const signInWithGitHub = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'github',
                options: {
                    redirectTo: window.location.origin,
                },
            });
            return { error };
        } catch (err) {
            return { error: err as Error };
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setSubscription(null);
        setSession(null);
    };

    const isAdmin = profile?.role === 'admin';
    const currentTier = subscription?.tier || 'free';
    const tierLimits = TIER_LIMITS[currentTier];

    return (
        <AuthContext.Provider
            value={{
                user,
                profile,
                subscription,
                session,
                isLoading,
                isAdmin,
                tierLimits,
                signUp,
                signIn,
                signInWithGoogle,
                signInWithGitHub,
                signOut,
                refreshProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

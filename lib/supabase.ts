import { createClient } from '@supabase/supabase-js';

// Supabase Configuration
// Replace these with your actual Supabase project credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface Profile {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    role: 'user' | 'admin';
    created_at: string;
}

export interface Subscription {
    id: string;
    user_id: string;
    tier: 'free' | 'pro' | 'enterprise';
    stripe_customer_id: string | null;
    stripe_subscription_id: string | null;
    current_period_end: string | null;
    status: 'active' | 'canceled' | 'past_due';
}

export interface AdPlacement {
    id: string;
    slot_name: string;
    ad_client: string;
    ad_slot: string;
    is_enabled: boolean;
    display_for: 'free' | 'all' | 'none';
    format: 'horizontal' | 'vertical' | 'rectangle' | 'responsive';
    created_at: string;
}

export interface UsageLog {
    id: string;
    user_id: string | null;
    tool_id: string;
    file_size: number;
    created_at: string;
}

// Subscription tier limits
export const TIER_LIMITS = {
    free: {
        dailyConversions: 20,
        maxFileSize: 10 * 1024 * 1024, // 10MB
        showAds: true,
        priorityProcessing: false,
        apiAccess: false,
    },
    pro: {
        dailyConversions: Infinity,
        maxFileSize: 50 * 1024 * 1024, // 50MB
        showAds: false,
        priorityProcessing: true,
        apiAccess: false,
    },
    enterprise: {
        dailyConversions: Infinity,
        maxFileSize: 100 * 1024 * 1024, // 100MB
        showAds: false,
        priorityProcessing: true,
        apiAccess: true,
    },
};

// Stripe Configuration
export const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

export const STRIPE_PRICE_IDS = {
    pro_monthly: import.meta.env.VITE_STRIPE_PRO_MONTHLY_PRICE_ID || '',
    pro_yearly: import.meta.env.VITE_STRIPE_PRO_YEARLY_PRICE_ID || '',
    enterprise_monthly: import.meta.env.VITE_STRIPE_ENTERPRISE_MONTHLY_PRICE_ID || '',
    enterprise_yearly: import.meta.env.VITE_STRIPE_ENTERPRISE_YEARLY_PRICE_ID || '',
};

/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_ANON_KEY: string;
    readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
    readonly VITE_STRIPE_PRO_MONTHLY_PRICE_ID: string;
    readonly VITE_STRIPE_PRO_YEARLY_PRICE_ID: string;
    readonly VITE_STRIPE_ENTERPRISE_MONTHLY_PRICE_ID: string;
    readonly VITE_STRIPE_ENTERPRISE_YEARLY_PRICE_ID: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

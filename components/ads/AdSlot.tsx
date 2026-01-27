import React, { useEffect, useState } from 'react';
import { supabase, AdPlacement } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface AdSlotProps {
    slotName: string;
    className?: string;
}

const AdSlot: React.FC<AdSlotProps> = ({ slotName, className = '' }) => {
    const [adConfig, setAdConfig] = useState<AdPlacement | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { subscription, isLoading: authLoading } = useAuth();

    useEffect(() => {
        const fetchAdConfig = async () => {
            try {
                const { data, error } = await supabase
                    .from('ad_placements')
                    .select('*')
                    .eq('slot_name', slotName)
                    .eq('is_enabled', true)
                    .single();

                if (!error && data) {
                    setAdConfig(data as AdPlacement);
                }
            } catch (err) {
                console.error('Error fetching ad config:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAdConfig();
    }, [slotName]);

    // Don't show ads for paid users
    const userTier = subscription?.tier || 'free';
    if (authLoading || isLoading) return null;

    // Check if ad should show for this user type
    if (!adConfig) return null;
    if (adConfig.display_for === 'none') return null;
    if (adConfig.display_for === 'free' && userTier !== 'free') return null;

    // Get ad format dimensions
    const getAdDimensions = () => {
        switch (adConfig.format) {
            case 'horizontal':
                return 'min-h-[90px] w-full';
            case 'vertical':
                return 'min-h-[600px] w-[160px]';
            case 'rectangle':
                return 'min-h-[250px] w-[300px]';
            case 'responsive':
            default:
                return 'min-h-[100px] w-full';
        }
    };

    return (
        <div className={`ad-container ${className}`}>
            <div
                className={`relative bg-slate-50 border border-slate-100 rounded-xl overflow-hidden ${getAdDimensions()}`}
            >
                {/* Placeholder for development */}
                {!adConfig.ad_client || !adConfig.ad_slot ? (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">
                        <div className="text-center p-4">
                            <p className="font-medium">Ad Placeholder</p>
                            <p className="text-xs mt-1">{slotName}</p>
                        </div>
                    </div>
                ) : (
                    // Real AdSense ad
                    <ins
                        className="adsbygoogle"
                        style={{ display: 'block' }}
                        data-ad-client={adConfig.ad_client}
                        data-ad-slot={adConfig.ad_slot}
                        data-ad-format={adConfig.format === 'responsive' ? 'auto' : undefined}
                        data-full-width-responsive={adConfig.format === 'responsive' ? 'true' : undefined}
                    />
                )}
            </div>

            {/* Subtle "Ad" label */}
            <p className="text-[10px] text-slate-400 text-center mt-1 font-medium uppercase tracking-wider">
                Advertisement
            </p>
        </div>
    );
};

// Wrapper component for horizontal banner ads
export const HorizontalBannerAd: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`max-w-4xl mx-auto px-4 my-8 ${className}`}>
        <AdSlot slotName="hero-banner" />
    </div>
);

// Wrapper component for sidebar ads
export const SidebarAd: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`hidden xl:block sticky top-24 ${className}`}>
        <AdSlot slotName="sidebar" />
    </div>
);

// Wrapper component for between-section ads
export const BetweenSectionAd: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`max-w-3xl mx-auto px-4 my-12 ${className}`}>
        <AdSlot slotName="between-sections" />
    </div>
);

// Wrapper component for footer banner ads
export const FooterBannerAd: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`max-w-4xl mx-auto px-4 mb-8 ${className}`}>
        <AdSlot slotName="footer-banner" />
    </div>
);

export default AdSlot;

import React, { useState } from 'react';
import { X, Check, Zap, Crown, Rocket, Loader2 } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '../../contexts/AuthContext';
import { STRIPE_PUBLISHABLE_KEY, STRIPE_PRICE_IDS, supabase } from '../../lib/supabase';

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null;

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
    const { user, subscription } = useAuth();
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    const handleSubscribe = async (tier: 'pro' | 'enterprise') => {
        if (!user) {
            // Prompt login
            onClose();
            return;
        }

        setIsLoading(tier);

        try {
            const priceId = billingCycle === 'monthly'
                ? (tier === 'pro' ? STRIPE_PRICE_IDS.pro_monthly : STRIPE_PRICE_IDS.enterprise_monthly)
                : (tier === 'pro' ? STRIPE_PRICE_IDS.pro_yearly : STRIPE_PRICE_IDS.enterprise_yearly);

            if (!priceId || !stripePromise) {
                // Mock subscription for development
                await supabase
                    .from('subscriptions')
                    .upsert({
                        user_id: user.id,
                        tier,
                        status: 'active',
                        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                    });

                onClose();
                window.location.reload();
                return;
            }

            // Create Stripe checkout session via edge function
            const { data, error } = await supabase.functions.invoke('create-checkout-session', {
                body: { priceId, userId: user.id },
            });

            if (error) throw error;

            const stripe = await stripePromise;
            if (stripe && data.sessionId) {
                window.location.href = data.url; // Use redirect URL from server
            }
        } catch (err) {
            console.error('Subscription error:', err);
        } finally {
            setIsLoading(null);
        }
    };

    if (!isOpen) return null;

    const currentTier = subscription?.tier || 'free';

    const plans = [
        {
            id: 'free',
            name: 'Free',
            icon: Zap,
            price: { monthly: 0, yearly: 0 },
            description: 'Perfect for trying out our tools',
            features: [
                '20 conversions per day',
                'Up to 10MB file size',
                'All conversion tools',
                'With advertisements',
            ],
            notIncluded: [
                'Priority processing',
                'API access',
            ],
            cta: 'Current Plan',
            disabled: true,
        },
        {
            id: 'pro',
            name: 'Pro',
            icon: Crown,
            price: { monthly: 9, yearly: 90 },
            description: 'Best for power users',
            popular: true,
            features: [
                'Unlimited conversions',
                'Up to 50MB file size',
                'All conversion tools',
                'No advertisements',
                'Priority processing',
            ],
            notIncluded: [
                'API access',
            ],
            cta: currentTier === 'pro' ? 'Current Plan' : 'Upgrade to Pro',
            disabled: currentTier === 'pro' || currentTier === 'enterprise',
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            icon: Rocket,
            price: { monthly: 29, yearly: 290 },
            description: 'For teams and businesses',
            features: [
                'Unlimited conversions',
                'Up to 100MB file size',
                'All conversion tools',
                'No advertisements',
                'Priority processing',
                'API access',
                'Priority support',
            ],
            notIncluded: [],
            cta: currentTier === 'enterprise' ? 'Current Plan' : 'Upgrade to Enterprise',
            disabled: currentTier === 'enterprise',
        },
    ];

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="relative p-8 pb-6 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 text-center">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <h2 className="text-3xl font-black text-white mb-2">Choose Your Plan</h2>
                    <p className="text-white/80">Unlock the full power of Free AI Converter</p>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-3 mt-6">
                        <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-white' : 'text-white/60'}`}>
                            Monthly
                        </span>
                        <button
                            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                            className="relative w-14 h-7 bg-white/20 rounded-full transition-colors"
                        >
                            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${billingCycle === 'yearly' ? 'left-8' : 'left-1'
                                }`} />
                        </button>
                        <span className={`text-sm font-bold ${billingCycle === 'yearly' ? 'text-white' : 'text-white/60'}`}>
                            Yearly
                            <span className="ml-1 text-xs bg-white/20 px-2 py-0.5 rounded-full">Save 17%</span>
                        </span>
                    </div>
                </div>

                {/* Plans */}
                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative rounded-2xl p-6 transition-all ${plan.popular
                                ? 'bg-gradient-to-b from-primary-50 to-purple-50 border-2 border-primary-200 shadow-lg shadow-primary-100/50'
                                : 'bg-slate-50 border border-slate-200'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-primary-500 to-purple-500 text-white text-xs font-bold rounded-full">
                                    Most Popular
                                </div>
                            )}

                            <div className="flex items-center gap-3 mb-4">
                                <div className={`p-2.5 rounded-xl ${plan.popular ? 'bg-primary-100 text-primary-600' : 'bg-slate-200 text-slate-600'
                                    }`}>
                                    <plan.icon className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900">{plan.name}</h3>
                            </div>

                            <div className="mb-4">
                                <span className="text-4xl font-black text-slate-900">
                                    ${plan.price[billingCycle]}
                                </span>
                                {plan.price[billingCycle] > 0 && (
                                    <span className="text-slate-400 text-sm">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                                )}
                            </div>

                            <p className="text-sm text-slate-500 mb-6">{plan.description}</p>

                            <ul className="space-y-3 mb-6">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                                {plan.notIncluded.map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-sm text-slate-400">
                                        <X className="w-4 h-4 text-slate-300 flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => plan.id !== 'free' && handleSubscribe(plan.id as 'pro' | 'enterprise')}
                                disabled={plan.disabled || isLoading !== null}
                                className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${plan.disabled
                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    : plan.popular
                                        ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50'
                                        : 'bg-slate-900 text-white hover:bg-slate-800'
                                    }`}
                            >
                                {isLoading === plan.id && <Loader2 className="w-4 h-4 animate-spin" />}
                                {plan.cta}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="px-8 pb-8 pt-2 text-center text-sm text-slate-400">
                    <p>Cancel anytime. No questions asked. All plans include a 7-day free trial.</p>
                </div>
            </div>
        </div>
    );
};

export default PricingModal;

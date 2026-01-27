import React, { useEffect, useState } from 'react';
import {
    User, Settings, CreditCard, History, BarChart3,
    FileImage, Calendar, TrendingUp, Crown, ChevronRight,
    Download, Clock, Zap, Shield
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, UsageLog } from '../../lib/supabase';

interface UserDashboardProps {
    onNavigateHome: () => void;
    onOpenPricing: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ onNavigateHome, onOpenPricing }) => {
    const { user, profile, subscription, tierLimits, signOut, refreshProfile } = useAuth();
    const [usageStats, setUsageStats] = useState({
        todayCount: 0,
        totalCount: 0,
        totalSize: 0,
    });
    const [recentUsage, setRecentUsage] = useState<UsageLog[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'settings'>('overview');

    useEffect(() => {
        if (user) {
            fetchUsageStats();
            fetchRecentUsage();
        }
    }, [user]);

    const fetchUsageStats = async () => {
        if (!user) return;

        const today = new Date().toISOString().split('T')[0];

        // Get today's usage
        const { count: todayCount } = await supabase
            .from('usage_logs')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .gte('created_at', today);

        // Get total usage
        const { data: totalData } = await supabase
            .from('usage_logs')
            .select('file_size')
            .eq('user_id', user.id);

        const totalSize = totalData?.reduce((sum, log) => sum + (log.file_size || 0), 0) || 0;

        setUsageStats({
            todayCount: todayCount || 0,
            totalCount: totalData?.length || 0,
            totalSize,
        });
    };

    const fetchRecentUsage = async () => {
        if (!user) return;

        const { data } = await supabase
            .from('usage_logs')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10);

        setRecentUsage((data as UsageLog[]) || []);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const currentTier = subscription?.tier || 'free';
    const dailyLimit = tierLimits.dailyConversions;
    const dailyUsagePercent = dailyLimit === Infinity ? 0 : (usageStats.todayCount / dailyLimit) * 100;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-black text-slate-900">Dashboard</h1>
                            <p className="text-slate-500 mt-1">Welcome back, {profile?.full_name || 'User'}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={onNavigateHome}
                                className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
                            >
                                ← Back to Tools
                            </button>
                            <button
                                onClick={() => signOut()}
                                className="px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex gap-1 mt-6 bg-slate-100 p-1 rounded-xl w-fit">
                        {[
                            { id: 'overview', label: 'Overview', icon: BarChart3 },
                            { id: 'history', label: 'History', icon: History },
                            { id: 'settings', label: 'Settings', icon: Settings },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id
                                        ? 'bg-white text-slate-900 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Subscription Card */}
                        <div className={`relative overflow-hidden rounded-2xl p-6 ${currentTier === 'free'
                                ? 'bg-white border border-slate-200'
                                : 'bg-gradient-to-r from-primary-500 to-purple-600 text-white'
                            }`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Crown className={`w-5 h-5 ${currentTier === 'free' ? 'text-slate-400' : 'text-white'}`} />
                                        <span className={`text-sm font-bold uppercase tracking-wider ${currentTier === 'free' ? 'text-slate-400' : 'text-white/80'}`}>
                                            Current Plan
                                        </span>
                                    </div>
                                    <h3 className={`text-2xl font-black ${currentTier === 'free' ? 'text-slate-900' : 'text-white'}`}>
                                        {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)} Plan
                                    </h3>
                                    {subscription?.current_period_end && currentTier !== 'free' && (
                                        <p className="text-white/80 text-sm mt-1">
                                            Renews on {new Date(subscription.current_period_end).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                                {currentTier === 'free' && (
                                    <button
                                        onClick={onOpenPricing}
                                        className="px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                                    >
                                        Upgrade <ChevronRight className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Daily Usage */}
                            <div className="bg-white rounded-2xl p-6 border border-slate-200">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm font-bold text-slate-500">Today's Conversions</span>
                                    <Clock className="w-5 h-5 text-slate-400" />
                                </div>
                                <p className="text-3xl font-black text-slate-900">
                                    {usageStats.todayCount}
                                    {dailyLimit !== Infinity && (
                                        <span className="text-lg text-slate-400 font-medium"> / {dailyLimit}</span>
                                    )}
                                </p>
                                {dailyLimit !== Infinity && (
                                    <div className="mt-3">
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all ${dailyUsagePercent > 80 ? 'bg-red-500' : 'bg-primary-500'
                                                    }`}
                                                style={{ width: `${Math.min(dailyUsagePercent, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Total Conversions */}
                            <div className="bg-white rounded-2xl p-6 border border-slate-200">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm font-bold text-slate-500">Total Conversions</span>
                                    <TrendingUp className="w-5 h-5 text-green-500" />
                                </div>
                                <p className="text-3xl font-black text-slate-900">{usageStats.totalCount}</p>
                                <p className="text-sm text-slate-400 mt-1">All time</p>
                            </div>

                            {/* Data Processed */}
                            <div className="bg-white rounded-2xl p-6 border border-slate-200">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm font-bold text-slate-500">Data Processed</span>
                                    <Download className="w-5 h-5 text-blue-500" />
                                </div>
                                <p className="text-3xl font-black text-slate-900">{formatFileSize(usageStats.totalSize)}</p>
                                <p className="text-sm text-slate-400 mt-1">Total files processed</p>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Your Plan Features</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                    <Zap className={`w-5 h-5 ${tierLimits.priorityProcessing ? 'text-green-500' : 'text-slate-300'}`} />
                                    <span className="text-sm font-medium text-slate-600">
                                        {tierLimits.priorityProcessing ? 'Priority Processing' : 'Standard Processing'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                    <FileImage className="w-5 h-5 text-blue-500" />
                                    <span className="text-sm font-medium text-slate-600">
                                        Max {formatFileSize(tierLimits.maxFileSize)}
                                    </span>
                                </div>
                                <div className={`flex items-center gap-3 p-3 rounded-xl ${tierLimits.showAds ? 'bg-slate-50' : 'bg-green-50'}`}>
                                    <Shield className={`w-5 h-5 ${tierLimits.showAds ? 'text-slate-300' : 'text-green-500'}`} />
                                    <span className="text-sm font-medium text-slate-600">
                                        {tierLimits.showAds ? 'With Ads' : 'Ad-Free'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                    <BarChart3 className={`w-5 h-5 ${tierLimits.apiAccess ? 'text-purple-500' : 'text-slate-300'}`} />
                                    <span className="text-sm font-medium text-slate-600">
                                        {tierLimits.apiAccess ? 'API Access' : 'No API'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="text-lg font-bold text-slate-900">Conversion History</h3>
                            <p className="text-sm text-slate-500 mt-1">Your recent file conversions</p>
                        </div>
                        {recentUsage.length === 0 ? (
                            <div className="p-12 text-center">
                                <FileImage className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-500">No conversions yet</p>
                                <button
                                    onClick={onNavigateHome}
                                    className="mt-4 px-4 py-2 bg-primary-50 text-primary-600 font-bold rounded-lg hover:bg-primary-100 transition-colors"
                                >
                                    Start Converting
                                </button>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {recentUsage.map((log) => (
                                    <div key={log.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                                                <FileImage className="w-5 h-5 text-primary-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">{log.tool_id}</p>
                                                <p className="text-sm text-slate-400">{formatFileSize(log.file_size)}</p>
                                            </div>
                                        </div>
                                        <span className="text-sm text-slate-400">{formatDate(log.created_at)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="space-y-6">
                        {/* Profile Settings */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Profile Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={user?.email || ''}
                                        disabled
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={profile?.full_name || ''}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-primary-100 focus:border-primary-300 outline-none"
                                    />
                                </div>
                                <button className="px-4 py-2 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition-colors">
                                    Save Changes
                                </button>
                            </div>
                        </div>

                        {/* Subscription Management */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Subscription</h3>
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                <div>
                                    <p className="font-bold text-slate-900">{currentTier.charAt(0).toUpperCase() + currentTier.slice(1)} Plan</p>
                                    <p className="text-sm text-slate-500">
                                        {currentTier === 'free' ? 'Upgrade to unlock more features' : 'Manage your subscription'}
                                    </p>
                                </div>
                                <button
                                    onClick={onOpenPricing}
                                    className="px-4 py-2 bg-primary-100 text-primary-600 font-bold rounded-lg hover:bg-primary-200 transition-colors"
                                >
                                    {currentTier === 'free' ? 'Upgrade' : 'Manage'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;

import React, { useEffect, useState } from 'react';
import {
    Users, DollarSign, BarChart3, Settings, Plus, Trash2,
    Edit2, Save, X, Eye, EyeOff, LayoutGrid, Image as ImageIcon,
    TrendingUp, Crown, Shield, AlertCircle, Check
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, Profile, Subscription, AdPlacement } from '../../lib/supabase';

interface AdminDashboardProps {
    onNavigateHome: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateHome }) => {
    const { profile, signOut } = useAuth();
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'subscriptions' | 'ads' | 'tools'>('overview');

    // Overview stats
    const [stats, setStats] = useState({
        totalUsers: 0,
        proUsers: 0,
        enterpriseUsers: 0,
        totalConversions: 0,
        monthlyRevenue: 0,
    });

    // Users management
    const [users, setUsers] = useState<(Profile & { subscription?: Subscription })[]>([]);
    const [usersLoading, setUsersLoading] = useState(false);

    // Ads management
    const [adPlacements, setAdPlacements] = useState<AdPlacement[]>([]);
    const [editingAd, setEditingAd] = useState<AdPlacement | null>(null);
    const [newAd, setNewAd] = useState<Partial<AdPlacement>>({
        slot_name: '',
        ad_client: '',
        ad_slot: '',
        is_enabled: true,
        display_for: 'free',
        format: 'responsive',
    });

    useEffect(() => {
        fetchStats();
        fetchUsers();
        fetchAdPlacements();
    }, []);

    const fetchStats = async () => {
        // Get user counts
        const { count: totalUsers } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });

        const { count: proUsers } = await supabase
            .from('subscriptions')
            .select('*', { count: 'exact', head: true })
            .eq('tier', 'pro');

        const { count: enterpriseUsers } = await supabase
            .from('subscriptions')
            .select('*', { count: 'exact', head: true })
            .eq('tier', 'enterprise');

        const { count: totalConversions } = await supabase
            .from('usage_logs')
            .select('*', { count: 'exact', head: true });

        setStats({
            totalUsers: totalUsers || 0,
            proUsers: proUsers || 0,
            enterpriseUsers: enterpriseUsers || 0,
            totalConversions: totalConversions || 0,
            monthlyRevenue: (proUsers || 0) * 9 + (enterpriseUsers || 0) * 29,
        });
    };

    const fetchUsers = async () => {
        setUsersLoading(true);
        const { data: profiles } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (profiles) {
            const usersWithSubs = await Promise.all(
                profiles.map(async (p) => {
                    const { data: sub } = await supabase
                        .from('subscriptions')
                        .select('*')
                        .eq('user_id', p.id)
                        .single();
                    return { ...p, subscription: sub as Subscription | undefined };
                })
            );
            setUsers(usersWithSubs as (Profile & { subscription?: Subscription })[]);
        }
        setUsersLoading(false);
    };

    const fetchAdPlacements = async () => {
        const { data } = await supabase
            .from('ad_placements')
            .select('*')
            .order('created_at', { ascending: false });
        setAdPlacements((data as AdPlacement[]) || []);
    };

    const updateUserRole = async (userId: string, role: 'user' | 'admin') => {
        await supabase.from('profiles').update({ role }).eq('id', userId);
        fetchUsers();
    };

    const updateSubscriptionTier = async (userId: string, tier: 'free' | 'pro' | 'enterprise') => {
        await supabase.from('subscriptions').update({ tier }).eq('user_id', userId);
        fetchUsers();
        fetchStats();
    };

    const saveAdPlacement = async () => {
        if (editingAd) {
            await supabase
                .from('ad_placements')
                .update({
                    slot_name: editingAd.slot_name,
                    ad_client: editingAd.ad_client,
                    ad_slot: editingAd.ad_slot,
                    is_enabled: editingAd.is_enabled,
                    display_for: editingAd.display_for,
                    format: editingAd.format,
                })
                .eq('id', editingAd.id);
            setEditingAd(null);
        }
        fetchAdPlacements();
    };

    const createAdPlacement = async () => {
        if (!newAd.slot_name) return;

        await supabase.from('ad_placements').insert({
            slot_name: newAd.slot_name,
            ad_client: newAd.ad_client || '',
            ad_slot: newAd.ad_slot || '',
            is_enabled: newAd.is_enabled ?? true,
            display_for: newAd.display_for || 'free',
            format: newAd.format || 'responsive',
        });

        setNewAd({
            slot_name: '',
            ad_client: '',
            ad_slot: '',
            is_enabled: true,
            display_for: 'free',
            format: 'responsive',
        });
        fetchAdPlacements();
    };

    const deleteAdPlacement = async (id: string) => {
        await supabase.from('ad_placements').delete().eq('id', id);
        fetchAdPlacements();
    };

    const toggleAdEnabled = async (id: string, enabled: boolean) => {
        await supabase.from('ad_placements').update({ is_enabled: enabled }).eq('id', id);
        fetchAdPlacements();
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            {/* Header */}
            <div className="bg-slate-800 border-b border-slate-700">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-primary-500/20 rounded-lg">
                                    <Shield className="w-6 h-6 text-primary-400" />
                                </div>
                                <h1 className="text-2xl font-black">Admin Dashboard</h1>
                            </div>
                            <p className="text-slate-400">Manage users, subscriptions, and ads</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={onNavigateHome}
                                className="px-4 py-2 text-sm font-bold text-slate-300 hover:text-white transition-colors"
                            >
                                ← Back to Site
                            </button>
                            <button
                                onClick={() => signOut()}
                                className="px-4 py-2 text-sm font-bold text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex gap-1 mt-6 bg-slate-700/50 p-1 rounded-xl w-fit">
                        {[
                            { id: 'overview', label: 'Overview', icon: BarChart3 },
                            { id: 'users', label: 'Users', icon: Users },
                            { id: 'tools', label: 'Tools Usage', icon: ImageIcon },
                            { id: 'subscriptions', label: 'Subscriptions', icon: Crown },
                            { id: 'ads', label: 'Ads', icon: LayoutGrid },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id
                                    ? 'bg-primary-500 text-white'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
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
            <div className="max-w-7xl mx-auto px-4 py-8">
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                                <div className="flex items-center justify-between mb-4">
                                    <Users className="w-8 h-8 text-blue-400" />
                                    <TrendingUp className="w-4 h-4 text-green-400" />
                                </div>
                                <p className="text-3xl font-black">{stats.totalUsers}</p>
                                <p className="text-slate-400 text-sm">Total Users</p>
                            </div>

                            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                                <div className="flex items-center justify-between mb-4">
                                    <Crown className="w-8 h-8 text-purple-400" />
                                    <span className="text-xs font-bold bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">Pro</span>
                                </div>
                                <p className="text-3xl font-black">{stats.proUsers}</p>
                                <p className="text-slate-400 text-sm">Pro Subscribers</p>
                            </div>

                            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                                <div className="flex items-center justify-between mb-4">
                                    <ImageIcon className="w-8 h-8 text-green-400" />
                                </div>
                                <p className="text-3xl font-black">{stats.totalConversions.toLocaleString()}</p>
                                <p className="text-slate-400 text-sm">Total Conversions</p>
                            </div>

                            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border border-green-500/30">
                                <div className="flex items-center justify-between mb-4">
                                    <DollarSign className="w-8 h-8 text-green-400" />
                                </div>
                                <p className="text-3xl font-black text-green-400">${stats.monthlyRevenue}</p>
                                <p className="text-slate-400 text-sm">Monthly Revenue</p>
                            </div>
                        </div>

                        {/* Quick Stats Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                                <h3 className="text-lg font-bold mb-4">User Breakdown</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400">Free Users</span>
                                        <span className="font-bold">{stats.totalUsers - stats.proUsers - stats.enterpriseUsers}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-purple-400">Pro Users</span>
                                        <span className="font-bold text-purple-400">{stats.proUsers}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-yellow-400">Enterprise Users</span>
                                        <span className="font-bold text-yellow-400">{stats.enterpriseUsers}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                                <h3 className="text-lg font-bold mb-4">Conversion Rate</h3>
                                <div className="flex items-end gap-4">
                                    <div>
                                        <p className="text-4xl font-black text-primary-400">
                                            {stats.totalUsers > 0 ? ((stats.proUsers + stats.enterpriseUsers) / stats.totalUsers * 100).toFixed(1) : 0}%
                                        </p>
                                        <p className="text-slate-400 text-sm">Free to Paid</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                                <h3 className="text-lg font-bold mb-4">Avg. Conversions/User</h3>
                                <div className="flex items-end gap-4">
                                    <div>
                                        <p className="text-4xl font-black text-green-400">
                                            {stats.totalUsers > 0 ? (stats.totalConversions / stats.totalUsers).toFixed(1) : 0}
                                        </p>
                                        <p className="text-slate-400 text-sm">Per User</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'tools' && (
                    <div className="space-y-6">
                        {/* Tools Usage Overview */}
                        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                            <div className="p-6 border-b border-slate-700">
                                <h3 className="text-lg font-bold">Tool Usage Analytics</h3>
                                <p className="text-slate-400 text-sm mt-1">Track which tools are most popular</p>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[
                                        { name: 'Image Compressor', usage: 45, color: 'bg-blue-500' },
                                        { name: 'PNG to JPG', usage: 32, color: 'bg-green-500' },
                                        { name: 'Background Remover', usage: 28, color: 'bg-purple-500' },
                                        { name: 'HEIC to JPG', usage: 18, color: 'bg-pink-500' },
                                        { name: 'SVG Optimizer', usage: 15, color: 'bg-yellow-500' },
                                        { name: 'Video Converter', usage: 12, color: 'bg-red-500' },
                                    ].map((tool) => (
                                        <div key={tool.name} className="bg-slate-700/50 rounded-xl p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium">{tool.name}</span>
                                                <span className="text-slate-400 text-sm">{tool.usage}%</span>
                                            </div>
                                            <div className="h-2 bg-slate-600 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${tool.color} rounded-full transition-all`}
                                                    style={{ width: `${tool.usage}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Usage by Time */}
                        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
                            <h3 className="text-lg font-bold mb-4">Usage Trends</h3>
                            <div className="grid grid-cols-7 gap-2">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                                    <div key={day} className="text-center">
                                        <div
                                            className="bg-primary-500/20 rounded-lg mb-2 transition-all hover:bg-primary-500/40"
                                            style={{ height: `${Math.random() * 80 + 40}px` }}
                                        />
                                        <span className="text-xs text-slate-400">{day}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                        <div className="p-6 border-b border-slate-700">
                            <h3 className="text-lg font-bold">User Management</h3>
                            <p className="text-slate-400 text-sm mt-1">Manage user roles and access</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-700/50">
                                    <tr>
                                        <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">User</th>
                                        <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                                        <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Plan</th>
                                        <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Joined</th>
                                        <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700">
                                    {users.map((u) => (
                                        <tr key={u.id} className="hover:bg-slate-700/30">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium">{u.full_name || 'No Name'}</p>
                                                    <p className="text-sm text-slate-400">{u.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={u.role}
                                                    onChange={(e) => updateUserRole(u.id, e.target.value as 'user' | 'admin')}
                                                    className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-sm"
                                                >
                                                    <option value="user">User</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={u.subscription?.tier || 'free'}
                                                    onChange={(e) => updateSubscriptionTier(u.id, e.target.value as 'free' | 'pro' | 'enterprise')}
                                                    className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-sm"
                                                >
                                                    <option value="free">Free</option>
                                                    <option value="pro">Pro</option>
                                                    <option value="enterprise">Enterprise</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-400">
                                                {new Date(u.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button className="text-slate-400 hover:text-white transition-colors">
                                                    <Settings className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'ads' && (
                    <div className="space-y-6">
                        {/* Add New Ad */}
                        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                            <h3 className="text-lg font-bold mb-4">Add New Ad Placement</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input
                                    type="text"
                                    placeholder="Slot Name (e.g., hero-banner)"
                                    value={newAd.slot_name || ''}
                                    onChange={(e) => setNewAd({ ...newAd, slot_name: e.target.value })}
                                    className="bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                />
                                <input
                                    type="text"
                                    placeholder="AdSense Client ID"
                                    value={newAd.ad_client || ''}
                                    onChange={(e) => setNewAd({ ...newAd, ad_client: e.target.value })}
                                    className="bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                />
                                <input
                                    type="text"
                                    placeholder="AdSense Slot ID"
                                    value={newAd.ad_slot || ''}
                                    onChange={(e) => setNewAd({ ...newAd, ad_slot: e.target.value })}
                                    className="bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                />
                            </div>
                            <div className="flex items-center gap-4 mt-4">
                                <select
                                    value={newAd.format || 'responsive'}
                                    onChange={(e) => setNewAd({ ...newAd, format: e.target.value as AdPlacement['format'] })}
                                    className="bg-slate-700 border border-slate-600 rounded-xl px-4 py-2.5 text-sm"
                                >
                                    <option value="responsive">Responsive</option>
                                    <option value="horizontal">Horizontal</option>
                                    <option value="vertical">Vertical</option>
                                    <option value="rectangle">Rectangle</option>
                                </select>
                                <select
                                    value={newAd.display_for || 'free'}
                                    onChange={(e) => setNewAd({ ...newAd, display_for: e.target.value as AdPlacement['display_for'] })}
                                    className="bg-slate-700 border border-slate-600 rounded-xl px-4 py-2.5 text-sm"
                                >
                                    <option value="free">Free Users Only</option>
                                    <option value="all">All Users</option>
                                    <option value="none">Disabled</option>
                                </select>
                                <button
                                    onClick={createAdPlacement}
                                    className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition-colors flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" /> Add Placement
                                </button>
                            </div>
                        </div>

                        {/* Existing Ad Placements */}
                        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                            <div className="p-6 border-b border-slate-700">
                                <h3 className="text-lg font-bold">Ad Placements</h3>
                                <p className="text-slate-400 text-sm mt-1">Manage AdSense ad slots across the site</p>
                            </div>
                            <div className="divide-y divide-slate-700">
                                {adPlacements.length === 0 ? (
                                    <div className="p-12 text-center text-slate-400">
                                        <LayoutGrid className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p>No ad placements yet</p>
                                    </div>
                                ) : (
                                    adPlacements.map((ad) => (
                                        <div key={ad.id} className="p-6 flex items-center justify-between">
                                            {editingAd?.id === ad.id ? (
                                                <div className="flex-1 grid grid-cols-4 gap-4">
                                                    <input
                                                        type="text"
                                                        value={editingAd.ad_client}
                                                        onChange={(e) => setEditingAd({ ...editingAd, ad_client: e.target.value })}
                                                        placeholder="Client ID"
                                                        className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={editingAd.ad_slot}
                                                        onChange={(e) => setEditingAd({ ...editingAd, ad_slot: e.target.value })}
                                                        placeholder="Slot ID"
                                                        className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm"
                                                    />
                                                    <select
                                                        value={editingAd.display_for}
                                                        onChange={(e) => setEditingAd({ ...editingAd, display_for: e.target.value as AdPlacement['display_for'] })}
                                                        className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm"
                                                    >
                                                        <option value="free">Free Only</option>
                                                        <option value="all">All</option>
                                                        <option value="none">None</option>
                                                    </select>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={saveAdPlacement}
                                                            className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30"
                                                        >
                                                            <Save className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingAd(null)}
                                                            className="p-2 bg-slate-700 text-slate-400 rounded-lg hover:bg-slate-600"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div>
                                                        <div className="flex items-center gap-3">
                                                            <span className={`w-2 h-2 rounded-full ${ad.is_enabled ? 'bg-green-400' : 'bg-slate-500'}`} />
                                                            <p className="font-bold">{ad.slot_name}</p>
                                                            <span className="text-xs font-medium bg-slate-700 px-2 py-1 rounded-full text-slate-300">
                                                                {ad.format}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-slate-400 mt-1">
                                                            {ad.ad_client ? `${ad.ad_client} / ${ad.ad_slot}` : 'No AdSense configured'}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => toggleAdEnabled(ad.id, !ad.is_enabled)}
                                                            className={`p-2 rounded-lg transition-colors ${ad.is_enabled ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}`}
                                                        >
                                                            {ad.is_enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingAd(ad)}
                                                            className="p-2 bg-slate-700 text-slate-400 rounded-lg hover:text-white"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteAdPlacement(ad.id)}
                                                            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Ad Slot Guide */}
                        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                            <h4 className="font-bold mb-4 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-primary-400" />
                                Available Ad Slot Locations
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {['hero-banner', 'sidebar', 'between-sections', 'footer-banner'].map((slot) => (
                                    <div key={slot} className="p-3 bg-slate-700/50 rounded-xl">
                                        <p className="font-medium text-sm">{slot}</p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            {slot === 'hero-banner' && 'Below hero section'}
                                            {slot === 'sidebar' && 'Right side (desktop)'}
                                            {slot === 'between-sections' && 'Between content'}
                                            {slot === 'footer-banner' && 'Above footer'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;

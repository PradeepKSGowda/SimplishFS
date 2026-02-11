import React from 'react';
import {
    LayoutDashboard,
    Library,
    Trophy,
    User,
    Settings,
    Flame
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
    const navItems = [
        { icon: LayoutDashboard, label: 'ಪ್ರಗತಿ (Progress)', id: 'dashboard' },
        { icon: Library, label: 'ನನ್ನ ಲೈಬ್ರರಿ (My Library)', id: 'library' },
        { icon: Trophy, label: 'ಲೀಡರ್ಬೋರ್ಡ್ (Leaderboard)', id: 'leaderboard' },
        { icon: Flame, label: 'ಸ್ಟ್ರೀಕ್ಸ್ (Streaks)', id: 'streaks' },
    ];

    return (
        <div className="sidebar glass-card">
            <div className="flex items-center gap-3 mb-8">
                <h2 style={{ color: 'var(--primary)', fontWeight: 800 }}>SIMPLISH</h2>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {navItems.map((item) => (
                    <motion.div
                        key={item.id}
                        whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.05)' }}
                        className="flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors"
                        style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', borderRadius: '0.5rem' }}
                    >
                        <item.icon size={20} color="var(--primary)" />
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{item.label}</span>
                    </motion.div>
                ))}
            </nav>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem' }}>
                    <User size={20} color="var(--text-muted)" />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>ನನ್ನ ವಿವರ (Profile)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem' }}>
                    <Settings size={20} color="var(--text-muted)" />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>ಸಂಯೋಜನೆಗಳು (Settings)</span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;

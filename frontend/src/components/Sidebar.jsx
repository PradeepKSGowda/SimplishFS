import React from 'react';
import {
    LayoutDashboard,
    Library,
    Trophy,
    User,
    Settings,
    Flame,
    Upload
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ onNavigate, currentView }) => {
    const navItems = [
        { icon: LayoutDashboard, label: 'ಪ್ರಗತಿ (Progress)', id: 'dashboard' },
        { icon: Library, label: 'ನನ್ನ ಲೈಬ್ರರಿ (My Library)', id: 'library' },
        { icon: Trophy, label: 'ಲೀಡರ್ಬೋರ್ಡ್ (Leaderboard)', id: 'leaderboard' },
        { icon: Upload, label: 'ಪಾಠ ಅಪ್ಲೋಡ್ (Upload)', id: 'admin' },
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
                        onClick={() => onNavigate(item.id)}
                        className="flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '0.75rem 1rem',
                            borderRadius: '0.5rem',
                            backgroundColor: currentView === item.id ? 'rgba(56, 189, 248, 0.1)' : 'transparent'
                        }}
                    >
                        <item.icon size={20} color={currentView === item.id ? "var(--primary)" : "var(--text-muted)"} />
                        <span style={{
                            fontSize: '0.9rem',
                            color: currentView === item.id ? 'var(--text-main)' : 'var(--text-muted)',
                            fontWeight: currentView === item.id ? '600' : '400'
                        }}>
                            {item.label}
                        </span>
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

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

const Sidebar = ({ onNavigate, currentView, user, onLogout }) => {
    const navItems = [
        { icon: LayoutDashboard, label: 'ಪ್ರಗತಿ (Progress)', id: 'dashboard' },
        { icon: Library, label: 'ನನ್ನ ಲೈಬ್ರರಿ (My Library)', id: 'library' },
        { icon: Trophy, label: 'ಲೀಡರ್ಬೋರ್ಡ್ (Leaderboard)', id: 'leaderboard' },
        { icon: Upload, label: 'ಪಾಠ ಅಪ್ಲೋಡ್ (Upload)', id: 'admin', roles: ['Admin'] },
    ].filter(item => !item.roles || item.roles.includes(user?.role));

    return (
        <div className="sidebar glass-card">
            <div className="flex items-center gap-3 mb-8">
                <h2 style={{ color: 'var(--primary)', fontWeight: 800, margin: 0 }}>SIMPLISH</h2>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {navItems.map((item) => (
                    <motion.div
                        key={item.id}
                        whileHover={{ x: 5, backgroundColor: 'var(--bg-dark)' }}
                        onClick={() => onNavigate(item.id)}
                        className="flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '0.75rem 1rem',
                            borderRadius: '0.5rem',
                            backgroundColor: currentView === item.id ? 'var(--primary-light)' : 'transparent'
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

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', background: 'var(--bg-dark)', borderRadius: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                        {user?.fullName?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>{user?.fullName || 'User'}</p>
                        <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{user?.role}</p>
                    </div>
                </div>
                <button
                    onClick={onLogout}
                    style={{
                        marginTop: '0.5rem',
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        border: '1px solid var(--border)',
                        background: '#ffffff',
                        color: '#ef4444',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                    }}
                >
                    ಲಾಗ್ ಔಟ್ (Logout)
                </button>
            </div>
        </div>
    );
};

export default Sidebar;

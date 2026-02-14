import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, Users, Zap, CheckCircle } from 'lucide-react';
import AuthForm from './AuthForm';

const LandingPage = ({ onAuthSuccess }) => {
    const [showAuth, setShowAuth] = useState(false);

    const features = [
        {
            icon: BookOpen,
            title: 'ಸುಲಭ ಕಲಿಕೆ (Easy Learning)',
            desc: 'ಸರಳ ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಪಾಠಗಳು.'
        },
        {
            icon: Users,
            title: 'ವೈಯಕ್ತಿಕ ಕೋಚ್ (Personal Coach)',
            desc: 'ನಿಮ್ಮ ವೇಗಕ್ಕೆ ಅನುಗುಣವಾಗಿ ಮಾರ್ಗದರ್ಶನ.'
        },
        {
            icon: Zap,
            title: 'ವೇಗವಾದ ಪ್ರಗತಿ (Fast Progress)',
            desc: 'ದೈನಂದಿನ ಅಭ್ಯಾಸದೊಂದಿಗೆ ವೇಗವಾಗಿ ಕಲಿಯಿರಿ.'
        }
    ];

    if (showAuth) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)', padding: '2rem' }}>
                <AuthForm onLoginSuccess={onAuthSuccess} />
                <button
                    onClick={() => setShowAuth(false)}
                    style={{ position: 'fixed', top: '2rem', left: '2rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 600 }}
                >
                    ← Back to Home
                </button>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#ffffff', color: 'var(--text-main)' }}>
            {/* Header */}
            <nav style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ padding: '0.5rem', background: 'var(--primary)', borderRadius: '0.5rem' }}>
                        <Sparkles color="white" size={24} />
                    </div>
                    <h2 style={{ margin: 0, fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.02em' }}>SIMPLISH</h2>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowAuth(true)}
                    style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}
                >
                    Sign In
                </button>
            </nav>

            {/* Hero Section */}
            <main style={{ maxWidth: '1100px', mx: 'auto', padding: '5rem 2rem', textAlign: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span style={{
                        background: 'var(--primary-light)',
                        color: 'var(--primary)',
                        padding: '0.4rem 1rem',
                        borderRadius: '2rem',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        Rural-First Learning (ಗ್ರಾಮೀಣ ಭಾಗದವರಿಗಾಗಿ ಚಾತುರ್ಯ)
                    </span>
                    <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', margin: '1.5rem 0', lineHeight: 1.1, fontWeight: 900 }}>
                        ಸರಳವಾಗಿ <span style={{ color: 'var(--primary)' }}>ಇಂಗ್ಲಿಷ್</span> ಕಲಿಯಿರಿ <br />
                        Learn English Simply
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto 3rem auto', lineHeight: 1.6 }}>
                        ನಮ್ಮ ಗ್ರಾಮೀಣ ಭಾಗದ ಮಿತ್ರರಿಗಾಗಿ ಮತ್ತು ಕಡಿಮೆ ಹಣದ ಸ್ಮಾರ್ಟ್‌ಫೋನ್‌ಗಳಲ್ಲಿ ವೇಗವಾಗಿ ಕೆಲಸ ಮಾಡುವ ಕಲಿಕಾ ವೇದಿಕೆ.
                        (Optimized for low-end devices and designed for rural excellence.)
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button
                            className="btn btn-primary"
                            style={{ padding: '1rem 3rem', fontSize: '1.1rem', fontWeight: 'bold' }}
                            onClick={() => setShowAuth(true)}
                        >
                            ಈಗಲೇ ಪ್ರಾರಂಭಿಸಿ (Get Started)
                        </button>
                    </div>
                </motion.div>

                {/* Features Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem',
                    marginTop: '6rem'
                }}>
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            className="glass-card"
                            style={{ padding: '2.5rem', textAlign: 'left', border: '1px solid var(--border)' }}
                            whileHover={{ y: -5, borderColor: 'var(--primary)' }}
                        >
                            <div style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>
                                <f.icon size={32} />
                            </div>
                            <h3 style={{ marginBottom: '0.75rem', fontSize: '1.25rem' }}>{f.title}</h3>
                            <p style={{ color: 'var(--text-muted)', lineHeight: 1.5 }}>{f.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Social Proof / Accessibility badge */}
                <div style={{ marginTop: '5rem', padding: '2rem', background: 'var(--bg-dark)', borderRadius: '1rem', display: 'inline-flex', alignItems: 'center', gap: '1rem' }}>
                    <CheckCircle color="var(--primary)" size={18} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>ಕಡಿಮೆ ಇಂಟರ್ನೆಟ್‌ನಲ್ಲೂ ಉತ್ತಮವಾಗಿ ಕೆಲಸ ಮಾಡುತ್ತದೆ (Works on 2G/3G)</span>
                </div>
            </main>

            {/* Footer */}
            <footer style={{ borderTop: '1px solid var(--border)', padding: '3rem 2rem', marginTop: '4rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <p>© 2026 SIMPLISH - ಗ್ರಾಮೀಣ ಕಲಿಕಾ ವೇದಿಕೆ</p>
            </footer>
        </div>
    );
};

export default LandingPage;

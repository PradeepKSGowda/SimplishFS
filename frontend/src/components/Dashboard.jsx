import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const Dashboard = () => {
    const currentLesson = {
        title: "Basic English Conversations",
        progress: 65,
        level: "Basic"
    };

    const levels = ["Basic", "Intermediate", "Advanced", "Expert"];

    return (
        <div className="main-content">
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2rem' }}>ನಮಸ್ಕಾರ! (Hello!)</h1>
                <p style={{ color: 'var(--text-muted)' }}>ಬನ್ನಿ, ಇಂಗ್ಲಿಷ್ ಕಲಿಯೋಣ. (Come, let's learn English.)</p>
            </header>

            {/* Pick up where you left off */}
            <section style={{ marginBottom: '4rem' }}>
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>ಮುಂದುವರಿಸಿ (Continue)</span>
                </h3>
                <motion.div
                    className="glass-card neon-glow"
                    style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div style={{ flex: 1 }}>
                        <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.8rem' }}>{currentLesson.level}</span>
                        <h2 style={{ margin: '0.5rem 0' }}>{currentLesson.title}</h2>
                        <div style={{ maxWidth: '400px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
                                <span>ಪ್ರಗತಿ (Progress)</span>
                                <span>{currentLesson.progress}%</span>
                            </div>
                            <div className="progress-bar">
                                <motion.div
                                    className="progress-fill"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${currentLesson.progress}%` }}
                                    transition={{ duration: 1 }}
                                ></motion.div>
                            </div>
                        </div>
                    </div>
                    <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Play size={18} fill="currentColor" />
                        <span>ಪ್ರಾರಂಭಿಸಿ (Start)</span>
                    </button>
                </motion.div>
            </section>

            {/* Learning Path */}
            <section>
                <h3 style={{ marginBottom: '1.5rem' }}>ನಿಮ್ಮ ಕಲಿಕೆಯ ಹಾದಿ (Your Learning Path)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {levels.map((lvl, index) => (
                        <motion.div
                            key={lvl}
                            className="glass-card"
                            style={{ padding: '1.5rem' }}
                            whileHover={{ scale: 1.02, borderColor: 'var(--primary)' }}
                        >
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 'bold' }}>MODULE {index + 1}</span>
                            <h4 style={{ margin: '0.5rem 0' }}>{lvl} English</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                                Master the {lvl.toLowerCase()} levels of spoken English and grammar.
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem' }}>12 Lessons</span>
                                <button style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                    ನೋಡಿ (View) →
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Dashboard;

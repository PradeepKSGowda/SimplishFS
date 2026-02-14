import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Loader2 } from 'lucide-react';
import { lessonApi } from '../utils/api';

const Dashboard = ({ user }) => {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const response = await lessonApi.getAll();
                setLessons(response.data);
            } catch (err) {
                console.error("Error fetching lessons:", err);
                setError("Failed to load curriculum. Please check if the backend is running.");
            } finally {
                setLoading(false);
            }
        };
        fetchLessons();
    }, []);

    const currentLesson = lessons[0] || {
        title: "No lessons available yet",
        progress: 0,
        level: "N/A"
    };

    const levels = ["Basic", "Intermediate", "Advanced", "Expert"];

    if (loading) {
        return (
            <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 className="animate-spin" size={48} color="var(--primary)" />
            </div>
        );
    }

    return (
        <div className="main-content">
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2rem' }}>ನಮಸ್ಕಾರ, {user?.fullName?.split(' ')[0]}! (Hello!)</h1>
                <p style={{ color: 'var(--text-muted)' }}>ಬನ್ನಿ, ಇಂಗ್ಲಿಷ್ ಕಲಿಯೋಣ. (Come, let's learn English.)</p>
            </header>

            {error && (
                <div style={{ color: '#dc2626', marginBottom: '2rem', padding: '1rem', border: '1px solid #fecaca', borderRadius: '0.5rem', background: '#fef2f2' }}>
                    {error}
                </div>
            )}

            {/* Pick up where you left off */}
            <section style={{ marginBottom: '4rem' }}>
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>ಮುಂದುವರಿಸಿ (Continue)</span>
                </h3>
                <motion.div
                    className="glass-card"
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
                                <span>{currentLesson.progress || 0}%</span>
                            </div>
                            <div className="progress-bar">
                                <motion.div
                                    className="progress-fill"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${currentLesson.progress || 0}%` }}
                                    transition={{ duration: 1 }}
                                ></motion.div>
                            </div>
                        </div>
                    </div>
                    <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} disabled={!lessons.length}>
                        <Play size={18} fill="currentColor" />
                        <span>ಪ್ರಾರಂಭಿಸಿ (Start)</span>
                    </button>
                </motion.div>
            </section>

            {/* Learning Path */}
            <section>
                <h3 style={{ marginBottom: '1.5rem' }}>ನಿಮ್ಮ ಕಲಿಕೆಯ ಹಾದಿ (Your Learning Path)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {levels.map((lvl, index) => {
                        const lessonsInLevel = lessons.filter(l => l.level === lvl);
                        return (
                            <motion.div
                                key={lvl}
                                className="glass-card"
                                style={{ padding: '1.5rem' }}
                                whileHover={{ scale: 1.01, borderColor: 'var(--primary)' }}
                            >
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 'bold' }}>MODULE {index + 1}</span>
                                <h4 style={{ margin: '0.5rem 0' }}>{lvl} English</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                                    {lessonsInLevel.length > 0
                                        ? `Explore ${lessonsInLevel.length} active lessons in this module.`
                                        : `Master the ${lvl.toLowerCase()} levels of spoken English and grammar.`}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.8rem' }}>{lessonsInLevel.length} Lessons</span>
                                    <button style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                        ನೋಡಿ (View) →
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

export default Dashboard;

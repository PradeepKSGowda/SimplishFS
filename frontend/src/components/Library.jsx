import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Music, Video, ArrowRight, Loader2, Search } from 'lucide-react';
import { lessonApi } from '../utils/api';

const Library = ({ onSelectLesson }) => {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const response = await lessonApi.getAll();
                setLessons(response.data);
            } catch (err) {
                console.error("Error fetching library:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLessons();
    }, []);

    const filteredLessons = lessons.filter(lesson =>
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'pdf': return <FileText size={20} />;
            case 'audio': return <Music size={20} />;
            case 'video': return <Video size={20} />;
            default: return <FileText size={20} />;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="animate-spin" size={48} color="var(--primary)" />
            </div>
        );
    }

    return (
        <div className="library-container">
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '1.8rem', color: 'var(--text-main)' }}>ನನ್ನ ಲೈಬ್ರರಿ (My Library)</h1>
                <p style={{ color: 'var(--text-muted)' }}>Explore all your uploaded curriculum modules.</p>
            </header>

            <div className="glass-card" style={{ padding: '0.75rem 1.5rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Search size={20} color="var(--text-muted)" />
                <input
                    type="text"
                    placeholder="Search lessons..."
                    style={{ background: 'none', border: 'none', color: 'white', outline: 'none', width: '100%', fontSize: '1rem' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {filteredLessons.length === 0 ? (
                <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <p>No lessons found. Go to "Upload" to add your first lesson!</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {filteredLessons.map((lesson, index) => (
                        <motion.div
                            key={lesson.id}
                            className="glass-card"
                            style={{ padding: '1.5rem', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)' }}
                            whileHover={{ scale: 1.02, borderColor: 'var(--primary)', backgroundColor: 'rgba(255,255,255,0.02)' }}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div style={{
                                    padding: '0.75rem',
                                    borderRadius: '0.75rem',
                                    background: 'rgba(56, 189, 248, 0.1)',
                                    color: 'var(--primary)'
                                }}>
                                    {getIcon(lesson.media_type)}
                                </div>
                                <span className="badge" style={{ fontSize: '0.7rem' }}>{lesson.level}</span>
                            </div>

                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{lesson.title}</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineBreak: 'anywhere' }}>
                                {lesson.description?.substring(0, 100)}{lesson.description?.length > 100 ? '...' : ''}
                            </p>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ORDER: {lesson.display_order}</span>
                                <button
                                    className="btn btn-primary"
                                    style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                    onClick={() => onSelectLesson(lesson)}
                                >
                                    <span>Learn</span>
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Library;

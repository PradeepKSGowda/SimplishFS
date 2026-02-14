import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Music, Video, ArrowRight, Loader2, Search, Edit, Trash2, Plus } from 'lucide-react';
import { lessonApi } from '../utils/api';

const Library = ({ onSelectLesson, onEditLesson, onAddLesson }) => {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

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

    useEffect(() => {
        fetchLessons();
    }, []);

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this lesson? This will remove all associated media.")) return;

        try {
            await lessonApi.delete(id);
            setLessons(lessons.filter(l => l.id !== id));
        } catch (err) {
            alert("Failed to delete lesson.");
        }
    };

    const filteredLessons = lessons.filter(lesson =>
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'pdf': return <FileText size={20} />;
            case 'audio': return <Music size={20} />;
            case 'video': return <Video size={20} />;
            case 'image': return <FileText size={20} />; // Using FileText for image too as a fallback
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
            <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', color: 'var(--text-main)' }}>ನನ್ನ ಲೈಬ್ರರಿ (My Library)</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Explore all your uploaded curriculum modules.</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={onAddLesson}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
                >
                    <Plus size={18} /> Add New Lesson
                </button>
            </header>

            <div className="glass-card" style={{ padding: '0.75rem 1.5rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Search size={20} color="var(--text-muted)" />
                <input
                    type="text"
                    placeholder="Search lessons..."
                    style={{ background: 'none', border: 'none', color: 'var(--text-main)', outline: 'none', width: '100%', fontSize: '1rem' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {filteredLessons.length === 0 ? (
                <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <p>No lessons found. Click "Add New Lesson" to get started!</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {filteredLessons.map((lesson, index) => (
                        <motion.div
                            key={lesson.id}
                            className="glass-card"
                            style={{ padding: '1.5rem', cursor: 'pointer', border: '1px solid var(--border)', position: 'relative' }}
                            whileHover={{ scale: 1.01, borderColor: 'var(--primary)', backgroundColor: 'var(--bg-dark)' }}
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
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onEditLesson(lesson); }}
                                        style={{ background: 'var(--bg-dark)', border: 'none', color: 'var(--text-main)', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer' }}
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={(e) => handleDelete(e, lesson.id)}
                                        style={{ background: 'rgba(248, 113, 113, 0.1)', border: 'none', color: '#f87171', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer' }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div onClick={() => onSelectLesson(lesson)}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{lesson.title}</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineBreak: 'anywhere' }}>
                                    {lesson.description?.substring(0, 100)}{lesson.description?.length > 100 ? '...' : ''}
                                </p>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>LEVEL: {lesson.level}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}>
                                        Learn <ArrowRight size={14} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Library;

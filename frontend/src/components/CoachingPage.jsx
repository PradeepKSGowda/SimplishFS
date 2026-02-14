import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, ChevronRight, List, Trophy, Globe, FileText,
    MessageSquare, ThumbsUp, ThumbsDown, Zap, Play, Send,
    Download, Smartphone, AlertCircle
} from 'lucide-react';

const CoachingPage = ({ lesson, onComplete, onBack }) => {
    const [activeTab, setActiveTab] = useState('coach'); // 'coach' or 'transcript'
    const [chatMessage, setChatMessage] = useState('');

    if (!lesson) return null;

    return (
        <div className="coaching-page" style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--bg-dark)',
            color: 'var(--text-main)',
            marginTop: '-2rem', // Match updated index.css padding
            marginLeft: '-2rem',
            marginRight: '-2rem'
        }}>
            {/* 1. TOP HEADER */}
            <header style={{
                height: '64px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 1.5rem',
                backgroundColor: '#ffffff',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.25rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        <span>Learn</span> / <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{lesson.title}</span>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button className="icon-btn"><ChevronLeft size={20} /></button>
                    <button className="glass-card" style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.4rem 1rem', fontSize: '0.85rem', fontWeight: 600,
                        backgroundColor: '#f8fafc'
                    }}>
                        <List size={16} /> Course Outline
                    </button>
                    <button className="icon-btn"><ChevronRight size={20} /></button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24' }}>
                        <Trophy size={18} /> <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Daily XP 0</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                        <Globe size={18} /> EN
                    </div>
                    <Download size={18} style={{ cursor: 'pointer' }} />
                    <Smartphone size={18} style={{ cursor: 'pointer' }} />
                    <AlertCircle size={18} style={{ cursor: 'pointer' }} />
                </div>
            </header>

            {/* 2. MAIN CONTENT AREA */}
            <main style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

                {/* 2a. LEFT SIDEBAR: AI COACH */}
                <aside style={{
                    width: '380px',
                    borderRight: '1px solid var(--border)',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '1.5rem',
                    backgroundColor: '#ffffff'
                }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <button
                            onClick={() => setActiveTab('coach')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700,
                                background: activeTab === 'coach' ? 'var(--primary-light)' : 'transparent',
                                color: activeTab === 'coach' ? 'var(--primary)' : 'var(--text-muted)',
                                border: 'none', cursor: 'pointer'
                            }}
                        >
                            <Zap size={14} /> AI Coach
                        </button>
                        <button
                            onClick={() => setActiveTab('transcript')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700,
                                background: activeTab === 'transcript' ? 'var(--bg-dark)' : 'transparent',
                                color: activeTab === 'transcript' ? 'var(--text-main)' : 'var(--text-muted)',
                                border: 'none', cursor: 'pointer'
                            }}
                        >
                            <FileText size={14} /> Transcript
                        </button>
                    </div>

                    <div className="glass-card" style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '1.5rem',
                        backgroundColor: 'rgba(30, 41, 59, 0.3)',
                        overflowY: 'auto'
                    }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{lesson.title}?</h3>
                        <p style={{ fontSize: '1rem', lineHeight: '1.6', color: 'var(--text-main)', marginBottom: '1rem' }}>
                            {lesson.description}
                        </p>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                            <ThumbsUp size={16} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
                            <ThumbsDown size={16} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
                        </div>

                        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <button className="glass-btn"><Zap size={14} /> Video Summary</button>
                            <button className="glass-btn"><Zap size={14} /> Real-Life Example</button>
                        </div>
                    </div>

                    <div style={{ marginTop: '1.5rem', position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Ask or write anything here..."
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            style={{
                                width: '100%', padding: '1rem 3rem 1rem 1.25rem',
                                borderRadius: '30px', border: '1px solid var(--border)',
                                backgroundColor: '#f8fafc', color: 'var(--text-main)',
                                outline: 'none', fontSize: '0.9rem'
                            }}
                        />
                        <Send
                            size={18}
                            style={{
                                position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)',
                                color: 'var(--primary)', cursor: 'pointer'
                            }}
                        />
                    </div>
                </aside>

                {/* 2b. CENTER: MEDIA CONTENT */}
                <section style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                    <div className="glass-card" style={{
                        flex: 1,
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        position: 'relative',
                        backgroundColor: '#ffffff'
                    }}>
                        {lesson.media_type === 'image' ? (
                            <img src={lesson.media_url.startsWith('http') ? lesson.media_url : `http://localhost:5000${lesson.media_url}`}
                                alt={lesson.title}
                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                            />
                        ) : lesson.media_type === 'video' ? (
                            <video controls style={{ width: '100%', height: '100%' }}>
                                <source src={lesson.media_url.startsWith('http') ? lesson.media_url : `http://localhost:5000${lesson.media_url}`} type="video/mp4" />
                            </video>
                        ) : lesson.media_type === 'pdf' ? (
                            <iframe
                                src={lesson.media_url.startsWith('http') ? lesson.media_url : `http://localhost:5000${lesson.media_url}`}
                                style={{ width: '100%', height: '100%', border: 'none' }}
                                title={lesson.title}
                            />
                        ) : (
                            <div className="text-center" style={{ color: 'var(--text-main)' }}>
                                <FileText size={64} color="var(--primary)" />
                                <p className="mt-4">Media format: {lesson.media_type}</p>
                                <a
                                    href={lesson.media_url.startsWith('http') ? lesson.media_url : `http://localhost:5000${lesson.media_url}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary"
                                    style={{ marginTop: '1rem' }}
                                >
                                    View Document
                                </a>
                            </div>
                        )}

                        <div style={{
                            position: 'absolute', bottom: '0', left: '0', right: '0',
                            height: '6px', backgroundColor: 'var(--bg-dark)'
                        }}>
                            <div style={{ width: '45%', height: '100%', backgroundColor: '#22c55e' }}></div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                        <button
                            className="btn btn-primary"
                            onClick={onComplete}
                            style={{
                                padding: '0.75rem 3rem', fontSize: '1.1rem', borderRadius: '6px'
                            }}
                        >
                            Got It!
                        </button>
                    </div>
                </section>
            </main>

            <style>{`
                .icon-btn {
                    padding: 0.5rem;
                    border: none;
                    background: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .icon-btn:hover { color: var(--text-main); }
                .glass-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem 1rem;
                    background: #f1f5f9;
                    border: 1px solid var(--border);
                    border-radius: 8px;
                    color: var(--text-main);
                    font-size: 0.85rem;
                    cursor: pointer;
                    transition: background 0.2s ease;
                }
                .glass-btn:hover { background: #e2e8f0; }
            `}</style>
        </div>
    );
};

export default CoachingPage;

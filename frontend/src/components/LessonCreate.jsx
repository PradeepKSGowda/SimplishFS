import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, CheckCircle2, XCircle, Loader2, ArrowLeft, Plus, HelpCircle, Edit, Trash2 } from 'lucide-react';
import { lessonApi, assessmentApi } from '../utils/api';

const LessonCreate = ({ lesson, onBack }) => {
    const [formData, setFormData] = useState({
        title: '',
        level: 'Basic',
        description: '',
        mediaType: 'video',
        displayOrder: 1
    });
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');
    const [questions, setQuestions] = useState([]);
    const [loadingQuestions, setLoadingQuestions] = useState(false);
    const [newQuestion, setNewQuestion] = useState({ text: '', type: 'Text', correct_answer: '', points: 10, options: '' });
    const [editingQuestionIdx, setEditingQuestionIdx] = useState(null);

    useEffect(() => {
        if (lesson) {
            setFormData({
                title: lesson.title,
                level: lesson.level,
                description: lesson.description,
                mediaType: lesson.media_type,
                displayOrder: lesson.display_order
            });
            fetchQuestions(lesson.id);
        }
    }, [lesson]);

    const fetchQuestions = async (lessonId) => {
        setLoadingQuestions(true);
        try {
            const res = await assessmentApi.getByLesson(lessonId);
            const fetchedQuestions = res.data.questions || [];
            setQuestions(fetchedQuestions.map(q => ({
                id: q.id,
                text: q.text,
                type: q.type,
                correct_answer: q.correct_answer,
                points: q.points || 10,
                options: q.options ? q.options.join(', ') : ''
            })));
        } catch (err) {
            console.warn("No assessment found for this lesson yet.");
            setQuestions([]);
        } finally {
            setLoadingQuestions(false);
        }
    };

    const handleAddQuestion = () => {
        if (!newQuestion.text || !newQuestion.correct_answer) return;

        const preparedQuestion = {
            ...newQuestion,
            options: newQuestion.type === 'MCQ'
                ? newQuestion.options.split(',').map(o => o.trim()).filter(o => o !== '')
                : null
        };

        if (editingQuestionIdx !== null) {
            const updated = [...questions];
            updated[editingQuestionIdx] = preparedQuestion;
            setQuestions(updated);
            setEditingQuestionIdx(null);
        } else {
            setQuestions([...questions, preparedQuestion]);
        }
        setNewQuestion({ text: '', type: 'Text', correct_answer: '', points: 10, options: '' });
    };

    const handleEditQuestion = (index) => {
        const q = questions[index];
        setNewQuestion({
            ...q,
            options: Array.isArray(q.options) ? q.options.join(', ') : (q.options || '')
        });
        setEditingQuestionIdx(index);
    };

    const handleDeleteQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        try {
            // 1. Save/Update Lesson
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            if (file) data.append('media', file);
            if (lesson) data.append('mediaUrl', lesson.media_url);

            let lessonId = lesson?.id;
            if (lesson) {
                await lessonApi.update(lesson.id, data);
            } else {
                const res = await lessonApi.upload(data);
                lessonId = res.data.lesson.id;
            }

            // 2. Save/Update Questions (Assessment)
            await assessmentApi.upsertQuestions(lessonId, questions);

            setMessage(lesson ? 'Lesson & Questions updated!' : 'Lesson & Questions saved!');
            setStatus('success');
            setTimeout(() => {
                setStatus('idle');
                onBack();
            }, 1500);
        } catch (err) {
            console.error(err);
            setStatus('error');
            setMessage('Failed to save. Check console.');
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6" style={{ paddingBottom: '5rem' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}>
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h2 style={{ margin: 0 }}>{lesson ? 'ಪಾಠ ಮತ್ತು ಪ್ರಶ್ನಾವಳಿ ನಿರ್ವಹಣೆ (Manage Lesson & Questions)' : 'ಹೊಸ ಪಾಠ ಮತ್ತು ಪ್ರಶ್ನಾವಳಿ ಸೇರಿಸಿ (Add New Lesson & Questions)'}</h2>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2.5rem', alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* LESSON FORM */}
                    <motion.form
                        onSubmit={handleSubmit}
                        className="glass-card"
                        style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h3 style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>Lesson Details</h3>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Title</label>
                            <input
                                className="glass-card"
                                style={{ width: '100%', padding: '0.75rem', color: 'var(--text-main)', background: '#ffffff', border: '1px solid var(--border)' }}
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Level</label>
                                <select
                                    className="glass-card"
                                    style={{ width: '100%', padding: '0.75rem', color: 'var(--text-main)', background: '#ffffff' }}
                                    value={formData.level}
                                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                >
                                    <option value="Basic">Basic</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                    <option value="Expert">Expert</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Media Type</label>
                                <select
                                    className="glass-card"
                                    style={{ width: '100%', padding: '0.75rem', color: 'white', background: 'rgba(15, 23, 42, 0.8)' }}
                                    value={formData.mediaType}
                                    onChange={(e) => setFormData({ ...formData, mediaType: e.target.value })}
                                >
                                    <option value="video">Video</option>
                                    <option value="audio">Audio</option>
                                    <option value="pdf">PDF</option>
                                    <option value="image">Image</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Description</label>
                            <textarea
                                className="glass-card"
                                style={{ width: '100%', padding: '0.75rem', color: 'var(--text-main)', background: '#ffffff', border: '1px solid var(--border)', height: '80px', resize: 'none' }}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Multimedia File</label>
                            <div className="glass-card" style={{ padding: '1rem', borderStyle: 'dashed', textAlign: 'center' }}>
                                <input
                                    type="file"
                                    accept=".pdf,.mp4,.mp3,.png,.jpg,.jpeg"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </div>

                        <div style={{ marginTop: '0.5rem' }}>
                            <button
                                className="btn btn-primary"
                                type="submit"
                                disabled={status === 'loading'}
                                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            >
                                {status === 'loading' ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                                {lesson ? 'Update Everything' : 'Save Lesson & Questions'}
                            </button>
                        </div>

                        {status === 'success' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#4ade80', textAlign: 'center', fontSize: '0.9rem' }}>
                                <CheckCircle2 size={16} /> {message}
                            </motion.div>
                        )}
                        {status === 'error' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#f87171', textAlign: 'center', fontSize: '0.9rem' }}>
                                <XCircle size={16} /> {message}
                            </motion.div>
                        )}
                    </motion.form>
                </div>

                {/* QUESTION EDITOR SIDEBAR */}
                <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <HelpCircle size={20} color="var(--primary)" />
                            {editingQuestionIdx !== null ? 'Edit Question' : 'Add Question'}
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Question Text</label>
                                <input
                                    className="glass-card" style={{ width: '100%', padding: '0.6rem', fontSize: '0.9rem', background: '#ffffff', color: 'var(--text-main)', border: '1px solid var(--border)' }}
                                    value={newQuestion.text}
                                    onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                                    placeholder="Enter question..."
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Type</label>
                                    <select
                                        className="glass-card" style={{ width: '100%', padding: '0.6rem', fontSize: '0.85rem', background: '#ffffff', color: 'var(--text-main)' }}
                                        value={newQuestion.type}
                                        onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value, options: e.target.value === 'MCQ' ? newQuestion.options : '' })}
                                    >
                                        <option value="Text">Text</option>
                                        <option value="MCQ">MCQ</option>
                                        <option value="Voice">Voice</option>
                                        <option value="Image">Image</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Points</label>
                                    <input
                                        type="number"
                                        className="glass-card" style={{ width: '100%', padding: '0.6rem', fontSize: '0.9rem', background: '#ffffff', color: 'var(--text-main)', border: '1px solid var(--border)' }}
                                        value={newQuestion.points}
                                        onChange={(e) => setNewQuestion({ ...newQuestion, points: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>

                            {newQuestion.type === 'MCQ' && (
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Options (comma-separated)</label>
                                    <input
                                        className="glass-card" style={{ width: '100%', padding: '0.6rem', fontSize: '0.9rem', background: '#ffffff', color: 'var(--text-main)', border: '1px solid var(--border)' }}
                                        value={newQuestion.options}
                                        onChange={(e) => setNewQuestion({ ...newQuestion, options: e.target.value })}
                                        placeholder="Option1, Option2, Option3"
                                    />
                                </div>
                            )}

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Correct Answer</label>
                                <input
                                    className="glass-card" style={{ width: '100%', padding: '0.6rem', fontSize: '0.9rem', background: '#ffffff', color: 'var(--text-main)', border: '1px solid var(--border)' }}
                                    value={newQuestion.correct_answer}
                                    onChange={(e) => setNewQuestion({ ...newQuestion, correct_answer: e.target.value })}
                                    placeholder="Expected answer..."
                                />
                            </div>

                            <button
                                onClick={handleAddQuestion}
                                className="btn btn-primary" style={{ padding: '0.6rem', fontSize: '0.9rem', marginTop: '0.5rem' }}
                            >
                                {editingQuestionIdx !== null ? 'Update Question' : 'Add to List'}
                            </button>
                            {editingQuestionIdx !== null && (
                                <button onClick={() => { setEditingQuestionIdx(null); setNewQuestion({ text: '', type: 'Text', correct_answer: '', points: 10 }); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Cancel Edit</button>
                            )}
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '1.5rem', flex: 1 }}>
                        <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Questions List ({questions.length})
                        </h4>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '350px', overflowY: 'auto' }}>
                            {questions.map((q, idx) => (
                                <div key={idx} className="glass-card" style={{ padding: '0.75rem', background: 'var(--bg-dark)', border: '1px solid var(--border)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)' }}>{q.type} • {q.points}pts</span>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <Edit size={12} style={{ cursor: 'pointer' }} onClick={() => handleEditQuestion(idx)} />
                                            <Trash2 size={12} style={{ cursor: 'pointer', color: '#f87171' }} onClick={() => handleDeleteQuestion(idx)} />
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>{q.text}</p>
                                    {q.type === 'MCQ' && q.options && (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.25rem' }}>
                                            {(Array.isArray(q.options) ? q.options : q.options.split(',')).map((opt, i) => (
                                                <span key={i} style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', background: '#ffffff', border: '1px solid var(--border)', borderRadius: '2px', color: 'var(--text-muted)' }}>
                                                    {opt.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <p style={{ fontSize: '0.75rem', color: '#4ade80' }}>Ans: {q.correct_answer}</p>
                                </div>
                            ))}
                            {questions.length === 0 && (
                                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '1rem' }}>No questions added.</p>
                            )}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default LessonCreate;
